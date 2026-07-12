package com.dwellix.auth.service;

import com.dwellix.auth.domain.PasswordResetTokenEntity;
import com.dwellix.auth.domain.RefreshTokenEntity;
import com.dwellix.auth.domain.Role;
import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.domain.VerificationTokenEntity;
import com.dwellix.auth.dto.AuthSessionResponse;
import com.dwellix.auth.dto.TokenResponse;
import com.dwellix.auth.dto.UserResponse;
import com.dwellix.auth.dto.request.ForgotPasswordRequest;
import com.dwellix.auth.dto.request.LoginRequest;
import com.dwellix.auth.dto.request.RefreshTokenRequest;
import com.dwellix.auth.dto.request.ResetPasswordRequest;
import com.dwellix.auth.dto.request.SignupRequest;
import com.dwellix.auth.dto.request.VerifyEmailRequest;
import com.dwellix.auth.dto.service.AuthSessionResult;
import com.dwellix.auth.exception.ConflictException;
import com.dwellix.auth.exception.InvalidTokenException;
import com.dwellix.auth.exception.NotFoundException;
import com.dwellix.auth.repository.PasswordResetTokenRepository;
import com.dwellix.auth.repository.RefreshTokenRepository;
import com.dwellix.auth.repository.UserRepository;
import com.dwellix.auth.repository.VerificationTokenRepository;
import com.dwellix.auth.security.JwtService;
import com.dwellix.auth.security.TokenHashService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthService {
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final VerificationTokenRepository verificationTokenRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final TokenHashService tokenHashService;
  private final EmailService emailService;
  private final RateLimitService rateLimitService;
  private final Clock clock;
  private final SecureRandom secureRandom;

  @org.springframework.beans.factory.annotation.Value("${app.auth.require-email-verification:false}")
  private boolean requireEmailVerification;

  public AuthService(
      UserRepository userRepository,
      RefreshTokenRepository refreshTokenRepository,
      VerificationTokenRepository verificationTokenRepository,
      PasswordResetTokenRepository passwordResetTokenRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      TokenHashService tokenHashService,
      EmailService emailService,
      RateLimitService rateLimitService
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.verificationTokenRepository = verificationTokenRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.tokenHashService = tokenHashService;
    this.emailService = emailService;
    this.rateLimitService = rateLimitService;
    this.clock = Clock.systemUTC();
    this.secureRandom = new SecureRandom();
  }

  public UserResponse signup(SignupRequest request) {
    rateLimitService.assertAllowed("signup:" + request.email().toLowerCase());

    if (userRepository.existsByEmailIgnoreCase(request.email())) {
      throw new ConflictException("An account already exists for that email address.");
    }

    UserEntity user = new UserEntity();
    user.setFullName(request.fullName().trim());
    user.setEmail(request.email().trim().toLowerCase());
    user.setPhoneNumber(request.phoneNumber().trim());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(Role.ROLE_USER);
    user.setEmailVerified(!requireEmailVerification);
    user.setAccountLocked(false);
    user.setEnabled(true);
    userRepository.save(user);

    if (requireEmailVerification) {
      String verificationToken = createVerificationToken(user);
      emailService.sendVerificationEmail(user, verificationToken);
    }

    return toUserResponse(user);
  }

  private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthService.class);

  public AuthSessionResult login(LoginRequest request) {
    long startTime = System.currentTimeMillis();

    rateLimitService.assertAllowed("login:" + request.email().toLowerCase());
    long rateLimitTime = System.currentTimeMillis();
    logger.info("Login rate limit check completed in {} ms", (rateLimitTime - startTime));

    UserEntity user = findVerifiedUserByEmail(request.email())
        .orElseThrow(() -> new InvalidTokenException("Invalid email or password."));
    long dbLookupTime = System.currentTimeMillis();
    logger.info("Login database user lookup completed in {} ms", (dbLookupTime - rateLimitTime));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new InvalidTokenException("Invalid email or password.");
    }
    long passwordVerifyTime = System.currentTimeMillis();
    logger.info("Login password verification completed in {} ms", (passwordVerifyTime - dbLookupTime));

    user.setLastLoginAt(Instant.now(clock));
    userRepository.save(user);
    long dbSaveTime = System.currentTimeMillis();
    logger.info("Login user lastLoginAt update completed in {} ms", (dbSaveTime - passwordVerifyTime));

    AuthSessionResult result = issueSession(user, "Login successful.");
    long totalTime = System.currentTimeMillis() - startTime;
    logger.info("Login request total processing time: {} ms", totalTime);

    return result;
  }

  public AuthSessionResult refresh(RefreshTokenRequest request, String refreshTokenValue) {
    String tokenValue = Optional.ofNullable(request).map(RefreshTokenRequest::refreshToken).filter(value -> !value.isBlank()).orElse(refreshTokenValue);
    if (tokenValue == null || tokenValue.isBlank()) {
      throw new InvalidTokenException("Refresh token is required.");
    }

    String tokenHash = tokenHashService.hash(tokenValue);
    RefreshTokenEntity existingToken = refreshTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidTokenException("Refresh token is invalid."));

    if (existingToken.getRevokedAt() != null || existingToken.getExpiresAt().isBefore(Instant.now(clock))) {
      throw new InvalidTokenException("Refresh token has expired.");
    }

    existingToken.setRevokedAt(Instant.now(clock));
    String newRefreshToken = createRefreshToken(existingToken.getUser());
    existingToken.setReplacedByTokenHash(tokenHashService.hash(newRefreshToken));
    refreshTokenRepository.save(existingToken);

    return issueSession(existingToken.getUser(), "Token refreshed.", newRefreshToken);
  }

  public void logout(RefreshTokenRequest request, String refreshTokenValue) {
    String tokenValue = Optional.ofNullable(request).map(RefreshTokenRequest::refreshToken).filter(value -> !value.isBlank()).orElse(refreshTokenValue);
    if (tokenValue != null && !tokenValue.isBlank()) {
      refreshTokenRepository.findByTokenHash(tokenHashService.hash(tokenValue)).ifPresent(token -> {
        token.setRevokedAt(Instant.now(clock));
        refreshTokenRepository.save(token);
      });
    }
  }

  public void forgotPassword(ForgotPasswordRequest request) {
    logger.info("[FORGOT_PASSWORD] request received");
    rateLimitService.assertAllowed("forgot:" + request.email().toLowerCase());

    String email = request.email().trim().toLowerCase();
    logger.info("[FORGOT_PASSWORD] normalized email lookup started");
    Optional<UserEntity> userOpt = findAnyUserByEmail(email);
    logger.info("[FORGOT_PASSWORD] account found = {}", userOpt.isPresent());

    userOpt.ifPresent(user -> {
      passwordResetTokenRepository.deleteByUser_Id(user.getId());
      String resetToken = createPasswordResetToken(user);
      logger.info("[FORGOT_PASSWORD] reset token persisted");
      emailService.sendPasswordResetEmail(user, resetToken);
    });
  }

  public void resetPassword(ResetPasswordRequest request) {
    if (!request.password().equals(request.confirmPassword())) {
      throw new InvalidTokenException("Passwords do not match.");
    }

    String tokenHash = tokenHashService.hash(request.token());
    PasswordResetTokenEntity resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidTokenException("Reset token is invalid."));

    if (resetToken.getConsumedAt() != null || resetToken.getExpiresAt().isBefore(Instant.now(clock))) {
      throw new InvalidTokenException("Reset token has expired.");
    }

    UserEntity user = resetToken.getUser();
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    userRepository.save(user);

    resetToken.setConsumedAt(Instant.now(clock));
    passwordResetTokenRepository.save(resetToken);
    refreshTokenRepository.deleteByUser_Id(user.getId());
  }

  public void verifyEmail(VerifyEmailRequest request) {
    if (!requireEmailVerification) {
      return;
    }
    String tokenHash = tokenHashService.hash(request.token());
    VerificationTokenEntity verificationToken = verificationTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidTokenException("Verification token is invalid."));

    if (verificationToken.getConsumedAt() != null || verificationToken.getExpiresAt().isBefore(Instant.now(clock))) {
      throw new InvalidTokenException("Verification token has expired.");
    }

    UserEntity user = verificationToken.getUser();
    user.setEmailVerified(true);
    userRepository.save(user);

    verificationToken.setConsumedAt(Instant.now(clock));
    verificationTokenRepository.save(verificationToken);
  }

  @Transactional(readOnly = true)
  public UserResponse me(UUID userId) {
    return userRepository.findById(userId)
        .map(this::toUserResponse)
        .orElseThrow(() -> new NotFoundException("User not found."));
  }

  private Optional<UserEntity> findAnyUserByEmail(String email) {
    return userRepository.findByEmailIgnoreCase(email);
  }

  private Optional<UserEntity> findVerifiedUserByEmail(String email) {
    if (!requireEmailVerification) {
      return userRepository.findByEmailIgnoreCase(email);
    }
    return userRepository.findByEmailIgnoreCase(email).filter(UserEntity::isEmailVerified);
  }

  public AuthSessionResult issueSession(UserEntity user, String message) {
    return issueSession(user, message, createRefreshToken(user));
  }

  private AuthSessionResult issueSession(UserEntity user, String message, String refreshToken) {
    String accessToken = jwtService.generateAccessToken(user);
    return new AuthSessionResult(
        toUserResponse(user),
        accessToken,
        refreshToken,
        jwtService.getAccessTokenExpirySeconds(),
        message
    );
  }

  public AuthSessionResponse toResponse(AuthSessionResult result) {
    return new AuthSessionResponse(
        result.user(),
        new TokenResponse(result.accessToken(), "Bearer", result.expiresInSeconds()),
        result.message()
    );
  }

  private String createVerificationToken(UserEntity user) {
    verificationTokenRepository.deleteByUser_Id(user.getId());
    String rawToken = generateOpaqueToken();
    VerificationTokenEntity tokenEntity = new VerificationTokenEntity();
    tokenEntity.setUser(user);
    tokenEntity.setTokenHash(tokenHashService.hash(rawToken));
    tokenEntity.setExpiresAt(Instant.now(clock).plusSeconds(60L * 60 * 24));
    verificationTokenRepository.save(tokenEntity);
    return rawToken;
  }

  private String createPasswordResetToken(UserEntity user) {
    String rawToken = generateOpaqueToken();
    PasswordResetTokenEntity tokenEntity = new PasswordResetTokenEntity();
    tokenEntity.setUser(user);
    tokenEntity.setTokenHash(tokenHashService.hash(rawToken));
    tokenEntity.setExpiresAt(Instant.now(clock).plusSeconds(60L * 30));
    passwordResetTokenRepository.save(tokenEntity);
    return rawToken;
  }

  private String createRefreshToken(UserEntity user) {
    String rawToken = generateOpaqueToken();
    RefreshTokenEntity tokenEntity = new RefreshTokenEntity();
    tokenEntity.setUser(user);
    tokenEntity.setTokenHash(tokenHashService.hash(rawToken));
    tokenEntity.setExpiresAt(Instant.now(clock).plusSeconds(60L * 60 * 24 * 7));
    refreshTokenRepository.save(tokenEntity);
    return rawToken;
  }

  private String generateOpaqueToken() {
    byte[] tokenBytes = new byte[32];
    secureRandom.nextBytes(tokenBytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
  }

  private UserResponse toUserResponse(UserEntity user) {
    return new UserResponse(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getPhoneNumber(),
        user.getRole(),
        user.isEmailVerified(),
        user.getLastLoginAt()
    );
  }
}

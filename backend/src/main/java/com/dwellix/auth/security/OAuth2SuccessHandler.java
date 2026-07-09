package com.dwellix.auth.security;

import com.dwellix.auth.domain.Role;
import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.repository.UserRepository;
import com.dwellix.auth.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final UserRepository userRepository;
  private final AuthService authService;
  private final CookieService cookieService;
  private final String frontendOrigin;

  public OAuth2SuccessHandler(
      UserRepository userRepository,
      AuthService authService,
      CookieService cookieService,
      @Value("${FRONTEND_ORIGIN:https://dwellix-silk.vercel.app}") String frontendOrigin
  ) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.cookieService = cookieService;
    this.frontendOrigin = frontendOrigin;
  }

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication
  ) throws IOException, ServletException {
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    final String name = oAuth2User.getAttribute("name") != null ? oAuth2User.getAttribute("name") : "Google User";

    UserEntity user = userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
      UserEntity newUser = new UserEntity();
      newUser.setEmail(email.trim().toLowerCase());
      newUser.setFullName(name.trim());
      newUser.setPhoneNumber("");
      
      byte[] passwordBytes = new byte[16];
      new SecureRandom().nextBytes(passwordBytes);
      String randomPassword = Base64.getUrlEncoder().withoutPadding().encodeToString(passwordBytes);
      newUser.setPasswordHash(new BCryptPasswordEncoder(12).encode(randomPassword));
      
      newUser.setRole(Role.ROLE_USER);
      newUser.setEmailVerified(true); // Auto-verified since it comes from Google OAuth
      newUser.setAccountLocked(false);
      newUser.setEnabled(true);
      return userRepository.save(newUser);
    });

    // Delegate session issuance to AuthService
    com.dwellix.auth.dto.service.AuthSessionResult sessionResult = authService.issueSession(user, "Logged in via Google");

    // Attach refresh token cookie
    ResponseCookie cookie = cookieService.createRefreshTokenCookie(sessionResult.refreshToken());
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    // Redirect directly to the dashboard
    getRedirectStrategy().sendRedirect(request, response, frontendOrigin + "/dashboard");
  }
}

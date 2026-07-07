package com.dwellix.auth.controller;

import com.dwellix.auth.api.ApiMessageResponse;
import com.dwellix.auth.config.AuthCookieProperties;
import com.dwellix.auth.dto.AuthSessionResponse;
import com.dwellix.auth.dto.UserResponse;
import com.dwellix.auth.dto.request.ForgotPasswordRequest;
import com.dwellix.auth.dto.request.LoginRequest;
import com.dwellix.auth.dto.request.RefreshTokenRequest;
import com.dwellix.auth.dto.request.ResetPasswordRequest;
import com.dwellix.auth.dto.request.SignupRequest;
import com.dwellix.auth.dto.request.VerifyEmailRequest;
import com.dwellix.auth.dto.service.AuthSessionResult;
import com.dwellix.auth.security.CookieService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import com.dwellix.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AuthService authService;
  private final CookieService cookieService;
  private final AuthCookieProperties authCookieProperties;

  public AuthController(AuthService authService, CookieService cookieService, AuthCookieProperties authCookieProperties) {
    this.authService = authService;
    this.cookieService = cookieService;
    this.authCookieProperties = authCookieProperties;
  }

  @PostMapping("/signup")
  public ResponseEntity<ApiMessageResponse> signup(@Valid @RequestBody SignupRequest request) {
    UserResponse response = authService.signup(request);
    return ResponseEntity.ok(new ApiMessageResponse("Account created for %s. Verify your email to continue.".formatted(response.email())));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthSessionResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse servletResponse) {
    AuthSessionResult result = authService.login(request);
    attachRefreshCookie(servletResponse, result.refreshToken());
    return ResponseEntity.ok(authService.toResponse(result));
  }

  @PostMapping("/logout")
  public ResponseEntity<ApiMessageResponse> logout(@RequestBody(required = false) RefreshTokenRequest request, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
    authService.logout(request, extractRefreshTokenFromCookie(servletRequest));
    clearRefreshCookie(servletResponse);
    return ResponseEntity.ok(new ApiMessageResponse("Logged out successfully."));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthSessionResponse> refresh(@RequestBody(required = false) RefreshTokenRequest request, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
    AuthSessionResult result = authService.refresh(request, extractRefreshTokenFromCookie(servletRequest));
    attachRefreshCookie(servletResponse, result.refreshToken());
    return ResponseEntity.ok(authService.toResponse(result));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<ApiMessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    authService.forgotPassword(request);
    return ResponseEntity.ok(new ApiMessageResponse("If the account exists, a reset link will be sent shortly."));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<ApiMessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    authService.resetPassword(request);
    return ResponseEntity.ok(new ApiMessageResponse("Password updated successfully."));
  }

  @PostMapping("/verify-email")
  public ResponseEntity<ApiMessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
    authService.verifyEmail(request);
    return ResponseEntity.ok(new ApiMessageResponse("Email verified successfully."));
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> me(@AuthenticationPrincipal CurrentUserPrincipal principal) {
    return ResponseEntity.ok(authService.me(principal.getUserId()));
  }

  private void attachRefreshCookie(HttpServletResponse response, String refreshToken) {
    ResponseCookie cookie = cookieService.createRefreshTokenCookie(refreshToken);
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  private void clearRefreshCookie(HttpServletResponse response) {
    ResponseCookie cookie = cookieService.clearRefreshTokenCookie();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  private String extractRefreshTokenFromCookie(HttpServletRequest request) {
    if (request.getCookies() == null) {
      return null;
    }

    for (var cookie : request.getCookies()) {
      if (authCookieProperties.refreshTokenName().equals(cookie.getName())) {
        return cookie.getValue();
      }
    }

    return null;
  }
}

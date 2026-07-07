package com.dwellix.auth.security;

import com.dwellix.auth.config.AuthCookieProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {
  private final AuthCookieProperties cookieProperties;

  public CookieService(AuthCookieProperties cookieProperties) {
    this.cookieProperties = cookieProperties;
  }

  public ResponseCookie createRefreshTokenCookie(String token) {
    return ResponseCookie.from(cookieProperties.refreshTokenName(), token)
        .httpOnly(cookieProperties.httpOnly())
        .secure(cookieProperties.secure())
        .sameSite(cookieProperties.sameSite())
        .path(cookieProperties.refreshTokenPath())
        .maxAge(cookieProperties.refreshTokenTtlSeconds())
        .build();
  }

  public ResponseCookie clearRefreshTokenCookie() {
    return ResponseCookie.from(cookieProperties.refreshTokenName(), "")
        .httpOnly(cookieProperties.httpOnly())
        .secure(cookieProperties.secure())
        .sameSite(cookieProperties.sameSite())
        .path(cookieProperties.refreshTokenPath())
        .maxAge(0)
        .build();
  }
}

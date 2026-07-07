package com.dwellix.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth.cookies")
public record AuthCookieProperties(
    String refreshTokenName,
    String refreshTokenPath,
    boolean secure,
    boolean httpOnly,
    String sameSite,
    long refreshTokenTtlSeconds
) {
}

package com.dwellix.auth.dto.service;

import com.dwellix.auth.dto.UserResponse;

public record AuthSessionResult(
    UserResponse user,
    String accessToken,
    String refreshToken,
    long expiresInSeconds,
    String message
) {
}

package com.dwellix.auth.dto;

public record TokenResponse(
    String accessToken,
    String tokenType,
    long expiresInSeconds
) {
}

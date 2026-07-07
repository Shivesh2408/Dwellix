package com.dwellix.auth.dto;

public record AuthSessionResponse(
    UserResponse user,
    TokenResponse tokens,
    String message
) {
}

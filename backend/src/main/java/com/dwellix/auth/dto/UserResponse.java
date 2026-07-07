package com.dwellix.auth.dto;

import com.dwellix.auth.domain.Role;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String fullName,
    String email,
    String phoneNumber,
    Role role,
    boolean emailVerified,
    Instant lastLoginAt
) {
}

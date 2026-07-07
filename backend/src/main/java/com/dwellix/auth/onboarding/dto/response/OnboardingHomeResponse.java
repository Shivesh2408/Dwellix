package com.dwellix.auth.onboarding.dto.response;

import com.dwellix.auth.onboarding.domain.HomeType;

import java.time.Instant;
import java.util.UUID;

public record OnboardingHomeResponse(
    UUID id,
    UUID userId,
    String homeName,
    HomeType homeType,
    String address,
    String city,
    String state,
    String pincode,
    boolean setupCompleted,
    Instant setupCompletedAt
) {
}

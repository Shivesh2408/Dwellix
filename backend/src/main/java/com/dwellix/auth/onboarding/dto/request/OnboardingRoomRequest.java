package com.dwellix.auth.onboarding.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OnboardingRoomRequest(
    @NotBlank @Size(max = 140) String name,
    @Size(max = 240) String notes
) {
}

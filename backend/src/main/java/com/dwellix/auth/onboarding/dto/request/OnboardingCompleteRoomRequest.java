package com.dwellix.auth.onboarding.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OnboardingCompleteRoomRequest(
    @NotBlank @Size(max = 140) String name,
    @Size(max = 240) String notes,
    @Valid List<OnboardingApplianceRequest> appliances
) {
}

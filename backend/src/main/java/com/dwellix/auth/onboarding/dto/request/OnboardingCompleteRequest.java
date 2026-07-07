package com.dwellix.auth.onboarding.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OnboardingCompleteRequest(
    @Valid @NotNull OnboardingHomeRequest home,
    @Valid @NotEmpty List<OnboardingCompleteRoomRequest> rooms
) {
}

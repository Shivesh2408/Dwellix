package com.dwellix.auth.onboarding.dto.request;

import com.dwellix.auth.onboarding.domain.HomeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record OnboardingHomeRequest(
    @NotBlank @Size(max = 140) String homeName,
    @NotNull HomeType homeType,
    @NotBlank @Size(max = 255) String address,
    @NotBlank @Size(max = 120) String city,
    @NotBlank @Size(max = 120) String state,
    @NotBlank @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Pincode must be a 6-digit value") String pincode
) {
}

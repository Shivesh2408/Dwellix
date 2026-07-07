package com.dwellix.auth.onboarding.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record OnboardingApplianceRequest(
    @NotBlank @Size(max = 140) String name,
    @NotBlank @Size(max = 120) String brand,
    @NotBlank @Size(max = 120) String model,
    @NotNull LocalDate purchaseDate,
    @NotNull LocalDate warrantyExpiry,
    @Size(max = 255) String photoFileName,
    @Size(max = 255) String invoiceFileName
) {
}

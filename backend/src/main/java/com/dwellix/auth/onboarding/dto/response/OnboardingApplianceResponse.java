package com.dwellix.auth.onboarding.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record OnboardingApplianceResponse(
    UUID id,
    UUID roomId,
    String name,
    String brand,
    String model,
    LocalDate purchaseDate,
    LocalDate warrantyExpiry,
    String photoFileName,
    String invoiceFileName,
    int sortOrder
) {
}

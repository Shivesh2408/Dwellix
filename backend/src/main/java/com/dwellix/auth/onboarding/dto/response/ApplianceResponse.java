package com.dwellix.auth.onboarding.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record ApplianceResponse(
    UUID id,
    String name,
    String brand,
    String model,
    String roomName,
    UUID roomId,
    LocalDate purchaseDate,
    LocalDate warrantyExpiry,
    String photoFileName,
    String warrantyStatus,
    Integer healthScore,
    String lastMaintenance
) {}

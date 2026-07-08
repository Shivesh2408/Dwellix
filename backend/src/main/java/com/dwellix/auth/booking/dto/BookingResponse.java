package com.dwellix.auth.booking.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record BookingResponse(
    UUID id,
    UUID userId,
    UUID applianceId,
    String applianceName,
    String brand,
    String model,
    String technicianName,
    String technicianPhone,
    String serviceType,
    String problemDescription,
    LocalDate bookingDate,
    String bookingTime,
    String status,
    Double estimatedCost,
    Instant createdAt,
    Instant updatedAt
) {}

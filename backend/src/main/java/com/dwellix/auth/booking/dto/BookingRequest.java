package com.dwellix.auth.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record BookingRequest(
    @NotNull(message = "Appliance ID is required")
    UUID applianceId,

    @NotBlank(message = "Service type is required")
    @Size(max = 100)
    String serviceType,

    @NotBlank(message = "Problem description is required")
    String problemDescription,

    @NotNull(message = "Booking date is required")
    LocalDate bookingDate,

    @NotBlank(message = "Booking time is required")
    @Size(max = 50)
    String bookingTime,

    @Size(max = 140)
    String technicianName,

    @Size(max = 30)
    String technicianPhone,

    String status,

    Double estimatedCost
) {}

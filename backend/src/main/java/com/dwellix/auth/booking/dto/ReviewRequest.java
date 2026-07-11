package com.dwellix.auth.booking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ReviewRequest(
    @NotNull(message = "Booking ID is required")
    UUID bookingId,

    @NotNull(message = "Rating is required")
    @Min(1) @Max(5)
    Integer rating,

    @NotBlank(message = "Review content is required")
    String review
) {}

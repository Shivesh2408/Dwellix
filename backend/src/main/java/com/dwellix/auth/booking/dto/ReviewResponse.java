package com.dwellix.auth.booking.dto;

import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
    UUID id,
    UUID bookingId,
    UUID customerId,
    String customerName,
    UUID technicianId,
    Integer rating,
    String review,
    Instant createdAt
) {}

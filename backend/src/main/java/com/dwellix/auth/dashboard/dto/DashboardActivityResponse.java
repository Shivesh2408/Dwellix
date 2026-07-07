package com.dwellix.auth.dashboard.dto;

import java.time.Instant;
import java.util.UUID;

public record DashboardActivityResponse(
    UUID id,
    String title,
    String description,
    String category, // e.g. "WARRANTY", "BOOKING", "AI", "INVOICE", "MAINTENANCE"
    Instant timestamp
) {}

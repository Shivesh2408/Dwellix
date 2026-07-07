package com.dwellix.auth.dashboard.dto;

import java.time.Instant;
import java.util.UUID;

public record DashboardNotificationResponse(
    UUID id,
    String title,
    String message,
    String type, // e.g. "INFO", "WARNING", "ALERT"
    boolean read,
    Instant createdAt
) {}

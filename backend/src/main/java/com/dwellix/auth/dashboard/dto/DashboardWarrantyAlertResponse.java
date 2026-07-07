package com.dwellix.auth.dashboard.dto;

import java.time.LocalDate;
import java.util.UUID;

public record DashboardWarrantyAlertResponse(
    UUID id,
    String applianceName,
    String brand,
    String model,
    LocalDate expiryDate,
    long daysRemaining,
    String status // e.g. "EXPIRING_SOON", "EXPIRED", "SAFE"
) {}

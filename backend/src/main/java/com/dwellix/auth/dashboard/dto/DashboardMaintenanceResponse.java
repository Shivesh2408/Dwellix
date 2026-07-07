package com.dwellix.auth.dashboard.dto;

import java.time.LocalDate;
import java.util.UUID;

public record DashboardMaintenanceResponse(
    UUID id,
    String applianceName,
    String taskName,
    LocalDate date,
    String status,
    String actionLabel
) {}

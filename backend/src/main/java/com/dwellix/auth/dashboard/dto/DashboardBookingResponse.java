package com.dwellix.auth.dashboard.dto;

import java.time.LocalDate;
import java.util.UUID;

public record DashboardBookingResponse(
    UUID id,
    String applianceName,
    String serviceName,
    LocalDate date,
    String status,
    String technicianName
) {}

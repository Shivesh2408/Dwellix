package com.dwellix.auth.dashboard.dto;

import java.util.UUID;

public record DashboardRecommendationResponse(
    UUID id,
    String applianceName,
    String recommendation,
    String recommendedAction,
    String urgency // e.g. "HIGH", "MEDIUM", "LOW"
) {}

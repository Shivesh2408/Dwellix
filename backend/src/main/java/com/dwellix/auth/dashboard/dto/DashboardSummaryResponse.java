package com.dwellix.auth.dashboard.dto;

import com.dwellix.auth.onboarding.dto.response.OnboardingHomeResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingApplianceResponse;

import java.util.List;

public record DashboardSummaryResponse(
    OnboardingHomeResponse home,
    String userName,
    int roomsCount,
    int appliancesCount,
    int healthScore,
    String healthRecommendation,
    List<DashboardBookingResponse> upcomingBookings,
    List<DashboardMaintenanceResponse> upcomingMaintenance,
    List<DashboardActivityResponse> recentActivity,
    List<DashboardRecommendationResponse> aiRecommendations,
    List<DashboardWarrantyAlertResponse> warrantyAlerts,
    List<OnboardingApplianceResponse> recentAppliances,
    List<DashboardNotificationResponse> notifications
) {}

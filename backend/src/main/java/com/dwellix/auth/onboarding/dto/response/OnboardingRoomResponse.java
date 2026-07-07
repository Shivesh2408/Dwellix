package com.dwellix.auth.onboarding.dto.response;

import java.util.List;
import java.util.UUID;

public record OnboardingRoomResponse(
    UUID id,
    UUID homeId,
    String name,
    String notes,
    int sortOrder,
    List<OnboardingApplianceResponse> appliances
) {
}

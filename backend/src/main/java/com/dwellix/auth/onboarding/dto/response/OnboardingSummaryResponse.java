package com.dwellix.auth.onboarding.dto.response;

import java.util.List;

public record OnboardingSummaryResponse(
    OnboardingHomeResponse home,
    List<OnboardingRoomResponse> rooms
) {
}

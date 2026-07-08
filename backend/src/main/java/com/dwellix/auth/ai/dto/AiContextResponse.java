package com.dwellix.auth.ai.dto;

import java.util.List;

public record AiContextResponse(
    String homeName,
    String homeType,
    int roomsCount,
    int appliancesCount,
    boolean warrantyTracking,
    List<AiRoomContext> rooms
) {}

package com.dwellix.auth.ai.dto;

import java.util.List;

public record AiRoomContext(
    String name,
    List<AiApplianceContext> appliances
) {}

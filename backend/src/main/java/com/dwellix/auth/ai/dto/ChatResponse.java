package com.dwellix.auth.ai.dto;

import java.util.UUID;

public record ChatResponse(
    String content,
    String modelUsed,
    UUID conversationId
) {}

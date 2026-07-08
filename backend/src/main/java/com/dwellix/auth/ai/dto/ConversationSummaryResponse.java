package com.dwellix.auth.ai.dto;

import java.time.Instant;
import java.util.UUID;

public record ConversationSummaryResponse(
    UUID id,
    String title,
    Instant createdAt,
    Instant updatedAt
) {}

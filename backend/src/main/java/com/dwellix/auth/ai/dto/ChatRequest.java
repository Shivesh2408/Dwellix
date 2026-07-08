package com.dwellix.auth.ai.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public record ChatRequest(
    @NotEmpty List<ChatMessage> messages,
    String model,
    UUID conversationId
) {}

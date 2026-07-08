package com.dwellix.auth.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenameConversationRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 40, message = "Title must not exceed 40 characters")
    String title
) {}

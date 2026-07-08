package com.dwellix.auth.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record ImageDiagnosisRequest(
    @NotBlank(message = "Image URL is required")
    String imageUrl
) {}

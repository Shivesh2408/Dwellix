package com.dwellix.auth.dto;

public record ImageUploadResponse(
    String imageUrl,
    String publicId,
    Integer width,
    Integer height,
    String format,
    Long bytes
) {}

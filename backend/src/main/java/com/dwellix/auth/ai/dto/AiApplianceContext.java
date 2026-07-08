package com.dwellix.auth.ai.dto;

public record AiApplianceContext(
    String name,
    String brand,
    String model,
    String purchaseDate,
    String warrantyExpiry,
    String maintenance
) {}

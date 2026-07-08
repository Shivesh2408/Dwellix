package com.dwellix.auth.ai.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record DiagnosisHistoryResponse(
    UUID id,
    String imageUrl,
    String applianceType,
    String brand,
    List<String> visibleProblems,
    String severity,
    List<String> possibleCauses,
    List<String> recommendedActions,
    Boolean technicianRequired,
    Double confidence,
    Instant timestamp
) {}

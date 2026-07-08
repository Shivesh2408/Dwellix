package com.dwellix.auth.ai.dto;

import java.util.List;

public record ImageDiagnosisResponse(
    String applianceType,
    String brand,
    List<String> visibleProblems,
    String severity,
    List<String> possibleCauses,
    List<String> recommendedActions,
    Boolean technicianRequired,
    Double confidence
) {}

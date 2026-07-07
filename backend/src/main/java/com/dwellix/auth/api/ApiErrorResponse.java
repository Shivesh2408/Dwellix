package com.dwellix.auth.api;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
    String message,
    String code,
    Instant timestamp,
    Map<String, String> fieldErrors
) {
}

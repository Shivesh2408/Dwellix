package com.dwellix.auth.booking.dto;

public record EarningsResponse(
    Double today,
    Double thisWeek,
    Double thisMonth,
    Double lifetime,
    Double pending
) {}

package com.dwellix.auth.booking.dto;

import java.util.UUID;

public record TechnicianResponse(
    UUID id,
    String name,
    String photoUrl,
    String specialization,
    Integer experienceYears,
    Double rating,
    Integer totalReviews,
    String phone,
    String email,
    String city,
    String availability,
    Double hourlyRate,
    Boolean verified
) {}

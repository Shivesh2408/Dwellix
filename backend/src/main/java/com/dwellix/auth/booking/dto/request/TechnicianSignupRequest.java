package com.dwellix.auth.booking.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TechnicianSignupRequest(
    @NotBlank String fullName,
    @NotBlank @Email String email,
    @NotBlank String phone,
    @NotBlank String password,
    @NotBlank String city,
    @NotNull Integer experience,
    @NotNull Double serviceRadius,
    @NotBlank String bio,
    @NotBlank String languages,
    @NotBlank String specialization,
    @NotNull Double inspectionCharge,
    String profilePhotoUrl
) {}

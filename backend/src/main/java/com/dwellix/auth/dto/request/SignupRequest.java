package com.dwellix.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @NotBlank @Size(max = 140) String fullName,
    @NotBlank @Email String email,
    @NotBlank @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "Phone number must be in international format") String phoneNumber,
    @NotBlank @Size(min = 8, max = 128) String password
) {
}

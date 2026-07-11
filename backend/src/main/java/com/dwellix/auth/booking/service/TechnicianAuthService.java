package com.dwellix.auth.booking.service;

import com.dwellix.auth.booking.domain.TechnicianEntity;
import com.dwellix.auth.booking.dto.request.TechnicianSignupRequest;
import com.dwellix.auth.booking.repository.TechnicianRepository;
import com.dwellix.auth.domain.Role;
import com.dwellix.auth.dto.AuthSessionResponse;
import com.dwellix.auth.dto.TokenResponse;
import com.dwellix.auth.dto.UserResponse;
import com.dwellix.auth.dto.request.LoginRequest;
import com.dwellix.auth.exception.ConflictException;
import com.dwellix.auth.exception.InvalidTokenException;
import com.dwellix.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class TechnicianAuthService {

  private final TechnicianRepository technicianRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public TechnicianAuthService(
      TechnicianRepository technicianRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService
  ) {
    this.technicianRepository = technicianRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public UserResponse signup(TechnicianSignupRequest request) {
    if (technicianRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
      throw new ConflictException("An account already exists for that email address.");
    }

    TechnicianEntity tech = new TechnicianEntity();
    tech.setName(request.fullName().trim());
    tech.setEmail(request.email().trim().toLowerCase());
    tech.setPhone(request.phone().trim());
    tech.setPasswordHash(passwordEncoder.encode(request.password()));
    tech.setCity(request.city().trim());
    tech.setExperienceYears(request.experience());
    tech.setServiceRadius(request.serviceRadius());
    tech.setBio(request.bio().trim());
    tech.setLanguages(request.languages().trim());
    tech.setSpecialization(request.specialization().trim());
    tech.setInspectionCharge(request.inspectionCharge());
    tech.setPhotoUrl(request.profilePhotoUrl());
    
    // Set default fields to be compatible with listing
    tech.setRating(5.0);
    tech.setTotalReviews(0);
    tech.setAvailability("Mon - Sat (09:00 AM - 06:00 PM)");
    tech.setHourlyRate(request.inspectionCharge());
    tech.setVerified(true);
    tech.setCreatedAt(Instant.now());
    tech.setUpdatedAt(Instant.now());

    technicianRepository.save(tech);

    return new UserResponse(
        tech.getId(),
        tech.getName(),
        tech.getEmail(),
        tech.getPhone(),
        Role.ROLE_TECHNICIAN,
        true,
        Instant.now()
    );
  }

  public AuthSessionResponse login(LoginRequest request) {
    TechnicianEntity tech = technicianRepository.findByEmailIgnoreCase(request.email())
        .orElseThrow(() -> new InvalidTokenException("Invalid email or password."));

    if (tech.getPasswordHash() == null || !passwordEncoder.matches(request.password(), tech.getPasswordHash())) {
      throw new InvalidTokenException("Invalid email or password.");
    }

    tech.setUpdatedAt(Instant.now());
    technicianRepository.save(tech);

    // Generate JWT access token with required claims (id, email, role, name)
    String accessToken = jwtService.generateAccessToken(
        tech.getId().toString(),
        tech.getEmail(),
        Role.ROLE_TECHNICIAN.name(),
        tech.getName()
    );

    UserResponse userRes = new UserResponse(
        tech.getId(),
        tech.getName(),
        tech.getEmail(),
        tech.getPhone(),
        Role.ROLE_TECHNICIAN,
        true,
        Instant.now()
    );

    TokenResponse tokens = new TokenResponse(accessToken, "Bearer", jwtService.getAccessTokenExpirySeconds());

    return new AuthSessionResponse(userRes, tokens, "Login successful.");
  }
}

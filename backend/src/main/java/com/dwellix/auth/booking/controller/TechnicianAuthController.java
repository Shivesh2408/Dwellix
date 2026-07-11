package com.dwellix.auth.booking.controller;

import com.dwellix.auth.api.ApiMessageResponse;
import com.dwellix.auth.booking.dto.request.TechnicianSignupRequest;
import com.dwellix.auth.booking.service.TechnicianAuthService;
import com.dwellix.auth.dto.AuthSessionResponse;
import com.dwellix.auth.dto.UserResponse;
import com.dwellix.auth.dto.request.LoginRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/technician")
public class TechnicianAuthController {

  private final TechnicianAuthService technicianAuthService;

  public TechnicianAuthController(TechnicianAuthService technicianAuthService) {
    this.technicianAuthService = technicianAuthService;
  }

  @PostMapping("/signup")
  public ResponseEntity<ApiMessageResponse> signup(@Valid @RequestBody TechnicianSignupRequest request) {
    UserResponse response = technicianAuthService.signup(request);
    return ResponseEntity.ok(new ApiMessageResponse("Technician account created for %s.".formatted(response.email())));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthSessionResponse> login(@Valid @RequestBody LoginRequest request) {
    AuthSessionResponse response = technicianAuthService.login(request);
    return ResponseEntity.ok(response);
  }
}

package com.dwellix.auth.onboarding.controller;

import com.dwellix.auth.api.ApiMessageResponse;
import com.dwellix.auth.onboarding.dto.request.OnboardingHomeRequest;
import com.dwellix.auth.onboarding.dto.response.OnboardingHomeResponse;
import com.dwellix.auth.onboarding.service.OnboardingService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/onboarding/home")
@PreAuthorize("isAuthenticated()")
public class OnboardingHomeController {
  private final OnboardingService onboardingService;

  public OnboardingHomeController(OnboardingService onboardingService) {
    this.onboardingService = onboardingService;
  }

  @GetMapping
  public ResponseEntity<OnboardingHomeResponse> get(@AuthenticationPrincipal CurrentUserPrincipal principal) {
    return ResponseEntity.ok(onboardingService.getHome(principal.getUserId()));
  }

  @PostMapping
  public ResponseEntity<OnboardingHomeResponse> create(@AuthenticationPrincipal CurrentUserPrincipal principal, @Valid @RequestBody OnboardingHomeRequest request) {
    return ResponseEntity.ok(onboardingService.upsertHome(principal.getUserId(), request));
  }

  @PutMapping
  public ResponseEntity<OnboardingHomeResponse> update(@AuthenticationPrincipal CurrentUserPrincipal principal, @Valid @RequestBody OnboardingHomeRequest request) {
    return ResponseEntity.ok(onboardingService.upsertHome(principal.getUserId(), request));
  }

  @DeleteMapping
  public ResponseEntity<ApiMessageResponse> delete(@AuthenticationPrincipal CurrentUserPrincipal principal) {
    onboardingService.deleteHome(principal.getUserId());
    return ResponseEntity.ok(new ApiMessageResponse("Home deleted successfully."));
  }
}

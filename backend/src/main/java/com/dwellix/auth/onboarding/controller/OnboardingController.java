package com.dwellix.auth.onboarding.controller;

import com.dwellix.auth.onboarding.dto.request.OnboardingCompleteRequest;
import com.dwellix.auth.onboarding.dto.response.OnboardingCompleteResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingSummaryResponse;
import com.dwellix.auth.onboarding.service.OnboardingService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/onboarding")
@PreAuthorize("isAuthenticated()")
public class OnboardingController {
  private final OnboardingService onboardingService;

  public OnboardingController(OnboardingService onboardingService) {
    this.onboardingService = onboardingService;
  }

  @GetMapping("/summary")
  public ResponseEntity<OnboardingSummaryResponse> summary(@AuthenticationPrincipal CurrentUserPrincipal principal) {
    return ResponseEntity.ok(onboardingService.getSummary(principal.getUserId()));
  }

  @PostMapping("/complete")
  public ResponseEntity<OnboardingCompleteResponse> complete(@AuthenticationPrincipal CurrentUserPrincipal principal, @Valid @RequestBody OnboardingCompleteRequest request) {
    return ResponseEntity.ok(onboardingService.complete(principal.getUserId(), request));
  }
}

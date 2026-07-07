package com.dwellix.auth.onboarding.controller;

import com.dwellix.auth.api.ApiMessageResponse;
import com.dwellix.auth.onboarding.dto.request.OnboardingApplianceRequest;
import com.dwellix.auth.onboarding.dto.response.OnboardingApplianceResponse;
import com.dwellix.auth.onboarding.service.OnboardingService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/onboarding")
@PreAuthorize("isAuthenticated()")
public class OnboardingApplianceController {
  private final OnboardingService onboardingService;

  public OnboardingApplianceController(OnboardingService onboardingService) {
    this.onboardingService = onboardingService;
  }

  @GetMapping("/rooms/{roomId}/appliances")
  public ResponseEntity<List<OnboardingApplianceResponse>> listForRoom(@AuthenticationPrincipal CurrentUserPrincipal principal, @PathVariable UUID roomId) {
    return ResponseEntity.ok(onboardingService.listAppliancesForRoom(principal.getUserId(), roomId));
  }

  @GetMapping("/appliances")
  public ResponseEntity<List<OnboardingApplianceResponse>> listAll(@AuthenticationPrincipal CurrentUserPrincipal principal) {
    return ResponseEntity.ok(onboardingService.listAppliances(principal.getUserId()));
  }

  @PostMapping("/rooms/{roomId}/appliances")
  public ResponseEntity<OnboardingApplianceResponse> create(@AuthenticationPrincipal CurrentUserPrincipal principal, @PathVariable UUID roomId, @Valid @RequestBody OnboardingApplianceRequest request) {
    return ResponseEntity.ok(onboardingService.createAppliance(principal.getUserId(), roomId, request));
  }

  @PutMapping("/appliances/{applianceId}")
  public ResponseEntity<OnboardingApplianceResponse> update(@AuthenticationPrincipal CurrentUserPrincipal principal, @PathVariable UUID applianceId, @Valid @RequestBody OnboardingApplianceRequest request) {
    return ResponseEntity.ok(onboardingService.updateAppliance(principal.getUserId(), applianceId, request));
  }

  @DeleteMapping("/appliances/{applianceId}")
  public ResponseEntity<ApiMessageResponse> delete(@AuthenticationPrincipal CurrentUserPrincipal principal, @PathVariable UUID applianceId) {
    onboardingService.deleteAppliance(principal.getUserId(), applianceId);
    return ResponseEntity.ok(new ApiMessageResponse("Appliance deleted successfully."));
  }
}

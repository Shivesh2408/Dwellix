package com.dwellix.auth.onboarding.controller;

import com.dwellix.auth.api.ApiMessageResponse;
import com.dwellix.auth.onboarding.dto.request.OnboardingRoomRequest;
import com.dwellix.auth.onboarding.dto.response.OnboardingRoomResponse;
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
@RequestMapping("/api/v1/onboarding/rooms")
@PreAuthorize("isAuthenticated()")
public class OnboardingRoomController {
  private final OnboardingService onboardingService;

  public OnboardingRoomController(OnboardingService onboardingService) {
    this.onboardingService = onboardingService;
  }

  @GetMapping
  public ResponseEntity<List<OnboardingRoomResponse>> list(@AuthenticationPrincipal CurrentUserPrincipal principal) {
    return ResponseEntity.ok(onboardingService.listRooms(principal.getUserId()));
  }

  @PostMapping
  public ResponseEntity<OnboardingRoomResponse> create(@AuthenticationPrincipal CurrentUserPrincipal principal, @Valid @RequestBody OnboardingRoomRequest request) {
    return ResponseEntity.ok(onboardingService.createRoom(principal.getUserId(), request));
  }

  @PutMapping("/{roomId}")
  public ResponseEntity<OnboardingRoomResponse> update(@AuthenticationPrincipal CurrentUserPrincipal principal, @PathVariable UUID roomId, @Valid @RequestBody OnboardingRoomRequest request) {
    return ResponseEntity.ok(onboardingService.updateRoom(principal.getUserId(), roomId, request));
  }

  @DeleteMapping("/{roomId}")
  public ResponseEntity<ApiMessageResponse> delete(@AuthenticationPrincipal CurrentUserPrincipal principal, @PathVariable UUID roomId) {
    onboardingService.deleteRoom(principal.getUserId(), roomId);
    return ResponseEntity.ok(new ApiMessageResponse("Room deleted successfully."));
  }
}

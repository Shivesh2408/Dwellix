package com.dwellix.auth.booking.controller;

import com.dwellix.auth.booking.dto.EarningsResponse;
import com.dwellix.auth.booking.service.TechnicianEarningsService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/technician/earnings")
@PreAuthorize("hasRole('ROLE_TECHNICIAN')")
public class TechnicianEarningsController {

  private final TechnicianEarningsService earningsService;

  public TechnicianEarningsController(TechnicianEarningsService earningsService) {
    this.earningsService = earningsService;
  }

  @GetMapping
  public ResponseEntity<EarningsResponse> getEarnings(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(earningsService.getEarnings(principal.getUserId()));
  }
}

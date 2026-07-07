package com.dwellix.auth.dashboard.controller;

import com.dwellix.auth.dashboard.dto.DashboardSummaryResponse;
import com.dwellix.auth.dashboard.service.DashboardService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping
  public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(dashboardService.getDashboardSummary(principal.getUserId()));
  }
}

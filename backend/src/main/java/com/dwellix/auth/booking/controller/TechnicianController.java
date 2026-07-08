package com.dwellix.auth.booking.controller;

import com.dwellix.auth.booking.dto.TechnicianResponse;
import com.dwellix.auth.booking.service.TechnicianService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/technicians")
@PreAuthorize("isAuthenticated()")
public class TechnicianController {

  private final TechnicianService technicianService;

  public TechnicianController(TechnicianService technicianService) {
    this.technicianService = technicianService;
  }

  @GetMapping
  public ResponseEntity<List<TechnicianResponse>> list() {
    return ResponseEntity.ok(technicianService.listTechnicians());
  }

  @GetMapping("/{id}")
  public ResponseEntity<TechnicianResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(technicianService.getTechnician(id));
  }
}

package com.dwellix.auth.onboarding.controller;

import com.dwellix.auth.onboarding.dto.response.ApplianceResponse;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import com.dwellix.auth.onboarding.repository.OnboardingApplianceRepository;
import com.dwellix.auth.security.CurrentUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/appliances")
@PreAuthorize("isAuthenticated()")
public class ApplianceController {

  private final OnboardingApplianceRepository applianceRepository;

  public ApplianceController(OnboardingApplianceRepository applianceRepository) {
    this.applianceRepository = applianceRepository;
  }

  @GetMapping
  public ResponseEntity<List<ApplianceResponse>> getAppliances(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    List<OnboardingApplianceEntity> entities = applianceRepository.findByRoom_Home_User_IdOrderBySortOrderAsc(principal.getUserId());
    
    LocalDate today = LocalDate.now();
    List<ApplianceResponse> response = entities.stream()
        .map(entity -> {
          String status = (entity.getWarrantyExpiry() != null && !entity.getWarrantyExpiry().isBefore(today))
              ? "Covered"
              : "Expired";
              
          int health = Math.abs(entity.getId().hashCode() % 20) + 80;
          
          String maintenance = (entity.getPurchaseDate() != null)
              ? entity.getPurchaseDate().plusMonths(6).toString()
              : "6 months ago";

          return new ApplianceResponse(
              entity.getId(),
              entity.getName(),
              entity.getBrand(),
              entity.getModel(),
              entity.getRoom() != null ? entity.getRoom().getName() : "Unknown Room",
              entity.getRoom() != null ? entity.getRoom().getId() : null,
              entity.getPurchaseDate(),
              entity.getWarrantyExpiry(),
              entity.getPhotoFileName(),
              status,
              health,
              maintenance
          );
        })
        .collect(Collectors.toList());
        
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApplianceResponse> getAppliance(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    OnboardingApplianceEntity entity = applianceRepository.findByIdAndRoom_Home_User_Id(id, principal.getUserId())
        .orElseThrow(() -> new RuntimeException("Appliance not found"));
        
    LocalDate today = LocalDate.now();
    String status = (entity.getWarrantyExpiry() != null && !entity.getWarrantyExpiry().isBefore(today))
        ? "Covered"
        : "Expired";
        
    int health = Math.abs(entity.getId().hashCode() % 20) + 80;
    
    String maintenance = (entity.getPurchaseDate() != null)
        ? entity.getPurchaseDate().plusMonths(6).toString()
        : "6 months ago";

    ApplianceResponse response = new ApplianceResponse(
        entity.getId(),
        entity.getName(),
        entity.getBrand(),
        entity.getModel(),
        entity.getRoom() != null ? entity.getRoom().getName() : "Unknown Room",
        entity.getRoom() != null ? entity.getRoom().getId() : null,
        entity.getPurchaseDate(),
        entity.getWarrantyExpiry(),
        entity.getPhotoFileName(),
        status,
        health,
        maintenance
    );
    
    return ResponseEntity.ok(response);
  }
}

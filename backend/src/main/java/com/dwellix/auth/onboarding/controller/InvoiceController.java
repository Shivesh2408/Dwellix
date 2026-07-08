package com.dwellix.auth.onboarding.controller;

import com.dwellix.auth.onboarding.dto.response.ApplianceResponse;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import com.dwellix.auth.onboarding.repository.OnboardingApplianceRepository;
import com.dwellix.auth.security.CurrentUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/invoices")
@PreAuthorize("isAuthenticated()")
public class InvoiceController {

  private final OnboardingApplianceRepository applianceRepository;

  public InvoiceController(OnboardingApplianceRepository applianceRepository) {
    this.applianceRepository = applianceRepository;
  }

  @GetMapping
  public ResponseEntity<List<ApplianceResponse>> getInvoices(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    List<OnboardingApplianceEntity> entities = applianceRepository.findByRoom_Home_User_IdOrderBySortOrderAsc(principal.getUserId());
    
    LocalDate today = LocalDate.now();
    List<ApplianceResponse> response = entities.stream()
        .filter(entity -> entity.getInvoiceFileName() != null && !entity.getInvoiceFileName().isBlank())
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
}

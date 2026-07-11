package com.dwellix.auth.booking.mapper;

import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.dto.BookingResponse;
import com.dwellix.auth.booking.repository.PaymentRepository;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

  private final PaymentRepository paymentRepository;

  public BookingMapper(PaymentRepository paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  public BookingResponse toResponse(TechnicianBookingEntity entity) {
    if (entity == null) return null;

    String applianceName = entity.getAppliance() != null ? entity.getAppliance().getName() : "Unknown Appliance";
    String brand = entity.getAppliance() != null ? entity.getAppliance().getBrand() : "Unknown Brand";
    String model = entity.getAppliance() != null ? entity.getAppliance().getModel() : "Unknown Model";

    String customerName = entity.getUser() != null ? entity.getUser().getFullName() : "Unknown Customer";
    String customerPhone = entity.getUser() != null ? entity.getUser().getPhoneNumber() : "Unknown Phone";
    String customerAddress = "No address";
    if (entity.getAppliance() != null && entity.getAppliance().getRoom() != null && entity.getAppliance().getRoom().getHome() != null) {
      customerAddress = entity.getAppliance().getRoom().getHome().getAddress();
    }

    String paymentStatus = paymentRepository.findByBookingId(entity.getId())
        .map(p -> p.getStatus())
        .orElse(null);

    return new BookingResponse(
        entity.getId(),
        entity.getUser() != null ? entity.getUser().getId() : null,
        entity.getAppliance() != null ? entity.getAppliance().getId() : null,
        applianceName,
        brand,
        model,
        entity.getTechnicianName(),
        entity.getTechnicianPhone(),
        entity.getServiceType(),
        entity.getProblemDescription(),
        entity.getBookingDate(),
        entity.getBookingTime(),
        entity.getStatus() != null ? entity.getStatus().name() : null,
        entity.getEstimatedCost(),
        entity.getCreatedAt(),
        entity.getUpdatedAt(),
        entity.getAssignedTechnicianId(),
        entity.getBookingStatus() != null ? entity.getBookingStatus().name() : null,
        entity.getAcceptedAt(),
        entity.getStartedAt(),
        entity.getCompletedAt(),
        entity.getEstimatedArrival(),
        entity.getServiceCharge(),
        entity.getInspectionCharge(),
        customerName,
        customerPhone,
        customerAddress,
        paymentStatus
    );
  }
}

package com.dwellix.auth.booking.mapper;

import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.dto.BookingResponse;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

  public BookingResponse toResponse(TechnicianBookingEntity entity) {
    if (entity == null) return null;

    String applianceName = entity.getAppliance() != null ? entity.getAppliance().getName() : "Unknown Appliance";
    String brand = entity.getAppliance() != null ? entity.getAppliance().getBrand() : "Unknown Brand";
    String model = entity.getAppliance() != null ? entity.getAppliance().getModel() : "Unknown Model";

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
        entity.getUpdatedAt()
    );
  }
}

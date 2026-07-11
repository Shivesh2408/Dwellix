package com.dwellix.auth.booking.repository;

import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TechnicianBookingRepository extends JpaRepository<TechnicianBookingEntity, UUID> {
  List<TechnicianBookingEntity> findByUser_IdOrderByBookingDateDesc(UUID userId);
  Optional<TechnicianBookingEntity> findByIdAndUser_Id(UUID bookingId, UUID userId);
  List<TechnicianBookingEntity> findByAssignedTechnicianId(UUID assignedTechnicianId);
  List<TechnicianBookingEntity> findByAssignedTechnicianIdAndStatus(UUID assignedTechnicianId, com.dwellix.auth.booking.domain.BookingStatus status);
}

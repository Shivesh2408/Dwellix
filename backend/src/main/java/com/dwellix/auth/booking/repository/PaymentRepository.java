package com.dwellix.auth.booking.repository;

import com.dwellix.auth.booking.domain.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, UUID> {
  Optional<PaymentEntity> findByBookingId(UUID bookingId);
  List<PaymentEntity> findByTechnicianId(UUID technicianId);
}

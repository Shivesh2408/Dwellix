package com.dwellix.auth.booking.repository;

import com.dwellix.auth.booking.domain.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, UUID> {
  List<ReviewEntity> findByTechnicianIdOrderByCreatedAtDesc(UUID technicianId);
  List<ReviewEntity> findByTechnicianId(UUID technicianId);
}

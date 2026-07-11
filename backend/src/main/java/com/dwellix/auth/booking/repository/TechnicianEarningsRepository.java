package com.dwellix.auth.booking.repository;

import com.dwellix.auth.booking.domain.TechnicianEarningsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TechnicianEarningsRepository extends JpaRepository<TechnicianEarningsEntity, UUID> {
  Optional<TechnicianEarningsEntity> findByTechnicianId(UUID technicianId);
}

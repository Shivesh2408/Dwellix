package com.dwellix.auth.booking.repository;

import com.dwellix.auth.booking.domain.TechnicianEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TechnicianRepository extends JpaRepository<TechnicianEntity, UUID> {
}

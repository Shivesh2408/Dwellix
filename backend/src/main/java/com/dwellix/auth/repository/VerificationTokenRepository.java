package com.dwellix.auth.repository;

import com.dwellix.auth.domain.VerificationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, UUID> {
  Optional<VerificationTokenEntity> findByTokenHash(String tokenHash);
  void deleteByUser_Id(UUID userId);
}

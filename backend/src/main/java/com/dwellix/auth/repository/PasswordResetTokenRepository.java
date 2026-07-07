package com.dwellix.auth.repository;

import com.dwellix.auth.domain.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, UUID> {
  Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);
  void deleteByUser_Id(UUID userId);
}

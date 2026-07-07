package com.dwellix.auth.onboarding.repository;

import com.dwellix.auth.onboarding.domain.OnboardingHomeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OnboardingHomeRepository extends JpaRepository<OnboardingHomeEntity, UUID> {
  Optional<OnboardingHomeEntity> findByUser_Id(UUID userId);
  void deleteByUser_Id(UUID userId);
}

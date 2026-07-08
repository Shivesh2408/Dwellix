package com.dwellix.auth.onboarding.repository;

import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OnboardingApplianceRepository extends JpaRepository<OnboardingApplianceEntity, UUID> {
  @EntityGraph(attributePaths = {"room"})
  List<OnboardingApplianceEntity> findByRoom_Home_User_IdOrderBySortOrderAsc(UUID userId);

  @EntityGraph(attributePaths = {"room"})
  List<OnboardingApplianceEntity> findByRoom_IdOrderBySortOrderAsc(UUID roomId);

  @EntityGraph(attributePaths = {"room"})
  Optional<OnboardingApplianceEntity> findByIdAndRoom_Home_User_Id(UUID applianceId, UUID userId);

  void deleteByRoom_Home_User_Id(UUID userId);
}

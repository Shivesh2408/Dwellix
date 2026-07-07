package com.dwellix.auth.onboarding.repository;

import com.dwellix.auth.onboarding.domain.OnboardingRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OnboardingRoomRepository extends JpaRepository<OnboardingRoomEntity, UUID> {
  List<OnboardingRoomEntity> findByHome_User_IdOrderBySortOrderAsc(UUID userId);
  Optional<OnboardingRoomEntity> findByIdAndHome_User_Id(UUID roomId, UUID userId);
  void deleteByHome_User_Id(UUID userId);
}

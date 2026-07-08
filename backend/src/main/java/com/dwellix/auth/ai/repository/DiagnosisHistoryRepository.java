package com.dwellix.auth.ai.repository;

import com.dwellix.auth.ai.domain.DiagnosisHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiagnosisHistoryRepository extends JpaRepository<DiagnosisHistoryEntity, UUID> {
  List<DiagnosisHistoryEntity> findByUser_IdOrderByTimestampDesc(UUID userId);
}

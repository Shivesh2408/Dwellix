package com.dwellix.auth.ai.service;

import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.repository.UserRepository;
import com.dwellix.auth.ai.domain.DiagnosisHistoryEntity;
import com.dwellix.auth.ai.dto.ImageDiagnosisResponse;
import com.dwellix.auth.ai.dto.DiagnosisHistoryResponse;
import com.dwellix.auth.ai.repository.DiagnosisHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AIDiagnosisHistoryService {

  private final DiagnosisHistoryRepository diagnosisHistoryRepository;
  private final UserRepository userRepository;

  public AIDiagnosisHistoryService(
      DiagnosisHistoryRepository diagnosisHistoryRepository,
      UserRepository userRepository
  ) {
    this.diagnosisHistoryRepository = diagnosisHistoryRepository;
    this.userRepository = userRepository;
  }

  public void saveDiagnosis(UUID userId, String imageUrl, ImageDiagnosisResponse response) {
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    DiagnosisHistoryEntity entity = new DiagnosisHistoryEntity();
    entity.setId(UUID.randomUUID());
    entity.setUser(user);
    entity.setImageUrl(imageUrl);
    entity.setApplianceType(response.applianceType());
    entity.setBrand(response.brand());
    entity.setVisibleProblems(response.visibleProblems() != null ? String.join(", ", response.visibleProblems()) : "");
    entity.setSeverity(response.severity());
    entity.setPossibleCauses(response.possibleCauses() != null ? String.join(", ", response.possibleCauses()) : "");
    entity.setRecommendedActions(response.recommendedActions() != null ? String.join(", ", response.recommendedActions()) : "");
    entity.setTechnicianRequired(response.technicianRequired());
    entity.setConfidence(response.confidence());
    entity.setTimestamp(Instant.now());

    diagnosisHistoryRepository.save(entity);
  }

  @Transactional(readOnly = true)
  public List<DiagnosisHistoryResponse> getHistory(UUID userId) {
    return diagnosisHistoryRepository.findByUser_IdOrderByTimestampDesc(userId).stream()
        .map(entity -> new DiagnosisHistoryResponse(
            entity.getId(),
            entity.getImageUrl(),
            entity.getApplianceType(),
            entity.getBrand(),
            entity.getVisibleProblems() != null && !entity.getVisibleProblems().isEmpty()
                ? Arrays.asList(entity.getVisibleProblems().split(", "))
                : List.of(),
            entity.getSeverity(),
            entity.getPossibleCauses() != null && !entity.getPossibleCauses().isEmpty()
                ? Arrays.asList(entity.getPossibleCauses().split(", "))
                : List.of(),
            entity.getRecommendedActions() != null && !entity.getRecommendedActions().isEmpty()
                ? Arrays.asList(entity.getRecommendedActions().split(", "))
                : List.of(),
            entity.getTechnicianRequired(),
            entity.getConfidence(),
            entity.getTimestamp()
        ))
        .collect(Collectors.toList());
  }
}

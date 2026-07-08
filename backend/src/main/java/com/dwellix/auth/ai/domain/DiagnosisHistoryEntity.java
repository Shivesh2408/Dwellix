package com.dwellix.auth.ai.domain;

import com.dwellix.auth.domain.UserEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_diagnosis_history")
public class DiagnosisHistoryEntity {

  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(name = "image_url", nullable = false, length = 1024)
  private String imageUrl;

  @Column(name = "appliance_type")
  private String applianceType;

  private String brand;

  @Column(name = "visible_problems", columnDefinition = "TEXT")
  private String visibleProblems;

  private String severity;

  @Column(name = "possible_causes", columnDefinition = "TEXT")
  private String possibleCauses;

  @Column(name = "recommended_actions", columnDefinition = "TEXT")
  private String recommendedActions;

  @Column(name = "technician_required")
  private Boolean technicianRequired;

  private Double confidence;

  @Column(nullable = false)
  private Instant timestamp;

  public DiagnosisHistoryEntity() {}

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getApplianceType() {
    return applianceType;
  }

  public void setApplianceType(String applianceType) {
    this.applianceType = applianceType;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getVisibleProblems() {
    return visibleProblems;
  }

  public void setVisibleProblems(String visibleProblems) {
    this.visibleProblems = visibleProblems;
  }

  public String getSeverity() {
    return severity;
  }

  public void setSeverity(String severity) {
    this.severity = severity;
  }

  public String getPossibleCauses() {
    return possibleCauses;
  }

  public void setPossibleCauses(String possibleCauses) {
    this.possibleCauses = possibleCauses;
  }

  public String getRecommendedActions() {
    return recommendedActions;
  }

  public void setRecommendedActions(String recommendedActions) {
    this.recommendedActions = recommendedActions;
  }

  public Boolean getTechnicianRequired() {
    return technicianRequired;
  }

  public void setTechnicianRequired(Boolean technicianRequired) {
    this.technicianRequired = technicianRequired;
  }

  public Double getConfidence() {
    return confidence;
  }

  public void setConfidence(Double confidence) {
    this.confidence = confidence;
  }

  public Instant getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(Instant timestamp) {
    this.timestamp = timestamp;
  }
}

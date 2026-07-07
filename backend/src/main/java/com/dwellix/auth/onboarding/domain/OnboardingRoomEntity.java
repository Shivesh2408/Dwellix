package com.dwellix.auth.onboarding.domain;

import com.dwellix.auth.domain.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "rooms")
public class OnboardingRoomEntity extends AuditedEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "home_id", nullable = false)
  private OnboardingHomeEntity home;

  @Column(nullable = false, length = 140)
  private String name;

  @Column(length = 240)
  private String notes;

  @Column(name = "sort_order", nullable = false)
  private int sortOrder;

  @OneToMany(mappedBy = "room", orphanRemoval = true)
  private List<OnboardingApplianceEntity> appliances = new ArrayList<>();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public OnboardingHomeEntity getHome() {
    return home;
  }

  public void setHome(OnboardingHomeEntity home) {
    this.home = home;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(int sortOrder) {
    this.sortOrder = sortOrder;
  }

  public List<OnboardingApplianceEntity> getAppliances() {
    return appliances;
  }

  public void setAppliances(List<OnboardingApplianceEntity> appliances) {
    this.appliances = appliances;
  }
}

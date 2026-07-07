package com.dwellix.auth.onboarding.domain;

import com.dwellix.auth.domain.AuditedEntity;
import com.dwellix.auth.domain.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "homes", uniqueConstraints = @UniqueConstraint(name = "uk_homes_user_id", columnNames = "user_id"))
public class OnboardingHomeEntity extends AuditedEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(name = "home_name", nullable = false, length = 140)
  private String homeName;

  @Enumerated(EnumType.STRING)
  @Column(name = "home_type", nullable = false, length = 40)
  private HomeType homeType;

  @Column(nullable = false, length = 255)
  private String address;

  @Column(nullable = false, length = 120)
  private String city;

  @Column(nullable = false, length = 120)
  private String state;

  @Column(nullable = false, length = 12)
  private String pincode;

  @Column(name = "setup_completed", nullable = false)
  private boolean setupCompleted;

  @Column(name = "setup_completed_at")
  private Instant setupCompletedAt;

  @OneToMany(mappedBy = "home", orphanRemoval = true)
  private List<OnboardingRoomEntity> rooms = new ArrayList<>();

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

  public String getHomeName() {
    return homeName;
  }

  public void setHomeName(String homeName) {
    this.homeName = homeName;
  }

  public HomeType getHomeType() {
    return homeType;
  }

  public void setHomeType(HomeType homeType) {
    this.homeType = homeType;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public String getPincode() {
    return pincode;
  }

  public void setPincode(String pincode) {
    this.pincode = pincode;
  }

  public boolean isSetupCompleted() {
    return setupCompleted;
  }

  public void setSetupCompleted(boolean setupCompleted) {
    this.setupCompleted = setupCompleted;
  }

  public Instant getSetupCompletedAt() {
    return setupCompletedAt;
  }

  public void setSetupCompletedAt(Instant setupCompletedAt) {
    this.setupCompletedAt = setupCompletedAt;
  }

  public List<OnboardingRoomEntity> getRooms() {
    return rooms;
  }

  public void setRooms(List<OnboardingRoomEntity> rooms) {
    this.rooms = rooms;
  }
}

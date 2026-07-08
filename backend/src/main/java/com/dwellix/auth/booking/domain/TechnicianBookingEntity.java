package com.dwellix.auth.booking.domain;

import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "technician_bookings")
public class TechnicianBookingEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "appliance_id", nullable = false)
  private OnboardingApplianceEntity appliance;

  @Column(name = "technician_name", length = 140)
  private String technicianName;

  @Column(name = "technician_phone", length = 30)
  private String technicianPhone;

  @Column(name = "service_type", nullable = false, length = 100)
  private String serviceType;

  @Column(name = "problem_description", columnDefinition = "TEXT", nullable = false)
  private String problemDescription;

  @Column(name = "booking_date", nullable = false)
  private LocalDate bookingDate;

  @Column(name = "booking_time", nullable = false, length = 50)
  private String bookingTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private BookingStatus status;

  @Column(name = "estimated_cost")
  private Double estimatedCost;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public TechnicianBookingEntity() {}

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

  public OnboardingApplianceEntity getAppliance() {
    return appliance;
  }

  public void setAppliance(OnboardingApplianceEntity appliance) {
    this.appliance = appliance;
  }

  public String getTechnicianName() {
    return technicianName;
  }

  public void setTechnicianName(String technicianName) {
    this.technicianName = technicianName;
  }

  public String getTechnicianPhone() {
    return technicianPhone;
  }

  public void setTechnicianPhone(String technicianPhone) {
    this.technicianPhone = technicianPhone;
  }

  public String getServiceType() {
    return serviceType;
  }

  public void setServiceType(String serviceType) {
    this.serviceType = serviceType;
  }

  public String getProblemDescription() {
    return problemDescription;
  }

  public void setProblemDescription(String problemDescription) {
    this.problemDescription = problemDescription;
  }

  public LocalDate getBookingDate() {
    return bookingDate;
  }

  public void setBookingDate(LocalDate bookingDate) {
    this.bookingDate = bookingDate;
  }

  public String getBookingTime() {
    return bookingTime;
  }

  public void setBookingTime(String bookingTime) {
    this.bookingTime = bookingTime;
  }

  public BookingStatus getStatus() {
    return status;
  }

  public void setStatus(BookingStatus status) {
    this.status = status;
  }

  public Double getEstimatedCost() {
    return estimatedCost;
  }

  public void setEstimatedCost(Double estimatedCost) {
    this.estimatedCost = estimatedCost;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}

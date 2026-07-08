package com.dwellix.auth.booking.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "technicians")
public class TechnicianEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 140)
  private String name;

  @Column(name = "photo_url")
  private String photoUrl;

  @Column(nullable = false, length = 100)
  private String specialization;

  @Column(name = "experience_years", nullable = false)
  private Integer experienceYears;

  @Column(nullable = false)
  private Double rating;

  @Column(name = "total_reviews", nullable = false)
  private Integer totalReviews;

  @Column(nullable = false, length = 30)
  private String phone;

  @Column(nullable = false, length = 100)
  private String email;

  @Column(nullable = false, length = 100)
  private String city;

  @Column(nullable = false, length = 100)
  private String availability;

  @Column(name = "hourly_rate", nullable = false)
  private Double hourlyRate;

  @Column(nullable = false)
  private Boolean verified;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public TechnicianEntity() {}

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhotoUrl() {
    return photoUrl;
  }

  public void setPhotoUrl(String photoUrl) {
    this.photoUrl = photoUrl;
  }

  public String getSpecialization() {
    return specialization;
  }

  public void setSpecialization(String specialization) {
    this.specialization = specialization;
  }

  public Integer getExperienceYears() {
    return experienceYears;
  }

  public void setExperienceYears(Integer experienceYears) {
    this.experienceYears = experienceYears;
  }

  public Double getRating() {
    return rating;
  }

  public void setRating(Double rating) {
    this.rating = rating;
  }

  public Integer getTotalReviews() {
    return totalReviews;
  }

  public void setTotalReviews(Integer totalReviews) {
    this.totalReviews = totalReviews;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getAvailability() {
    return availability;
  }

  public void setAvailability(String availability) {
    this.availability = availability;
  }

  public Double getHourlyRate() {
    return hourlyRate;
  }

  public void setHourlyRate(Double hourlyRate) {
    this.hourlyRate = hourlyRate;
  }

  public Boolean getVerified() {
    return verified;
  }

  public void setVerified(Boolean verified) {
    this.verified = verified;
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

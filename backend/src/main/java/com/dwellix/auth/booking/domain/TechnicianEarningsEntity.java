package com.dwellix.auth.booking.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "technician_earnings")
public class TechnicianEarningsEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "technician_id", nullable = false)
  private UUID technicianId;

  @Column(nullable = false)
  private Double today;

  @Column(name = "this_week", nullable = false)
  private Double thisWeek;

  @Column(name = "this_month", nullable = false)
  private Double thisMonth;

  @Column(nullable = false)
  private Double lifetime;

  @Column(nullable = false)
  private Double pending;

  @Column(name = "last_updated", nullable = false)
  private Instant lastUpdated;

  public TechnicianEarningsEntity() {}

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getTechnicianId() {
    return technicianId;
  }

  public void setTechnicianId(UUID technicianId) {
    this.technicianId = technicianId;
  }

  public Double getToday() {
    return today;
  }

  public void setToday(Double today) {
    this.today = today;
  }

  public Double getThisWeek() {
    return thisWeek;
  }

  public void setThisWeek(Double thisWeek) {
    this.thisWeek = thisWeek;
  }

  public Double getThisMonth() {
    return thisMonth;
  }

  public void setThisMonth(Double thisMonth) {
    this.thisMonth = thisMonth;
  }

  public Double getLifetime() {
    return lifetime;
  }

  public void setLifetime(Double lifetime) {
    this.lifetime = lifetime;
  }

  public Double getPending() {
    return pending;
  }

  public void setPending(Double pending) {
    this.pending = pending;
  }

  public Instant getLastUpdated() {
    return lastUpdated;
  }

  public void setLastUpdated(Instant lastUpdated) {
    this.lastUpdated = lastUpdated;
  }
}

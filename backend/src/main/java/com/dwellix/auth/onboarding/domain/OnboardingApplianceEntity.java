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
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "appliances")
public class OnboardingApplianceEntity extends AuditedEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_id", nullable = false)
  private OnboardingRoomEntity room;

  @Column(nullable = false, length = 140)
  private String name;

  @Column(nullable = false, length = 120)
  private String brand;

  @Column(nullable = false, length = 120)
  private String model;

  @Column(name = "purchase_date", nullable = false)
  private LocalDate purchaseDate;

  @Column(name = "warranty_expiry", nullable = false)
  private LocalDate warrantyExpiry;

  @Column(name = "photo_file_name", length = 255)
  private String photoFileName;

  @Column(name = "invoice_file_name", length = 255)
  private String invoiceFileName;

  @Column(name = "sort_order", nullable = false)
  private int sortOrder;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public OnboardingRoomEntity getRoom() {
    return room;
  }

  public void setRoom(OnboardingRoomEntity room) {
    this.room = room;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public LocalDate getPurchaseDate() {
    return purchaseDate;
  }

  public void setPurchaseDate(LocalDate purchaseDate) {
    this.purchaseDate = purchaseDate;
  }

  public LocalDate getWarrantyExpiry() {
    return warrantyExpiry;
  }

  public void setWarrantyExpiry(LocalDate warrantyExpiry) {
    this.warrantyExpiry = warrantyExpiry;
  }

  public String getPhotoFileName() {
    return photoFileName;
  }

  public void setPhotoFileName(String photoFileName) {
    this.photoFileName = photoFileName;
  }

  public String getInvoiceFileName() {
    return invoiceFileName;
  }

  public void setInvoiceFileName(String invoiceFileName) {
    this.invoiceFileName = invoiceFileName;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(int sortOrder) {
    this.sortOrder = sortOrder;
  }
}

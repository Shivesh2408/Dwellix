package com.dwellix.auth.booking.service;

import com.dwellix.auth.booking.domain.BookingStatus;
import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.dto.BookingRequest;
import com.dwellix.auth.booking.dto.BookingResponse;
import com.dwellix.auth.booking.mapper.BookingMapper;
import com.dwellix.auth.booking.repository.TechnicianBookingRepository;
import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import com.dwellix.auth.onboarding.repository.OnboardingApplianceRepository;
import com.dwellix.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

  private final TechnicianBookingRepository bookingRepository;
  private final OnboardingApplianceRepository applianceRepository;
  private final UserRepository userRepository;
  private final BookingMapper bookingMapper;

  public BookingService(
      TechnicianBookingRepository bookingRepository,
      OnboardingApplianceRepository applianceRepository,
      UserRepository userRepository,
      BookingMapper bookingMapper
  ) {
    this.bookingRepository = bookingRepository;
    this.applianceRepository = applianceRepository;
    this.userRepository = userRepository;
    this.bookingMapper = bookingMapper;
  }

  public BookingResponse createBooking(UUID userId, BookingRequest request) {
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    OnboardingApplianceEntity appliance = applianceRepository.findByIdAndRoom_Home_User_Id(request.applianceId(), userId)
        .orElseThrow(() -> new RuntimeException("Appliance not found or does not belong to this user"));

    TechnicianBookingEntity entity = new TechnicianBookingEntity();
    entity.setUser(user);
    entity.setAppliance(appliance);
    entity.setServiceType(request.serviceType());
    entity.setProblemDescription(request.problemDescription());
    entity.setBookingDate(request.bookingDate());
    entity.setBookingTime(request.bookingTime());
    
    BookingStatus status = BookingStatus.PENDING;
    if (request.status() != null && !request.status().isBlank()) {
      try {
        status = BookingStatus.valueOf(request.status().toUpperCase());
      } catch (Exception e) {
        // Fallback to PENDING
      }
    }
    entity.setStatus(status);

    Double cost = request.estimatedCost();
    if (cost == null) {
      cost = 1500.0; // Default estimate
    }
    entity.setEstimatedCost(cost);

    entity.setTechnicianName(request.technicianName());
    entity.setTechnicianPhone(request.technicianPhone());
    entity.setCreatedAt(Instant.now());
    entity.setUpdatedAt(Instant.now());

    return bookingMapper.toResponse(bookingRepository.save(entity));
  }

  @Transactional(readOnly = true)
  public List<BookingResponse> getBookings(UUID userId) {
    return bookingRepository.findByUser_IdOrderByBookingDateDesc(userId).stream()
        .map(bookingMapper::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public BookingResponse getBooking(UUID id, UUID userId) {
    TechnicianBookingEntity entity = bookingRepository.findByIdAndUser_Id(id, userId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    return bookingMapper.toResponse(entity);
  }

  public BookingResponse updateBooking(UUID id, UUID userId, BookingRequest request) {
    TechnicianBookingEntity entity = bookingRepository.findByIdAndUser_Id(id, userId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!entity.getAppliance().getId().equals(request.applianceId())) {
      OnboardingApplianceEntity appliance = applianceRepository.findByIdAndRoom_Home_User_Id(request.applianceId(), userId)
          .orElseThrow(() -> new RuntimeException("Appliance not found or does not belong to this user"));
      entity.setAppliance(appliance);
    }

    entity.setServiceType(request.serviceType());
    entity.setProblemDescription(request.problemDescription());
    entity.setBookingDate(request.bookingDate());
    entity.setBookingTime(request.bookingTime());

    if (request.status() != null && !request.status().isBlank()) {
      entity.setStatus(BookingStatus.valueOf(request.status().toUpperCase()));
    }

    if (request.estimatedCost() != null) {
      entity.setEstimatedCost(request.estimatedCost());
    }

    if (request.technicianName() != null) {
      entity.setTechnicianName(request.technicianName());
    }
    if (request.technicianPhone() != null) {
      entity.setTechnicianPhone(request.technicianPhone());
    }

    entity.setUpdatedAt(Instant.now());
    return bookingMapper.toResponse(bookingRepository.save(entity));
  }

  public void deleteBooking(UUID id, UUID userId) {
    TechnicianBookingEntity entity = bookingRepository.findByIdAndUser_Id(id, userId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    bookingRepository.delete(entity);
  }
}

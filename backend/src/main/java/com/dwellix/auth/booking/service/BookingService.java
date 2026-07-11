package com.dwellix.auth.booking.service;

import com.dwellix.auth.booking.domain.BookingStatus;
import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.dto.BookingRequest;
import com.dwellix.auth.booking.dto.BookingResponse;
import com.dwellix.auth.booking.mapper.BookingMapper;
import com.dwellix.auth.booking.repository.TechnicianBookingRepository;
import com.dwellix.auth.booking.repository.TechnicianRepository;
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
  private final TechnicianRepository technicianRepository;

  public BookingService(
      TechnicianBookingRepository bookingRepository,
      OnboardingApplianceRepository applianceRepository,
      UserRepository userRepository,
      BookingMapper bookingMapper,
      TechnicianRepository technicianRepository
  ) {
    this.bookingRepository = bookingRepository;
    this.applianceRepository = applianceRepository;
    this.userRepository = userRepository;
    this.bookingMapper = bookingMapper;
    this.technicianRepository = technicianRepository;
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
    if (request.assignedTechnicianId() != null) {
      status = BookingStatus.REQUESTED;
      entity.setAssignedTechnicianId(request.assignedTechnicianId());
      entity.setBookingStatus(status);
      
      technicianRepository.findById(request.assignedTechnicianId()).ifPresent(tech -> {
        entity.setTechnicianName(tech.getName());
        entity.setTechnicianPhone(tech.getPhone());
        if (request.inspectionCharge() == null) {
          entity.setInspectionCharge(tech.getInspectionCharge() != null ? tech.getInspectionCharge() : tech.getHourlyRate());
        }
        if (request.serviceCharge() == null) {
          entity.setServiceCharge(tech.getInspectionCharge() != null ? tech.getInspectionCharge() : tech.getHourlyRate());
        }
      });
    }
    if (request.status() != null && !request.status().isBlank()) {
      try {
        status = BookingStatus.valueOf(request.status().toUpperCase());
      } catch (Exception e) {
        // Fallback
      }
    }
    entity.setStatus(status);
    
    if (request.serviceCharge() != null) {
      entity.setServiceCharge(request.serviceCharge());
    }
    if (request.inspectionCharge() != null) {
      entity.setInspectionCharge(request.inspectionCharge());
    }

    Double cost = request.estimatedCost();
    if (cost == null) {
      cost = 1500.0; // Default estimate
    }
    entity.setEstimatedCost(cost);

    if (entity.getTechnicianName() == null) {
      entity.setTechnicianName(request.technicianName());
    }
    if (entity.getTechnicianPhone() == null) {
      entity.setTechnicianPhone(request.technicianPhone());
    }
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

  public void refreshTechnicianQueue(UUID technicianId) {
    List<TechnicianBookingEntity> bookings = bookingRepository.findByAssignedTechnicianId(technicianId);
    
    List<TechnicianBookingEntity> activeJobs = bookings.stream()
        .filter(b -> {
          BookingStatus s = b.getBookingStatus();
          return s == BookingStatus.ACCEPTED || s == BookingStatus.QUEUED ||
                 s == BookingStatus.IN_PROGRESS || s == BookingStatus.TRAVELLING ||
                 s == BookingStatus.ARRIVED;
        })
        .sorted((b1, b2) -> {
          int cmp = b1.getBookingDate().compareTo(b2.getBookingDate());
          if (cmp != 0) return cmp;
          return b1.getBookingTime().compareTo(b2.getBookingTime());
        })
        .collect(Collectors.toList());

    if (activeJobs.isEmpty()) return;

    boolean hasRunningJob = activeJobs.stream()
        .anyMatch(b -> b.getBookingStatus() == BookingStatus.IN_PROGRESS ||
                       b.getBookingStatus() == BookingStatus.TRAVELLING ||
                       b.getBookingStatus() == BookingStatus.ARRIVED);

    if (hasRunningJob) {
      for (TechnicianBookingEntity b : activeJobs) {
        BookingStatus s = b.getBookingStatus();
        if (s != BookingStatus.IN_PROGRESS && s != BookingStatus.TRAVELLING && s != BookingStatus.ARRIVED) {
          if (s != BookingStatus.QUEUED) {
            b.setBookingStatus(BookingStatus.QUEUED);
            bookingRepository.save(b);
          }
        }
      }
    } else {
      for (int i = 0; i < activeJobs.size(); i++) {
        TechnicianBookingEntity b = activeJobs.get(i);
        if (i == 0) {
          if (b.getBookingStatus() != BookingStatus.ACCEPTED) {
            b.setBookingStatus(BookingStatus.ACCEPTED);
            bookingRepository.save(b);
          }
        } else {
          if (b.getBookingStatus() != BookingStatus.QUEUED) {
            b.setBookingStatus(BookingStatus.QUEUED);
            bookingRepository.save(b);
          }
        }
      }
    }
  }

  public List<BookingResponse> getTechnicianBookings(UUID technicianId) {
    refreshTechnicianQueue(technicianId);
    return bookingRepository.findByAssignedTechnicianId(technicianId).stream()
        .map(bookingMapper::toResponse)
        .collect(Collectors.toList());
  }

  public List<BookingResponse> getPendingTechnicianBookings(UUID technicianId) {
    return bookingRepository.findByAssignedTechnicianIdAndStatus(technicianId, BookingStatus.REQUESTED).stream()
        .map(bookingMapper::toResponse)
        .collect(Collectors.toList());
  }

  public BookingResponse acceptBooking(UUID bookingId, UUID technicianId) {
    TechnicianBookingEntity booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    if (!technicianId.equals(booking.getAssignedTechnicianId())) {
      throw new RuntimeException("Booking is not assigned to this technician");
    }
    if (booking.getBookingStatus() != BookingStatus.REQUESTED) {
      throw new RuntimeException("Booking is not in REQUESTED state");
    }
    booking.setBookingStatus(BookingStatus.ACCEPTED);
    booking.setAcceptedAt(Instant.now());
    bookingRepository.save(booking);

    refreshTechnicianQueue(technicianId);
    
    return bookingMapper.toResponse(bookingRepository.findById(bookingId).get());
  }

  public BookingResponse rejectBooking(UUID bookingId, UUID technicianId) {
    TechnicianBookingEntity booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    if (!technicianId.equals(booking.getAssignedTechnicianId())) {
      throw new RuntimeException("Booking is not assigned to this technician");
    }
    if (booking.getBookingStatus() != BookingStatus.REQUESTED) {
      throw new RuntimeException("Booking is not in REQUESTED state");
    }
    booking.setBookingStatus(BookingStatus.REJECTED);
    bookingRepository.save(booking);
    
    refreshTechnicianQueue(technicianId);

    return bookingMapper.toResponse(booking);
  }

  public BookingResponse startBooking(UUID bookingId, UUID technicianId) {
    TechnicianBookingEntity booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    if (!technicianId.equals(booking.getAssignedTechnicianId())) {
      throw new RuntimeException("Booking is not assigned to this technician");
    }
    booking.setBookingStatus(BookingStatus.IN_PROGRESS);
    booking.setStartedAt(Instant.now());
    bookingRepository.save(booking);

    refreshTechnicianQueue(technicianId);

    return bookingMapper.toResponse(booking);
  }

  public BookingResponse completeBooking(UUID bookingId, UUID technicianId) {
    TechnicianBookingEntity booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    if (!technicianId.equals(booking.getAssignedTechnicianId())) {
      throw new RuntimeException("Booking is not assigned to this technician");
    }
    booking.setBookingStatus(BookingStatus.COMPLETED);
    booking.setCompletedAt(Instant.now());
    bookingRepository.save(booking);

    refreshTechnicianQueue(technicianId);

    return bookingMapper.toResponse(booking);
  }
}

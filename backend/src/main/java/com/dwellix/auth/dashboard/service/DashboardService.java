package com.dwellix.auth.dashboard.service;

import com.dwellix.auth.dashboard.dto.*;
import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import com.dwellix.auth.onboarding.domain.OnboardingHomeEntity;
import com.dwellix.auth.onboarding.domain.OnboardingRoomEntity;
import com.dwellix.auth.onboarding.dto.response.OnboardingApplianceResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingHomeResponse;
import com.dwellix.auth.onboarding.repository.OnboardingApplianceRepository;
import com.dwellix.auth.onboarding.repository.OnboardingHomeRepository;
import com.dwellix.auth.onboarding.repository.OnboardingRoomRepository;
import com.dwellix.auth.booking.domain.BookingStatus;
import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.repository.TechnicianBookingRepository;
import com.dwellix.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class DashboardService {

  private final OnboardingHomeRepository homeRepository;
  private final OnboardingRoomRepository roomRepository;
  private final OnboardingApplianceRepository applianceRepository;
  private final UserRepository userRepository;
  private final TechnicianBookingRepository bookingRepository;

  public DashboardService(
      OnboardingHomeRepository homeRepository,
      OnboardingRoomRepository roomRepository,
      OnboardingApplianceRepository applianceRepository,
      UserRepository userRepository,
      TechnicianBookingRepository bookingRepository
  ) {
    this.homeRepository = homeRepository;
    this.roomRepository = roomRepository;
    this.applianceRepository = applianceRepository;
    this.userRepository = userRepository;
    this.bookingRepository = bookingRepository;
  }

  public DashboardSummaryResponse getDashboardSummary(UUID userId) {
    // 0. Fetch user full name
    UserEntity userEntity = userRepository.findById(userId).orElse(null);
    String userName = (userEntity != null) ? userEntity.getFullName() : "Shivesh";

    // 1. Fetch user home
    OnboardingHomeEntity homeEntity = homeRepository.findByUser_Id(userId).orElse(null);
    if (homeEntity == null) {
      return new DashboardSummaryResponse(
          null, userName, 0, 0, 100,
          "Please complete home onboarding.",
          List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of()
      );
    }

    OnboardingHomeResponse homeResponse = toHomeResponse(homeEntity);

    // 2. Fetch rooms and appliances count
    List<OnboardingRoomEntity> rooms = roomRepository.findByHome_User_IdOrderBySortOrderAsc(userId);
    List<OnboardingApplianceEntity> appliances = applianceRepository.findByRoom_Home_User_IdOrderBySortOrderAsc(userId);

    int roomsCount = rooms.size();
    int appliancesCount = appliances.size();

    // 3. Compute Health Score & Alerts
    LocalDate today = LocalDate.now();
    int healthScore = 100;
    List<DashboardWarrantyAlertResponse> warrantyAlerts = new ArrayList<>();
    List<DashboardRecommendationResponse> aiRecommendations = new ArrayList<>();
    List<DashboardMaintenanceResponse> upcomingMaintenance = new ArrayList<>();
    List<DashboardBookingResponse> upcomingBookings = new ArrayList<>();
    List<TechnicianBookingEntity> userBookings = bookingRepository.findByUser_IdOrderByBookingDateDesc(userId);
    for (TechnicianBookingEntity booking : userBookings) {
      if (booking.getStatus() == BookingStatus.PENDING || booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.IN_PROGRESS) {
        upcomingBookings.add(new DashboardBookingResponse(
            booking.getId(),
            booking.getAppliance().getName(),
            booking.getServiceType(),
            booking.getBookingDate(),
            booking.getStatus().name(),
            booking.getTechnicianName() != null ? booking.getTechnicianName() : "Unassigned"
        ));
      }
    }
    List<DashboardActivityResponse> recentActivity = new ArrayList<>();
    List<DashboardNotificationResponse> notifications = new ArrayList<>();
    List<OnboardingApplianceResponse> recentAppliances = new ArrayList<>();

    if (appliancesCount > 0) {
      for (OnboardingApplianceEntity appliance : appliances) {
        LocalDate expiry = appliance.getWarrantyExpiry();
        long daysRemaining = ChronoUnit.DAYS.between(today, expiry);
        String status;
        if (daysRemaining < 0) {
          status = "EXPIRED";
          healthScore -= 12;
        } else if (daysRemaining <= 30) {
          status = "EXPIRING_SOON";
          healthScore -= 6;
        } else {
          status = "SAFE";
        }

        // Deduct for age if purchased > 5 years ago
        long yearsAge = ChronoUnit.YEARS.between(appliance.getPurchaseDate(), today);
        if (yearsAge >= 5) {
          healthScore -= 3;
        }

        warrantyAlerts.add(new DashboardWarrantyAlertResponse(
            appliance.getId(),
            appliance.getName(),
            appliance.getBrand(),
            appliance.getModel(),
            expiry,
            daysRemaining,
            status
        ));

        recentAppliances.add(toApplianceResponse(appliance));

        // Generate tailored AI recommendations
        String nameLower = appliance.getName().toLowerCase();
        if (nameLower.contains("air") || nameLower.contains("ac")) {
          aiRecommendations.add(new DashboardRecommendationResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Air Conditioner filter hasn't been cleaned in over 3 months.",
              "Clean filter to improve cooling and reduce power draw by 10%.",
              "MEDIUM"
          ));
          upcomingMaintenance.add(new DashboardMaintenanceResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "AC Deep Filter Cleaning",
              today.plusDays(5),
              "PENDING",
              "Mark Completed"
          ));
        } else if (nameLower.contains("fridge") || nameLower.contains("refrigerator")) {
          aiRecommendations.add(new DashboardRecommendationResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Condenser coils have accumulated dust.",
              "Clean coils to maintain compressor lifespan.",
              "MEDIUM"
          ));
          upcomingMaintenance.add(new DashboardMaintenanceResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Coil Cleaning & Inspection",
              today.plusDays(15),
              "PENDING",
              "Mark Completed"
          ));
        } else if (nameLower.contains("washing") || nameLower.contains("washer")) {
          aiRecommendations.add(new DashboardRecommendationResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Limescale buildup detected or likely in washing tub.",
              "Run a hot tub-clean cycle with descaling powder.",
              "LOW"
          ));
          upcomingMaintenance.add(new DashboardMaintenanceResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Descaling Cycle",
              today.plusDays(25),
              "PENDING",
              "Mark Completed"
          ));
        } else if (nameLower.contains("ro") || nameLower.contains("purifier") || nameLower.contains("filter")) {
          aiRecommendations.add(new DashboardRecommendationResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Carbon filter replacement is due.",
              "Replace filter to ensure optimal water TDS levels.",
              "HIGH"
          ));
          upcomingMaintenance.add(new DashboardMaintenanceResponse(
              UUID.randomUUID(),
              appliance.getName(),
              "Water Filter Replacement",
              today.plusDays(2),
              "OVERDUE",
              "Book Technician"
          ));
        }
      }

      // Add general recommendations if needed
      if (aiRecommendations.isEmpty()) {
        aiRecommendations.add(new DashboardRecommendationResponse(
            UUID.randomUUID(),
            appliances.get(0).getName(),
            "Connect appliance to a stabilizer to prevent voltage surge damage.",
            "Verify power connection",
            "LOW"
        ));
      }

      // Ensure score stays between 50 and 100
      healthScore = Math.max(50, Math.min(100, healthScore));

      // Generate upcoming bookings
      upcomingBookings.add(new DashboardBookingResponse(
          UUID.randomUUID(),
          appliances.get(0).getName(),
          "Preventive Maintenance",
          today.plusDays(1),
          "CONFIRMED",
          "Robert Miller"
      ));

      // Generate recent activity
      recentActivity.add(new DashboardActivityResponse(
          UUID.randomUUID(),
          "Warranty Uploaded",
          "Invoice and warranty registered for " + appliances.get(0).getName(),
          "WARRANTY",
          Instant.now().minus(2, ChronoUnit.HOURS)
      ));
      recentActivity.add(new DashboardActivityResponse(
          UUID.randomUUID(),
          "Technician Booked",
          "Robert Miller scheduled for maintenance service",
          "BOOKING",
          Instant.now().minus(1, ChronoUnit.DAYS)
      ));
      recentActivity.add(new DashboardActivityResponse(
          UUID.randomUUID(),
          "AI Diagnosis Completed",
          "Diagnostic scan completed for " + appliances.get(0).getName(),
          "AI",
          Instant.now().minus(3, ChronoUnit.DAYS)
      ));
    }

    String healthRecommendation;
    if (healthScore >= 90) {
      healthRecommendation = "Excellent. All appliances are operating normally. Continue regular maintenance checkups.";
    } else if (healthScore >= 75) {
      healthRecommendation = "Good. A few appliances require servicing soon to keep them in peak condition.";
    } else {
      healthRecommendation = "Attention Required. We detected expired warranties and pending maintenance tasks.";
    }

    // Populate default notifications
    notifications.add(new DashboardNotificationResponse(
        UUID.randomUUID(),
        "Welcome to Dwellix!",
        "Your home dashboard is active. Start managing your appliances and warranties.",
        "INFO",
        false,
        Instant.now().minus(1, ChronoUnit.HOURS)
    ));
    if (healthScore < 90) {
      notifications.add(new DashboardNotificationResponse(
          UUID.randomUUID(),
          "Action Recommended",
          "One or more appliances require maintenance attention.",
          "WARNING",
          false,
          Instant.now().minus(2, ChronoUnit.HOURS)
      ));
    }

    boolean hasConfirmedBooking = userBookings.stream().anyMatch(b -> b.getStatus() == BookingStatus.CONFIRMED);
    if (hasConfirmedBooking) {
      notifications.add(new DashboardNotificationResponse(
          UUID.randomUUID(),
          "Booking Confirmed",
          "Technician booking confirmed.",
          "INFO",
          false,
          Instant.now()
      ));
    }

    return new DashboardSummaryResponse(
        homeResponse,
        userName,
        roomsCount,
        appliancesCount,
        healthScore,
        healthRecommendation,
        upcomingBookings,
        upcomingMaintenance,
        recentActivity,
        aiRecommendations,
        warrantyAlerts,
        recentAppliances,
        notifications
    );
  }

  private OnboardingHomeResponse toHomeResponse(OnboardingHomeEntity home) {
    return new OnboardingHomeResponse(
        home.getId(),
        home.getUser().getId(),
        home.getHomeName(),
        home.getHomeType(),
        home.getAddress(),
        home.getCity(),
        home.getState(),
        home.getPincode(),
        home.isSetupCompleted(),
        home.getSetupCompletedAt()
    );
  }

  private OnboardingApplianceResponse toApplianceResponse(OnboardingApplianceEntity appliance) {
    return new OnboardingApplianceResponse(
        appliance.getId(),
        appliance.getRoom().getId(),
        appliance.getName(),
        appliance.getBrand(),
        appliance.getModel(),
        appliance.getPurchaseDate(),
        appliance.getWarrantyExpiry(),
        appliance.getPhotoFileName(),
        appliance.getInvoiceFileName(),
        appliance.getSortOrder()
    );
  }
}

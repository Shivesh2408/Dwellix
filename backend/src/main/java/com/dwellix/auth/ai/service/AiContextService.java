package com.dwellix.auth.ai.service;

import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import com.dwellix.auth.onboarding.domain.OnboardingHomeEntity;
import com.dwellix.auth.onboarding.domain.OnboardingRoomEntity;
import com.dwellix.auth.onboarding.repository.OnboardingApplianceRepository;
import com.dwellix.auth.onboarding.repository.OnboardingHomeRepository;
import com.dwellix.auth.onboarding.repository.OnboardingRoomRepository;
import com.dwellix.auth.repository.UserRepository;
import com.dwellix.auth.ai.dto.AiApplianceContext;
import com.dwellix.auth.ai.dto.AiContextResponse;
import com.dwellix.auth.ai.dto.AiRoomContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AiContextService {

  private final OnboardingHomeRepository homeRepository;
  private final OnboardingRoomRepository roomRepository;
  private final OnboardingApplianceRepository applianceRepository;
  private final UserRepository userRepository;

  public AiContextService(
      OnboardingHomeRepository homeRepository,
      OnboardingRoomRepository roomRepository,
      OnboardingApplianceRepository applianceRepository,
      UserRepository userRepository
  ) {
    this.homeRepository = homeRepository;
    this.roomRepository = roomRepository;
    this.applianceRepository = applianceRepository;
    this.userRepository = userRepository;
  }

  public AiContextResponse getAiContext(UUID userId) {
    OnboardingHomeEntity home = homeRepository.findByUser_Id(userId).orElse(null);
    if (home == null) {
      return new AiContextResponse(null, null, 0, 0, false, List.of());
    }

    List<OnboardingRoomEntity> rooms = roomRepository.findByHome_User_IdOrderBySortOrderAsc(userId);
    List<OnboardingApplianceEntity> appliances = applianceRepository.findByRoom_Home_User_IdOrderBySortOrderAsc(userId);

    List<AiRoomContext> roomContexts = new ArrayList<>();
    for (OnboardingRoomEntity room : rooms) {
      List<AiApplianceContext> applianceContexts = new ArrayList<>();
      for (OnboardingApplianceEntity appliance : appliances) {
        if (appliance.getRoom().getId().equals(room.getId())) {
          applianceContexts.add(new AiApplianceContext(
              appliance.getName(),
              appliance.getBrand(),
              appliance.getModel(),
              appliance.getPurchaseDate() != null ? appliance.getPurchaseDate().toString() : null,
              appliance.getWarrantyExpiry() != null ? appliance.getWarrantyExpiry().toString() : null,
              getMaintenanceSchedule(appliance.getName())
          ));
        }
      }
      roomContexts.add(new AiRoomContext(room.getName(), applianceContexts));
    }

    return new AiContextResponse(
        home.getHomeName(),
        home.getHomeType() != null ? home.getHomeType().name() : null,
        rooms.size(),
        appliances.size(),
        true,
        roomContexts
    );
  }

  public String buildSystemPrompt(UUID userId) {
    UserEntity user = userRepository.findById(userId).orElse(null);
    String ownerName = (user != null) ? user.getFullName() : "Homeowner";

    AiContextResponse context = getAiContext(userId);

    StringBuilder sb = new StringBuilder();
    sb.append("You are Dwellix AI.\n");
    sb.append("You are helping a homeowner named ").append(ownerName).append(".\n");
    sb.append("Always answer using the user's registered appliances whenever possible.\n");
    sb.append("If information is missing, politely ask for it.\n");
    sb.append("Never invent appliance details.\n");
    sb.append("Prefer maintenance, warranty and troubleshooting advice.\n\n");

    if (context.homeName() == null) {
      sb.append("User has no registered home profile or appliances currently. Politely ask them to register their home profile first.\n");
      return sb.toString();
    }

    sb.append("Registered Home Context:\n");
    sb.append("Owner: ").append(ownerName).append("\n");
    sb.append("Home Name: ").append(context.homeName()).append("\n");
    sb.append("Home Type: ").append(context.homeType()).append("\n");
    sb.append("Rooms Count: ").append(context.roomsCount()).append("\n");
    sb.append("Appliances Count: ").append(context.appliancesCount()).append("\n\n");

    if (context.rooms().isEmpty()) {
      sb.append("No registered rooms or appliances yet.\n");
    } else {
      sb.append("Rooms & Appliances Detail:\n");
      for (AiRoomContext room : context.rooms()) {
        sb.append("- Room: ").append(room.name()).append("\n");
        if (room.appliances().isEmpty()) {
          sb.append("  (No registered appliances in this room)\n");
        } else {
          for (AiApplianceContext appliance : room.appliances()) {
            sb.append("  * Appliance: ").append(appliance.name()).append("\n");
            sb.append("    Brand: ").append(appliance.brand() != null ? appliance.brand() : "Unknown").append("\n");
            sb.append("    Model: ").append(appliance.model() != null ? appliance.model() : "Unknown").append("\n");
            sb.append("    Purchase Date: ").append(appliance.purchaseDate() != null ? appliance.purchaseDate() : "Unknown").append("\n");
            sb.append("    Warranty Expiry: ").append(appliance.warrantyExpiry() != null ? appliance.warrantyExpiry() : "Unknown").append("\n");
            sb.append("    Maintenance Schedule: ").append(appliance.maintenance()).append("\n");
          }
        }
      }
    }

    return sb.toString();
  }

  private String getMaintenanceSchedule(String applianceName) {
    if (applianceName == null) return "General inspection & cleaning";
    String lower = applianceName.toLowerCase();
    if (lower.contains("air") || lower.contains("ac")) {
      return "AC Deep Filter Cleaning (every 3 months)";
    } else if (lower.contains("fridge") || lower.contains("refrigerator")) {
      return "Condenser Coil Cleaning (every 6 months)";
    } else if (lower.contains("washing") || lower.contains("washer")) {
      return "Tub Clean cycle & door seal wipe (monthly)";
    } else if (lower.contains("purifier") || lower.contains("ro")) {
      return "Sediment Filter replacement (every 6-12 months)";
    }
    return "General inspection & cleaning";
  }
}

package com.dwellix.auth.onboarding.service;

import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.exception.NotFoundException;
import com.dwellix.auth.onboarding.domain.OnboardingApplianceEntity;
import com.dwellix.auth.onboarding.domain.OnboardingHomeEntity;
import com.dwellix.auth.onboarding.domain.OnboardingRoomEntity;
import com.dwellix.auth.onboarding.dto.request.OnboardingApplianceRequest;
import com.dwellix.auth.onboarding.dto.request.OnboardingCompleteRequest;
import com.dwellix.auth.onboarding.dto.request.OnboardingCompleteRoomRequest;
import com.dwellix.auth.onboarding.dto.request.OnboardingHomeRequest;
import com.dwellix.auth.onboarding.dto.request.OnboardingRoomRequest;
import com.dwellix.auth.onboarding.dto.response.OnboardingApplianceResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingCompleteResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingHomeResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingRoomResponse;
import com.dwellix.auth.onboarding.dto.response.OnboardingSummaryResponse;
import com.dwellix.auth.onboarding.repository.OnboardingApplianceRepository;
import com.dwellix.auth.onboarding.repository.OnboardingHomeRepository;
import com.dwellix.auth.onboarding.repository.OnboardingRoomRepository;
import com.dwellix.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OnboardingService {
  private final UserRepository userRepository;
  private final OnboardingHomeRepository homeRepository;
  private final OnboardingRoomRepository roomRepository;
  private final OnboardingApplianceRepository applianceRepository;
  private final Clock clock;

  public OnboardingService(
      UserRepository userRepository,
      OnboardingHomeRepository homeRepository,
      OnboardingRoomRepository roomRepository,
      OnboardingApplianceRepository applianceRepository
  ) {
    this.userRepository = userRepository;
    this.homeRepository = homeRepository;
    this.roomRepository = roomRepository;
    this.applianceRepository = applianceRepository;
    this.clock = Clock.systemUTC();
  }

  @Transactional(readOnly = true)
  public OnboardingSummaryResponse getSummary(UUID userId) {
    OnboardingHomeEntity home = homeRepository.findByUser_Id(userId).orElse(null);
    List<OnboardingRoomEntity> rooms = home == null ? List.of() : roomRepository.findByHome_User_IdOrderBySortOrderAsc(userId);
    return new OnboardingSummaryResponse(home == null ? null : toHomeResponse(home), rooms.stream().map(this::toRoomResponse).toList());
  }

  public OnboardingHomeResponse upsertHome(UUID userId, OnboardingHomeRequest request) {
    OnboardingHomeEntity home = homeRepository.findByUser_Id(userId).orElseGet(() -> {
      OnboardingHomeEntity entity = new OnboardingHomeEntity();
      entity.setUser(getUser(userId));
      return entity;
    });

    home.setHomeName(request.homeName().trim());
    home.setHomeType(request.homeType());
    home.setAddress(request.address().trim());
    home.setCity(request.city().trim());
    home.setState(request.state().trim());
    home.setPincode(request.pincode().trim());
    home.setSetupCompleted(false);
    home.setSetupCompletedAt(null);
    return toHomeResponse(homeRepository.save(home));
  }

  @Transactional(readOnly = true)
  public OnboardingHomeResponse getHome(UUID userId) {
    return homeRepository.findByUser_Id(userId)
        .map(this::toHomeResponse)
        .orElseThrow(() -> new NotFoundException("Onboarding home not found."));
  }

  public void deleteHome(UUID userId) {
    homeRepository.deleteByUser_Id(userId);
  }

  @Transactional(readOnly = true)
  public List<OnboardingRoomResponse> listRooms(UUID userId) {
    return roomRepository.findByHome_User_IdOrderBySortOrderAsc(userId).stream().map(this::toRoomResponse).toList();
  }

  public OnboardingRoomResponse createRoom(UUID userId, OnboardingRoomRequest request) {
    OnboardingHomeEntity home = requireHome(userId);
    OnboardingRoomEntity room = new OnboardingRoomEntity();
    room.setHome(home);
    room.setName(request.name().trim());
    room.setNotes(request.notes() == null ? "" : request.notes().trim());
    room.setSortOrder(roomRepository.findByHome_User_IdOrderBySortOrderAsc(userId).size());
    return toRoomResponse(roomRepository.save(room));
  }

  public OnboardingRoomResponse updateRoom(UUID userId, UUID roomId, OnboardingRoomRequest request) {
    OnboardingRoomEntity room = requireRoom(userId, roomId);
    room.setName(request.name().trim());
    room.setNotes(request.notes() == null ? "" : request.notes().trim());
    return toRoomResponse(roomRepository.save(room));
  }

  public void deleteRoom(UUID userId, UUID roomId) {
    OnboardingRoomEntity room = requireRoom(userId, roomId);
    roomRepository.delete(room);
  }

  @Transactional(readOnly = true)
  public List<OnboardingApplianceResponse> listAppliances(UUID userId) {
    return applianceRepository.findByRoom_Home_User_IdOrderBySortOrderAsc(userId).stream().map(this::toApplianceResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<OnboardingApplianceResponse> listAppliancesForRoom(UUID userId, UUID roomId) {
    requireRoom(userId, roomId);
    return applianceRepository.findByRoom_IdOrderBySortOrderAsc(roomId).stream().map(this::toApplianceResponse).toList();
  }

  public OnboardingApplianceResponse createAppliance(UUID userId, UUID roomId, OnboardingApplianceRequest request) {
    OnboardingRoomEntity room = requireRoom(userId, roomId);
    OnboardingApplianceEntity appliance = new OnboardingApplianceEntity();
    appliance.setRoom(room);
    applyApplianceRequest(appliance, request);
    appliance.setSortOrder(applianceRepository.findByRoom_IdOrderBySortOrderAsc(roomId).size());
    return toApplianceResponse(applianceRepository.save(appliance));
  }

  public OnboardingApplianceResponse updateAppliance(UUID userId, UUID applianceId, OnboardingApplianceRequest request) {
    OnboardingApplianceEntity appliance = requireAppliance(userId, applianceId);
    applyApplianceRequest(appliance, request);
    return toApplianceResponse(applianceRepository.save(appliance));
  }

  public void deleteAppliance(UUID userId, UUID applianceId) {
    OnboardingApplianceEntity appliance = requireAppliance(userId, applianceId);
    applianceRepository.delete(appliance);
  }

  public OnboardingCompleteResponse complete(UUID userId, OnboardingCompleteRequest request) {
    upsertHome(userId, request.home());
    OnboardingHomeEntity home = requireHomeEntity(userId);

    applianceRepository.deleteByRoom_Home_User_Id(userId);
    roomRepository.deleteByHome_User_Id(userId);

    int roomIndex = 0;
    for (OnboardingCompleteRoomRequest roomRequest : request.rooms()) {
      OnboardingRoomEntity room = new OnboardingRoomEntity();
      room.setHome(home);
      room.setName(roomRequest.name().trim());
      room.setNotes(roomRequest.notes() == null ? "" : roomRequest.notes().trim());
      room.setSortOrder(roomIndex++);
      room = roomRepository.save(room);

      int applianceIndex = 0;
      for (OnboardingApplianceRequest applianceRequest : roomRequest.appliances()) {
        OnboardingApplianceEntity appliance = new OnboardingApplianceEntity();
        appliance.setRoom(room);
        applyApplianceRequest(appliance, applianceRequest);
        appliance.setSortOrder(applianceIndex++);
        applianceRepository.save(appliance);
      }
    }

    home.setSetupCompleted(true);
    home.setSetupCompletedAt(Instant.now(clock));
    homeRepository.save(home);

    return new OnboardingCompleteResponse("Onboarding completed successfully.", true);
  }

  private UserEntity getUser(UUID userId) {
    return userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found."));
  }

  private OnboardingHomeEntity requireHomeEntity(UUID userId) {
    return homeRepository.findByUser_Id(userId).orElseThrow(() -> new NotFoundException("Onboarding home not found."));
  }

  private OnboardingHomeEntity requireHome(UUID userId) {
    return requireHomeEntity(userId);
  }

  private OnboardingRoomEntity requireRoom(UUID userId, UUID roomId) {
    return roomRepository.findByIdAndHome_User_Id(roomId, userId).orElseThrow(() -> new NotFoundException("Room not found."));
  }

  private OnboardingApplianceEntity requireAppliance(UUID userId, UUID applianceId) {
    return applianceRepository.findByIdAndRoom_Home_User_Id(applianceId, userId).orElseThrow(() -> new NotFoundException("Appliance not found."));
  }

  private void applyApplianceRequest(OnboardingApplianceEntity appliance, OnboardingApplianceRequest request) {
    appliance.setName(request.name().trim());
    appliance.setBrand(request.brand().trim());
    appliance.setModel(request.model().trim());
    appliance.setPurchaseDate(request.purchaseDate());
    appliance.setWarrantyExpiry(request.warrantyExpiry());
    appliance.setPhotoFileName(request.photoFileName() == null || request.photoFileName().isBlank() ? null : request.photoFileName().trim());
    appliance.setInvoiceFileName(request.invoiceFileName() == null || request.invoiceFileName().isBlank() ? null : request.invoiceFileName().trim());
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

  private OnboardingRoomResponse toRoomResponse(OnboardingRoomEntity room) {
    return new OnboardingRoomResponse(
        room.getId(),
        room.getHome().getId(),
        room.getName(),
        room.getNotes(),
        room.getSortOrder(),
        applianceRepository.findByRoom_IdOrderBySortOrderAsc(room.getId()).stream().map(this::toApplianceResponse).toList()
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

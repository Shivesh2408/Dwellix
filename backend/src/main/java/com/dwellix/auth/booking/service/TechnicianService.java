package com.dwellix.auth.booking.service;

import com.dwellix.auth.booking.domain.TechnicianEntity;
import com.dwellix.auth.booking.dto.TechnicianResponse;
import com.dwellix.auth.booking.repository.TechnicianRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TechnicianService {

  private final TechnicianRepository technicianRepository;

  public TechnicianService(TechnicianRepository technicianRepository) {
    this.technicianRepository = technicianRepository;
  }

  public List<TechnicianResponse> listTechnicians() {
    return technicianRepository.findAll().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  public TechnicianResponse getTechnician(UUID id) {
    TechnicianEntity entity = technicianRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Technician not found"));
    return toResponse(entity);
  }

  private TechnicianResponse toResponse(TechnicianEntity entity) {
    return new TechnicianResponse(
        entity.getId(),
        entity.getName(),
        entity.getPhotoUrl(),
        entity.getSpecialization(),
        entity.getExperienceYears(),
        entity.getRating(),
        entity.getTotalReviews(),
        entity.getPhone(),
        entity.getEmail(),
        entity.getCity(),
        entity.getAvailability(),
        entity.getHourlyRate(),
        entity.getVerified()
    );
  }
}

package com.dwellix.auth.booking.service;

import com.dwellix.auth.booking.domain.BookingStatus;
import com.dwellix.auth.booking.domain.ReviewEntity;
import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.domain.TechnicianEntity;
import com.dwellix.auth.booking.dto.ReviewRequest;
import com.dwellix.auth.booking.dto.ReviewResponse;
import com.dwellix.auth.booking.repository.ReviewRepository;
import com.dwellix.auth.booking.repository.TechnicianBookingRepository;
import com.dwellix.auth.booking.repository.TechnicianRepository;
import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

  private final ReviewRepository reviewRepository;
  private final TechnicianBookingRepository bookingRepository;
  private final TechnicianRepository technicianRepository;
  private final UserRepository userRepository;

  public ReviewService(
      ReviewRepository reviewRepository,
      TechnicianBookingRepository bookingRepository,
      TechnicianRepository technicianRepository,
      UserRepository userRepository
  ) {
    this.reviewRepository = reviewRepository;
    this.bookingRepository = bookingRepository;
    this.technicianRepository = technicianRepository;
    this.userRepository = userRepository;
  }

  public ReviewResponse createReview(UUID customerId, ReviewRequest request) {
    TechnicianBookingEntity booking = bookingRepository.findById(request.bookingId())
        .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

    if (!booking.getUser().getId().equals(customerId)) {
      throw new IllegalArgumentException("Unauthorized to review this booking");
    }

    BookingStatus status = booking.getBookingStatus() != null ? booking.getBookingStatus() : booking.getStatus();
    if (status != BookingStatus.COMPLETED && status != BookingStatus.PAID) {
      throw new IllegalStateException("Only completed bookings can be reviewed");
    }

    if (booking.getAssignedTechnicianId() == null) {
      throw new IllegalStateException("No technician assigned to this booking");
    }

    ReviewEntity review = new ReviewEntity();
    review.setBookingId(request.bookingId());
    review.setCustomerId(customerId);
    review.setTechnicianId(booking.getAssignedTechnicianId());
    review.setRating(request.rating());
    review.setReview(request.review());
    review.setCreatedAt(Instant.now());

    reviewRepository.save(review);

    // Update technician average rating and total reviews dynamically
    TechnicianEntity tech = technicianRepository.findById(booking.getAssignedTechnicianId())
        .orElseThrow(() -> new IllegalArgumentException("Technician not found"));

    List<ReviewEntity> reviews = reviewRepository.findByTechnicianId(tech.getId());
    double avgRating = reviews.stream().mapToInt(ReviewEntity::getRating).average().orElse(5.0);
    tech.setRating(avgRating);
    tech.setTotalReviews(reviews.size());
    technicianRepository.save(tech);

    UserEntity customer = userRepository.findById(customerId).orElse(null);
    String customerName = customer != null ? customer.getFullName() : "Anonymous";

    return new ReviewResponse(
        review.getId(),
        review.getBookingId(),
        review.getCustomerId(),
        customerName,
        review.getTechnicianId(),
        review.getRating(),
        review.getReview(),
        review.getCreatedAt()
    );
  }

  @Transactional(readOnly = true)
  public List<ReviewResponse> getReviews(UUID technicianId) {
    return reviewRepository.findByTechnicianIdOrderByCreatedAtDesc(technicianId).stream()
        .map(r -> {
          UserEntity customer = userRepository.findById(r.getCustomerId()).orElse(null);
          String customerName = customer != null ? customer.getFullName() : "Anonymous";
          return new ReviewResponse(
              r.getId(),
              r.getBookingId(),
              r.getCustomerId(),
              customerName,
              r.getTechnicianId(),
              r.getRating(),
              r.getReview(),
              r.getCreatedAt()
          );
        })
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public Double getAverageRating(UUID technicianId) {
    List<ReviewEntity> reviews = reviewRepository.findByTechnicianId(technicianId);
    return reviews.stream().mapToInt(ReviewEntity::getRating).average().orElse(0.0);
  }
}

package com.dwellix.auth.booking.controller;

import com.dwellix.auth.booking.dto.ReviewRequest;
import com.dwellix.auth.booking.dto.ReviewResponse;
import com.dwellix.auth.booking.service.ReviewService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {

  private final ReviewService reviewService;

  public ReviewController(ReviewService reviewService) {
    this.reviewService = reviewService;
  }

  @PostMapping("/reviews")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ReviewResponse> createReview(
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @Valid @RequestBody ReviewRequest request
  ) {
    return ResponseEntity.ok(reviewService.createReview(principal.getUserId(), request));
  }

  @GetMapping("/technicians/{id}/reviews")
  public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable UUID id) {
    return ResponseEntity.ok(reviewService.getReviews(id));
  }

  @GetMapping("/technicians/{id}/rating")
  public ResponseEntity<Double> getAverageRating(@PathVariable UUID id) {
    return ResponseEntity.ok(reviewService.getAverageRating(id));
  }
}

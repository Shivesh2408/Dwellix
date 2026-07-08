package com.dwellix.auth.booking.controller;

import com.dwellix.auth.api.ApiMessageResponse;
import com.dwellix.auth.booking.dto.BookingRequest;
import com.dwellix.auth.booking.dto.BookingResponse;
import com.dwellix.auth.booking.service.BookingService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@PreAuthorize("isAuthenticated()")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping
  public ResponseEntity<BookingResponse> create(
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @Valid @RequestBody BookingRequest request
  ) {
    return ResponseEntity.ok(bookingService.createBooking(principal.getUserId(), request));
  }

  @GetMapping
  public ResponseEntity<List<BookingResponse>> getBookings(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.getBookings(principal.getUserId()));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookingResponse> getBooking(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.getBooking(id, principal.getUserId()));
  }

  @PutMapping("/{id}")
  public ResponseEntity<BookingResponse> update(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @Valid @RequestBody BookingRequest request
  ) {
    return ResponseEntity.ok(bookingService.updateBooking(id, principal.getUserId(), request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiMessageResponse> delete(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    bookingService.deleteBooking(id, principal.getUserId());
    return ResponseEntity.ok(new ApiMessageResponse("Booking deleted successfully."));
  }
}

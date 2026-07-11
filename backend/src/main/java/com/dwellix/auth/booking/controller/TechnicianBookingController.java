package com.dwellix.auth.booking.controller;

import com.dwellix.auth.booking.dto.BookingResponse;
import com.dwellix.auth.booking.service.BookingService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/technician/bookings")
@PreAuthorize("hasRole('ROLE_TECHNICIAN')")
public class TechnicianBookingController {

  private final BookingService bookingService;

  public TechnicianBookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @GetMapping
  public ResponseEntity<List<BookingResponse>> getBookings(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.getTechnicianBookings(principal.getUserId()));
  }

  @GetMapping("/pending")
  public ResponseEntity<List<BookingResponse>> getPendingBookings(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.getPendingTechnicianBookings(principal.getUserId()));
  }

  @PutMapping("/{id}/accept")
  public ResponseEntity<BookingResponse> accept(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.acceptBooking(id, principal.getUserId()));
  }

  @PutMapping("/{id}/reject")
  public ResponseEntity<BookingResponse> reject(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.rejectBooking(id, principal.getUserId()));
  }

  @PutMapping("/{id}/start")
  public ResponseEntity<BookingResponse> start(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.startBooking(id, principal.getUserId()));
  }

  @PutMapping("/{id}/complete")
  public ResponseEntity<BookingResponse> complete(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(bookingService.completeBooking(id, principal.getUserId()));
  }
}

package com.dwellix.auth.booking.service;

import com.dwellix.auth.booking.domain.BookingStatus;
import com.dwellix.auth.booking.domain.TechnicianBookingEntity;
import com.dwellix.auth.booking.dto.EarningsResponse;
import com.dwellix.auth.booking.repository.TechnicianBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class TechnicianEarningsService {

  private final TechnicianBookingRepository bookingRepository;

  public TechnicianEarningsService(TechnicianBookingRepository bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  public EarningsResponse getEarnings(UUID technicianId) {
    List<TechnicianBookingEntity> bookings = bookingRepository.findByAssignedTechnicianId(technicianId);

    LocalDate today = LocalDate.now();
    LocalDate oneWeekAgo = today.minusDays(7);
    LocalDate oneMonthAgo = today.minusDays(30);

    double todaySum = 0.0;
    double weekSum = 0.0;
    double monthSum = 0.0;
    double lifetimeSum = 0.0;
    double pendingSum = 0.0;

    for (TechnicianBookingEntity b : bookings) {
      BookingStatus status = b.getBookingStatus() != null ? b.getBookingStatus() : b.getStatus();
      if (status == BookingStatus.COMPLETED || status == BookingStatus.PAID) {
        double amount = b.getServiceCharge() != null ? b.getServiceCharge() : (b.getEstimatedCost() != null ? b.getEstimatedCost() : 0.0);
        
        lifetimeSum += amount;

        LocalDate date = b.getBookingDate();
        if (date != null) {
          if (date.equals(today)) {
            todaySum += amount;
          }
          if (!date.isBefore(oneWeekAgo) && !date.isAfter(today)) {
            weekSum += amount;
          }
          if (!date.isBefore(oneMonthAgo) && !date.isAfter(today)) {
            monthSum += amount;
          }
        }
      } else if (status == BookingStatus.PAYMENT_PENDING) {
        double amount = b.getServiceCharge() != null ? b.getServiceCharge() : (b.getEstimatedCost() != null ? b.getEstimatedCost() : 0.0);
        pendingSum += amount;
      }
    }

    return new EarningsResponse(todaySum, weekSum, monthSum, lifetimeSum, pendingSum);
  }
}

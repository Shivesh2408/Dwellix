package com.dwellix.auth.service;

import com.dwellix.auth.exception.RateLimitException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryRateLimitService implements RateLimitService {
  private final Clock clock;
  private final int maxAttempts;
  private final long windowSeconds;
  private final Map<String, RateWindow> windows = new ConcurrentHashMap<>();

  public InMemoryRateLimitService(
      @Value("${app.rate-limit.max-attempts:10}") int maxAttempts,
      @Value("${app.rate-limit.window-seconds:60}") long windowSeconds
  ) {
    this.clock = Clock.systemUTC();
    this.maxAttempts = maxAttempts;
    this.windowSeconds = windowSeconds;
  }

  @Override
  public void assertAllowed(String key) {
    Instant now = clock.instant();
    windows.compute(key, (ignored, existing) -> {
      if (existing == null || existing.windowStart.plusSeconds(windowSeconds).isBefore(now)) {
        return new RateWindow(now, 1);
      }
      if (existing.attempts >= maxAttempts) {
        throw new RateLimitException("Too many requests. Please try again shortly.");
      }
      existing.attempts += 1;
      return existing;
    });
  }

  private static final class RateWindow {
    private final Instant windowStart;
    private int attempts;

    private RateWindow(Instant windowStart, int attempts) {
      this.windowStart = windowStart;
      this.attempts = attempts;
    }
  }
}

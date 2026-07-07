package com.dwellix.auth.service;

public interface RateLimitService {
  void assertAllowed(String key);
}

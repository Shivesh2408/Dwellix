package com.dwellix.auth.service;

import com.dwellix.auth.domain.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class NoOpEmailService implements EmailService {
  private static final Logger logger = LoggerFactory.getLogger(NoOpEmailService.class);

  @Override
  public void sendVerificationEmail(UserEntity user, String verificationToken) {
    logger.info("Verification email queued for {}. Verification URL: http://localhost:3000/auth/verify-email?token={}", user.getEmail(), verificationToken);
  }

  @Override
  public void sendPasswordResetEmail(UserEntity user, String resetToken) {
    logger.info("Password reset email queued for {}. Reset URL: http://localhost:3000/auth/reset-password?token={}", user.getEmail(), resetToken);
  }
}

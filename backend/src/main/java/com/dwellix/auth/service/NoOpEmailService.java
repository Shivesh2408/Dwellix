package com.dwellix.auth.service;

import com.dwellix.auth.domain.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class NoOpEmailService implements EmailService {
  private static final Logger logger = LoggerFactory.getLogger(NoOpEmailService.class);
  private final String frontendOrigin;

  public NoOpEmailService(@Value("${FRONTEND_ORIGIN:https://dwellix-silk.vercel.app}") String frontendOrigin) {
    this.frontendOrigin = frontendOrigin;
  }

  @Override
  public void sendVerificationEmail(UserEntity user, String verificationToken) {
    logger.info("Verification email queued for {}. Verification URL: {}/auth/verify-email?token={}", user.getEmail(), frontendOrigin, verificationToken);
  }

  @Override
  public void sendPasswordResetEmail(UserEntity user, String resetToken) {
    logger.info("Password reset email queued for {}. Reset URL: {}/auth/reset-password?token={}", user.getEmail(), frontendOrigin, resetToken);
  }
}

package com.dwellix.auth.service;

import com.dwellix.auth.domain.UserEntity;

public interface EmailService {
  void sendVerificationEmail(UserEntity user, String verificationToken);
  void sendPasswordResetEmail(UserEntity user, String resetToken);
}

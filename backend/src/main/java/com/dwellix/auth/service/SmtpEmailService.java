package com.dwellix.auth.service;

import com.dwellix.auth.domain.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Primary
public class SmtpEmailService implements EmailService {
  private static final Logger logger = LoggerFactory.getLogger(SmtpEmailService.class);

  private final JavaMailSender mailSender;
  private final String frontendOrigin;
  private final String fromEmail;

  public SmtpEmailService(
      JavaMailSender mailSender,
      @Value("${FRONTEND_ORIGIN:https://dwellix-silk.vercel.app}") String frontendOrigin,
      @Value("${spring.mail.username:}") String fromEmail
  ) {
    this.mailSender = mailSender;
    this.frontendOrigin = frontendOrigin;
    this.fromEmail = fromEmail;
  }

  @Override
  public void sendVerificationEmail(UserEntity user, String verificationToken) {
    String verificationUrl = "%s/auth/verify-email?token=%s".formatted(frontendOrigin, verificationToken);
    logger.info("[VERIFICATION_EMAIL] Sending to {}, url: {}", user.getEmail(), verificationUrl);
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(user.getEmail());
      message.setSubject("Verify Your Dwellix Account");
      message.setText("Welcome to Dwellix! Please verify your email by clicking the link: " + verificationUrl);
      mailSender.send(message);
      logger.info("[VERIFICATION_EMAIL] Sent successfully to {}", user.getEmail());
    } catch (Exception e) {
      logger.error("[VERIFICATION_EMAIL] Failed to send email to {}: {}", user.getEmail(), e.getMessage());
    }
  }

  @Override
  public void sendPasswordResetEmail(UserEntity user, String resetToken) {
    String resetUrl = "%s/auth/reset-password?token=%s".formatted(frontendOrigin, resetToken);
    logger.info("[FORGOT_PASSWORD] mail send started for {}", user.getEmail());
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(user.getEmail());
      message.setSubject("Reset Your Dwellix Password");
      message.setText("To reset your password, click the link: " + resetUrl);
      mailSender.send(message);
      logger.info("[FORGOT_PASSWORD] mail send completed for {}", user.getEmail());
    } catch (Exception e) {
      logger.error("[FORGOT_PASSWORD] mail send failed: {}, message: {}", e.getClass().getName(), e.getMessage());
      throw e; // Do not swallow MailException
    }
  }
}

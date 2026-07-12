package com.dwellix.auth.service;

import com.dwellix.auth.domain.UserEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
@Primary
public class ResendEmailService implements EmailService {
  private static final Logger logger = LoggerFactory.getLogger(ResendEmailService.class);

  private final HttpClient httpClient;
  private final ObjectMapper objectMapper;
  private final String apiKey;
  private final String fromEmail;
  private final String frontendOrigin;

  public ResendEmailService(
      ObjectMapper objectMapper,
      @Value("${RESEND_API_KEY:}") String apiKey,
      @Value("${EMAIL_FROM:Dwellix <onboarding@resend.dev>}") String fromEmail,
      @Value("${FRONTEND_ORIGIN:https://dwellix-silk.vercel.app}") String frontendOrigin
  ) {
    this.httpClient = HttpClient.newHttpClient();
    this.objectMapper = objectMapper;
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
    this.frontendOrigin = frontendOrigin;
  }

  @Override
  public void sendVerificationEmail(UserEntity user, String verificationToken) {
    String verificationUrl = "%s/auth/verify-email?token=%s".formatted(frontendOrigin, verificationToken);
    logger.info("[VERIFICATION_EMAIL] Sending verification email to {}", user.getEmail());
    try {
      sendEmailViaResend(
          user.getEmail(),
          "Verify Your Dwellix Account",
          "<p>Welcome to Dwellix! Please verify your email by clicking the link below:</p>" +
          "<p><a href=\"" + verificationUrl + "\">Verify Account</a></p>"
      );
      logger.info("[VERIFICATION_EMAIL] Sent successfully via Resend to {}", user.getEmail());
    } catch (Exception e) {
      logger.error("[VERIFICATION_EMAIL] Failed to send email to {}: {}", user.getEmail(), e.getMessage());
    }
  }

  @Override
  public void sendPasswordResetEmail(UserEntity user, String resetToken) {
    String resetUrl = "%s/auth/reset-password?token=%s".formatted(frontendOrigin, resetToken);
    logger.info("[FORGOT_PASSWORD] Resend API send started");
    try {
      sendEmailViaResend(
          user.getEmail(),
          "Reset Your Dwellix Password",
          "<p>To reset your password, please click the link below:</p>" +
          "<p><a href=\"" + resetUrl + "\">Reset Password</a></p>" +
          "<p>If you did not request this, please ignore this email.</p>"
      );
      logger.info("[FORGOT_PASSWORD] Resend API send succeeded");
    } catch (Exception e) {
      logger.error("[FORGOT_PASSWORD] Resend API send failed: {}", e.getMessage());
      throw new RuntimeException("Email sending failed", e);
    }
  }

  private void sendEmailViaResend(String to, String subject, String htmlContent) {
    if (apiKey == null || apiKey.isBlank()) {
      logger.warn("RESEND_API_KEY is not configured. Email will not be sent.");
      return;
    }

    try {
      Map<String, Object> payload = Map.of(
          "from", fromEmail,
          "to", List.of(to),
          "subject", subject,
          "html", htmlContent
      );

      String requestBody = objectMapper.writeValueAsString(payload);

      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create("https://api.resend.com/emails"))
          .header("Authorization", "Bearer " + apiKey)
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(requestBody))
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      logger.info("[FORGOT_PASSWORD] Resend API response status = {}", response.statusCode());

      if (response.statusCode() < 200 || response.statusCode() >= 300) {
        throw new RuntimeException("Resend API returned non-success code: " + response.statusCode() + ", body: " + response.body());
      }
    } catch (Exception e) {
      throw new RuntimeException("Failed to send email via Resend: " + e.getMessage(), e);
    }
  }
}

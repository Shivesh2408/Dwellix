package com.dwellix.auth.exception;

import com.dwellix.auth.api.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
    Map<String, String> fieldErrors = new LinkedHashMap<>();
    for (FieldError error : exception.getBindingResult().getFieldErrors()) {
      fieldErrors.put(error.getField(), error.getDefaultMessage());
    }
    return build(HttpStatus.BAD_REQUEST, "Validation failed.", "VALIDATION_ERROR", fieldErrors);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException exception) {
    return build(HttpStatus.CONFLICT, exception.getMessage(), "CONFLICT", Map.of());
  }

  @ExceptionHandler(InvalidTokenException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidToken(InvalidTokenException exception) {
    return build(HttpStatus.UNAUTHORIZED, exception.getMessage(), "INVALID_TOKEN", Map.of());
  }

  @ExceptionHandler(RateLimitException.class)
  public ResponseEntity<ApiErrorResponse> handleRateLimit(RateLimitException exception) {
    return build(HttpStatus.TOO_MANY_REQUESTS, exception.getMessage(), "RATE_LIMITED", Map.of());
  }

  @ExceptionHandler(AuthException.class)
  public ResponseEntity<ApiErrorResponse> handleAuth(AuthException exception) {
    return build(HttpStatus.BAD_REQUEST, exception.getMessage(), "AUTH_ERROR", Map.of());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception exception) {
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", "INTERNAL_ERROR", Map.of());
  }

  private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message, String code, Map<String, String> fieldErrors) {
    return ResponseEntity.status(status).body(new ApiErrorResponse(message, code, Instant.now(), fieldErrors));
  }
}

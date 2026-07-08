package com.dwellix.auth.controller;

import com.dwellix.auth.dto.ImageUploadResponse;
import com.dwellix.auth.service.CloudinaryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ImageUploadController {

  private final CloudinaryService cloudinaryService;

  public ImageUploadController(CloudinaryService cloudinaryService) {
    this.cloudinaryService = cloudinaryService;
  }

  @PostMapping("/uploads/image")
  public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
    // 1. Validate file empty check
    if (file == null || file.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
    }

    // 2. Validate file size (10 MB = 10,485,760 bytes)
    if (file.getSize() > 10485760) {
      return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds limit of 10 MB"));
    }

    // 3. Validate content type (MIME type)
    String contentType = file.getContentType();
    if (contentType == null) {
      return ResponseEntity.badRequest().body(Map.of("error", "Unsupported file type"));
    }

    String lowerType = contentType.toLowerCase();
    if (!lowerType.equals("image/jpeg") &&
        !lowerType.equals("image/jpg") &&
        !lowerType.equals("image/png") &&
        !lowerType.equals("image/webp")) {
      return ResponseEntity.badRequest().body(Map.of("error", "Unsupported file type. Only JPG, JPEG, PNG, and WEBP are allowed."));
    }

    // 4. Perform upload
    ImageUploadResponse response = cloudinaryService.uploadImage(file);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/uploads/**")
  public ResponseEntity<?> deleteImage(HttpServletRequest request) throws IOException {
    String path = request.getRequestURI();
    String prefix = "/api/v1/uploads/";
    int index = path.indexOf(prefix);
    if (index == -1) {
      return ResponseEntity.badRequest().body(Map.of("error", "Invalid path"));
    }

    String publicId = path.substring(index + prefix.length());
    if (publicId.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Public ID is required"));
    }

    cloudinaryService.deleteImage(publicId);
    return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
  }

  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<?> handleMaxSizeException(MaxUploadSizeExceededException ex) {
    return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds the configured upload limit of 10 MB"));
  }

  @ExceptionHandler(IOException.class)
  public ResponseEntity<?> handleIOException(IOException ex) {
    return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleGeneralException(Exception ex) {
    return ResponseEntity.status(500).body(Map.of("error", "An error occurred: " + ex.getMessage()));
  }
}

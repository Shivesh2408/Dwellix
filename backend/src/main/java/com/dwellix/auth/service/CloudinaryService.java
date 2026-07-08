package com.dwellix.auth.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dwellix.auth.dto.ImageUploadResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

  private final Cloudinary cloudinary;

  public CloudinaryService(Cloudinary cloudinary) {
    this.cloudinary = cloudinary;
  }

  public ImageUploadResponse uploadImage(MultipartFile file) throws IOException {
    Map<?, ?> uploadResult = cloudinary.uploader().upload(
        file.getBytes(),
        ObjectUtils.asMap("folder", "dwellix")
    );

    String imageUrl = (String) uploadResult.get("secure_url");
    String publicId = (String) uploadResult.get("public_id");
    Integer width = (Integer) uploadResult.get("width");
    Integer height = (Integer) uploadResult.get("height");
    String format = (String) uploadResult.get("format");
    Long bytes = uploadResult.get("bytes") != null ? ((Number) uploadResult.get("bytes")).longValue() : null;

    return new ImageUploadResponse(imageUrl, publicId, width, height, format, bytes);
  }

  public void deleteImage(String publicId) throws IOException {
    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
  }
}

package com.dwellix.auth.ai.service;

import com.dwellix.auth.ai.dto.ImageDiagnosisRequest;
import com.dwellix.auth.ai.dto.ImageDiagnosisResponse;
import com.dwellix.auth.ai.dto.OpenRouterResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class AIImageDiagnosisService {

  private final WebClient webClient;
  private final ObjectMapper objectMapper;

  @Value("${app.ai.vision.model:google/gemma-3-27b-it:free}")
  private String visionModel;

  public AIImageDiagnosisService(WebClient openRouterWebClient, ObjectMapper objectMapper) {
    this.webClient = openRouterWebClient;
    this.objectMapper = objectMapper;
  }

  public Mono<ImageDiagnosisResponse> diagnoseImage(ImageDiagnosisRequest request) {
    String imageUrl = request.imageUrl();

    Map<String, Object> textPart = Map.of(
        "type", "text",
        "text", "Analyze the following home appliance image."
    );
    Map<String, Object> imagePart = Map.of(
        "type", "image_url",
        "image_url", Map.of("url", imageUrl)
    );

    Map<String, Object> systemMessage = Map.of(
        "role", "system",
        "content", "You are Dwellix AI.\n" +
                   "Analyze home appliance images.\n" +
                   "Return a JSON object with this exact structure:\n" +
                   "{\n" +
                   "  \"applianceType\": \"...\",\n" +
                   "  \"brand\": \"...\",\n" +
                   "  \"visibleProblems\": [\"...\"],\n" +
                   "  \"severity\": \"Low/Medium/High\",\n" +
                   "  \"possibleCauses\": [\"...\"],\n" +
                   "  \"recommendedActions\": [\"...\"],\n" +
                   "  \"technicianRequired\": true/false,\n" +
                   "  \"confidence\": 0.95\n" +
                   "}\n" +
                   "Never invent details that are not visible. Do NOT return raw markdown or wrap the response in code block ticks."
    );

    Map<String, Object> userMessage = Map.of(
        "role", "user",
        "content", List.of(textPart, imagePart)
    );

    Map<String, Object> requestBody = Map.of(
        "model", visionModel,
        "messages", List.of(systemMessage, userMessage)
    );

    return webClient.post()
        .uri("/chat/completions")
        .bodyValue(requestBody)
        .retrieve()
        .bodyToMono(OpenRouterResponse.class)
        .map(response -> {
          if (response.choices() == null || response.choices().isEmpty()) {
            throw new RuntimeException("Empty response from vision model: " + visionModel);
          }
          String content = response.choices().get(0).message().content();
          String cleanJson = cleanJsonContent(content);
          try {
            return objectMapper.readValue(cleanJson, ImageDiagnosisResponse.class);
          } catch (Exception e) {
            throw new RuntimeException("Failed to parse diagnosis JSON: " + e.getMessage() + "\nRaw response was: " + content);
          }
        });
  }

  private String cleanJsonContent(String content) {
    if (content == null) return "{}";
    content = content.trim();
    if (content.startsWith("```")) {
      int firstNewLine = content.indexOf("\n");
      if (firstNewLine != -1) {
        content = content.substring(firstNewLine + 1);
      }
      if (content.endsWith("```")) {
        content = content.substring(0, content.length() - 3);
      }
    }
    return content.trim();
  }
}

package com.dwellix.auth.ai.service;

import com.dwellix.auth.ai.dto.ChatMessage;
import com.dwellix.auth.ai.dto.ChatRequest;
import com.dwellix.auth.ai.dto.ChatResponse;
import com.dwellix.auth.ai.dto.OpenRouterResponse;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OpenRouterService {

  private static final Logger logger = LoggerFactory.getLogger(OpenRouterService.class);

  private final WebClient webClient;

  private static final List<String> MODELS = List.of(
      "google/gemma-3-27b-it:free",
      "openrouter/free",
      "google/gemma-4-31b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free"
  );

  public OpenRouterService(WebClient openRouterWebClient) {
    this.webClient = openRouterWebClient;
  }

  public Mono<ChatResponse> chat(ChatRequest request) {
    List<String> modelSequence;
    if (request.model() != null && !request.model().isBlank()) {
      modelSequence = List.of(request.model());
    } else {
      modelSequence = MODELS;
    }

    return tryChatWithFallback(request.messages(), modelSequence, 0);
  }

  private Mono<ChatResponse> tryChatWithFallback(List<ChatMessage> messages, List<String> models, int index) {
    if (index >= models.size()) {
      return Mono.error(new RuntimeException("All OpenRouter models failed to respond."));
    }

    String model = models.get(index);
    logger.info("Attempting AI chat with model: {}", model);

    Map<String, Object> requestBody = Map.of(
        "model", model,
        "messages", messages
    );

    return webClient.post()
        .uri("/chat/completions")
        .bodyValue(requestBody)
        .retrieve()
        .bodyToMono(OpenRouterResponse.class)
        .map(response -> {
          if (response.choices() == null || response.choices().isEmpty()) {
            throw new RuntimeException("Empty choices in response from model: " + model);
          }
          String content = response.choices().get(0).message().content();
          String actualModel = response.model() != null ? response.model() : model;
          return new ChatResponse(content, actualModel, null);
        })
        .onErrorResume(throwable -> {
          logger.warn("Model {} failed with error: {}. Trying fallback...", model, throwable.getMessage());
          return tryChatWithFallback(messages, models, index + 1);
        });
  }
}

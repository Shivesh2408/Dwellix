package com.dwellix.auth.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AiConfig {

  @Value("${app.ai.openrouter.api-key}")
  private String apiKey;

  @Value("${app.ai.openrouter.base-url}")
  private String baseUrl;

  @Bean
  public WebClient openRouterWebClient(WebClient.Builder webClientBuilder) {
    return webClientBuilder
        .baseUrl(baseUrl)
        .defaultHeader("Authorization", "Bearer " + apiKey)
        .defaultHeader("Content-Type", "application/json")
        .defaultHeader("HTTP-Referer", "http://localhost:3000")
        .defaultHeader("X-Title", "Dwellix")
        .build();
  }
}

package com.dwellix.auth.ai.dto;

import java.util.List;

public record OpenRouterResponse(
    List<Choice> choices,
    String model
) {
  public record Choice(
      int index,
      ChatMessage message
  ) {}
}

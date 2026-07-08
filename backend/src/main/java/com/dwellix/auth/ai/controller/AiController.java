package com.dwellix.auth.ai.controller;

import com.dwellix.auth.ai.domain.ConversationEntity;
import com.dwellix.auth.ai.dto.*;
import com.dwellix.auth.ai.service.AiContextService;
import com.dwellix.auth.ai.service.OpenRouterService;
import com.dwellix.auth.ai.service.AIImageDiagnosisService;
import com.dwellix.auth.ai.service.AIConversationService;
import com.dwellix.auth.ai.service.AIDiagnosisHistoryService;
import com.dwellix.auth.security.CurrentUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

  private final OpenRouterService openRouterService;
  private final AiContextService aiContextService;
  private final AIImageDiagnosisService aiImageDiagnosisService;
  private final AIConversationService aiConversationService;
  private final AIDiagnosisHistoryService aiDiagnosisHistoryService;

  public AiController(
      OpenRouterService openRouterService,
      AiContextService aiContextService,
      AIImageDiagnosisService aiImageDiagnosisService,
      AIConversationService aiConversationService,
      AIDiagnosisHistoryService aiDiagnosisHistoryService
  ) {
    this.openRouterService = openRouterService;
    this.aiContextService = aiContextService;
    this.aiImageDiagnosisService = aiImageDiagnosisService;
    this.aiConversationService = aiConversationService;
    this.aiDiagnosisHistoryService = aiDiagnosisHistoryService;
  }

  @GetMapping("/context")
  public ResponseEntity<AiContextResponse> getAiContext(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(aiContextService.getAiContext(principal.getUserId()));
  }

  @PostMapping("/chat")
  public Mono<ChatResponse> chat(
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @Valid @RequestBody ChatRequest request
  ) {
    UUID userId = principal.getUserId();
    
    UUID cid = request.conversationId();
    final UUID conversationId;
    final ConversationEntity conversation;
    if (cid == null) {
      conversationId = UUID.randomUUID();
      conversation = aiConversationService.createNewConversation(userId, conversationId, request);
    } else {
      conversationId = cid;
      conversation = aiConversationService.loadAndTrackUserMessage(userId, conversationId, request);
    }

    String systemPrompt = aiContextService.buildSystemPrompt(userId);
    
    List<ChatMessage> originalMessages = request.messages();
    List<ChatMessage> messagesWithContext = new ArrayList<>();
    messagesWithContext.add(new ChatMessage("system", systemPrompt));
    
    if (originalMessages != null) {
      for (ChatMessage msg : originalMessages) {
        if (!"system".equalsIgnoreCase(msg.role())) {
          messagesWithContext.add(msg);
        }
      }
    }
    
    ChatRequest contextRequest = new ChatRequest(messagesWithContext, request.model(), conversationId);
    
    return openRouterService.chat(contextRequest)
        .map(response -> {
          aiConversationService.saveAssistantMessage(conversation, response.content());
          return new ChatResponse(response.content(), response.modelUsed(), conversationId);
        });
  }

  @PostMapping("/diagnose-image")
  public Mono<ImageDiagnosisResponse> diagnoseImage(
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @Valid @RequestBody ImageDiagnosisRequest request
  ) {
    return aiImageDiagnosisService.diagnoseImage(request)
        .map(response -> {
          aiDiagnosisHistoryService.saveDiagnosis(principal.getUserId(), request.imageUrl(), response);
          return response;
        });
  }

  @GetMapping("/diagnose-image/history")
  public ResponseEntity<List<DiagnosisHistoryResponse>> getDiagnosisHistory(
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(aiDiagnosisHistoryService.getHistory(principal.getUserId()));
  }

  // --- Conversation History Endpoints ---

  @GetMapping("/conversations")
  public ResponseEntity<List<ConversationSummaryResponse>> getConversations(
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @RequestParam(value = "search", required = false) String search
  ) {
    return ResponseEntity.ok(aiConversationService.getConversations(principal.getUserId(), search));
  }

  @GetMapping("/conversations/{id}")
  public ResponseEntity<ConversationResponse> getConversation(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    return ResponseEntity.ok(aiConversationService.getConversation(id, principal.getUserId()));
  }

  @DeleteMapping("/conversations/{id}")
  public ResponseEntity<?> deleteConversation(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal
  ) {
    aiConversationService.deleteConversation(id, principal.getUserId());
    return ResponseEntity.ok(Map.of("message", "Conversation deleted successfully"));
  }

  @PatchMapping("/conversations/{id}")
  public ResponseEntity<ConversationSummaryResponse> renameConversation(
      @PathVariable UUID id,
      @AuthenticationPrincipal CurrentUserPrincipal principal,
      @Valid @RequestBody RenameConversationRequest request
  ) {
    return ResponseEntity.ok(aiConversationService.renameConversation(id, principal.getUserId(), request.title()));
  }
}

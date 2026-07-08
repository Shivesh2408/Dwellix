package com.dwellix.auth.ai.service;

import com.dwellix.auth.domain.UserEntity;
import com.dwellix.auth.repository.UserRepository;
import com.dwellix.auth.ai.domain.ConversationEntity;
import com.dwellix.auth.ai.domain.MessageEntity;
import com.dwellix.auth.ai.dto.*;
import com.dwellix.auth.ai.repository.ConversationRepository;
import com.dwellix.auth.ai.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AIConversationService {

  private final ConversationRepository conversationRepository;
  private final MessageRepository messageRepository;
  private final UserRepository userRepository;

  public AIConversationService(
      ConversationRepository conversationRepository,
      MessageRepository messageRepository,
      UserRepository userRepository
  ) {
    this.conversationRepository = conversationRepository;
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public List<ConversationSummaryResponse> getConversations(UUID userId, String search) {
    List<ConversationEntity> list = conversationRepository.findByUser_IdOrderByUpdatedAtDesc(userId);
    if (search != null && !search.isBlank()) {
      String clean = search.toLowerCase().trim();
      list = list.stream()
          .filter(c -> c.getTitle().toLowerCase().contains(clean))
          .collect(Collectors.toList());
    }
    return list.stream()
        .map(c -> new ConversationSummaryResponse(c.getId(), c.getTitle(), c.getCreatedAt(), c.getUpdatedAt()))
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public ConversationResponse getConversation(UUID id, UUID userId) {
    ConversationEntity conversation = conversationRepository.findByIdAndUser_Id(id, userId)
        .orElseThrow(() -> new RuntimeException("Conversation not found"));

    List<MessageResponse> msgs = conversation.getMessages().stream()
        .map(m -> new MessageResponse(m.getRole(), m.getContent(), m.getTimestamp()))
        .collect(Collectors.toList());

    return new ConversationResponse(
        conversation.getId(),
        conversation.getTitle(),
        conversation.getCreatedAt(),
        conversation.getUpdatedAt(),
        msgs
    );
  }

  public void deleteConversation(UUID id, UUID userId) {
    ConversationEntity conversation = conversationRepository.findByIdAndUser_Id(id, userId)
        .orElseThrow(() -> new RuntimeException("Conversation not found"));
    conversationRepository.delete(conversation);
  }

  public ConversationSummaryResponse renameConversation(UUID id, UUID userId, String title) {
    ConversationEntity conversation = conversationRepository.findByIdAndUser_Id(id, userId)
        .orElseThrow(() -> new RuntimeException("Conversation not found"));

    String cleanTitle = title.trim();
    if (cleanTitle.length() > 40) {
      cleanTitle = cleanTitle.substring(0, 37) + "...";
    }

    conversation.setTitle(cleanTitle);
    conversation.setUpdatedAt(Instant.now());
    ConversationEntity saved = conversationRepository.save(conversation);

    return new ConversationSummaryResponse(saved.getId(), saved.getTitle(), saved.getCreatedAt(), saved.getUpdatedAt());
  }

  public ConversationEntity createNewConversation(UUID userId, UUID conversationId, ChatRequest request) {
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    List<ChatMessage> list = request.messages();
    String firstUserQuery = "New Chat";
    if (list != null && !list.isEmpty()) {
      for (ChatMessage msg : list) {
        if ("user".equalsIgnoreCase(msg.role())) {
          firstUserQuery = msg.content();
          break;
        }
      }
    }

    String title = firstUserQuery.trim();
    if (title.length() > 40) {
      title = title.substring(0, 37) + "...";
    }

    ConversationEntity conversation = new ConversationEntity();
    conversation.setId(conversationId);
    conversation.setUser(user);
    conversation.setTitle(title);
    conversation.setCreatedAt(Instant.now());
    conversation.setUpdatedAt(Instant.now());
    ConversationEntity saved = conversationRepository.save(conversation);

    // Save the latest user query message
    if (list != null && !list.isEmpty()) {
      ChatMessage latest = list.get(list.size() - 1);
      if ("user".equalsIgnoreCase(latest.role())) {
        saveMessage(saved, "user", latest.content());
      }
    }

    return saved;
  }

  public ConversationEntity loadAndTrackUserMessage(UUID userId, UUID conversationId, ChatRequest request) {
    ConversationEntity conversation = conversationRepository.findByIdAndUser_Id(conversationId, userId)
        .orElseThrow(() -> new RuntimeException("Conversation not found"));

    List<ChatMessage> list = request.messages();
    if (list != null && !list.isEmpty()) {
      ChatMessage latest = list.get(list.size() - 1);
      if ("user".equalsIgnoreCase(latest.role())) {
        saveMessage(conversation, "user", latest.content());
      }
    }

    conversation.setUpdatedAt(Instant.now());
    return conversationRepository.save(conversation);
  }

  public void saveAssistantMessage(ConversationEntity conversation, String content) {
    saveMessage(conversation, "assistant", content);
    conversation.setUpdatedAt(Instant.now());
    conversationRepository.save(conversation);
  }

  private void saveMessage(ConversationEntity conversation, String role, String content) {
    MessageEntity message = new MessageEntity();
    message.setId(UUID.randomUUID());
    message.setConversation(conversation);
    message.setRole(role);
    message.setContent(content);
    message.setTimestamp(Instant.now());
    messageRepository.save(message);
  }
}

package com.dwellix.auth.ai.repository;

import com.dwellix.auth.ai.domain.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, UUID> {
  List<ConversationEntity> findByUser_IdOrderByUpdatedAtDesc(UUID userId);
  Optional<ConversationEntity> findByIdAndUser_Id(UUID id, UUID userId);
}

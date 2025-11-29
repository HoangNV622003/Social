package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.dto.response.ChatProjection;
import vn.datn.social.entity.Chat;
import vn.datn.social.entity.Message;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("""
            
             SELECT c.id             AS id,
                   CASE
                       WHEN c.user1Id = :currentUserId THEN c.user2Id
                       ELSE c.user1Id
                       END          AS receiverId,
            
                   u.username       AS receiverName,
                   u.image          AS receiverImage,
                   c.lastMessage    AS lastMessage,
                   c.dateUpdated AS lastMessageDate
            FROM Chat c
                     JOIN User u ON u.id = CASE
                                               WHEN c.user1Id = :currentUserId THEN c.user2Id
                                               ELSE c.user1Id
                END
            WHERE c.user2Id = :currentUserId
               OR c.user1Id = :currentUserId
            ORDER BY c.dateUpdated DESC
            """)
    Page<ChatProjection> findAllByUserId(Long currentUserId, Pageable pageable);

    @Query("""
            SELECT c FROM Chat c
            WHERE (c.user1Id = :userId1 AND c.user2Id = :userId2)
               OR (c.user1Id = :userId2 AND c.user2Id = :userId1)
            """)
    Optional<Chat> findByTwoUserIds(@Param("userId1") Long userId1,
                                    @Param("userId2") Long userId2);
}

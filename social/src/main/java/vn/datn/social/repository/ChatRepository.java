package vn.datn.social.repository;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.Chat;
import vn.datn.social.entity.Message;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByParticipantsUsername(String participantsUsername);


    @Query("SELECT m FROM Message m WHERE m.chat.id = :chatId ORDER BY m.timestamp DESC")
    List<Message> findLastMessageByChatId(@Param("chatId") Long chatId, Pageable pageable);


    @Query("SELECT c FROM Chat c JOIN c.participants p1 JOIN c.participants p2 WHERE (p1.id = :senderId AND p2.id = :receiverId) OR (p1.id = :receiverId AND p2.id = :senderId)")
    Optional<Chat> findChatBetweenUsers(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);


}

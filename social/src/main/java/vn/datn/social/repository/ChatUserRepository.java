package vn.datn.social.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.Chat;

@Repository
public interface ChatUserRepository extends JpaRepository<Chat,Long> {

    @Modifying
    @Query(value = "DELETE FROM chat_user WHERE chat_id = :chatId", nativeQuery = true)
    void deleteByChatId(Long chatId);
}

package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByChatId(Long chatId, Pageable pageable);

    @Query(value = "SELECT YEAR(timestamp) AS year, MONTH(timestamp) AS month, COUNT(*) AS message_count " +
            "FROM messages " +
            "GROUP BY YEAR(timestamp), MONTH(timestamp) " +
            "ORDER BY year ASC, month ASC", nativeQuery = true)
    List<Object[]> getMessageStatistics();
    void deleteAllByChatId(Long chatId);
}


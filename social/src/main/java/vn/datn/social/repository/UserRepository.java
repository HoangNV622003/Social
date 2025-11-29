package vn.datn.social.repository;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByUsernameIgnoreCaseAndIdNot(String username, Long id);

    boolean existsByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);

    @Query(value = """
        SELECT u.*
        FROM chats c
        JOIN user u ON u.id = CASE
            WHEN c.user1_id = :userId THEN c.user2_id
            ELSE c.user1_id
        END
        WHERE c.id = :chatId
          AND :userId IN (c.user1_id, c.user2_id)
        """, nativeQuery = true)
    Optional<User> findOtherUserInChat(@Param("chatId") Long chatId, @Param("userId") Long userId);

    Optional<User> findByVerificationCode(String verificationCode);

    @Query(value = "SELECT address, COUNT(*) AS user_count " +
                   "FROM user " +
                   "GROUP BY address " +
                   "ORDER BY user_count DESC", nativeQuery = true)
    List<Object[]> getUsersByAddress();
}

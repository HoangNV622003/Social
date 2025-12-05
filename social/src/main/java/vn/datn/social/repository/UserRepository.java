package vn.datn.social.repository;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.dto.response.projection.MonthlySummaryProjection;
import vn.datn.social.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    Optional<User> findByEmail(String email);

    @Query("""
                SELECT u FROM User u INNER JOIN Post p ON p.createdBy=u.id WHERE p.id=:postId
            """)
    Optional<User> findByPostId(@Param("postId") Long postId);

    boolean existsByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);


    @Query(value = "SELECT address, COUNT(*) AS user_count " +
                   "FROM user " +
                   "GROUP BY address " +
                   "ORDER BY user_count DESC", nativeQuery = true)
    List<Object[]> getUsersByAddress();

    @Query("""
                SELECT u FROM User u RIGHT JOIN ChatMember c ON c.userId = u.id WHERE c.roomId = :chatRoomId
            """)
    Set<User> findAllByChatRoomId(Long chatRoomId);

    @Query("""
        SELECT u FROM User u
        WHERE LOWER(u.email) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
            LOWER(u.username) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
            LOWER(u.address) LIKE LOWER(CONCAT('%',:keyword,'%'))
    """)
    Page<User> searchByCriterial(@Param("keyword")String keyword, Pageable pageable);

    @Query(value = """
    SELECT 
        m.month,
        COALESCE(p.totalPosts, 0) AS totalPosts,
        COALESCE(u.totalUsers, 0) AS totalUsers,
        COALESCE(c.totalComments, 0) AS totalComments,
        COALESCE(msg.totalMessages, 0) AS totalMessages,
        COALESCE(l.totalLikes, 0) AS totalLikes
    FROM 
        (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
         UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 
         UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) m
    LEFT JOIN (SELECT MONTH(date_created) AS month, COUNT(*) AS totalPosts FROM post WHERE YEAR(date_created) = :year GROUP BY month) p ON m.month = p.month
    LEFT JOIN (SELECT MONTH(date_created) AS month, COUNT(*) AS totalUsers FROM user WHERE YEAR(date_created) = :year GROUP BY month) u ON m.month = u.month
    LEFT JOIN (SELECT MONTH(date_created) AS month, COUNT(*) AS totalComments FROM comment WHERE YEAR(date_created) = :year GROUP BY month) c ON m.month = c.month
    LEFT JOIN (SELECT MONTH(date_created) AS month, COUNT(*) AS totalMessages FROM messages WHERE YEAR(date_created) = :year GROUP BY month) msg ON m.month = msg.month
    LEFT JOIN (SELECT MONTH(date_created) AS month, COUNT(*) AS totalLikes FROM post_like WHERE YEAR(date_created) = :year GROUP BY month) l ON m.month = l.month
    ORDER BY m.month
    """, nativeQuery = true)
    List<MonthlySummaryProjection> findMonthlySummaryBy(@Param("year") Integer year);
}

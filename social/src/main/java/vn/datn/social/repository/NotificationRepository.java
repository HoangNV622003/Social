package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.dto.response.projection.NotificationProjection;
import vn.datn.social.entity.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("""
        SELECT
            n.id AS id,
            n.content AS content,
            n.type AS type,
            n.status AS status,
            u.id AS userId,
            u.username AS username,
            u.image AS userImage,
            n.deepLink AS deepLink,
            n.dateCreated AS dateCreated
        FROM Notification n LEFT JOIN User u ON n.createdBy = u.id
        WHERE n.userId = :userId ORDER BY n.dateCreated DESC
    """)
    Page<NotificationProjection> findByUserId(Long userId, Pageable pageable);

    List<Notification> findAllByUserId(Long userId);
    Long countByUserIdAndStatus(Long userId, Short status);
}





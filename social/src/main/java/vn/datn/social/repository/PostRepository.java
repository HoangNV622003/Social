package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.datn.social.dto.response.projection.ImageProjection;
import vn.datn.social.dto.response.projection.PostProjection;
import vn.datn.social.entity.Post;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("""
            SELECT
                p.id                    AS id,
                p.content               AS content,
                u.id                    AS authorId,
                u.username              AS authorUsername,
                u.image                 AS authorImage,
                p.dateCreated           AS dateCreated,
                COUNT(DISTINCT l2.id)   AS totalLike,
                COUNT(DISTINCT c.id)    AS totalComment,
                COALESCE(MAX(CASE WHEN l.createdBy = :currentUserId THEN 1 ELSE 0 END), 0) = 1 AS liked
            FROM Post p
            LEFT JOIN Like l  ON l.postId = p.id AND l.createdBy = :currentUserId
            LEFT JOIN Like l2 ON l2.postId = p.id
            LEFT JOIN Comment c ON c.postId = p.id
            LEFT JOIN User u ON p.createdBy = u.id
            WHERE (:userId IS NULL OR p.createdBy = :userId)
            GROUP BY p.id, p.dateCreated
            ORDER BY p.dateCreated DESC
            """)
    Page<PostProjection> findAllWithQuery(
            @Param("currentUserId") Long currentUserId,
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
            SELECT
                p.id                    AS id,
                p.content               AS content,
                u.id                    AS authorId,
                u.username              AS authorUsername,
                u.image                 AS authorImage,
                p.dateCreated           AS dateCreated,
                COUNT(DISTINCT l2.id)   AS totalLike,
                COUNT(DISTINCT c.id)    AS totalComment,
                COALESCE(MAX(CASE WHEN l.createdBy = :currentUserId THEN 1 ELSE 0 END), 0) = 1 AS liked
            FROM Post p
            LEFT JOIN Like l  ON l.postId = p.id AND l.createdBy = :currentUserId
            LEFT JOIN Like l2 ON l2.postId = p.id
            LEFT JOIN Comment c ON c.postId = p.id
            LEFT JOIN User u ON p.createdBy = u.id
            WHERE (LOWER(p.content) LIKE LOWER(CONCAT('%',:keyword,'%')))
            GROUP BY p.id, p.dateCreated
            ORDER BY p.dateCreated DESC
            """)
    Page<PostProjection> searchByCriterial(
            @Param("currentUserId") Long currentUserId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("""
            SELECT
                p.id                    AS id,
                p.content               AS content,
                u.id                    AS authorId,
                u.username              AS authorUsername,
                u.image                 AS authorImage,
                p.dateCreated           AS dateCreated,
                COUNT(DISTINCT l2.id)   AS totalLike,
                COUNT(DISTINCT c.id)    AS totalComment,
                COALESCE(MAX(CASE WHEN l.createdBy = :currentUserId THEN 1 ELSE 0 END), 0) = 1 AS liked
            FROM Post p
            LEFT JOIN Like l  ON l.postId = p.id AND l.createdBy = :currentUserId
            LEFT JOIN Like l2 ON l2.postId = p.id
            LEFT JOIN Comment c ON c.postId = p.id
            LEFT JOIN User u ON p.createdBy = u.id
            WHERE p.id = :postId
            GROUP BY p.id, u.id
            """)
    Optional<PostProjection> findByIdWithQuery(
            @Param("postId") Long postId,
            @Param("currentUserId") Long currentUserId
    );
}
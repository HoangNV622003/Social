package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.datn.social.dto.response.projection.CommentProjection;
import vn.datn.social.entity.Comment;
import vn.datn.social.entity.Post;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("""
        SELECT
            c.id AS id,
            c.content AS content,
            c.image AS image,
            c.dateCreated AS dateCreated,
            u.id AS userId,
            u.username AS username,
            u.image AS userImage
        FROM Comment c LEFT JOIN User u ON c.createdBy = u.id WHERE c.postId=:postId
    """)
    Page<CommentProjection> findByPostId(Long postId, Pageable pageable);

    @Query("""
                SELECT
                    c.id AS id,
                    c.content AS content,
                    c.image AS image,
                    c.dateCreated AS dateCreated,
                    u.id AS userId,
                    u.username AS username,
                    u.image AS userImage
                FROM Comment c LEFT JOIN User u ON c.createdBy = u.id WHERE c.id=:id
            """)
    Optional<CommentProjection> findByCommentId(Long id);
    void deleteByPostId(Long postId);
}

package vn.datn.social.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.datn.social.entity.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByPostIdAndCreatedBy(Long postId, Long createdBy);

    void deleteByPostId(Long postId);
    void deleteByPostIdAndCreatedBy(Long postId, Long createdBy);
}

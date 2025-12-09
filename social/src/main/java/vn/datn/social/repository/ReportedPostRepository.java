package vn.datn.social.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.dto.response.projection.ReportedPostProjection;
import vn.datn.social.entity.ReportedPost;

import java.util.List;

@Repository
public interface ReportedPostRepository extends JpaRepository<ReportedPost, Long> {
    List<ReportedPost> findByPostId(Long postId);

    @Query("""
        SELECT
            rp.id AS reportId,
            p.id AS postId,
            rp.createdBy AS reportedBy,
            rp.reason AS reason,
            p.content AS postContent
        FROM ReportedPost rp INNER JOIN Post p ON rp.postId=p.id LEFT JOIN User u ON u.id = rp.createdBy
        """)
    Page<ReportedPostProjection> findAllWithQuery(Pageable pageable);

    boolean existsById(Long id);

    void deleteById(Long id);

    void deleteByPostId(Long postId);
}

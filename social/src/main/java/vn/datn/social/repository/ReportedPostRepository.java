package vn.datn.social.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.dto.response.ReportedPostProjection;
import vn.datn.social.entity.ReportedPost;

import java.util.List;

@Repository
public interface ReportedPostRepository extends JpaRepository<ReportedPost, Long> {
    List<ReportedPost> findByPostId(Long postId);
//    Long getReportId();
//    Long getPostId();
//    String getReportedBy();
//    String getReason();
//    String getPostContent();  // Thêm nội dung bài viết
//    String getPostImage();
    @Query("""
        SELECT
            rp.id AS reportId,
            p.id AS postId,
            rp.reportedBy AS reportedBy,
            rp.reason AS reason,
            p.content AS postContent,
            p.png AS postImage
        FROM ReportedPost rp LEFT JOIN Post p ON rp.post.id=p.id LEFT JOIN User u ON u.id = rp.reportedBy
        """)
    Page<ReportedPostProjection> findAllWithQuery(Pageable pageable);

    boolean existsById(Long id);

    void deleteById(Long id);
}

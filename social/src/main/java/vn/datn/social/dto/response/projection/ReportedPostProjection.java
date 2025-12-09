package vn.datn.social.dto.response.projection;

public interface ReportedPostProjection {
    Long getReportId();

    Long getPostId();

    String getReportedBy();

    String getReason();

    String getPostContent();  // Thêm nội dung bài viết
}

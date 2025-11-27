package vn.datn.social.dto.response;

import java.sql.Blob;

public interface ReportedPostProjection {
     Long getReportId();
     Long getPostId();
     String getReportedBy();
     String getReason();
     String getPostContent();  // Thêm nội dung bài viết
     Blob getPostImage();
}

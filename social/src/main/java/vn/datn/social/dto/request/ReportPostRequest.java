package vn.datn.social.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportPostRequest {
    private Long reportId;
    private Long postId;
    private Long reportedBy;
    private String reason;
    private String postContent;  // Thêm nội dung bài viết
    private String postImage;    // Hình ảnh bài viết dưới dạng Base64
}


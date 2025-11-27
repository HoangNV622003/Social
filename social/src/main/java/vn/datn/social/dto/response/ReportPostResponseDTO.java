package vn.datn.social.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportPostResponseDTO {
    private Long reportId;
    private Long postId;
    private String reportedBy;
    private String reason;
    private String postContent;  // Thêm nội dung bài viết
    private String postImage;
}

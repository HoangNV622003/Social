package vn.datn.social.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportPostRequest {
    private Long postId;
    private String reason;
}


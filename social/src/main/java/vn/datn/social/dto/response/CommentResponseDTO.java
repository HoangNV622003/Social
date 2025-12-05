package vn.datn.social.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private UserSummaryResponseDTO author;
    private String content;
    private String image;
}

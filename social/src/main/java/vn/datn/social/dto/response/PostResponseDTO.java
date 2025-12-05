package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponseDTO {
    Long id;
    UserSummaryResponseDTO author;
    String image;
    String content;
    Long dateCreated;
    Integer totalLike;
    Integer totalComment;
    Boolean isLiked;
}

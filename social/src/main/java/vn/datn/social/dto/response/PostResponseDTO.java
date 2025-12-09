package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponseDTO {
    Long id;
    UserSummaryResponseDTO author;
    List<String> imageUrls;
    String content;
    Long dateCreated;
    Integer totalLike;
    Integer totalComment;
    Boolean isLiked;
}

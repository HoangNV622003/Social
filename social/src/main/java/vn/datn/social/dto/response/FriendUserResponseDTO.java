package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendUserResponseDTO {
    Long id;
    Long userId;
    String name;
    String image;
    String status;
    Long dateCreated;
}

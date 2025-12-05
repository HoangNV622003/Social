package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponseDTO {
    Long id;
    String content;
    Long userId;
    String username;
    String image;
    Long dateCreated;
    String deepLink;
    String type;
    String status;
}

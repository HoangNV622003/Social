package vn.datn.social.dto.response;

import lombok.*;
import vn.datn.social.constant.NotificationType;

import java.time.LocalDateTime;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String contentnoti;
    private LocalDateTime timestamp;
    private String status;
    private NotificationType type;
    private String sender_username;
}

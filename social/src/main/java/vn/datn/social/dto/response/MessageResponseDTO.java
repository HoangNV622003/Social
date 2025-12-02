package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String clientTempId;
    private String senderName;
    private String senderImage;
    private String content;
    private Long dateCreated;
}

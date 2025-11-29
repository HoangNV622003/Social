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
    private Long receiverId;
    private String content;
    private Long dateCreated;
}

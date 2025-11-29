package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatResponseDTO {
    Long chatId;
    String lastMessage;
    Long lastMessageDate;
    UserResponseDTO receiver;
}

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
    String name;
    String type;
    String image;
    String lastMessage;
    Long lastMessageDate;
}

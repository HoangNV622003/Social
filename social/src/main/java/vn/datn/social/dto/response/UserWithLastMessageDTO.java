package vn.datn.social.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWithLastMessageDTO {
    private String username;
    private String lastMessageContent;
    private Long chatId;
    private Long userId; // Added field for userId
    private LocalDateTime lastMessageTimestamp; // Field for last message timestamp
}

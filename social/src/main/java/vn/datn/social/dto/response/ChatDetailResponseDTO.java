package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatDetailResponseDTO {
    Long id;
    UserResponseDTO receiver;
    Page<MessageResponseDTO> messages;
}

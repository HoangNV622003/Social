package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatDetailResponseDTO {
    Long id;
    String name;
    String image;
    String type;
    Set<UserResponseDTO> members;
    Page<MessageResponseDTO> messages;
}

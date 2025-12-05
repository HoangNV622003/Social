package vn.datn.social.dto.response;

import lombok.*;
import org.springframework.data.domain.Page;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    Long id;
    String username;
    String email;
    String image;
    String address;
    String relationship;
}

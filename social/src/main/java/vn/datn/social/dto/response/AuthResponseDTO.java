package vn.datn.social.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponseDTO {
    String accessToken;
    String refreshToken;
    String tokenType;
    Long expiresIn;
    Long created;
    UserResponseDTO user;
}
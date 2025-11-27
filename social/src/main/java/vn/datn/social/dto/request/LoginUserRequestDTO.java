package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginUserRequestDTO {
    @NotBlank(message = "Email không được để trống")
    String email;
    @NotBlank(message = "Mât khẩu không được để trống")
    String password;
    boolean rememberMe = false;
    String deviceId;
    String firebaseToken;
}

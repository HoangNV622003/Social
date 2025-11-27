package vn.datn.social.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManageDto {
    private Long id;
    private String username;
    private String verificationCode;
    private Boolean enabled;
    private String email;

    @JsonProperty("isAdmin") // Đặt tên cho thuộc tính trong JSON
    private Boolean isAdmin;
}

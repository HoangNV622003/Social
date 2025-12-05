package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginUserRequestDTO(
        @NotBlank(message = "Email không được để trống")
        String email,
        @NotBlank(message = "Mât khẩu không được để trống")
        String password,
        boolean rememberMe,
        String deviceId,
        String firebaseToken) {
}

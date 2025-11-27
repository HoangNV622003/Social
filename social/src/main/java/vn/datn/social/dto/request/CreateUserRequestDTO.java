package vn.datn.social.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public record CreateUserRequestDTO(
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email,
        @NotBlank(message = "Username không được để trống")
        String username,
        @NotBlank(message = "Mật khẩu không được để trống")
        String password,
        String confirmPassword) {
}

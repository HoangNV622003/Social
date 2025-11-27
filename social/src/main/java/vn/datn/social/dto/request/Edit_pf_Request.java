package vn.datn.social.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record Edit_pf_Request(
        @NotBlank(message = "Username không được để trống")
        @Size(min = 6, message = "Username phải có ít nhất 6 ký tự")
        String username,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email,

        @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
        String password,

        String address
) {
}

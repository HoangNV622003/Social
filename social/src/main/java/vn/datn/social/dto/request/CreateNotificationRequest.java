package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateNotificationRequest(
        @NotBlank(message = "Nội dung không được để trống")
        String content,
        String deepLink,
        @NotNull(message = "Mã người nhận không được để trống")
        Long receiverId,
        @NotBlank(message = "Loại thông báo không được để trống")
        String type
) {
}

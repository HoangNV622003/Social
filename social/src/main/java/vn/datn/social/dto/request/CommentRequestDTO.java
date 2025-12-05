package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public record CommentRequestDTO(
        @NotBlank(message = "Content have to not blank")
        String content,
        MultipartFile file
) {
}

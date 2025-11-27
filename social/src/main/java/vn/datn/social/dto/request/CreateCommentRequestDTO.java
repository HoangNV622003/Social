package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCommentRequestDTO(
        @NotNull
        Long postId,
        @NotBlank(message = "Content have to not blank")
        String content
) {
}

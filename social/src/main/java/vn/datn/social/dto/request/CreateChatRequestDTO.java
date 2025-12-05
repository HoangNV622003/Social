package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateChatRequestDTO (
        @NotNull(message = "UserId can't null ")
        Long userId
){
}

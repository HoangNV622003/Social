package vn.datn.social.dto.request;

public record MessageRequestDTO(
        String content, Long senderId
) {
}

package vn.datn.social.dto.request;

public record MessageRequestDTO(
        Long receiverId, String content, String type
) {
}

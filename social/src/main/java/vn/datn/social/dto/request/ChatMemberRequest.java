package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

public record ChatMemberRequest(
        @NotNull(message = "UserId can't null ")
        Long userId,
        @NotNull(message = "RoomId can't null ")
        Long roomId) { }

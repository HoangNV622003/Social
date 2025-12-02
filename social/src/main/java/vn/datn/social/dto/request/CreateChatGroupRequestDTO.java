package vn.datn.social.dto.request;

import java.util.List;

public record CreateChatGroupRequestDTO (
        String groupName,
        List<Long> userIds
){
}

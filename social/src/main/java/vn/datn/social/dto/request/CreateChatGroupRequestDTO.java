package vn.datn.social.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record CreateChatGroupRequestDTO (
        MultipartFile file,
        String groupName,
        List<Long> userIds
){
}

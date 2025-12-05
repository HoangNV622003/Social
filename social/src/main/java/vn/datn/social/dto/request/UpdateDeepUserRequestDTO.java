package vn.datn.social.dto.request;

import org.springframework.web.multipart.MultipartFile;

public record UpdateDeepUserRequestDTO (
        String username,
        String email,
        String address,
        Boolean isAdmin,
        MultipartFile file,
        String imageUrl
){
}

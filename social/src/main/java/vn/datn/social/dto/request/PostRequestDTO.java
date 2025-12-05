package vn.datn.social.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

public record PostRequestDTO(String content, MultipartFile file ) implements Serializable {
}

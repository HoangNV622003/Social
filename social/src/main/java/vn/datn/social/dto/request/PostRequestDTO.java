package vn.datn.social.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;

public record PostRequestDTO(
        @NotBlank(message = "Nội dung không được để trống")
        String content,
        @NotNull
        @NotEmpty
        List<MultipartFile> files

) implements Serializable {
}

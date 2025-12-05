package vn.datn.social.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.utils.FileUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UploadService {

    @Value("${upload.uploadDir}")
    private String uploadDir; // không static


    private Path uploadPath;

    @PostConstruct
    public void init() throws IOException {
        uploadPath = Paths.get(uploadDir);

        // Tạo thư mục nếu chưa có
        Files.createDirectories(uploadPath);
    }

    public String uploadImage(MultipartFile file) {
        FileUtils.validateFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
            String fileName = UUID.randomUUID() + "_" + sanitizedFileName;

            Path destinationFile = uploadPath.resolve(fileName);

            // Lưu file
            Files.copy(file.getInputStream(), destinationFile);

            return "/uploads/" + fileName;   // đường dẫn trả về cho client
        } catch (Exception e) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Lỗi upload ảnh");
        }
    }

}

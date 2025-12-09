package vn.datn.social.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.utils.FileUtils;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
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

    public List<String> uploadImages(List<MultipartFile> files) {
        List<String> result = new ArrayList<>();
        files.forEach(file -> result.add(uploadImage(file)));
        return result;
    }

    public void deleteImage(String imageUrl){
        try {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            Path filePath = uploadPath.resolve(fileName).normalize();

            if (!filePath.startsWith(uploadPath.normalize())) {
                log.error("DELETE IMAGE ERROR: Không được phép xóa file ngoài thư mục uploads");
            }

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            } else {
                log.error("DELETE IMAGE ERROR: Không tìm thấy ảnh");
            }

        } catch (Exception e) {
            log.error("DELETE IMAGE ERROR: {}", e.getMessage());
        }
    }

    public void deleteImages(List<String> imageUrls) {
        imageUrls.forEach(this::deleteImage);
    }
}

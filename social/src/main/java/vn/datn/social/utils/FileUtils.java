package vn.datn.social.utils;

import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.exception.BusinessException;

public class FileUtils {
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024;
    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"};
    private static final String[] ALLOWED_MIME_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp"
    };
    public static void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "File không được để trống");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "File vượt quá 50MB");
        }

        String contentType = file.getContentType();
        String extension = getExtension(file.getOriginalFilename());

        if (!isAllowedMimeType(contentType) || !isAllowedExtension(extension)) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Chỉ cho phép upload ảnh");
        }
    }

    private static boolean isAllowedExtension(String ext) {
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equalsIgnoreCase(ext)) return true;
        }
        return false;
    }

    private static boolean isAllowedMimeType(String mime) {
        for (String allowed : ALLOWED_MIME_TYPES) {
            if (allowed.equalsIgnoreCase(mime)) return true;
        }
        return false;
    }

    private static String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}

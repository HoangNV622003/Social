package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.dto.response.ImageResponseDTO;
import vn.datn.social.entity.Image;
import vn.datn.social.repository.ImageRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageService {
    ImageRepository imageRepository;
    UploadService uploadService;

    public Page<ImageResponseDTO> findAll(Long userId, Pageable pageable) {
        return imageRepository.findAllByCreatedBy(userId, pageable)
                .map(i -> ImageResponseDTO.builder()
                        .id(i.getId())
                        .postId(i.getPostId())
                        .imageUrl(i.getImageUrl())
                        .build());
    }

    public List<Image> saveImages(Long postId, List<MultipartFile> files) {
        List<String> imageUrls = uploadService.uploadImages(files);
        List<Image> image = imageUrls.stream()
                .map(url -> Image.builder()
                        .imageUrl(url)
                        .postId(postId)
                        .build())
                .toList();
        return imageRepository.saveAll(image);
    }

    public Map<Long, List<String>> getImageMapByPostIdIn(List<Long> postIds) {
        List<Image> images = imageRepository.findAllByPostIdIn(postIds);
        if (images.isEmpty()) {
            return Collections.emptyMap();
        }
        return images.stream()
                .collect(Collectors.groupingBy(
                        Image::getPostId,
                        Collectors.mapping(Image::getImageUrl, Collectors.toList())));
    }
}

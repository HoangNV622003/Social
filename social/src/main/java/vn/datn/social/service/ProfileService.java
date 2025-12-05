package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.response.ImageResponseDTO;
import vn.datn.social.dto.response.ProfileResponseDTO;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {
    PostService postService;
    UserRepository userRepository;
    FriendService friendService;
    private final PostRepository postRepository;
    private final UploadService uploadService;

    public ProfileResponseDTO getProfile(Long userId, Long currentUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found"));
        return convertToDTO(user, currentUserId);
    }

    public Page<ImageResponseDTO> getImages(Long userId, Pageable pageable) {
        return postRepository.findAllByAuthorId(userId, pageable).map(p -> ImageResponseDTO.builder()
                .postId(p.getPostId())
                .image(p.getImage())
                .build());
    }

    public ProfileResponseDTO changeAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found"));
        String image = uploadService.uploadImage(file);
        user.setImage(image);
        userRepository.save(user);
        return convertToDTO(user, userId);
    }

    private ProfileResponseDTO convertToDTO(User user, Long currentUserId) {
        return ProfileResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .address(user.getAddress())
                .email(user.getEmail())
                .image(user.getImage())
                .relationship(friendService.getRelationShip(currentUserId, user.getId()))
                .build();
    }
}

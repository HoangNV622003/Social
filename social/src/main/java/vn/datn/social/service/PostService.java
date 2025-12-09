package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.PostRequestDTO;
import vn.datn.social.dto.response.PostResponseDTO;
import vn.datn.social.dto.response.UserSummaryResponseDTO;
import vn.datn.social.dto.response.projection.PostProjection;
import vn.datn.social.entity.Image;
import vn.datn.social.entity.Post;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.CommentRepository;
import vn.datn.social.repository.LikeRepository;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.ReportedPostRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {

    PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final ReportedPostRepository reportedPostRepository;
    ImageService imageService;

    public Page<PostResponseDTO> findAll(Long userId, Long currentUserId, Pageable pageable) {
        Page<PostProjection> postProjections = postRepository.findAllWithQuery(currentUserId, userId, pageable);
        if (postProjections.getTotalElements() == 0) {
            return new PageImpl<>(new ArrayList<>());
        }
        List<Long> postIds = postProjections.stream().map(PostProjection::getId).toList();
        Map<Long, List<String>> imagesMap = imageService.getImageMapByPostIdIn(postIds);
        return postProjections.map(post -> convertToDTO(post, imagesMap));
    }

    public PostResponseDTO createPost(PostRequestDTO postRequestDTO, Long currentUserId) {
        Post post = Post.builder()
                .content(postRequestDTO.content())
                .build();
        postRepository.save(post);
        List<Image> images = imageService.saveImages(post.getId(), postRequestDTO.files());
        Map<Long, List<String>> imageMaps = convertToMap(images);
        PostProjection projection = postRepository.findByIdWithQuery(post.getId(), currentUserId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy bài viết"));
        return convertToDTO(projection, imageMaps);
    }

    private Map<Long, List<String>> convertToMap(List<Image> images) {
        if (images == null || images.isEmpty()) return new HashMap<>();
        return images.stream()
                .collect(Collectors.groupingBy(
                        Image::getPostId,
                        Collectors.mapping(Image::getImageUrl, Collectors.toList())));
    }

    public PostResponseDTO getPost(Long id, Long currentUserId) {
        Map<Long, List<String>> imageMap = imageService.getImageMapByPostIdIn(List.of(id));
        PostProjection projection = postRepository.findByIdWithQuery(id, currentUserId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy bài viết"));
        return convertToDTO(projection, imageMap);
    }

    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Bài viết không tồn tại");
        }
        postRepository.deleteById(id);
        commentRepository.deleteByPostId(id);
        likeRepository.deleteByPostId(id);
        reportedPostRepository.deleteByPostId(id);
    }

    public PostResponseDTO convertToDTO(PostProjection p, Map<Long, List<String>> imageMap) {
        UserSummaryResponseDTO author = UserSummaryResponseDTO.builder()
                .id(p.getAuthorId())
                .username(p.getAuthorUsername())
                .image(p.getAuthorImage())
                .build();
        return PostResponseDTO.builder()
                .id(p.getId())
                .content(p.getContent())
                .imageUrls(imageMap.get(p.getId()))
                .dateCreated(p.getDateCreated().toEpochMilli())
                .totalLike(p.getTotalLike())
                .totalComment(p.getTotalComment())
                .author(author)
                .isLiked(p.isLiked())
                .build();
    }
}

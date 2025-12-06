package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.PostRequestDTO;
import vn.datn.social.dto.response.PostResponseDTO;
import vn.datn.social.dto.response.UserSummaryResponseDTO;
import vn.datn.social.dto.response.projection.PostProjection;
import vn.datn.social.entity.Post;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.CommentRepository;
import vn.datn.social.repository.LikeRepository;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.ReportedPostRepository;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {

    PostRepository postRepository;
    LikeService likeService;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UploadService uploadService;
    private final ReportedPostRepository reportedPostRepository;

    public Page<PostResponseDTO> findAll(Long userId, Long currentUserId, Pageable pageable) {
        return postRepository.findAllWithQuery(currentUserId, userId, pageable).map(this::convertToDTO);
    }

    public PostResponseDTO createPost(PostRequestDTO postRequestDTO, Long currentUserId) {
        String image = uploadService.uploadImage(postRequestDTO.file());
        Post post = Post.builder()
                .content(postRequestDTO.content())
                .image(image)
                .build();
        postRepository.save(post);
        return getPost(post.getId(), currentUserId);
    }


    public PostResponseDTO getPost(Long id, Long currentUserId) {
        return convertToDTO(postRepository.findByIdWithQuery(id, currentUserId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy bài viết")));
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

    public PostResponseDTO convertToDTO(PostProjection p) {
        UserSummaryResponseDTO author = UserSummaryResponseDTO.builder()
                .id(p.getAuthorId())
                .username(p.getAuthorUsername())
                .image(p.getAuthorImage())
                .build();
        return PostResponseDTO.builder()
                .id(p.getId())
                .content(p.getContent())
                .image(p.getImage())
                .dateCreated(p.getDateCreated().toEpochMilli())
                .totalLike(p.getTotalLike())
                .totalComment(p.getTotalComment())
                .author(author)
                .isLiked(p.isLiked())
                .build();
    }
}

package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.ClientUrls;
import vn.datn.social.constant.NotificationType;
import vn.datn.social.dto.request.CommentRequestDTO;
import vn.datn.social.dto.request.CreateNotificationRequest;
import vn.datn.social.dto.response.CommentResponseDTO;
import vn.datn.social.dto.response.UserSummaryResponseDTO;
import vn.datn.social.dto.response.projection.CommentProjection;
import vn.datn.social.entity.Comment;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.CommentRepository;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.IBEUser;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {

    CommentRepository commentRepository;
    PostRepository postRepository;
    NotificationService notificationService;
    UserRepository userRepository;
    private final UploadService uploadService;

    public CommentResponseDTO createComment(IBEUser ibeUser, Long postId, CommentRequestDTO request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy bài viết"));
        String image = request.file() != null ? uploadService.uploadImage(request.file()) : null;
        Comment comment = Comment.builder()
                .postId(postId)
                .content(request.content())
                .image(image)
                .build();
        comment = commentRepository.save(comment);
        User receiver = userRepository.findByPostId(postId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found"));
        CommentProjection projection = commentRepository.findByCommentId(comment.getId()).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Comment not found"));
        if (receiver.getId().equals(ibeUser.getId())) return convertToDTO(projection);

        String content = " đã bình luận về bài viết của bạn";
        String deepLink = ClientUrls.POST_DETAIL_URL + post.getId();
        sendNotification(content, deepLink, receiver.getId(), NotificationType.COMMENT.name());

        return convertToDTO(projection);
    }

    public Page<CommentResponseDTO> findAllByPostId(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable).map(this::convertToDTO);
    }

    private CommentResponseDTO convertToDTO(CommentProjection projection) {
        UserSummaryResponseDTO authorDTO = UserSummaryResponseDTO.builder()
                .id(projection.getUserId())
                .username(projection.getUsername())
                .image(projection.getUserImage())
                .build();
        return CommentResponseDTO.builder()
                .id(projection.getId())
                .content(projection.getContent())
                .image(projection.getImage())
                .author(authorDTO)
                .dateCreated(projection.getDateCreated().getEpochSecond())
                .build();
    }

    private void sendNotification(String content, String deepLink, Long receiverId, String type) {
        CreateNotificationRequest request = new CreateNotificationRequest(content, deepLink, receiverId, type);
        notificationService.createNotification(request);
    }
}

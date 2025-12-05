package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.ClientUrls;
import vn.datn.social.constant.NotificationType;
import vn.datn.social.dto.request.CreateNotificationRequest;
import vn.datn.social.dto.request.LikeRequestDTO;
import vn.datn.social.entity.Like;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.LikeRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.IBEUser;

@Service
@Transactional
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public void toggleLike(LikeRequestDTO request, IBEUser iBEUser) {
        if (likeRepository.existsByPostIdAndCreatedBy(request.postId(), iBEUser.getId())) {
            likeRepository.deleteByPostIdAndCreatedBy(request.postId(), iBEUser.getId());
            return;
        }
        Like like = Like.builder()
                .postId(request.postId())
                .build();
        likeRepository.save(like);
        User user = userRepository.findByPostId(request.postId())
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found"));
        if (user.getId().equals(iBEUser.getId())) return;
        String content = " Đã thích bài viết của bạn";
        String deepLink = ClientUrls.POST_DETAIL_URL + request.postId();
        sendNotification(content, deepLink, user.getId(), NotificationType.LIKE.name());
    }

    private void sendNotification(String content, String deepLink, Long receiverId, String type) {
        CreateNotificationRequest request = new CreateNotificationRequest(content, deepLink, receiverId, type);
        notificationService.createNotification(request);
    }
}


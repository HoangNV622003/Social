package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.NotificationStatus;
import vn.datn.social.constant.NotificationType;
import vn.datn.social.dto.request.CreateNotificationRequest;
import vn.datn.social.dto.response.NotificationResponseDTO;
import vn.datn.social.dto.response.UnreadCountNotificationResponseDTO;
import vn.datn.social.dto.response.projection.NotificationProjection;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.NotificationRepository;
import vn.datn.social.repository.UserRepository;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {

    UserRepository userRepository;
    NotificationRepository notificationRepository;
    SimpMessagingTemplate simpMessagingTemplate;

    public UnreadCountNotificationResponseDTO getUnreadCount(Long userId) {
        Long count = notificationRepository.countByUserIdAndStatus(userId, (short) NotificationStatus.UNREAD.getValue());
        return UnreadCountNotificationResponseDTO.builder().unreadCount(count).build();
    }

    public Page<NotificationResponseDTO> findAll(Long userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable).map(this::convertToDTO);
    }

    public void createNotification(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .content(request.content())
                .deepLink(request.deepLink())
                .userId(request.receiverId())
                .type((short) NotificationType.find(request.type()).getValue())
                .status((short) NotificationStatus.UNREAD.getValue())
                .build();
        notificationRepository.save(notification);
        User user = userRepository.findById(notification.getCreatedBy())
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND));
        NotificationResponseDTO dto = NotificationResponseDTO.builder()
                .id(notification.getId())
                .deepLink(notification.getDeepLink())
                .content(notification.getContent())
                .status(NotificationStatus.UNREAD.name())
                .type(request.type())
                .username(user.getUsername())
                .image(user.getImage())
                .dateCreated(notification.getDateCreated().toEpochMilli())
                .build();
        simpMessagingTemplate.convertAndSendToUser(
                request.receiverId().toString(),
                "/topic/notifications",
                dto
        );
    }

    public void markReadAll(Long userId) {
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);
        notifications.forEach(notification -> {
            notification.setStatus((short) NotificationStatus.READ.getValue());
        });
        notificationRepository.saveAll(notifications);
    }

    public void markRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND));
        notification.setStatus((short) NotificationStatus.READ.getValue());
        notificationRepository.save(notification);
    }

    private NotificationResponseDTO convertToDTO(NotificationProjection projection) {
        log.info("Date: {}", projection.getDateCreated());
        return NotificationResponseDTO.builder()
                .id(projection.getId())
                .content(projection.getContent())
                .deepLink(projection.getDeepLink())
                .type(NotificationType.find(projection.getType()).name())
                .status(NotificationStatus.find(projection.getStatus()).name())
                .userId(projection.getUserId())
                .username(projection.getUsername())
                .image(projection.getUserImage())
                .dateCreated(projection.getDateCreated() != null ? projection.getDateCreated().toEpochMilli() : null)
                .build();
    }
}

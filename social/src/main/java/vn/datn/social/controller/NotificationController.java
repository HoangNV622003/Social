package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.response.NotificationDTO;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.User;
import vn.datn.social.security.IBEUser;
import vn.datn.social.service.NotificationService;
import vn.datn.social.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    private NotificationService notificationService;

    private UserService userService;

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@AuthenticationPrincipal IBEUser ibeUser) {
        User user = userService.findByUsername(ibeUser.getUsername()); // Lấy người dùng hiện tại
        List<Notification> notifications = notificationService.getUnreadNotifications(user); // Lấy danh sách thông báo

        // Chuyển đổi danh sách Notification sang NotificationDTO
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDTO) // Sử dụng constructor của NotificationDTO
                .toList();

        return ResponseEntity.ok(notificationDTOs); // Trả về danh sách NotificationDTO
    }
    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .contentnoti(notification.getContentnoti())
                .sender_username(notification.getSender().getUsername())
                .type(notification.getType())
                .status(notification.getStatus())
                .timestamp(notification.getTimestamp())
                .build();
    }

    // Fetch all notifications for the current user

    // tra ra noti của nguoi dunùng hien tai
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(
            @AuthenticationPrincipal IBEUser ibeUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        User currentUser = userService.findByUsername(ibeUser.getUsername());
        Page<Notification> notifications = notificationService.getNotificationsByReceiverId(currentUser.getId(), page, size);

        // Map notifications to NotificationDTO using the constructor
        List<NotificationDTO> notificationDTOs = notifications.getContent().stream()
                .map(this::convertToDTO) // Sử dụng constructor NotificationDTO(Notification notification)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOs);

    }


    // response khi nguoi duùng truy cap vao trang noti( chuyen tat ca ve trang thai read
    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead(@AuthenticationPrincipal IBEUser ibeUser) {
        User currentUser = userService.findByUsername(ibeUser.getUsername());

        notificationService.markAllAsRead(currentUser.getId());

        return ResponseEntity.ok().build();
    }



}

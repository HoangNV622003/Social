package vn.datn.social.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.CreateNotificationRequest;
import vn.datn.social.dto.response.NotificationResponseDTO;
import vn.datn.social.dto.response.UnreadCountNotificationResponseDTO;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponseDTO>> getNotifications(
            @PageableDefault(size = 20) Pageable pageable,
            @CurrentUserId Long userId
    ) {
        return ResponseEntity.ok(notificationService.findAll(userId, pageable));
    }

    @PostMapping
    public ResponseEntity<Void> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        notificationService.createNotification(request);
        return ResponseEntity.ok().build();
    }

    // response khi nguoi duùng truy cap vao trang noti( chuyen tat ca ve trang thai read
    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead(@CurrentUserId Long userId) {
        notificationService.markReadAll(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountNotificationResponseDTO> getUnreadCount(@CurrentUserId Long userId) {
        return  ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }
}

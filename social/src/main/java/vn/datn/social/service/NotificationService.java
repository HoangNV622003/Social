package vn.datn.social.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.User;
import vn.datn.social.repository.NotificationRepository;

import java.util.List;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    UserService userService;

    public void createNotification(User sender, User receiver, String content) {
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setContentnoti(content);
        notification.setStatus("unread");
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByReceiverAndStatus(user, "unread");
    }

    public void save(Notification notification) {
        notificationRepository.save(notification);
    }

    // Get notifications by receiver's ID
    public Page<Notification> getNotificationsByReceiverId(long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return notificationRepository.findByReceiverId(userId, pageable);
    }


    public void markAllAsRead(long userId) {
        List<Notification> notifications = notificationRepository.findByReceiverIdAndStatus(userId, "unread");
        notifications.forEach(notification -> notification.setStatus("read"));
        notificationRepository.saveAll(notifications); // Lưu tất cả các thông báo đã cập nhật
    }


}

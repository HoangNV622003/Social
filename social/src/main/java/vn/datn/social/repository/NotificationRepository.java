package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.User;

import java.util.List;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
//    List<Notification> findByReceiverUsername(String username);


    //List<Notification> findByReceiver_Username(String username); // Sử dụng underscore để truy vấn
    List<Notification> findByReceiverIdAndStatus(long receiverId, String status);

    List<Notification> findByReceiverAndStatus(User receiver, String status);

    List<Notification> findByReceiver(User receiver);


    // Add pagination support
    Page<Notification> findByReceiverId(long receiverId, Pageable pageable);


    //List<Notification> findByUserAndIsReadFalse(User user); // Fetch unread notifications
}





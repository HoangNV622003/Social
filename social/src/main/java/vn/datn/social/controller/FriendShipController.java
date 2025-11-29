package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.constant.NotificationType;
import vn.datn.social.dto.response.FriendSummaryResponseDTO;
import vn.datn.social.entity.FriendShip;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.User;
import vn.datn.social.repository.FriendRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.FriendService;
import vn.datn.social.service.NotificationService;
import vn.datn.social.service.SearchService;
import vn.datn.social.service.UserService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friend")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendShipController {
    SearchService service;

    UserService userService;

    FriendService friendShipService;

    NotificationService notificationService;

    UserRepository userRepository;
    FriendRepository friendShipRepository;

    @PostMapping("/add_friend")
    public ResponseEntity<String> addFriend(@RequestParam("username") String friendUsername, @CurrentUserId Long currentUserId) {
        User sender = userService.findById(currentUserId);
        User receiver = userService.findByUsername(friendUsername);
        if (friendShipService.existsBetweenUsers(sender, receiver)) {
            return ResponseEntity.badRequest().body("Your friendship has already been added.");
        }
        // Create a new friendship request
        FriendShip friendShip = new FriendShip();
        friendShip.setUser(sender);
        friendShip.setFriend(receiver);
        friendShip.setAccepted(false);  // Set as not accepted initially
        friendShipService.save(friendShip);

        // Create a notification for the receiver
        Notification notification = new Notification();
        notification.setContentnoti(sender.getUsername() + " đã gửi yêu cầu kết bạn cho bạn.");
        notification.setType(NotificationType.ADD_FRIEND); // Type of notification
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setStatus("unread");
        notification.setTimestamp(LocalDateTime.now());
        notificationService.save(notification);

        // Return response with updated friend request status
        return ResponseEntity.ok(" Send addFriend request successfully"); // Return updated status in the response
    }

    @PostMapping("/accept")
    public ResponseEntity<Void> acceptFriend(
            @RequestParam("username") String friendUsername, @CurrentUserId Long currentUserId) {
        User receiver = userService.findById(currentUserId);
        User sender = userService.findByUsername(friendUsername);

        FriendShip friendship = friendShipService.findPendingRequest(sender, receiver);
        friendship.setAccepted(true);
        friendShipService.save(friendship);

        receiver.setFriendPending(false);
        sender.setFriendPending(false);
        userService.saveAgaint(receiver);
        userService.saveAgaint(sender);

        Notification receiverNotification = new Notification();
        receiverNotification.setContentnoti(
                "You and " + sender.getUsername() + " are now friends. Lets share amazing things!");
        receiverNotification.setType(NotificationType.MESSAGE);
        receiverNotification.setSender(receiver);
        receiverNotification.setReceiver(receiver);
        receiverNotification.setStatus("unread");
        receiverNotification.setTimestamp(LocalDateTime.now());
        notificationService.save(receiverNotification);

        Notification senderNotification = new Notification();
        senderNotification.setContentnoti(
                receiver.getUsername() + " accepted your friend request. Lets share amazing things!");
        senderNotification.setType(NotificationType.MESSAGE);
        senderNotification.setSender(sender);
        senderNotification.setReceiver(sender);
        senderNotification.setStatus("unread");
        senderNotification.setTimestamp(LocalDateTime.now());
        notificationService.save(senderNotification);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancel/{otherName}")
    public ResponseEntity<Map<String, Object>> cancelFriend(@PathVariable String otherName, Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Lấy tên người dùng hiện tại từ Principal
            String currentUsername = principal.getName();

            // Tìm FriendShip giữa currentUser và otherUser
            Optional<FriendShip> optionalFriendShip = friendShipRepository.findFriendShipBetweenUsers(currentUsername, otherName);

            if (optionalFriendShip.isEmpty()) {
                response.put("error", "Friendship not found.");
                return ResponseEntity.status(404).body(response);
            }

            // Xóa FriendShip
            friendShipRepository.delete(optionalFriendShip.get());
            response.put("message", "Friendship successfully canceled.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while canceling the friendship.");
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<FriendSummaryResponseDTO>> searchMyFriends(@RequestParam(required = false, name = "keyword") String keyword, @CurrentUserId Long currentUserId) {
        return ResponseEntity.ok(friendShipService.searchFriends(keyword, currentUserId));
    }
}

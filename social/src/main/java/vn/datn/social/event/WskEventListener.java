package vn.datn.social.event;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class WskEventListener {

//    private final SimpMessageSendingOperations messagingTemplate;
//
//    @EventListener
//    public void handleFriendRequestEvent(FriendRequestEvent event) {
//        User sender = event.getSender();
//        User receiver = event.getReceiver();
//
//        // Đảm bảo receiver là một đối tượng User hợp lệ
//        if (receiver != null) {
//            Notification notification = new Notification();
//            notification.setContentnoti("You have a new friend request from " + sender.getUsername());
//            notification.setReceiverId(receiver); // Thiết lập receiver là đối tượng User
//
//            messagingTemplate.convertAndSendToUser(
//                    receiver.getUsername(), "/specific", notification
//            );
//        } else {
//            log.warn("Receiver is null. Cannot send notification.");
//        }
//    }
}

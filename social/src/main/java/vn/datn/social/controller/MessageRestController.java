package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.response.MessageDTO;
import vn.datn.social.dto.response.UserWithLastMessageDTO;
import vn.datn.social.entity.Chat;
import vn.datn.social.entity.Message;
import vn.datn.social.entity.User;
import vn.datn.social.repository.ChatRepository;
import vn.datn.social.repository.MessageRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.service.ChatService;
import vn.datn.social.service.MessageService;
import vn.datn.social.service.UserService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageRestController {

    
     MessageRepository messageRepository;

    
     ChatRepository chatRepository;

    
     UserRepository userRepository;

    
     UserService userService;

    
     ChatService chatService;

    
     MessageService messageService;


    // Lấy danh sách các tin nhắn theo chatId
    @GetMapping("/{chatId}")
    public ResponseEntity<Page<MessageDTO>> getMessagesByChatId(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("timestamp"))); // Sắp xếp theo thời gian giảm dần
        Page<Message> messagesPage = messageRepository.findByChatId(chatId, pageable);

        if (messagesPage.hasContent()) {
            List<MessageDTO> messageDTOList = messagesPage.stream()
                    .map(message -> {
                        String senderUsername = userService.getUsernameById(message.getSender().getId());
                        return MessageDTO.builder()
                                .id(message.getId())
                                .content(message.getContent())
                                .chatId(message.getChat().getId())
                                .timestamp(message.getTimestamp())
                                .senderId(message.getSender().getId())
                                .receiverId(message.getReceiver().getId())
                                .senderUsername(senderUsername)
                                .receiverUsername(message.getReceiver().getUsername())
                                .build();
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new PageImpl<>(messageDTOList, pageable, messagesPage.getTotalElements()));
        } else {
            return ResponseEntity.noContent().build();
        }
    }


    @PostMapping("/createChat/{receiverUsername}")
    public ResponseEntity<Long> createChat(@PathVariable String receiverUsername, Principal principal) {

        User sender = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

// Lấy receiver từ username được truyền vào
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));


        if (sender == null || receiver == null) {
            return ResponseEntity.badRequest().body(null); // Trả về lỗi nếu không tìm thấy người dùng
        }

        // Kiểm tra nếu chat đã tồn tại giữa 2 người này chưa
        Optional<Chat> existingChat = chatRepository.findChatBetweenUsers(sender.getId(), receiver.getId());
        if (existingChat.isPresent()) {
            return ResponseEntity.ok(existingChat.get().getId()); // Nếu đã có chat, trả về ID của chat cũ
        }

        // Nếu không có chat, tạo một chat mới
        Chat newChat = Chat.builder()
                .name(sender.getUsername() + "-" + receiver.getUsername())
                .isGroup(false)  // Chat giữa 2 người thì không phải nhóm
                .participants(Arrays.asList(sender, receiver))
                .build();

        chatRepository.save(newChat);
        // Gửi tin nhắn mặc định sau khi tạo chat
        String defaultMessage = "We are friends! Let's talk!";

        Message message = new Message();
        message.setChat(newChat);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(defaultMessage);
        message.setTimestamp(LocalDateTime.now());

        Message message1 = new Message();
        message1.setChat(newChat);
        message1.setSender(receiver);
        message1.setReceiver(sender);
        message1.setContent(defaultMessage);
        message1.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);
        messageRepository.save(message1);
        // Lưu tin nhắn vào cơ sở dữ liệu


        return ResponseEntity.ok(newChat.getId());  // Trả về ID của chat mới
    }


    // API trả về danh sách người dùng với tin nhắn cuối cùng của họ
    @GetMapping
    public ResponseEntity<List<UserWithLastMessageDTO>> getMessagesForUser(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Nếu người dùng chưa đăng nhập
        }

        // Lấy danh sách người dùng với tin nhắn cuối cùng
        List<UserWithLastMessageDTO> usersWithMessages = chatService.getUsersWithMessages(username);

        return ResponseEntity.ok(usersWithMessages); // Trả về danh sách người dùng và tin nhắn
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<String> deleteChat(@PathVariable Long chatId) {
        try {
            // Gọi service để xóa chat
            chatService.deleteChat(chatId);
            return ResponseEntity.ok("Chat deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete chat: " + e.getMessage());
        }
    }


}


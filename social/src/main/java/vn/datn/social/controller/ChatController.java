package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.response.MessageDTO;
import vn.datn.social.dto.response.UserWithLastMessageDTO;
import vn.datn.social.entity.Chat;
import vn.datn.social.entity.Message;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.ChatRepository;
import vn.datn.social.repository.MessageRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.IBEUser;
import vn.datn.social.service.ChatService;
import vn.datn.social.service.NotificationService;
import vn.datn.social.service.UserService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;

    ChatRepository chatRepository;

    UserService userService;

    MessageRepository messageRepository;

    private SimpMessagingTemplate messagingTemplate;

    private UserRepository userRepository;

    NotificationService notificationService;

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @MessageMapping("chat.sendMessage")
    @SendTo("/topic/chat")
    public Message sendMsg(@Payload Message msg) {
        return msg;
    }

    @MessageMapping("chat.addUser")
    @SendTo("/topic/chat")
    public Message addUser(@Payload Message msg, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", msg.getSender());
        return msg;
    }

    @GetMapping("/chat/{chatId}")
    public String openChatBox(@PathVariable Long chatId, Model model, @AuthenticationPrincipal IBEUser ibeUser) {
        User currentUser = userService.findByUsername(ibeUser.getUsername());

        model.addAttribute("chatId", chatId);
        model.addAttribute("currentUserId", currentUser.getId());
        model.addAttribute("currentUserName", currentUser.getUsername());
        return "chatboxx";
    }

    @MessageMapping("/chat/{receiverId}")
    @SendToUser("/queue/messages")
    public Message sendMessage(@DestinationVariable String receiverId, Message message) {
        return message;
    }

    @MessageMapping("/chat/{chatId}/sendMessage")
    @SendTo("/topic/chat/{chatId}")
    public MessageDTO sendMessage(
            @DestinationVariable Long chatId,
            @Payload MessageDTO messageDTO) {

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND,"Chat not found"));

        User sender = userRepository.findByUsername(messageDTO.getSenderUsername())
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND,"Sender not found"));

        User receiver = userRepository.findByUsername(messageDTO.getReceiverUsername())
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND,"Receiver not found"));

        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());

        Message saved = messageRepository.save(message);

        // Trả về đầy đủ để frontend hiển thị
        MessageDTO dto = new MessageDTO();
        dto.setId(saved.getId());
        dto.setContent(saved.getContent());
        dto.setSenderUsername(sender.getUsername());
        dto.setReceiverUsername(receiver.getUsername());
        dto.setTimestamp(saved.getTimestamp());

        return dto;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<UserWithLastMessageDTO>> getMessagesForUser(@AuthenticationPrincipal IBEUser ibeUser) {

        List<UserWithLastMessageDTO> usersWithMessages = chatService.getUsersWithMessages(ibeUser.getUsername());

        return ResponseEntity.ok(usersWithMessages);
    }
}

package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.dto.response.MessageDTO;
import vn.datn.social.dto.response.UserWithLastMessageDTO;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.security.IBEUser;
import vn.datn.social.service.ChatService;
import vn.datn.social.service.MessageService;
import vn.datn.social.service.UserService;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;
    UserService userService;
    SimpMessagingTemplate messagingTemplate;

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final MessageService messageService;

    // GỬI TIN NHẮN – ĐÚNG ĐƯỜNG DẪN, CÓ AUTH, BROADCAST ĐÚNG CHỖ
    @MessageMapping("/chat/{chatId}/send-message")
    public void sendMessage(
            @DestinationVariable Long chatId,
            @Payload MessageRequestDTO request
    ) {
        messageService.sendMessage(chatId, request);
    }

}
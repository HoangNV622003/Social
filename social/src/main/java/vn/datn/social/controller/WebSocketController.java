package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.service.WebSocketService;

@Slf4j
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketController {
    WebSocketService webSocketService;

    // GỬI TIN NHẮN – ĐÚNG ĐƯỜNG DẪN, CÓ AUTH, BROADCAST ĐÚNG CHỖ
    @MessageMapping("/chat/{chatId}/send-message")
    public void sendMessage(
            @DestinationVariable Long chatId,
            @Payload MessageRequestDTO request
    ) {
        webSocketService.sendMessage(chatId, request);
    }
}

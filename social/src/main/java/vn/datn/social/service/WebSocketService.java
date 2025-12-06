package vn.datn.social.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.ChatResponseDTO;
import vn.datn.social.dto.response.MessageResponseDTO;
import vn.datn.social.dto.response.UserResponseDTO;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketService {
    MessageService messageService;
    SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationService notificationService;

    @Async
    public void sendMessage(Long chatId, MessageRequestDTO requestDTO) {
        MessageResponseDTO message = messageService.sendMessage(chatId, requestDTO);
        simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId, message);
    }

    @Async
    public void sendChatGroup(ChatDetailResponseDTO response) {
        ChatResponseDTO dto = ChatResponseDTO.builder()
                .chatId(response.getId())
                .name(response.getName())
                .image(response.getImage())
                .type(response.getType())
                .build();
        response.getMembers().stream()
                .map(UserResponseDTO::getId)
                .forEach(id -> simpMessagingTemplate.convertAndSend("/topic/new-chat/" + id, dto));
    }
}

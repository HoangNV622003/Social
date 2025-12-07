package vn.datn.social.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.ChatResponseDTO;
import vn.datn.social.dto.response.MessageResponseDTO;
import vn.datn.social.dto.response.UserResponseDTO;

import java.util.List;
import java.util.Set;

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
    public void sendAddToChatGroup(ChatDetailResponseDTO response) {
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

    @Async
    public void sendRemoveFromChatGroup(Set<Long> userIds, Long chatId) {
        userIds.forEach(id -> simpMessagingTemplate.convertAndSend("/topic/remove-chat/" + id, chatId));
    }

    @Async
    public void sendToUpdateGroup(Set<Long> userIds, ChatDetailResponseDTO responseDTO) {
        userIds.forEach(id -> simpMessagingTemplate.convertAndSend("/topic/update-chat/" + id, responseDTO));
    }
}

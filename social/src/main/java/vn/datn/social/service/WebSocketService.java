package vn.datn.social.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.request.CreateChatGroupRequestDTO;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.MessageResponseDTO;
import vn.datn.social.entity.Message;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketService {
    ChatService chatService;
    MessageService messageService;
    SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(Long chatId, MessageRequestDTO requestDTO) {
        MessageResponseDTO message = messageService.sendMessage(chatId, requestDTO);
        simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId, message);
    }

    public void createChatPrivate(Long currentUserId, CreateChatRequestDTO requestDTO) {
        ChatDetailResponseDTO chat = chatService.createChatPrivate(currentUserId, requestDTO);
        simpMessagingTemplate.convertAndSendToUser(
                String.valueOf(requestDTO.userId()),
                "/queue/new-chat",
                chat);
    }

    public void createChatGroup(Long currentUserId, CreateChatGroupRequestDTO requestDTO) {
        ChatDetailResponseDTO chat= chatService.createChatGroup(currentUserId, requestDTO);
        requestDTO.userIds().add(currentUserId);
        requestDTO.userIds().forEach(id -> {
            simpMessagingTemplate.convertAndSendToUser(
                    id.toString(),
                    "/queue/new-chat",
                    chat
            );
        });
    }
}

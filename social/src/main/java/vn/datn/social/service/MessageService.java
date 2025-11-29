package vn.datn.social.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.dto.response.MessageResponseDTO;
import vn.datn.social.entity.Message;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.ChatRepository;
import vn.datn.social.repository.MessageRepository;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;
    private final ChatRepository chatRepository;

    public Page<MessageResponseDTO> findAllByChatId(Long chatId, Pageable pageable) {
        if (!chatRepository.existsById(chatId)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat");
        }
        return messageRepository.findByChatId(chatId, pageable).map(this::convertToMessageResponseDTO);
    }

    public void sendMessage(Long chatId, MessageRequestDTO request) {
        if (!chatRepository.existsById(chatId)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat");
        }
        User receiver = userService.findById(request.receiverId());
        Message message = saveMessage(chatId, request);
        simpMessagingTemplate.convertAndSend("/topic/chat/" + chatId, message);
    }

    private MessageResponseDTO convertToMessageResponseDTO(Message message) {
        return MessageResponseDTO.builder()
                .id(message.getId())
                .chatId(message.getChatId())
                .content(message.getContent())
                .senderId(message.getCreatedBy())
                .receiverId(message.getReceiverId())
                .dateCreated(message.getDateCreated().getEpochSecond())
                .build();
    }

    private Message saveMessage(Long chatId, MessageRequestDTO request) {
        Message message = Message.builder()
                .chatId(chatId)
                .content(request.content())
                .receiverId(request.receiverId())
                .build();
        return messageRepository.save(message);
    }
}

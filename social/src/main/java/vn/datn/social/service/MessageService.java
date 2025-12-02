package vn.datn.social.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.MessageRequestDTO;
import vn.datn.social.dto.response.MessageResponseDTO;
import vn.datn.social.entity.ChatRoom;
import vn.datn.social.entity.Message;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.ChatRoomRepository;
import vn.datn.social.repository.MessageRepository;
import vn.datn.social.utils.BlobUtil;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;
    private final ChatRoomRepository chatRepository;

    public Page<MessageResponseDTO> findAllByChatId(Long chatId, Pageable pageable) {
        if (!chatRepository.existsById(chatId)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat");
        }
        return messageRepository.findByRoomId(chatId, pageable).map(this::convertToMessageResponseDTO);
    }

    public MessageResponseDTO sendMessage(Long chatId, MessageRequestDTO request) {
        if (!chatRepository.existsById(chatId)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat");
        }
        ChatRoom chatRoom = chatRepository.findById(chatId).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat"));

        Message message = Message.builder()
                .roomId(chatId)
                .content(request.content())
                .senderId(request.senderId())
                .build();
        message = messageRepository.save(message);
        chatRoom.setLastMessageId(message.getId());
        chatRepository.save(chatRoom);
        return convertToMessageResponseDTO(message);
    }

    private MessageResponseDTO convertToMessageResponseDTO(Message message) {
        User user = userService.findById(message.getSenderId());
        return MessageResponseDTO.builder()
                .id(message.getId())
                .chatId(message.getRoomId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .senderName(user.getUsername())
                .senderImage(user.getImage() != null ? BlobUtil.blobToBase64(user.getImage()) : null)
                .dateCreated(message.getDateCreated().getEpochSecond())
                .build();
    }
}

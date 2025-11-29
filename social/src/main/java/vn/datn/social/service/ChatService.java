package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.ChatProjection;
import vn.datn.social.dto.response.ChatResponseDTO;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.entity.Chat;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.ChatRepository;
import vn.datn.social.repository.MessageRepository;
import vn.datn.social.utils.BlobUtil;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatService {

    ChatRepository chatRepository;
    MessageRepository messageRepository;
    UserService userService;
    MessageService messageService;

    public Page<ChatResponseDTO> findAll(Long currentUserId, Pageable pageable) {
        return chatRepository.findAllByUserId(currentUserId, pageable).map(this::convertToChatResponseDTO);
    }

    public ChatDetailResponseDTO getChatDetails(Long chatId, Long currentUserId,Pageable pageable) {
        User receiver = userService.findReceiverByChatIdAndCurrentUserId(chatId, currentUserId);
        return ChatDetailResponseDTO.builder()
                .id(chatId)
                .receiver(userService.convertToUserResponseDTO(receiver))
                .messages(messageService.findAllByChatId(chatId, pageable))
                .build();
    }

    public ChatResponseDTO createChat(Long currentUserId, CreateChatRequestDTO requestDTO) {
        Chat chat = chatRepository.findByTwoUserIds(currentUserId, requestDTO.receiverId())
                .orElseGet(() -> saveChat(currentUserId, requestDTO));
        User user = userService.findById(requestDTO.receiverId());
        UserResponseDTO userResponseDTO = UserResponseDTO.builder()
                .id(user.getId())
                .image(user.getImage() != null ? BlobUtil.blobToBase64(user.getImage()) : null)
                .username(user.getUsername())
                .build();
        return ChatResponseDTO.builder()
                .chatId(chat.getId())
                .lastMessage(chat.getLastMessage())
                .lastMessageDate(null)
                .receiver(userResponseDTO)
                .build();
    }

    public Chat saveChat(Long currentUserId, CreateChatRequestDTO requestDTO) {
        Chat chat = Chat.builder()
                .user1Id(requestDTO.receiverId())
                .user2Id(currentUserId)
                .build();
        return chatRepository.save(chat);
    }

    public boolean existsChatById(Long chatId) {
        return chatRepository.existsById(chatId);
    }

    public ChatResponseDTO convertToChatResponseDTO(ChatProjection projection) {
        UserResponseDTO receiverDTO = UserResponseDTO.builder()
                .id(projection.getReceiverId())
                .username(projection.getReceiverName())
                .image(projection.getReceiverImage() != null ? BlobUtil.blobToBase64(projection.getReceiverImage()) : null)
                .build();

        return ChatResponseDTO.builder()
                .chatId(projection.getId())
                .lastMessage(projection.getLastMessage())
                .lastMessageDate(projection.getLastMessageDate() != null
                        ? projection.getLastMessageDate().toEpochMilli()
                        : null)
                .receiver(receiverDTO)
                .build();
    }

    public Chat findById(Long chatId) {
        return chatRepository.findById(chatId).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat"));
    }

    public void deleteChat(Long chatId) {
        chatRepository.deleteById(chatId);
        messageRepository.deleteAllByChatId(chatId);
    }
}

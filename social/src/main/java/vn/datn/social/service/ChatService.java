package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.ChatTypeConstants;
import vn.datn.social.dto.request.CreateChatGroupRequestDTO;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.ChatResponseDTO;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.dto.response.projection.ChatProjection;
import vn.datn.social.dto.response.projection.ChatSummaryProjection;
import vn.datn.social.entity.ChatMember;
import vn.datn.social.entity.ChatRoom;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.ChatMemberRepository;
import vn.datn.social.repository.ChatRoomRepository;
import vn.datn.social.repository.MessageRepository;
import vn.datn.social.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatService {

    ChatRoomRepository chatRoomRepository;
    MessageRepository messageRepository;
    UserService userService;
    MessageService messageService;
    private final ChatMemberRepository chatMemberRepository;
    private final ChatMemberService chatMemberService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final WebSocketService webSocketService;
    private final UploadService uploadService;

    public Page<ChatResponseDTO> findAll(Long currentUserId, Pageable pageable) {
        return chatRoomRepository.findAllByUserId(currentUserId, pageable).map(this::convertToChatResponseDTO);
    }

    public Page<ChatSummaryProjection> findChatByName(Long currentUserId, String keyword, Pageable pageable) {
        return chatRoomRepository.searchByName(keyword, currentUserId, pageable);
    }

    public ChatDetailResponseDTO getChatDetails(Long chatId, Pageable pageable) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatId).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat"));
        Set<UserResponseDTO> members = userRepository.findAllByChatRoomId(chatId).stream()
                .map(userService::convertToUserResponseDTO)
                .collect(Collectors.toSet());

        return ChatDetailResponseDTO.builder()
                .id(chatId)
                .members(members)
                .name(chatRoom.getName())
                .type(ChatTypeConstants.find(chatRoom.getType()).name())
                .image(chatRoom.getImage())
                .messages(messageService.findAllByChatId(chatId, pageable))
                .build();
    }

    public ChatDetailResponseDTO openChatPrivate(Long currentUserId, CreateChatRequestDTO requestDTO) {
        ChatRoom chat = chatRoomRepository.findByTwoUserIds(currentUserId, requestDTO.userId())
                .orElseGet(() -> saveChatPrivate(currentUserId, requestDTO));

        return getChatDetails(chat.getId(), null);
    }

    public ChatDetailResponseDTO createChatGroup(Long currentUserId, CreateChatGroupRequestDTO requestDTO) {
        String image = requestDTO.file() != null ? uploadService.uploadImage(requestDTO.file()) : null;
        ChatRoom chatRoom = ChatRoom.builder()
                .name(requestDTO.groupName())
                .image(image)
                .type(ChatTypeConstants.GROUP.getValue())
                .build();
        chatRoomRepository.save(chatRoom);
        requestDTO.userIds().add(currentUserId);
        chatMemberService.saveAllChatMembers(chatRoom.getId(), requestDTO.userIds());
        List<User> users = userRepository.findAllById(requestDTO.userIds());
        Set<UserResponseDTO> userResponseDTOS = users.stream()
                .map(userService::convertToUserResponseDTO)
                .collect(Collectors.toSet());
        ChatDetailResponseDTO chat = ChatDetailResponseDTO.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getName())
                .image(chatRoom.getImage())
                .members(userResponseDTOS)
                .type(ChatTypeConstants.find(chatRoom.getType()).name())
                .build();
        webSocketService.sendChatGroup(chat);
        return chat;
    }

    public void updateChatGroup(Long chatId, CreateChatGroupRequestDTO requestDTO) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatId).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat"));
        updateChatRoom(chatRoom, requestDTO);
        Set<Long> newUserIds= updateChatMembers(chatId, requestDTO.userIds());
        if (newUserIds.isEmpty()) return;
        Set<UserResponseDTO> users = newUserIds.stream()
                .map(id -> UserResponseDTO.builder()
                        .id(id)
                        .build())
                .collect(Collectors.toSet());
        ChatDetailResponseDTO chatDetailResponseDTO = ChatDetailResponseDTO.builder()
                .id(chatId)
                .name(chatRoom.getName())
                .image(chatRoom.getImage())
                .type(ChatTypeConstants.find(chatRoom.getType()).name())
                .members(users)
                .build();
        webSocketService.sendChatGroup(chatDetailResponseDTO);
    }

    public void updateChatRoom(ChatRoom chatRoom, CreateChatGroupRequestDTO requestDTO) {
        String image = requestDTO.file() != null ? uploadService.uploadImage(requestDTO.file()) : null;
        chatRoom.setName(requestDTO.groupName());
        chatRoom.setImage(image);
        chatRoomRepository.save(chatRoom);
    }

    public Set<Long> updateChatMembers(Long chatId, List<Long> userIds) {
        chatMemberRepository.deleteByUserIdNotInAndRoomId(userIds, chatId);
        Set<User> currentUsers = userRepository.findAllByChatRoomId(chatId);
        if (currentUsers.isEmpty()) {
            return new HashSet<>();
        }
        Set<Long> currentIds = currentUsers.stream().map(User::getId).collect(Collectors.toSet());
        Set<Long> newMemberIds = userIds.stream()
                .filter(id -> !currentIds.contains(id))
                .collect(Collectors.toSet());
        Set<ChatMember> newChatMembers = newMemberIds.stream()
                .map(id -> ChatMember.builder()
                        .roomId(chatId)
                        .userId(id)
                        .build())
                .collect(Collectors.toSet());
        chatMemberRepository.saveAll(newChatMembers);
        return newMemberIds;
    }

    public ChatRoom saveChatPrivate(Long currentUserId, CreateChatRequestDTO requestDTO) {
        ChatRoom chat = ChatRoom.builder()
                .type(ChatTypeConstants.PRIVATE.getValue())
                .build();
        chat = chatRoomRepository.save(chat);
        chatMemberService.saveAllChatMembers(chat.getId(), List.of(currentUserId, requestDTO.userId()));
        return chat;
    }

    public ChatResponseDTO convertToChatResponseDTO(ChatProjection projection) {
        return ChatResponseDTO.builder()
                .chatId(projection.getId())
                .lastMessage(projection.getLastMessage())
                .lastMessageDate(projection.getLastMessageDate() != null
                        ? projection.getLastMessageDate().getEpochSecond()
                        : null)
                .name(projection.getName())
                .image(projection.getImage())
                .type(ChatTypeConstants.find(projection.getType()).name())
                .build();
    }

    public ChatRoom findById(Long chatId) {
        return chatRoomRepository.findById(chatId).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy đoạn chat"));
    }

    public void deleteChat(Long chatRoomId) {
        chatRoomRepository.deleteById(chatRoomId);
        chatMemberRepository.deleteAllByRoomId(chatRoomId);
        messageRepository.deleteAllByRoomId(chatRoomId);
    }
}

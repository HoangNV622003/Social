package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.response.UserWithLastMessageDTO;
import vn.datn.social.entity.Chat;
import vn.datn.social.entity.Message;
import vn.datn.social.entity.User;
import vn.datn.social.repository.ChatRepository;
import vn.datn.social.repository.ChatUserRepository;
import vn.datn.social.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatService {

    private ChatRepository chatRepository;

    private UserRepository userRepository;

    private ChatUserRepository chatUserRepository;

    // Fetch the latest message for the given chatId
    public Optional<Message> findLastMessageByChatId(Long chatId) {
        List<Message> messages = chatRepository.findLastMessageByChatId(chatId, PageRequest.of(0, 1));
        return messages.isEmpty() ? Optional.empty() : Optional.of(messages.get(0));
    }

    // Phương thức lấy người dùng và tin nhắn cuối cùng
    public List<UserWithLastMessageDTO> getUsersWithMessages(String username) {
        List<Chat> chats = chatRepository.findByParticipantsUsername(username);
        List<UserWithLastMessageDTO> userWithMessages = new ArrayList<>();

        for (Chat chat : chats) {
            for (User participant : chat.getParticipants()) {
                if (!participant.getUsername().equals(username)) {
                    // Get the last message in the chat
                    Optional<Message> lastMessageOpt = findLastMessageByChatId(chat.getId());
                    if (lastMessageOpt.isPresent()) {
                        Message lastMessage = lastMessageOpt.get();
                        // Create DTO with userId and other information
                        UserWithLastMessageDTO dto = UserWithLastMessageDTO.builder()
                                .username(participant.getUsername())
                                .chatId(chat.getId())
                                .lastMessageContent(lastMessage.getContent())
                                .lastMessageTimestamp(lastMessage.getTimestamp())
                                .build();
                        userWithMessages.add(dto);
                    }
                }
            }
        }
        return userWithMessages;
    }

    public Chat findById(Long chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
    }

    @Transactional
    public void deleteChat(Long chatId) {
        // Xóa tất cả các bản ghi liên kết trong bảng chat_user

        chatUserRepository.deleteByChatId(chatId);

        // Xóa bản ghi trong bảng chat
        chatRepository.deleteById(chatId);
    }
}

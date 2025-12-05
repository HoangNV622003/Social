package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.ChatMemberRequest;
import vn.datn.social.entity.ChatMember;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.ChatMemberRepository;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatMemberService {
    ChatMemberRepository chatMemberRepository;

    public void saveChatMember(ChatMemberRequest request) {
        if (chatMemberRepository.existsByUserIdAndRoomId(request.userId(), request.roomId())) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Người dùng đã ở trong đoạn chat");
        }
        ChatMember chatMember = ChatMember.builder()
                .userId(request.userId())
                .roomId(request.roomId())
                .build();
        chatMemberRepository.save(chatMember);
    }

    public void saveAllChatMembers(Long chatRoomId, List<Long> memberIds) {
        List<ChatMember> chatMembers = memberIds.stream()
                .map(id -> ChatMember.builder()
                        .roomId(chatRoomId)
                        .userId(id)
                        .build())
                .toList();
        chatMemberRepository.saveAll(chatMembers);
    }
}

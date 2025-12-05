package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.CreateChatGroupRequestDTO;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.ChatResponseDTO;
import vn.datn.social.dto.response.projection.ChatSummaryProjection;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.ChatService;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    ChatService chatService;

    @GetMapping
    public ResponseEntity<Page<ChatResponseDTO>> findAll(@PageableDefault Pageable pageable, @CurrentUserId Long currentUserId) {
        return ResponseEntity.ok(chatService.findAll(currentUserId, pageable));
    }

    @PostMapping
    public ResponseEntity<ChatDetailResponseDTO> createChat(
            @CurrentUserId Long currentUserId,
            @RequestBody CreateChatRequestDTO createChatRequestDTO
    ) {
        return ResponseEntity.ok(chatService.openChatPrivate(currentUserId, createChatRequestDTO));
    }

    @PostMapping("/group")
    public ResponseEntity<ChatDetailResponseDTO> createGroupChat(
            @CurrentUserId Long currentUserId, @RequestBody CreateChatGroupRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(chatService.createChatGroup(currentUserId, requestDTO));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ChatDetailResponseDTO> getChat(
            @PathVariable("chatId") Long chatId,
            @PageableDefault Pageable pageable
    ) {
        return ResponseEntity.ok(chatService.getChatDetails(chatId, pageable));
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long chatId) {
        chatService.deleteChat(chatId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ChatSummaryProjection>> search(
            @CurrentUserId Long currentUserId,
            @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(chatService.findChatByName(currentUserId, keyword, pageable));
    }
}

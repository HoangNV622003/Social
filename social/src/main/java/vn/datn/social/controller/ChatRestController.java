package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.response.ChatDetailResponseDTO;
import vn.datn.social.dto.response.ChatResponseDTO;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.ChatService;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatRestController {

    ChatService chatService;

    @GetMapping
    public ResponseEntity<Page<ChatResponseDTO>> findAll(@PageableDefault Pageable pageable, @CurrentUserId Long currentUserId) {
        return ResponseEntity.ok(chatService.findAll(currentUserId, pageable));
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> createChat(@CurrentUserId Long currentUserId, @RequestBody CreateChatRequestDTO createChatRequestDTO) {
        return ResponseEntity.ok(chatService.createChat(currentUserId, createChatRequestDTO));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ChatDetailResponseDTO> getChat(
            @PathVariable("chatId") Long chatId,
            @CurrentUserId Long currentUserId,
            @PageableDefault Pageable pageable
    ) {
        return ResponseEntity.ok(chatService.getChatDetails(chatId, currentUserId, pageable));
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long chatId) {
        chatService.deleteChat(chatId);
        return ResponseEntity.ok().build();
    }
}

package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.response.MessageResponseDTO;
import vn.datn.social.service.MessageService;

@RestController
@RequestMapping("/api/chats/{chatId}/messages")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageController {
    MessageService messageService;

    @GetMapping
    public ResponseEntity<Page<MessageResponseDTO>> findAllByChatId(
            @PathVariable Long chatId,
            @PageableDefault(size = 20, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(messageService.findAllByChatId(chatId, pageable));
    }
}

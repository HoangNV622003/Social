package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.CommentRequestDTO;
import vn.datn.social.dto.response.CommentResponseDTO;
import vn.datn.social.security.IBEUser;
import vn.datn.social.service.CommentService;

@RestController
@RequestMapping("/api/post/{postId}/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<CommentResponseDTO> createComment(@PathVariable Long postId, @ModelAttribute CommentRequestDTO request, @AuthenticationPrincipal IBEUser ibeUser) {
        return ResponseEntity.ok(commentService.createComment(ibeUser,postId, request));
    }

    @GetMapping
    public ResponseEntity<Page<CommentResponseDTO>> findAllByPostId(@PathVariable Long postId, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(commentService.findAllByPostId(postId, pageable));
    }
}

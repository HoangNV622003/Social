package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.datn.social.dto.request.CreateCommentRequestDTO;
import vn.datn.social.entity.Comment;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody CreateCommentRequestDTO request, @CurrentUserId Long userId) {
        return ResponseEntity.ok().body(commentService.saveComment(userId, request));
    }
}

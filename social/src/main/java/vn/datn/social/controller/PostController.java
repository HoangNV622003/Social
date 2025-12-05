package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.PostRequestDTO;
import vn.datn.social.dto.response.PostResponseDTO;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.PostService;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDTO> createPost(
            @ModelAttribute PostRequestDTO postRequestDTO,
            @CurrentUserId Long currentUserId
    ) {
        return ResponseEntity.ok(postService.createPost(postRequestDTO, currentUserId));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
            @RequestParam(value = "userId", required = false) Long userId,
            @PageableDefault Pageable pageable,
            @CurrentUserId Long currentUserId
    ) {
        return ResponseEntity.ok(postService.findAll(userId, currentUserId, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}

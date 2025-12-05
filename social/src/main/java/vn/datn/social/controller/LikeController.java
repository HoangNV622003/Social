package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.datn.social.dto.request.LikeRequestDTO;
import vn.datn.social.entity.Like;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.security.IBEUser;
import vn.datn.social.service.LikeService;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeController {
    LikeService likeService;

    @PostMapping
    public ResponseEntity<Void> toggleLike(@RequestBody LikeRequestDTO likeRequestDTO, @AuthenticationPrincipal IBEUser iBEUser) {
        likeService.toggleLike(likeRequestDTO, iBEUser);
        return ResponseEntity.ok().build();
    }
}

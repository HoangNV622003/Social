package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.FriendRequestDTO;
import vn.datn.social.dto.response.FriendSummaryResponseDTO;
import vn.datn.social.dto.response.FriendUserResponseDTO;
import vn.datn.social.dto.response.projection.FriendUserProjection;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.FriendService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friend")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendController {
    FriendService friendService;

    @GetMapping("/{userId}")
    public ResponseEntity<Page<FriendSummaryResponseDTO>> getFriendships(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PathVariable Long userId,
            @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(friendService.findAll(keyword, userId, pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addFriend(@RequestBody FriendRequestDTO requestDTO, @CurrentUserId Long currentUserId) {
        friendService.createRequest(requestDTO, currentUserId);
        return ResponseEntity.ok().build(); // Return updated status in the response
    }

    @PutMapping("/{userId}/accept")
    public ResponseEntity<Void> acceptFriend(
            @PathVariable Long userId, @CurrentUserId Long currentUserId) {
        friendService.acceptFriend(userId, currentUserId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/cancel")
    public ResponseEntity<Void> cancelFriend(@PathVariable Long userId, @CurrentUserId Long currentUserId) {
        friendService.cancelFriend(userId, currentUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unfriend(@PathVariable Long userId, @CurrentUserId Long currentUserId) {
        friendService.unfriend(userId, currentUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/request/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        friendService.deleteRequest(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/request")
    ResponseEntity<Page<FriendUserResponseDTO>> findAllRequestFriends(@CurrentUserId Long userId, Pageable pageable) {
        return ResponseEntity.ok(friendService.findAllRequestFriends(userId, pageable));
    }
}

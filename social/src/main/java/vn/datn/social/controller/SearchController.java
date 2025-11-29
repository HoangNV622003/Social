package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.datn.social.entity.User;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.FriendService;
import vn.datn.social.service.SearchService;
import vn.datn.social.service.UserService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchController {

    SearchService searchService;
    FriendService friendService;
    UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @CurrentUserId Long userId) {
        User currentUser = userService.findById(userId);
        return ResponseEntity.ok(searchService.findAllUser(keyword, currentUser, PageRequest.of(page, size)));
    }
}

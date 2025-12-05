package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.datn.social.dto.response.PostResponseDTO;
import vn.datn.social.dto.response.SearchResponseDTO;
import vn.datn.social.dto.response.UserSummaryResponseDTO;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.FriendService;
import vn.datn.social.service.SearchService;
import vn.datn.social.service.UserService;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchController {

    SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponseDTO> searchAll(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable,
            @CurrentUserId Long userId) {
        return ResponseEntity.ok(searchService.searchByCriteria(keyword, userId, pageable));
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponseDTO>> searchPosts(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable,
            @CurrentUserId Long userId) {
        return ResponseEntity.ok(searchService.searchPostByCriteria(keyword, userId, pageable));
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserSummaryResponseDTO>> searchUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(searchService.searchUserByCriteria(keyword, pageable));
    }
}

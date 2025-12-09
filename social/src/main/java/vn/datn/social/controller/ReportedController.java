package vn.datn.social.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.constant.NotificationType;
import vn.datn.social.dto.request.ReportPostRequest;
import vn.datn.social.dto.response.ReportPostResponseDTO;
import vn.datn.social.entity.Notification;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.ReportedPost;
import vn.datn.social.entity.User;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.NotificationService;
import vn.datn.social.service.PostService;
import vn.datn.social.service.ReportedPostService;
import vn.datn.social.service.UserService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportedController {

    private final ReportedPostService reportedPostService;
    private final PostService postService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Void> reportPost(@RequestBody ReportPostRequest request) {
        reportedPostService.reportPost(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<ReportPostResponseDTO>> getAllReports(
            @PageableDefault Pageable pageable) {

        return ResponseEntity.ok(reportedPostService.getAllReports(pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportedPostService.deleteReport(id);
        return ResponseEntity.ok().build();
    }
}

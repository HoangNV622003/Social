package vn.datn.social.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.ChangePasswordRequest;
import vn.datn.social.dto.request.CreateUserRequestDTO;
import vn.datn.social.dto.request.Edit_pf_Request;
import vn.datn.social.dto.response.Edit_pf;
import vn.datn.social.entity.User;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.EmailService;
import vn.datn.social.service.UserService;

import java.security.Principal;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    PasswordEncoder passwordEncoder;
    EmailService emailService;

    @GetMapping("/profile")
    public ResponseEntity<Edit_pf> getUserProfile(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(userService.getUser(username));
    }

    // Endpoint để cập nhật thông tin người dùng
    @PutMapping("/profile")
    public ResponseEntity<Void> updateUserProfile(@Valid @RequestBody Edit_pf_Request userProfileRequest, @CurrentUserId Long userId) {
        User user = userService.updateUserProfile(userId, userProfileRequest); // Giả sử bạn có phương thức cập nhật người dùng
        return ResponseEntity.ok().build();
    }

    // Thêm endpoint để thay đổi mật khẩu
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request, @CurrentUserId Long userId) {
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequestDTO user, HttpServletRequest request) {
        return ResponseEntity.ok(userService.createUser(user, request));
    }
}

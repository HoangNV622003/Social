package vn.datn.social.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.ChangePasswordRequest;
import vn.datn.social.dto.request.CreateUserRequestDTO;
import vn.datn.social.dto.request.UpdateDeepUserRequestDTO;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.entity.User;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.UserService;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    PasswordEncoder passwordEncoder;

    // Thêm endpoint để thay đổi mật khẩu
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request, @CurrentUserId Long userId) {
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody CreateUserRequestDTO user, HttpServletRequest request) {
        return ResponseEntity.ok(userService.createUser(user, request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping(value = "/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateUserByAdmin(@ModelAttribute UpdateDeepUserRequestDTO request, @PathVariable Long userId) {
        userService.updateDeepUserByAdmin(userId, request);
        return ResponseEntity.ok().build();
    }
}

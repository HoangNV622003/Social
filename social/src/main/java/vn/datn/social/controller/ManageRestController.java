package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.response.UserManageDto;
import vn.datn.social.entity.User;
import vn.datn.social.service.FriendService;
import vn.datn.social.service.PostService;
import vn.datn.social.service.UserService;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/manage")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManageRestController {

    UserService userService;

    FriendService friendService;

    PostService postService;

    @GetMapping("/user/{username}")
    public ResponseEntity<UserManageDto> getUser(@PathVariable("username") String username, Principal principal) {
        // Kiểm tra người dùng đang đăng nhập
        User currentUser = userService.findByUsername(principal.getName());
        if (currentUser == null || !currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Lấy thông tin người dùng được yêu cầu
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Chuyển đổi User thành UserManageDto
        UserManageDto userManageDto = userService.convertToUserManageDTO(user);

        return new ResponseEntity<>(userManageDto, HttpStatus.OK);
    }

    // Update thông tin người dùng
    @PutMapping("/update/{username}")
    public ResponseEntity<String> updateUser(@PathVariable("username") String username, @RequestBody UserManageDto userDto) {
        try {
            // Lấy thông tin người dùng từ cơ sở dữ liệu
            User existingUser = userService.findByUsername(username);

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Cập nhật thông tin
            existingUser.setUsername(userDto.getUsername());
            existingUser.setEmail(userDto.getEmail());
            existingUser.setEnabled(userDto.getEnabled()); // Lấy giá trị enabled từ DTO
            existingUser.setAdmin(userDto.getIsAdmin());
            existingUser.setVerificationCode(userDto.getVerificationCode());

            // Lưu lại thông tin đã cập nhật
            userService.saveAgaint(existingUser);

            return ResponseEntity.ok("User updated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user: " + e.getMessage());
        }
    }
}

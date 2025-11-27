package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.dto.response.FriendDTO;
import vn.datn.social.dto.response.PostDTO;
import vn.datn.social.dto.response.UserDto;
import vn.datn.social.entity.User;
import vn.datn.social.service.*;
import vn.datn.social.utils.BlobUtil;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.security.Principal;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileRestController {

    UserService userService;

    FriendService friendService;

    PostService postService;

    LikeService likeService;

    CommentService commentService;

    @GetMapping("/main")
    public ResponseEntity<UserDto> getUserMainProfile(Principal principal) {
        // Lấy username từ Principal
        String username = principal.getName();

        // Lấy thông tin người dùng từ database
        User user = userService.findByUsername(username);

        // Chuyển đổi thông tin người dùng sang UserDto
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFriend(false); // Vì đây là profile của chính user, không cần đặt quan hệ friend
        userDto.setFriendPending(false);

        // Chuyển đổi Blob sang Base64 và đặt vào DTO
        if (user.getImage() != null) {
            userDto.setImage(BlobUtil.blobToBase64(user.getImage()));
        } else {
            userDto.setImage(null); // Hoặc một URL hình ảnh mặc định nếu cần
        }

        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping("/fr")
    public ResponseEntity<List<FriendDTO>> getUserFr(Principal principal) {
        String username = principal.getName();

        // Lấy danh sách bạn bè
        List<FriendDTO> friends = friendService.getFriendlists(username);

        return new ResponseEntity<>(friends, HttpStatus.OK);
    }

    @GetMapping("/{username}/friends")
    public ResponseEntity<List<FriendDTO>> getUserFr(@PathVariable String username) {
        // Lấy danh sách bạn bè của người dùng với username tương ứng
        List<FriendDTO> friends = friendService.getFriendlists(username);

        return new ResponseEntity<>(friends, HttpStatus.OK);
    }

    @GetMapping("/{username}/posts")
    public ResponseEntity<List<PostDTO>> getUserPost(
            @PathVariable String username, // Lấy username từ URL
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Tìm kiếm user theo username
        User user = userService.findByUsername(username);

        // Gọi service để lấy danh sách PostDTO (dạng List)
        List<PostDTO> postDTOs = postService.getUserPosts(user.getId(), page, size);

        return new ResponseEntity<>(postDTOs, HttpStatus.OK);
    }

    //get user post by id
    @GetMapping("/post")
    public ResponseEntity<List<PostDTO>> getUserPost(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        // Lấy thông tin user hiện tại từ Principal
        String username = principal.getName();
        User user = userService.findByUsername(username);
        long userId = user.getId();

        // Gọi service để lấy danh sách PostDTO (dạng List)
        List<PostDTO> postDTOs = postService.getUserPosts(userId, page, size);

        return new ResponseEntity<>(postDTOs, HttpStatus.OK);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) {
        try {
            // Lấy username từ Principal
            String username = principal.getName();

            // Tìm user theo username
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Validate file type
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file format. Only images are allowed.");
            }

            // Convert file to Blob and save it
            byte[] bytes = file.getBytes();
            Blob blob = new SerialBlob(bytes);
            user.setImage(blob);

            // Lưu user với avatar mới
            userService.saveAgaint(user);

            return ResponseEntity.ok("Avatar updated successfully");
        } catch (IOException | SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload avatar");
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable("username") String username, Principal principal) {
        // Kiểm tra người dùng đang đăng nhập
        User currentUser = userService.findByUsername(principal.getName());
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Lấy thông tin người dùng được yêu cầu
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Kiểm tra quan hệ bạn bè hoặc yêu cầu kết bạn
        boolean friend = friendService.isFriendAccepted(currentUser, user);
        boolean friendPending = friendService.isFriendPending(currentUser, user);
        boolean friendRequestReceiver = friendService.isCurrentUserFriendRequestReceiver(user, currentUser);

        // Tạo UserDto
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFriend(friend);
        userDto.setFriendPending(friendPending);
        userDto.setFriendRequestReceiver(friendRequestReceiver);

        // Chuyển đổi hình ảnh từ Blob sang Base64
        if (user.getImage() != null) {
            userDto.setImage(BlobUtil.blobToBase64(user.getImage()));
        } else {
            userDto.setImage(null); // Đặt ảnh mặc định nếu không có ảnh
        }

        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }
}
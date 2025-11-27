package vn.datn.social.dto.response;

import jakarta.persistence.Access;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.datn.social.entity.User;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private User user;
    private List<User> friendlists;
    private List<PostDTO> userPosts; // Chuyển sang Page<Post> để giữ toàn bộ thông tin phân trang
    private int currentPage;
    private int totalPages;
}

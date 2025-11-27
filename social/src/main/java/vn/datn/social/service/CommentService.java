package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.CreateCommentRequestDTO;
import vn.datn.social.dto.response.CommentDTO;
import vn.datn.social.entity.Comment;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.CommentRepository;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.utils.BlobUtil;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {

    CommentRepository commentRepository;

    UserRepository userRepository;

    PostRepository postRepository;
    private final UserService userService;
    private final PostService postService;

    public List<Comment> findCommentsByPost(Post post) {
        return commentRepository.findByPost(post);
    }

    // Phương thức lấy danh sách bình luận theo postId với phân trang
    public Page<CommentDTO> getCommentsForPost(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable với số trang và kích thước
        Page<Comment> commentsPage = commentRepository.findByPostId(postId, pageable); // Lấy Page<Comment> với phân trang

        return commentsPage.map(comment -> {
            String username = comment.getUser().getUsername();
            String image = BlobUtil.blobToBase64(comment.getUser().getImage());
            return new CommentDTO(username, comment.getContent(), image); // Ánh xạ Comment thành CommentDTO
        });
    }

    public Comment saveComment(Long userId, CreateCommentRequestDTO request) {
        // Tìm bài post theo ID
        Post post = postService.findById(request.postId());

        // Tìm người dùng theo tên người dùng
        User user = userService.findById(userId);

        // Tạo một bình luận mới
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(request.content());
        // Chuyển LocalDateTime thành Date
        Date createdAt = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        comment.setCreatedAt(createdAt);

        // Lưu bình luận vào cơ sở dữ liệu
        return commentRepository.save(comment);
    }
}

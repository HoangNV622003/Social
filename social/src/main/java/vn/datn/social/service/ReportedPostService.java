package vn.datn.social.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.ReportPostRequest;
import vn.datn.social.dto.response.ReportPostResponseDTO;
import vn.datn.social.dto.response.ReportedPostProjection;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.ReportedPost;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.ReportedPostRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.utils.BlobUtil;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportedPostService {

    private final ReportedPostRepository reportedPostRepository;

    private final PostRepository postRepository;

    private final UserRepository userRepository;

    public void reportPost(Long postId, Long reportedById, String reason) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Post not found"));

        // Tạo đối tượng ReportedPost
        ReportedPost reportedPost = ReportedPost.builder()
                .post(post)
                .reportedBy(reportedById) // Lưu user_id trực tiếp
                .reason(reason)
                .reportedAt(new Date()) // Lấy thời gian hiện tại
                .build();

        // Lưu thông tin báo cáo vào database
        reportedPostRepository.save(reportedPost);
    }

    public Page<ReportPostResponseDTO> getAllReports(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportedPostRepository.findAllWithQuery(pageable).map(this::convertToDTO);
    }

    public void deletePost(Long postId) {
        // Trước khi xóa bài viết, cần xóa các bản ghi liên quan trong bảng reported_post
        List<ReportedPost> reportedPosts = reportedPostRepository.findByPostId(postId);
        if (reportedPosts != null) {
            reportedPostRepository.deleteAll(reportedPosts);  // Xóa tất cả báo cáo liên quan
        }

        // Sau đó, xóa bài viết
        postRepository.deleteById(postId);
    }

    public boolean removeReport(Long reportId) {
        if (reportedPostRepository.existsById(reportId)) {
            reportedPostRepository.deleteById(reportId);
            return true;
        }
        return false;
    }

    private ReportPostResponseDTO convertToDTO(ReportedPostProjection projection) {
        return ReportPostResponseDTO.builder()
                .reportId(projection.getReportId())
                .postId(projection.getPostId())
                .reportedBy(projection.getReportedBy())
                .reason(projection.getReason())
                .postContent(projection.getPostContent())
                .postImage(projection.getPostImage() != null ? BlobUtil.blobToBase64(projection.getPostImage()) : null)
                .build();
    }

    public void deleteByPostId(Long postId) {
        reportedPostRepository.deleteById(postId);
    }

    public List<ReportedPost> findByPostId(Long postId) {
        return reportedPostRepository.findByPostId(postId);
    }
}
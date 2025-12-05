package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.ReportPostRequest;
import vn.datn.social.dto.response.ReportPostResponseDTO;
import vn.datn.social.dto.response.projection.ReportedPostProjection;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.ReportedPost;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.ReportedPostRepository;
import vn.datn.social.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportedPostService {

    private final ReportedPostRepository reportedPostRepository;

    private final PostRepository postRepository;

    private final UserRepository userRepository;

    public void reportPost(ReportPostRequest request) {
        Post post = postRepository.findById(request.getPostId()).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Post not found"));

        ReportedPost reportedPost = ReportedPost.builder()
                .postId(post.getId())
                .reason(request.getReason())
                .build();

        reportedPostRepository.save(reportedPost);
    }

    public Page<ReportPostResponseDTO> getAllReports(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reportedPostRepository.findAllWithQuery(pageable).map(this::convertToDTO);
    }

    public void deleteReport(Long reportId) {
        if (!reportedPostRepository.existsById(reportId)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Reported post not found");
        }
        reportedPostRepository.deleteById(reportId);
    }

    private ReportPostResponseDTO convertToDTO(ReportedPostProjection projection) {
        return ReportPostResponseDTO.builder()
                .reportId(projection.getReportId())
                .postId(projection.getPostId())
                .reportedBy(projection.getReportedBy())
                .reason(projection.getReason())
                .postContent(projection.getPostContent())
                .postImage(projection.getPostImage())
                .build();
    }
}
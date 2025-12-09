package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.ReportPostRequest;
import vn.datn.social.dto.response.ReportPostResponseDTO;
import vn.datn.social.dto.response.projection.ReportedPostProjection;
import vn.datn.social.entity.Image;
import vn.datn.social.entity.Post;
import vn.datn.social.entity.ReportedPost;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.ReportedPostRepository;
import vn.datn.social.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportedPostService {

    private final ReportedPostRepository reportedPostRepository;

    private final PostRepository postRepository;

    private final UserRepository userRepository;
    private final ImageService imageService;

    public void reportPost(ReportPostRequest request) {
        Post post = postRepository.findById(request.getPostId()).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Post not found"));

        ReportedPost reportedPost = ReportedPost.builder()
                .postId(post.getId())
                .reason(request.getReason())
                .build();

        reportedPostRepository.save(reportedPost);
    }

    public Page<ReportPostResponseDTO> getAllReports(Pageable pageable) {
        List<Long> postIds = reportedPostRepository.findAll(pageable).stream()
                .map(ReportedPost::getPostId).toList();
        Map<Long, List<String>> imageMaps = imageService.getImageMapByPostIdIn(postIds);
        return reportedPostRepository.findAllWithQuery(pageable)
                .map(report -> convertToDTO(report, imageMaps));
    }

    public void deleteReport(Long reportId) {
        if (!reportedPostRepository.existsById(reportId)) {
            throw new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Reported post not found");
        }
        reportedPostRepository.deleteById(reportId);
    }

    private ReportPostResponseDTO convertToDTO(ReportedPostProjection projection, Map<Long, List<String>> images) {
        return ReportPostResponseDTO.builder()
                .reportId(projection.getReportId())
                .postId(projection.getPostId())
                .reportedBy(projection.getReportedBy())
                .reason(projection.getReason())
                .postContent(projection.getPostContent())
                .postImages(images.get(projection.getPostId()))
                .build();
    }
}
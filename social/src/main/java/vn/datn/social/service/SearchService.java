package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.Authorities;
import vn.datn.social.dto.response.PostResponseDTO;
import vn.datn.social.dto.response.SearchResponseDTO;
import vn.datn.social.dto.response.UserSummaryResponseDTO;
import vn.datn.social.dto.response.projection.PostProjection;
import vn.datn.social.entity.Image;
import vn.datn.social.entity.User;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;
    private final ImageService imageService;

    public SearchResponseDTO searchByCriteria(String keyword, Long currentUserId, Pageable pageable) {
        List<UserSummaryResponseDTO> users = userRepository.searchByCriterial(keyword, pageable).stream()
                .map(this::toDTO).toList();
        List<PostResponseDTO> postResponseDTOS = searchPostByCriteria(keyword, currentUserId, pageable).getContent();
        return SearchResponseDTO.builder()
                .users(users)
                .posts(postResponseDTOS)
                .build();
    }

    public Page<PostResponseDTO> searchPostByCriteria(String keyword, Long currentUserId, Pageable pageable) {
        Page<PostProjection> projections = postRepository.searchByCriterial(currentUserId, keyword, pageable);
        List<Long> postIds = projections.stream().map(PostProjection::getId).toList();
        Map<Long, List<String>> imageMap = imageService.getImageMapByPostIdIn(postIds);
        return projections.map(projection -> postService.convertToDTO(projection, imageMap));
    }

    public Page<UserSummaryResponseDTO> searchUserByCriteria(String keyword, Pageable pageable) {
        return userRepository.searchByCriterial(keyword, pageable)
                .map(this::toDTO);
    }

    private UserSummaryResponseDTO toDTO(User user) {
        return UserSummaryResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .image(user.getImage())
                .isAdmin(Authorities.ROLE_ADMIN.getId() == user.getRole())
                .build();
    }
}


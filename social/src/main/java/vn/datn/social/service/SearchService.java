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
import vn.datn.social.entity.User;
import vn.datn.social.repository.PostRepository;
import vn.datn.social.repository.UserRepository;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    public SearchResponseDTO searchByCriteria(String keyword, Long currentUserId, Pageable pageable) {
        List<UserSummaryResponseDTO> users = userRepository.searchByCriterial(keyword, pageable).stream()
                .map(this::toDTO).toList();
        List<PostResponseDTO> posts = postRepository.searchByCriterial(currentUserId, keyword, pageable).stream()
                .map(postService::convertToDTO).toList();
        return SearchResponseDTO.builder()
                .users(users)
                .posts(posts)
                .build();
    }

    public Page<PostResponseDTO> searchPostByCriteria(String keyword, Long currentUserId, Pageable pageable) {
        return postRepository.searchByCriterial(currentUserId, keyword, pageable)
                .map(postService::convertToDTO);
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
                .isAdmin(Authorities.ROLE_ADMIN.getId()==user.getRole())
                .build();
    }
}


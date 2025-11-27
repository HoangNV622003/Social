package vn.datn.social.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.response.SearchDTO;
import vn.datn.social.dto.response.UserDto;
import vn.datn.social.entity.User;
import vn.datn.social.repository.SearchRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.utils.BlobUtil;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchRepository searchRepository;
    private final FriendService friendService;
    private final UserRepository userRepository;

    public Page<SearchDTO> findAllUser(String keyword, User currentUser, Pageable pageable) {
        return searchRepository.search(keyword, currentUser.getId(), pageable).map(user -> {
            boolean friend = friendService.isFriendAccepted(currentUser, user);
            boolean friendPending = friendService.isFriendPending(currentUser, user);
            boolean friendRequestReceiver = friendService.isCurrentUserFriendRequestReceiver(user, currentUser);
            return SearchDTO.builder()
                    .username(user.getUsername())
                    .friend(friend)
                    .friendPending(friendPending)
                    .friendRequestReceiver(friendRequestReceiver)
                    .email(user.getEmail())
                    .isAdmin(user.isAdmin())
                    .enabled(user.isEnabled())
                    .build();
        });
    }

    public Page<User> suggestFriends(User currentUser, Pageable pageable) {
        Page<User> suggestedFriends = searchRepository.findFriendsByAddress(currentUser.getAddress(), currentUser, pageable);
        System.out.println("Number of suggested friends: " + suggestedFriends.getTotalElements());
        System.out.println("Content of suggested friends: " + suggestedFriends.getContent());
        return suggestedFriends;
    }
}


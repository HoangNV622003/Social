package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.response.FriendDTO;
import vn.datn.social.entity.FriendShip;
import vn.datn.social.entity.User;
import vn.datn.social.repository.FriendRepository;
import vn.datn.social.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public List<User> getFriends(String username) {
        return friendRepository.findFriendsByUsername(username);
    }

    public List<FriendDTO> getFriendlists(String username) {
        List<User> friends = friendRepository.findFriendsByUsername(username);
        return friends.stream()
                .map(user -> new FriendDTO(user.getId(), user.getUsername(), user.getEmail()))
                .collect(Collectors.toList());
    }

    public void acceptFriend(Long currentUserId, String friendUsername) {
        User user = userService.findByUsername(friendUsername);

    }

    public boolean existsBetweenUsers(User currentUser, User user) {
        return friendRepository.existsByUserAndFriendAndAccepted(currentUser, user, true);
    }

    public FriendShip findByUsers(User sender, User receiver) {
        return friendRepository.findByUserAndFriend(sender, receiver);
    }

    public void save(FriendShip friendShip) {
        friendRepository.save(friendShip);
    }

    // Check if a friend request is pending
    public boolean isFriendPending(User user1, User user2) {
        return friendRepository.existsByUserAndFriendAndAccepted(user1, user2, false)
                || friendRepository.existsByUserAndFriendAndAccepted(user2, user1, false);
    }


    // Check if users are friends (friendship is accepted)
    public boolean isFriendAccepted(User user1, User user2) {
        return friendRepository.existsByUserAndFriendAndAccepted(user1, user2, true)
                || friendRepository.existsByUserAndFriendAndAccepted(user2, user1, true);
    }


    //    public FriendShip findPendingRequest(User sender, User receiver) {
//        return friendShipRepository.findByUserAndFriendAndAcceptedFalse(sender, receiver);
//    }
    public FriendShip findPendingRequest(User sender, User receiver) {
        return friendRepository.findByUserAndFriend(sender, receiver);
    }

    public boolean isCurrentUserFriendRequestReceiver(User sender, User receiver) {
        return friendRepository.existsByUserAndFriendAndAccepted(receiver, sender, false);
    }


}

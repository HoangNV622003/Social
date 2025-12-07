package vn.datn.social.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.*;
import vn.datn.social.dto.request.CreateChatRequestDTO;
import vn.datn.social.dto.request.CreateNotificationRequest;
import vn.datn.social.dto.request.FriendRequestDTO;
import vn.datn.social.dto.response.FriendSummaryResponseDTO;
import vn.datn.social.dto.response.FriendUserResponseDTO;
import vn.datn.social.dto.response.projection.FriendSummaryProjection;
import vn.datn.social.entity.FriendUser;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.FriendRepository;

import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendService {

    FriendRepository friendRepository;
    UserService userService;
    NotificationService notificationService;
    private final ChatService chatService;

    public Page<FriendSummaryResponseDTO> findAll(String keyword, Long userId, Pageable pageable) {
        return friendRepository.searchMyFriends(userId, keyword, pageable)
                .map(this::convertToFriendSummaryResponse);
    }

    public void createRequest(FriendRequestDTO friendRequestDTO, Long currentUserId) {
        User user = userService.findById(friendRequestDTO.userId());
        if (!friendRepository.existsByUserIdAndCreatedByAndStatus(
                user.getId(), currentUserId, (short) FriendStatus.FRIEND.getValue())) {
            FriendUser friendUser = FriendUser.builder()
                    .userId(user.getId())
                    .status((short) FriendStatus.PENDING.getValue())
                    .build();
            friendRepository.save(friendUser);
        }
        User currentUser = userService.findById(currentUserId);
        String content = "Đã gửi cho bạn lời mời kết bạn";
        String deepLink = ClientUrls.USER_DETAIL_URL + currentUserId;
        sendNotification(content, deepLink, friendRequestDTO.userId(), NotificationType.ADD_FRIEND.name());
    }

    public void acceptFriend(Long currentUserId, Long friendId) {
        User user = userService.findById(friendId);
        FriendUser friendUser = friendRepository.findByMyIdAndFriendIdAndStatus(currentUserId, friendId, (short) FriendStatus.PENDING.getValue())
                .orElseThrow(() -> new BusinessException(
                        ApiResponseCode.ENTITY_NOT_FOUND,
                        "Không tìm thấy yêu cầu kết bạn")
                );
        friendUser.setStatus((short) FriendStatus.FRIEND.getValue());
        friendRepository.save(friendUser);
        chatService.openChatPrivate(currentUserId, new CreateChatRequestDTO(friendId));
        String content = " Đã chấp nhận lời mời kết bạn";
        String deepLink = ClientUrls.USER_DETAIL_URL + currentUserId;
        sendNotification(content, deepLink, friendUser.getCreatedBy(), NotificationType.ACCEPT.name());
    }

    public void cancelFriend(Long currentUserId, Long friendId) {
        User user = userService.findById(friendId);
        FriendUser friendUser = friendRepository
                .findByMyIdAndFriendIdAndStatus(currentUserId, friendId, (short) FriendStatus.PENDING.getValue())
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy bạn bè"));
        friendRepository.delete(friendUser);
    }

    public void unfriend(Long currentUserId, Long friendId) {
        User user = userService.findById(friendId);
        friendRepository.deleteByMyIdAndFriendIdAndStatus(
                currentUserId, friendId, (short) FriendStatus.FRIEND.getValue()
        );
    }

    public Page<FriendUserResponseDTO> findAllRequestFriends(Long userId, Pageable pageable) {
        return friendRepository.findAllRequestFriends(userId, pageable)
                .map(projection -> FriendUserResponseDTO.builder()
                        .id(projection.getId())
                        .userId(projection.getUserId())
                        .name(projection.getName())
                        .status(FriendStatus.find(projection.getStatus()).name())
                        .dateCreated(projection.getDateCreated().getEpochSecond())
                        .build());
    }

    public String getRelationShip(Long currentUserId, Long friendId) {
        if (currentUserId.equals(friendId)) return RelationShipStatus.SELF.name();
        FriendUser friendUser = friendRepository.findByMyIdAndFriendId(currentUserId, friendId).orElse(null);
        if (friendUser == null) {
            return RelationShipStatus.STRANGER.name();
        }
        if (friendUser.getStatus() == FriendStatus.FRIEND.getValue()) {
            return RelationShipStatus.FRIEND.name();
        }
        if (friendUser.getStatus() == FriendStatus.PENDING.getValue()) {
            return Objects.equals(friendUser.getUserId(), friendId)
                    ? RelationShipStatus.SENT_REQUEST.name()
                    : RelationShipStatus.RECEIVED_REQUEST.name();
        }
        return null;
    }

    private void sendNotification(String content, String deepLink, Long receiverId, String type) {
        CreateNotificationRequest createNotificationRequest = new CreateNotificationRequest(content, deepLink, receiverId, type);
        notificationService.createNotification(createNotificationRequest);
    }

    private FriendSummaryResponseDTO convertToFriendSummaryResponse(FriendSummaryProjection projection) {
        return FriendSummaryResponseDTO.builder()
                .id(projection.getId())
                .username(projection.getUsername())
                .image(projection.getImage())
                .build();
    }
}

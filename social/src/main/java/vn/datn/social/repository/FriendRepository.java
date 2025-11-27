package vn.datn.social.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.FriendShip;
import vn.datn.social.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<FriendShip, Long> {

    // Lấy danh sách bạn bè theo tên người dùng
//    @Query("SELECT f.friend FROM FriendShip f WHERE f.user.username = :username")
//    List<User> findFriendsByUsername(@Param("username") String username);
    // Truy vấn để lấy danh sách bạn bè theo cả hai chiều
    @Query("SELECT f.friend FROM FriendShip f WHERE f.user.username = :username " +
            "UNION " +
            "SELECT f.user FROM FriendShip f WHERE f.friend.username = :username")
    List<User> findFriendsByUsername(@Param("username") String username);


    // Kiểm tra mối quan hệ bạn bè giữa hai người
    boolean existsByUserAndFriend(User user, User friend);

    boolean existsByUserAndFriendAndAccepted(User user, User friend, boolean accepted);

    // Tìm kiếm mối quan hệ chưa được chấp nhận giữa hai người dùng
    Optional<FriendShip> findByUserAndFriendAndAccepted(User user, User friend, boolean accepted);

    // Lấy mối quan hệ giữa hai người dùng
    FriendShip findByUserAndFriend(User user, User friend);

    @Query("SELECT f FROM FriendShip f " +
            "WHERE (f.user.username = :currentUsername AND f.friend.username = :otherUsername) " +
            "OR (f.user.username = :otherUsername AND f.friend.username = :currentUsername)")
    Optional<FriendShip> findFriendShipBetweenUsers(@Param("currentUsername") String currentUsername,
                                                    @Param("otherUsername") String otherUsername);


}



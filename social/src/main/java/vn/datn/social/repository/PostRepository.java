package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.datn.social.dto.response.PostDTO;
import vn.datn.social.entity.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Query to fetch friends' posts with pagination
//    @Query("SELECT p FROM Post p " +
//            "JOIN p.user u " +
//            "JOIN FriendShip f ON (f.user.id = u.id OR f.friend.id = u.id) " +
//            "JOIN User cu ON (cu.id = f.user.id OR cu.id = f.friend.id) " +
//            "WHERE cu.username = :username " +
//            "AND f.accepted = true " +
//            "AND u.username != :username")
//    Page<Post> findPostsByFriendship(@Param("username") String username, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.id IN " +
            "(SELECT f.friend.id FROM FriendShip f WHERE f.user.id = :userId AND f.accepted = true)")
    Page<Post> findPostsByFriendship(@Param("userId") long userId, Pageable pageable);

    // Phương thức lấy các bài viết theo userId với phân trang
    @Query("SELECT p FROM Post p WHERE p.user.id = ?1 ORDER BY p.createdAt DESC")
    Page<Post> getPostsByUserId(long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.id = ?1 ORDER BY p.createdAt DESC")
    Page<PostDTO> getPostsByUserId2(long userId, Pageable pageable);

    @Query(value = "SELECT YEAR(p.created_at) AS year, MONTH(p.created_at) AS month, " +
            "COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT pl.id) AS like_count " +
            "FROM post p " +
            "LEFT JOIN comment c ON c.post_id = p.id " +
            "LEFT JOIN post_like pl ON pl.post_id = p.id " +
            "GROUP BY YEAR(p.created_at), MONTH(p.created_at) " +
            "ORDER BY year DESC, month DESC", nativeQuery = true)
    List<Object[]> getInteractionStatistics();
}

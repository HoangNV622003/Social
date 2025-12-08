package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import vn.datn.social.dto.response.projection.FriendSummaryProjection;
import vn.datn.social.dto.response.projection.FriendUserProjection;
import vn.datn.social.entity.FriendUser;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<FriendUser, Long> {

    @Query("""
            SELECT
                u.id AS id,
                u.username AS username,
                u.image AS image
            FROM FriendUser f
            JOIN User u
                ON u.id = CASE
                            WHEN f.userId = :myId THEN f.createdBy
                            ELSE f.userId
                          END
            WHERE (f.userId = :myId OR f.createdBy = :myId)
              AND f.status = 2
              AND (
                    :keyword IS NULL OR :keyword = '' OR
                    LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                    LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            """)
    Page<FriendSummaryProjection> searchMyFriends(
            @Param("myId") Long myId,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("""
                SELECT f FROM FriendUser f WHERE
                    ((f.userId=:userId AND f.createdBy=:createdBy) OR
                    (f.userId=:createdBy AND f.createdBy=:userId)) AND
                    f.status = :status
            """)
    Optional<FriendUser> findByMyIdAndFriendIdAndStatus(@Param("userId") Long userId, @Param("createdBy") Long createdBy, @Param("status") Short status);

    @Transactional
    @Modifying
    @Query("""
                DELETE FROM FriendUser f WHERE
                    ((f.userId=:userId AND f.createdBy=:createdBy) OR
                    (f.userId=:createdBy AND f.createdBy=:userId)) AND
                    f.status = :status
            """)
    void deleteByMyIdAndFriendIdAndStatus(@Param("userId") Long userId,
                                          @Param("createdBy") Long createdBy,
                                          @Param("status") Short status);

    @Query("""
                SELECT f FROM FriendUser f WHERE
                    (f.userId=:friendId AND f.createdBy=:currentUserId) OR
                    (f.userId=:currentUserId AND f.createdBy=:friendId)
            """)
    Optional<FriendUser> findByMyIdAndFriendId(@Param("currentUserId") Long currentUserId, @Param("friendId") Long friendId);

    @Query("""
                SELECT
                    f.id AS id,
                    f.createdBy AS userId,
                    u.username AS name,
                    u.image AS image,
                    f.status AS status,
                    f.dateCreated AS dateCreated
                FROM FriendUser f
                LEFT JOIN User u ON f.userId=u.id
                WHERE f.userId=:userId AND f.status=1
            """)
    Page<FriendUserProjection> findAllRequestFriends(@Param("userId")Long userId, Pageable pageable);

    boolean existsByUserIdAndCreatedByAndStatus(Long userId, Long createdBy, Short status);
}



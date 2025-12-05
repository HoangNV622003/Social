package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.dto.response.projection.ChatProjection;
import vn.datn.social.entity.ChatRoom;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query(value = """
    SELECT
        cr.id AS id,
        cr.type AS type,
        m.content AS lastMessage,
        m.date_created AS lastMessageDate,
        -- Tên phòng chat
        CASE
            WHEN cr.type = 1 THEN opponent.username     -- chat 1-1: tên người kia
            WHEN cr.type = 2 THEN cr.name                -- group: tên nhóm
        END AS name,
        -- Ảnh phòng chat
        CASE
            WHEN cr.type = 1 THEN opponent.image         -- chat 1-1: ảnh người kia
            WHEN cr.type = 2 THEN NULL                   -- group: trả về null như yêu cầu
        END AS image
    FROM chat_rooms cr
    JOIN chat_members cm ON cr.id = cm.room_id
    LEFT JOIN messages m ON m.id = cr.last_message_id
    
    -- Lấy đúng 1 người kia trong chat 1-1 (rất quan trọng!)
    LEFT JOIN (
        SELECT cm2.room_id,
               u.username,
               u.image,
               ROW_NUMBER() OVER (PARTITION BY cm2.room_id ORDER BY cm2.id) AS rn
        FROM chat_members cm2
        JOIN user u ON u.id = cm2.user_id
        WHERE cm2.user_id != :currentUserId
    ) opponent ON opponent.room_id = cr.id AND opponent.rn = 1
    
    WHERE cm.user_id = :currentUserId
      AND cr.type IN (1, 2)  -- chỉ lấy private + group
      AND cr.last_message_id IS NOT NULL
    GROUP BY cr.id, cr.type, cr.name, m.content, m.date_created, opponent.username, cr.date_updated, opponent.image
    ORDER BY cr.date_updated DESC
    """,
            countQuery = """
    SELECT COUNT(DISTINCT cr.id)
    FROM chat_rooms cr
    JOIN chat_members cm ON cr.id = cm.room_id
    WHERE cm.user_id = :currentUserId
        AND cr.last_message_id IS NOT NULL
    """,
            nativeQuery = true)
    Page<ChatProjection> findAllByUserId(
            @Param("currentUserId") Long currentUserId,
            Pageable pageable
    );

    @Query(value = """
    SELECT cr.*
    FROM chat_rooms cr
    JOIN chat_members cm1 ON cr.id = cm1.room_id
    JOIN chat_members cm2 ON cr.id = cm2.room_id
    WHERE cr.type = 1
      AND cm1.user_id = :userId1
      AND cm2.user_id = :userId2
    LIMIT 1
    """, nativeQuery = true)
    Optional<ChatRoom> findByTwoUserIds(@Param("userId1") Long userId1,
                                    @Param("userId2") Long userId2);

    @Query(value = """
            
                        SELECT
                cr.id,
                cr.type,
                m.content              AS lastMessage,
                m.date_created         AS lastMessageDate,
            
                CASE
                    WHEN cr.type = 1 THEN opponent.username
                    WHEN cr.type = 2 THEN cr.name
                END                    AS name,
            
                CASE
                    WHEN cr.type = 1 THEN opponent.image
                    WHEN cr.type = 2 THEN NULL
                END                    AS image
            
            FROM chat_rooms cr
            
            JOIN chat_members cm ON cr.id = cm.room_id
            
            LEFT JOIN messages m ON m.id = cr.last_message_id
            
            LEFT JOIN (
                SELECT
                    cm2.room_id,
                    u.username,
                    u.image,
                    ROW_NUMBER() OVER (PARTITION BY cm2.room_id ORDER BY cm2.id) AS rn
                FROM chat_members cm2
                JOIN user u ON u.id = cm2.user_id
                WHERE cm2.user_id != :currentUserId
            ) opponent ON opponent.room_id = cr.id AND opponent.rn = 1
            
            WHERE
                cm.user_id = :currentUserId
                AND cr.type IN (1, 2)
                AND (
                    :search IS NULL                                            -- nếu không search → lấy hết
                    OR :search = ''                                            -- search rỗng → lấy hết
                    OR LOWER(opponent.username) LIKE LOWER(CONCAT('%', :search, '%'))  -- tìm theo tên người kia
                    OR LOWER(cr.name) LIKE LOWER(CONCAT('%', :search, '%'))            -- tìm theo tên nhóm
                )
            
            GROUP BY
                cr.id, cr.type, cr.name, m.content, m.date_created,
                opponent.username, opponent.image, cr.date_updated
            
            ORDER BY cr.date_updated DESC;
            """, nativeQuery = true)
    Page<ChatProjection> searchByName(@Param("keyword")String keyword, @Param(":currentUserId")Long currentUserId, Pageable pageable);
}

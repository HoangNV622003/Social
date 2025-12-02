package vn.datn.social.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.ChatMember;

import java.util.Optional;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember,Long> {
    boolean existsByUserIdAndRoomId(Long userId,Long roomId);

    void deleteAllByRoomId(Long roomId);
}

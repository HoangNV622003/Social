package vn.datn.social.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.ChatMember;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember,Long> {
    boolean existsByUserIdAndRoomId(Long userId,Long roomId);

    List<Long> deleteByUserIdNotInAndRoomId(Collection<Long> userIds, Long roomId);
    void deleteAllByRoomId(Long roomId);

    void deleteAllByUserIdInAndRoomId(Set<Long> toDelete, Long chatId);
}

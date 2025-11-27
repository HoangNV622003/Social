package vn.datn.social.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.datn.social.entity.Like;
import vn.datn.social.repository.LikeRepository;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    public boolean existsByUserIdAndPostId(long userId, Long postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }
    public void save(Like like) {
        likeRepository.save(like);
    }

    public Long countLikesByPostId(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    // LikeService
    public void deleteByUserIdAndPostId(long userId, Long postId) {
        likeRepository.deleteByUserIdAndPostId(userId, postId);
    }

}


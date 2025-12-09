package vn.datn.social.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.datn.social.entity.Image;

import java.util.Collection;
import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image,Long> {

    @Query("""
        SELECT i FROM Image i WHERE i.createdBy=:userId ORDER BY i.dateUpdated DESC
    """)
    Page<Image> findAllByCreatedBy(@Param("userId")Long userId, Pageable pageable);

    List<Image> findAllByPostIdIn(Collection<Long> postIds);

    List<Image> findByPostId(Long postId);
}

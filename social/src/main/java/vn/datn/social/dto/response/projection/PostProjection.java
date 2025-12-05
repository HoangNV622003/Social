package vn.datn.social.dto.response.projection;

import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;

public interface PostProjection {
    Long getId();

    String getContent();

    String getImage();

    Long getAuthorId();

    String getAuthorUsername();

    String getAuthorImage();

    Instant getDateCreated();

    Integer getTotalLike();

    Integer getTotalComment();

    @Value("#{target.liked}")
    boolean isLiked();
}

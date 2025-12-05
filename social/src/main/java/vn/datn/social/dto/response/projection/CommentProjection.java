package vn.datn.social.dto.response.projection;

import java.time.Instant;

public interface CommentProjection {
    Long getId();
    String getContent();
    String getImage();
    Instant getDateCreated();
    Long getUserId();
    String getUsername();
    String getUserImage();
}

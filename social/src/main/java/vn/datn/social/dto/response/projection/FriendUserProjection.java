package vn.datn.social.dto.response.projection;

import java.time.Instant;

public interface FriendUserProjection {
    Long getId();
    Long getUserId();
    String getName();
    String getImage();
    Short getStatus();
    Instant getDateCreated();
}

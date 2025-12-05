package vn.datn.social.dto.response.projection;

import java.time.Instant;

public interface NotificationProjection {
    Long getId();

    String getContent();

    Short getType();

    Short getStatus();

    Long getUserId();

    String getUsername();

    String getUserImage();

    String getDeepLink();

    Instant getDateCreated();
}

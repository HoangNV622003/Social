package vn.datn.social.dto.response;

import java.sql.Blob;

public interface FriendSummaryProjection {
    Long getId();
    String getUsername();
    Blob getImage();
}

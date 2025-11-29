package vn.datn.social.dto.response;

import java.sql.Blob;
import java.time.Instant;

public interface ChatProjection {
    Long getId();
    Long getReceiverId();
    String getReceiverName();
    String getLastMessage();
    Blob getReceiverImage();
    Instant getLastMessageDate();
}

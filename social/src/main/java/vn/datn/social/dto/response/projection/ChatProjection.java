package vn.datn.social.dto.response.projection;

import java.time.Instant;

public interface ChatProjection {
    Long getId();

    Integer getType();           // 1 = private, 2 = group

    String getLastMessage();     // có thể null

    Instant getLastMessageDate();  // có thể null

    String getName();            // private → tên người kia, group → cr.name

    String getImage();           // private → ảnh người kia, group → null
}

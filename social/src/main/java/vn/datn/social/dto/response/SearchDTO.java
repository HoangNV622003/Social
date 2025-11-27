package vn.datn.social.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchDTO {
    private String username;
    private String email;
    private boolean friend; // Đã là bạn
    private boolean friendPending; // Đang chờ kết bạn
    private boolean friendRequestReceiver; // Là người nhận lời mời kết bạn
    private boolean enabled;
    private boolean isAdmin;
}

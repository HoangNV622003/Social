package vn.datn.social.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String username;
    private String email;
    private boolean isFriend;
    private boolean isFriendPending;
    private String image;
    private boolean friendRequestReceiver;
}

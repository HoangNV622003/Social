package vn.datn.social.event;

import lombok.Getter;
import lombok.Setter;
import vn.datn.social.entity.User;

@Getter
@Setter
public class FriendRequestEvent {
    private final User sender;
    private final User receiver;

    public FriendRequestEvent(User sender, User receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }
}

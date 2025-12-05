package vn.datn.social.constant;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;

@Getter
public enum FriendStatus {
    PENDING(1), FRIEND(2),;

    private final int value;

    FriendStatus(int value) {
        this.value = value;
    }

    public static FriendStatus find(int value) {
        return Arrays.stream(FriendStatus.values())
                .filter(x -> x.value == value)
                .findFirst()
                .orElse(null);
    }

    public static FriendStatus find(String name) {
        if (StringUtils.isBlank(name)) return null;
        return Arrays.stream(FriendStatus.values())
                .filter(x -> x.name().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }
}

package vn.datn.social.constant;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;
@Getter
public enum NotificationStatus {
    READ(1), UNREAD(-1)
    ;
    private final int value;

    NotificationStatus(int value) {
        this.value = value;
    }

    static final Map<Integer, NotificationStatus> LOOKUP_VALUE ;
    static final Map<String, NotificationStatus> LOOKUP_NAME ;
    static {
        LOOKUP_VALUE = new HashMap<>();
        LOOKUP_NAME = new HashMap<>();
        for (NotificationStatus notificationStatus : NotificationStatus.values()) {
            LOOKUP_VALUE.put(notificationStatus.getValue(), notificationStatus);
            LOOKUP_NAME.put(notificationStatus.name(), notificationStatus);
        }
    }

    public static NotificationStatus find(int value) {
        return LOOKUP_VALUE.get(value);
    }
    public static NotificationStatus find(String name) {
        return LOOKUP_NAME.get(StringUtils.upperCase(name));
    }
}

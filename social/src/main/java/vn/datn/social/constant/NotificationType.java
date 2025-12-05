package vn.datn.social.constant;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum NotificationType {
    ADD_FRIEND(1),LIKE(2), ACCEPT(3),COMMENT(4);

    private final int value;

    NotificationType(int value) {
        this.value = value;
    }
    static final Map<Integer,NotificationType> LOOKUP_VALUE;
    static final Map<String,NotificationType> LOOKUP_NAME;
    static {
        LOOKUP_VALUE = new HashMap<>();
        LOOKUP_NAME = new HashMap<>();
        for (NotificationType notificationType : NotificationType.values()) {
            LOOKUP_VALUE.put(notificationType.getValue(), notificationType);
            LOOKUP_NAME.put(notificationType.name(), notificationType);
        }
    }

    public static NotificationType find(int value) {
        return LOOKUP_VALUE.get(value);
    }
    public static NotificationType find(String name) {
        return LOOKUP_NAME.get(StringUtils.upperCase(name));
    }

}

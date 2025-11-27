package vn.datn.social.constant;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum CommonStatus {
    ACTIVE(1), INACTIVE(-1), DELETE(-3);
    private final int value;

    CommonStatus(int value) {
        this.value = value;
    }

    static final Map<String, CommonStatus> LOOKUP_NAME;
    static final Map<Integer, CommonStatus> LOOKUP_VALUE;

    static {
        LOOKUP_NAME = new HashMap<>();
        LOOKUP_VALUE = new HashMap<>();
        for (CommonStatus status : CommonStatus.values()) {
            LOOKUP_NAME.put(status.name(), status);
            LOOKUP_VALUE.put(status.value, status);
        }
    }

    public CommonStatus find(int value) {
        return LOOKUP_VALUE.get(value);
    }

    public CommonStatus find(String name) {
        return LOOKUP_NAME.get(name);
    }

}

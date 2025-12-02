package vn.datn.social.constant;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;

@Getter
public enum ChatTypeConstants {
    PRIVATE(1), GROUP(2);

    private final int value;

    ChatTypeConstants(int value) {
        this.value = value;
    }

    public static ChatTypeConstants find(int value) {
        return Arrays.stream(ChatTypeConstants.values())
                .filter(x -> x.value == value)
                .findFirst()
                .orElse(null);
    }

    public static ChatTypeConstants find(String name) {
        if (StringUtils.isBlank(name)) return null;
        return Arrays.stream(ChatTypeConstants.values())
                .filter(x -> x.name().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }
}

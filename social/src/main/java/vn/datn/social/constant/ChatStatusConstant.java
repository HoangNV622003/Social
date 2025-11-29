package vn.datn.social.constant;

import lombok.Getter;

@Getter
public enum ChatStatusConstant {
    LEAVE(1)
    ;

    private final int value;

    ChatStatusConstant(int value) {
        this.value = value;
    }
}

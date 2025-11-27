package vn.datn.social.constant;

import lombok.Getter;

@Getter
public enum TokenType {
    ACCESS("access"), REFRESH("refresh");
    ;
    final String id;
    TokenType(String value) {
        this.id = value;
    }
}

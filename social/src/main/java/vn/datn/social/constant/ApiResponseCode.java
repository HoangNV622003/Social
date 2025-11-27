package vn.datn.social.constant;

import lombok.Getter;
import vn.datn.social.dto.response.IApiResponse;


@Getter
public enum ApiResponseCode implements IApiResponse {
    BAD_REQUEST("400", "BAD_REQUEST"),
    RESOURCE_NOT_FOUND("404", "RESOURCE_NOT_FOUND"),
    INTERNAL_SERVER_ERROR("500", "INTERNAL_SERVER_ERROR"),
    ENTITY_NOT_FOUND("400", "ENTITY_NOT_FOUND"),
    UNAUTHORIZED("401", "Unauthorized"),
    FORBIDDEN("403", "Forbidden"),
    METHOD_NOT_ALLOWED("405", "Method Not Allowed"),
    SUCCESS("200", "SUCCESS");
    private final String code;
    private final String error;

    ApiResponseCode(String code, String error) {
        this.code = code;
        this.error = error;
    }
}

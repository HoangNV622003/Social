package vn.datn.social.exception;

import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.response.IApiResponse;

public class UnauthenticatedException extends BaseException {
    public UnauthenticatedException() {
        super(ApiResponseCode.UNAUTHORIZED.getCode(), ApiResponseCode.UNAUTHORIZED.getError());
    }

    public UnauthenticatedException(String code, String message) {
        super(code, message);
    }

    public UnauthenticatedException(String code, String message, String messageDescription) {
        super(code, message, messageDescription);
    }

    public UnauthenticatedException(IApiResponse iApiResponse) {
        super(iApiResponse);
    }
}

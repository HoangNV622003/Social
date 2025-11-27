package vn.datn.social.exception;

import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.response.IApiResponse;

public class InternalException extends BaseException {
    public InternalException() {
        super(ApiResponseCode.INTERNAL_SERVER_ERROR.getCode(), ApiResponseCode.INTERNAL_SERVER_ERROR.getError());
    }

    public InternalException(String code, String message) {
        super(code, message);
    }

    public InternalException(String code, String message, String messageDescription) {
        super(code, message, messageDescription);
    }

    public InternalException(IApiResponse iApiResponse) {
        super(iApiResponse);
    }
}

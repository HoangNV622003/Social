package vn.datn.social.exception;
import lombok.Getter;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.response.IApiResponse;

import java.util.List;

@Getter
public class BusinessException extends BaseException {
    List<String> params = null;

    public BusinessException() {
    }

    public BusinessException(ApiResponseCode apiResponseCode, String messageDescription) {
        super(apiResponseCode.getCode(), apiResponseCode.getError(), messageDescription);
    }

    public BusinessException(String code, String message) {
        super(code, message);
    }

    public BusinessException(String code, String message, String messageDescription) {
        super(code, message, messageDescription);
    }

    public BusinessException(IApiResponse apiResponse) {
        super(apiResponse);
    }

    public BusinessException(IApiResponse apiResponse, List<String> params) {
        super(apiResponse);
        this.params = params;
    }

    public BusinessException(IApiResponse apiResponse, String errorDescription) {
        super(apiResponse);
        this.messageDescription = errorDescription;
    }

}

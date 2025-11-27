package vn.datn.social.security;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import vn.datn.social.dto.response.IApiResponse;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {
    String code;
    String error;
    String errorDescription;
    Object data;

    public ApiErrorResponse() {
    }


    public ApiErrorResponse(String code, String error, String errorDescription) {
        this.errorDescription = errorDescription;
        this.code = code;
        this.error = error;
    }

    public ApiErrorResponse(String code, String error) {
        this.code = code;
        this.error = error;
    }

    public ApiErrorResponse(String code, String error, String errorDescription, Object data) {
        this.code = code;
        this.error = error;
        this.errorDescription = errorDescription;
        this.data = data;
    }

    public ApiErrorResponse(IApiResponse apiResponse) {
        this.code = apiResponse.getCode();
        this.error = apiResponse.getError();
    }
}

package vn.datn.social.exception.handler;
import vn.datn.social.constant.ApiResponseCode;

import vn.datn.social.exception.BusinessException;
import vn.datn.social.exception.InternalException;
import vn.datn.social.security.ApiErrorResponse;
import vn.datn.social.utils.CommonUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.net.BindException;
import java.nio.file.AccessDeniedException;
import java.util.stream.Collectors;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler extends Throwable{
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final MessageSource messageSource;

    // 404 không tìm thấy endpoint
    @ResponseBody
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
    public ApiErrorResponse handleNotFoundException(Exception ex) {
        log.error("handleNotFoundException {}", ExceptionUtils.getStackTrace(ex));
        return new ApiErrorResponse(ApiResponseCode.RESOURCE_NOT_FOUND);
    }

    //400 dữ liệu không hợp lệ
    /*
    MethodArgumentNotValidException: Xử lý lỗi validation cho DTO trong @RequestBody (REST API).
    BindException: Xử lý lỗi validation cho form hoặc query params trên url
    ConstraintViolationException: được ném khi validation thất bại trên các tham số phương thức hoặc giá trị trả về được đánh dấu bởi @Validated và các annotation như @NotNull, @Size, v.v.
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class, ConstraintViolationException.class})
    public ApiErrorResponse handleValidationException(Exception e) {
        log.error("handleValidationException {}", ExceptionUtils.getStackTrace(e));
        String message = null;
        if (e instanceof MethodArgumentNotValidException ex) {
            message = ex.getBindingResult().getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining("; "));
        } else if (e instanceof ConstraintViolationException ex) {
            message = ex.getConstraintViolations().iterator().next().getMessage();
        } else {
            message = e.getMessage();
        }
        return new ApiErrorResponse(ApiResponseCode.BAD_REQUEST.getCode(), ApiResponseCode.BAD_REQUEST.getError(), message);
    }

    //405 gửi sai phương thức HTTP
    @ResponseBody
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ApiErrorResponse handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        log.error("handleHttpRequestMethodNotSupportedException {}", ExceptionUtils.getStackTrace(ex));
        return new ApiErrorResponse(ApiResponseCode.METHOD_NOT_ALLOWED);
    }

    //401 Sai thông tin đăng nhập hoặc chưa xác thực
    @ResponseBody
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler({BadCredentialsException.class, InsufficientAuthenticationException.class})
    public ApiErrorResponse handleBadCredentialsException(Exception ex) {
        log.error("handleBadCredentialsException {}", ExceptionUtils.getStackTrace(ex));
        return new ApiErrorResponse(ApiResponseCode.UNAUTHORIZED.getCode(),
                ApiResponseCode.UNAUTHORIZED.getError(), "Phiên đăng nhập đã hết hạn");
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(AccessDeniedException.class)
    public ApiErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        log.error("handleAccessDeniedException {}", ExceptionUtils.getStackTrace(ex));
        return new ApiErrorResponse(ApiResponseCode.FORBIDDEN.getCode(),
                ApiResponseCode.FORBIDDEN.getError(), "Bạn không có quyền truy cập tài nguyên này");
    }

    /**
     * BusinessException – Lỗi nghiệp vụ do dev định nghĩa
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.error("handleBusinessException(): {}", ExceptionUtils.getStackTrace(ex));
        String desc = CommonUtils.getMessage(messageSource, request, ex.getMessage(),
                ex.getParams() != null ? ex.getParams().toArray() : new Object[]{});
        log.error("handleBusinessException {}", desc);
        return ResponseEntity.status(Integer.parseInt(ex.getCode()))
                .body(new ApiErrorResponse(ex.getCode(), ex.getMessage(), ex.getMessageDescription()));
    }

    /**
     * InternalException – Lỗi nội bộ hệ thống
     */
    @ExceptionHandler(InternalException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ApiErrorResponse handleInternalException(InternalException ex, HttpServletRequest request) {
        log.error("handleInternalException(): {}", ExceptionUtils.getStackTrace(ex));
        String desc = ex.getMessageDescription() != null ? ex.getMessageDescription()
                : CommonUtils.getMessage(messageSource, request, ex.getMessage());
        return new ApiErrorResponse(ex.getCode(), ex.getMessage(), desc);
    }

    /**
     * 400 – JSON sai định dạng
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ApiErrorResponse handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.error("handleHttpMessageNotReadable(): {}", ExceptionUtils.getStackTrace(ex));
        return new ApiErrorResponse(ApiResponseCode.BAD_REQUEST.getCode(),
                ApiResponseCode.BAD_REQUEST.getError(), "Dữ liệu JSON không hợp lệ");
    }

    /**
     * 500 – Các lỗi runtime không xác định
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ApiErrorResponse handleRuntimeException(RuntimeException e) {
        log.error("handleRuntimeException(): {}", ExceptionUtils.getStackTrace(e));
        return new ApiErrorResponse(ApiResponseCode.INTERNAL_SERVER_ERROR);
    }

    /**
     * 500 – Các lỗi tổng quát khác
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ApiErrorResponse handleException(Exception e) {
        log.error("handleException(): {}", ExceptionUtils.getStackTrace(e));
        return new ApiErrorResponse(ApiResponseCode.INTERNAL_SERVER_ERROR);
    }
}

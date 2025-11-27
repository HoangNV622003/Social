package vn.datn.social.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class HttpResponseUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static void writeHttpResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("message", message);
        body.put("error", status.getReasonPhrase());
        objectMapper.writeValue(response.getWriter(), body);
    }
}

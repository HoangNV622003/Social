package vn.datn.social.utils;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.MessageSource;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.LocaleResolver;

import java.util.Locale;

public class CommonUtils {
    //dùng để xác định ngôn ngữ hoặc khu vực cho 1 yêu cầu HTTP
    public static Locale getLocaleResolver(HttpServletRequest request) {
        try {
            Locale locale;
            String lang = request.getHeader("lang"); //Header lang thường được client gửi để chỉ định ngôn ngữ mong muốn (ví dụ: en cho tiếng Anh, vi cho tiếng Việt).
            if (StringUtils.isNotEmpty(lang)) {
                locale = new Locale(lang);
            } else {
                LocaleResolver localeResolver = (LocaleResolver) request.getAttribute(DispatcherServlet.LOCALE_RESOLVER_ATTRIBUTE);
                locale = localeResolver.resolveLocale(request);
            }
            return locale;
        } catch (Exception e) {
            return Locale.forLanguageTag("vi");
        }
    }

    public static String getMessage(MessageSource messageSource, HttpServletRequest request, String key, Object[] params) {
        try {
            Locale locale = CommonUtils.getLocaleResolver(request);
            return messageSource.getMessage(key, params, locale);
        } catch (Exception e) {
            return null;
        }
    }

    public static String getMessage(MessageSource messageSource, HttpServletRequest request, String key) {
        try {
            final Locale locale = CommonUtils.getLocaleResolver(request);
            return messageSource.getMessage(key, null, locale);
        } catch (Exception e) {
            return null;
        }
    }

    public static final String[] IP_HEADER_CANDIDATES = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
    };
}

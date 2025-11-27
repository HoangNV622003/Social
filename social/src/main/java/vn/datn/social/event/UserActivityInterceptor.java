package vn.datn.social.event;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import vn.datn.social.entity.User;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.service.UserService;

import java.security.Principal;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserActivityInterceptor implements HandlerInterceptor {

    private UserRepository userRepository;

    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Principal principal = request.getUserPrincipal();
        if (principal != null) {
            User user = userService.findByUsername(principal.getName());
            if (user != null && !user.isOnline()) {
                user.setOnline(true);
                userRepository.save(user);
            }
        }
        return true;
    }
}


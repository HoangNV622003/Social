package vn.datn.social.security;

import vn.datn.social.constant.ConstantsAll;
import vn.datn.social.utils.SecurityUtils;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;
@Component
public class SpringSecurityAuditorAware implements AuditorAware<Long> {
    @Override
    public Optional<Long> getCurrentAuditor() {
        return Optional.of(SecurityUtils.getCurrentUserIdLogin().orElse(ConstantsAll.SYSTEM_ID));
    }
}

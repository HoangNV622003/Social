package vn.datn.social.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.io.Serializable;
import java.util.Collection;

public class IBEUser extends User implements Serializable {
        @Getter
        private final long id;
        @Setter
        private RequesterInfo requesterInfo = new RequesterInfo();

        public IBEUser(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
            super(username, password, authorities);
            this.id = id;
        }

        public String getUserRefCode() {
            return requesterInfo == null ? null : requesterInfo.getRequesterCode();
        }

        public boolean setUserRefCode(String userRefCode) {
            requesterInfo = (requesterInfo == null) ? new RequesterInfo() : requesterInfo;
            return true;
        }

    }



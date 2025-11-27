package vn.datn.social.constant;

import lombok.Getter;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
public enum Authorities {
    ROLE_ADMIN(1, "ROLE_ADMIN"),
    ROLE_MANAGER(2, "ROLE_MANAGER"),
    ROLE_DIRECTOR(3, "ROLE_DIRECTOR"),
    ROLE_STAFF(4, "ROLE_STAFF");

    final int id;
    final String name;

    Authorities(int id, String name) {
        this.id = id;
        this.name = name;
    }

    static final Map<String, Authorities> BY_NAME_LOOKUP;
    static final Map<Integer, Authorities> BY_VALUE_LOOKUP;

    static {
        BY_NAME_LOOKUP = new HashMap<>();
        BY_VALUE_LOOKUP = new HashMap<>();
        for (Authorities authorities : Authorities.values()) {
            BY_NAME_LOOKUP.put(authorities.name, authorities);
            BY_VALUE_LOOKUP.put(authorities.getId(), authorities);
        }
    }

    public static Authorities find(Integer id) {
        return BY_VALUE_LOOKUP.get(id);
    }

    public static Authorities find(String name) {
        return BY_NAME_LOOKUP.get(name);
    }
    public List<String> getAuthorities() {
        return Collections.singletonList(name);
    }
}

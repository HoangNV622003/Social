package vn.datn.social.security;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class RequesterInfo implements Serializable {
    private String requesterCode;
    private String requesterName;
    private long expirationInMilis=0;

    @JsonCreator
    public RequesterInfo(){}
}

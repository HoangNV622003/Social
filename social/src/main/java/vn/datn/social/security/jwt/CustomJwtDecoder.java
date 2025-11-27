package vn.datn.social.security.jwt;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import tech.jhipster.config.JHipsterProperties;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class CustomJwtDecoder implements JwtDecoder {
    private final String secretKey;
    private final TokenProvider tokenProvider;

    public CustomJwtDecoder(JHipsterProperties jHipsterProperties, TokenProvider tokenProvider) {
        secretKey = jHipsterProperties.getSecurity().getAuthentication().getJwt().getBase64Secret();
        this.tokenProvider = tokenProvider;
    }

    @PostConstruct
    public void init() {
        if (StringUtils.isBlank(secretKey)) {
            throw new JwtException("secretKey is empty");
        }
        byte[] secretKeyBytes = Base64.decodeBase64(secretKey);
        if (secretKeyBytes.length < 32) {
            throw new IllegalArgumentException("Secret key must be at least 32 bytes for HS512 after base64 decode");
        }
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKeyBytes, "HmacSHA512");
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Override
    public Jwt decode(String token) throws JwtException { // giải mã token và trả về jwt để xác thực và phân quyền
        if (StringUtils.isBlank(token)) {
            throw new JwtException("token is empty");
        }
        try {
            tokenProvider.validateAccessToken(token); // Kiểm tra chữ ký, hết hạn, và token vô hiệu hóa
            SignedJWT signedJWT = SignedJWT.parse(token);

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Map<String, Object> headers = new HashMap<>();
            headers.put("typ", "JWT");
            headers.put("alg", signedJWT.getHeader().getAlgorithm().getName());

            return new Jwt(
                    token,
                    claimsSet.getIssueTime().toInstant(),
                    claimsSet.getExpirationTime().toInstant(),
                    headers,
                    claimsSet.getClaims()
            );
        } catch (JwtException e) {
            log.error("Failed to decode JWT token: {}", e.getMessage());
            throw e;
        } catch (ParseException e) {
            log.error("Failed to parse JWT: {}", e.getMessage());
            throw new JwtException("Invalid token: " + e.getMessage());
        }
    }
}
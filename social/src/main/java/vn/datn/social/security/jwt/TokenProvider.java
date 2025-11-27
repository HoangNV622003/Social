package vn.datn.social.security.jwt;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.micrometer.common.util.StringUtils;
import lombok.Getter;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import tech.jhipster.config.JHipsterProperties;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.TokenType;
import vn.datn.social.dto.response.TokenPairResponseDTO;
import vn.datn.social.entity.InvalidatedToken;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.exception.UnauthenticatedException;
import vn.datn.social.repository.InvalidatedTokenRepository;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.AuthenticationToken;
import vn.datn.social.security.IBEUser;

import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Component
public class TokenProvider {

    private static final Logger log = LoggerFactory.getLogger(TokenProvider.class);
    private static final String AUTHORITIES_KEY = "auth";
    private static final String EMAIL_KEY = "email";
    private static final String TOKEN_TYPE = "type";
    private static final String USERNAME_KEY = "username";

    private final long accessTokenValidity;
    private final long refreshTokenValidity;
    private final MACVerifier verifier;
    private final MACSigner signer;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final UserRepository userRepository;

    public TokenProvider(JHipsterProperties jHipsterProperties,
                         InvalidatedTokenRepository invalidatedTokenRepository,
                         UserRepository userRepository) {
        this.accessTokenValidity = 1000L * jHipsterProperties.getSecurity()
                .getAuthentication().getJwt().getTokenValidityInSeconds();
        this.refreshTokenValidity = 1000L * jHipsterProperties.getSecurity()
                .getAuthentication().getJwt().getTokenValidityInSecondsForRememberMe();
        this.invalidatedTokenRepository = invalidatedTokenRepository;
        this.userRepository = userRepository;

        byte[] secretKey = Base64.decodeBase64(jHipsterProperties.getSecurity()
                .getAuthentication().getJwt().getBase64Secret());
        if (secretKey.length < 32) {
            throw new IllegalArgumentException("Secret key must be at least 32 bytes");
        }
        try {
            this.verifier = new MACVerifier(secretKey);
            this.signer = new MACSigner(secretKey);
        } catch (JOSEException e) {
            throw new RuntimeException("Failed to initialize JWT signer/verifier", e);
        }
    }

    public TokenPairResponseDTO createTokenPair(User user) {
        String accessToken = createAccessToken(user);
        String refreshToken = createRefreshToken(user);
        return new TokenPairResponseDTO(accessToken, refreshToken);
    }

    public void logout(String accessToken, String refreshToken) throws ParseException {
        if(StringUtils.isNotBlank(accessToken)){
            SignedJWT accessJwt=parseAndVerify(accessToken);
            validateAccessTokenForLogout(accessJwt);
            invalidateToken(accessJwt);
        }
        if(StringUtils.isNotBlank(refreshToken)){
            SignedJWT refreshJwt=parseAndVerify(refreshToken);
            validateRefreshTokenForLogout(refreshJwt);
            invalidateToken(refreshJwt);
        }
    }

    // ≤ 20 dòng
    private void validateAccessTokenForLogout(SignedJWT jwt) throws ParseException {
        String type = getClaim(jwt, TOKEN_TYPE);
        if (!TokenType.ACCESS.getId().equals(type)) {
            throw new JwtException("Not an access token");
        }
    }

    // ≤ 20 dòng
    private void validateRefreshTokenForLogout(SignedJWT jwt) throws ParseException {
        String type = getClaim(jwt, TOKEN_TYPE);
        if (!TokenType.REFRESH.getId().equals(type)) {
            throw new JwtException("Not a refresh token");
        }
    }
    private String createAccessToken(User user) {
        return buildToken(user, accessTokenValidity, TokenType.ACCESS.getId());
    }

    private String createRefreshToken(User user) {
        return buildToken(user, refreshTokenValidity, TokenType.REFRESH.getId());
    }

    private String buildToken(User user, long validity, String type) {
        Date now = new Date();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getId()))
                .issueTime(now)
                .expirationTime(new Date(now.getTime() + validity))
                .jwtID(UUID.randomUUID().toString())
                .claim(EMAIL_KEY, user.getEmail())
                .claim(USERNAME_KEY, user.getUsername())
                .claim(TOKEN_TYPE, type)
                .build();

        JWSObject jws = new JWSObject(new JWSHeader(JWSAlgorithm.HS512), new Payload(claims.toJSONObject()));
        try {
            jws.sign(signer);
            return jws.serialize();
        } catch (JOSEException e) {
            log.error("Sign token failed", e);
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Cannot create token");
        }
    }

    public TokenPairResponseDTO refreshAccessToken(String refreshToken) throws ParseException {
        SignedJWT jwt = parseAndVerify(refreshToken);
        validateRefreshToken(jwt);
        Long userId = Long.valueOf(jwt.getJWTClaimsSet().getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found"));
        invalidateToken(jwt);
        return createTokenPair(user);
    }

    private void validateRefreshToken(SignedJWT jwt) throws ParseException {
        String type = getClaim(jwt, TOKEN_TYPE);
        if (!TokenType.REFRESH.getId().equals(type)) {
            throw new JwtException("Invalid token type");
        }
        if (isTokenInvalidated(jwt)) {
            throw new JwtException("Refresh token revoked");
        }
        if (isExpired(jwt)) {
            throw new JwtException("Refresh token expired");
        }
    }

    public void validateAccessToken(String token) throws ParseException {
        SignedJWT jwt = parseAndVerify(token);
        String type = getClaim(jwt, TOKEN_TYPE);
        if (!TokenType.ACCESS.getId().equals(type)) {
            throw new JwtException("Not an access token");
        }
        if (isTokenInvalidated(jwt) || isExpired(jwt)) {
            throw new JwtException("Token invalid or expired");
        }
    }

    private SignedJWT parseAndVerify(String token) {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            if (!jwt.verify(verifier)) {
                throw new JwtException("Invalid signature");
            }
            return jwt;
        } catch (ParseException | JOSEException e) {
            throw new JwtException("Invalid JWT format");
        }
    }

    private boolean isExpired(SignedJWT jwt) throws ParseException {
        Date exp = jwt.getJWTClaimsSet().getExpirationTime();
        return exp != null && exp.before(new Date());
    }

    private boolean isTokenInvalidated(SignedJWT jwt) throws ParseException {
        String jti = jwt.getJWTClaimsSet().getJWTID();
        return invalidatedTokenRepository.existsById(jti);
    }

    private void invalidateToken(SignedJWT jwt) throws ParseException {
        String jti = jwt.getJWTClaimsSet().getJWTID();
        Date exp = jwt.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken token = InvalidatedToken.builder()
                .id(jti)
                .expiryTime(exp.toInstant())
                .build();
        invalidatedTokenRepository.save(token);
    }

    private String getClaim(SignedJWT jwt, String key) throws ParseException {
        Object claim = jwt.getJWTClaimsSet().getClaim(key);
        return claim != null ? claim.toString() : null;
    }

    public Authentication getAuthentication(Jwt jwtToken) {
        try {
            SignedJWT jwt = SignedJWT.parse(jwtToken.getTokenValue());
            String authStr = getClaim(jwt, AUTHORITIES_KEY);
            Collection<GrantedAuthority> authorities = parseAuthorities(authStr);
            Long userId = Long.valueOf(jwt.getJWTClaimsSet().getSubject());
            String username = getClaim(jwt, USERNAME_KEY);

            IBEUser principal = new IBEUser(userId, username, "", authorities);
            AuthenticationToken auth = new AuthenticationToken(principal, "", authorities, jwtToken.getTokenValue());
            auth.setDetails("pre_auth");
            auth.setUserId(userId);
            auth.setRoles(authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            return auth;
        } catch (Exception e) {
            log.info("Invalid JWT: {}", e.getMessage());
            throw new UnauthenticatedException(ApiResponseCode.UNAUTHORIZED.getCode(), "Invalid token");
        }
    }

    private Collection<GrantedAuthority> parseAuthorities(String authStr) {
        if (StringUtils.isBlank(authStr)) return new ArrayList<>();
        return Arrays.stream(authStr.split(","))
                .filter(s -> !s.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }
}
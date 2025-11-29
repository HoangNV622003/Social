package vn.datn.social.security.jwt;

import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private static final Logger logger = LoggerFactory.getLogger(CustomJwtAuthenticationConverter.class);
    private final TokenProvider tokenProvider;
    public CustomJwtAuthenticationConverter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    @Override
    public AbstractAuthenticationToken convert(@Nonnull Jwt jwt) {
        try{
            Authentication authentication = tokenProvider.getAuthentication(jwt.getTokenValue());
            if(!(authentication instanceof AbstractAuthenticationToken)){
                logger.error("Authentication is not of type AbstractAuthenticationToken");
                throw new IllegalArgumentException("Authentication is not of type AbstractAuthenticationToken");
            }
            return (AbstractAuthenticationToken) authentication;
        }catch (Exception e){
            logger.error("Error while converting Jwt to AbstractAuthenticationToken",e);
            throw new IllegalArgumentException("Error while converting Jwt to AbstractAuthenticationToken");
        }
    }
}

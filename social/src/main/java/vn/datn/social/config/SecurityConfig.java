package vn.datn.social.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import tech.jhipster.config.JHipsterProperties;
import vn.datn.social.constant.AuthoritiesConstants;
import vn.datn.social.security.jwt.CustomJwtAccessDeniedHandler;
import vn.datn.social.security.jwt.CustomJwtAuthenticationConverter;
import vn.datn.social.security.jwt.CustomJwtAuthenticationEntryPoint;
import vn.datn.social.security.jwt.CustomJwtDecoder;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JHipsterProperties jHipsterProperties;
    private final CustomJwtAuthenticationConverter customJwtAuthenticationConverter;

    public SecurityConfig(CustomJwtAuthenticationConverter converter, JHipsterProperties jHipsterProperties) {
        this.customJwtAuthenticationConverter = converter;
        this.jHipsterProperties = jHipsterProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomJwtDecoder customJwtDecoder) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors-> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new CustomJwtAuthenticationEntryPoint())
                        .accessDeniedHandler(new CustomJwtAccessDeniedHandler())
                )
                .headers(header -> header
                        .addHeaderWriter(new StaticHeadersWriter("Content-Security-Policy",
                                jHipsterProperties.getSecurity().getContentSecurityPolicy()))
                        .referrerPolicy(referrer -> referrer
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .permissionsPolicyHeader(permissions -> permissions
                                .policy("camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=()"))
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                )
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/authenticate").permitAll()
                        .requestMatchers("/api/admin/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
                        .requestMatchers("/api/users").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .requestMatchers( "/websocket/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()      // handshake + SockJS fallback
                        .requestMatchers("/ws").permitAll()
                        .requestMatchers("/ws/info").permitAll()
                        .anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(customJwtDecoder)//xác thực token
                                .jwtAuthenticationConverter(customJwtAuthenticationConverter)// chuyển đổi token hợp lệ thành đối tượng Authentication
                        )
                );
        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:3000")); // Dùng List + Patterns
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Bắt buộc khi dùng Bearer token

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
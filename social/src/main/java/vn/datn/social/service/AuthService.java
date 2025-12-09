package vn.datn.social.service;

import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.Authorities;
import vn.datn.social.dto.request.LoginUserRequestDTO;
import vn.datn.social.dto.response.AuthResponseDTO;
import vn.datn.social.dto.response.TokenPairResponseDTO;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.UserRepository;
import vn.datn.social.security.jwt.TokenProvider;

import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    TokenProvider tokenProvider;
    UserService userService;

    public AuthResponseDTO generateToken(LoginUserRequestDTO loginUserRequestDTO) {
        User user = userRepository.findByEmailOrUsername(loginUserRequestDTO.email())
                .orElseThrow(() -> new BusinessException(ApiResponseCode.BAD_REQUEST, "Tài khoản chưa được đăng ký"));
        if (!passwordEncoder.matches(loginUserRequestDTO.password(), user.getPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Mật khẩu không đúng");
        }
        TokenPairResponseDTO tokenPair = tokenProvider.createTokenPair(user);
        Long expirationTime = tokenProvider.getRefreshTokenValidity();
        return buildAuthResponseDTO(user, expirationTime, tokenPair);
    }

    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND));
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .image(user.getImage())
                .address(user.getAddress())
                .role(Authorities.find(user.getRole()).getName())
                .build();
    }

    private AuthResponseDTO buildAuthResponseDTO(User user, Long expirationTime, TokenPairResponseDTO tokenPair) {
        return AuthResponseDTO.builder()
                .tokenType("Bearer")
                .expiresIn(expirationTime)
                .user(userService.convertToUserResponseDTO(user))
                .accessToken(tokenPair.getToken())
                .refreshToken(tokenPair.getRefreshToken())
                .created(Instant.now().getEpochSecond())
                .build();
    }
}

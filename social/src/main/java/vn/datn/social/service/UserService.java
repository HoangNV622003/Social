package vn.datn.social.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.constant.Authorities;
import vn.datn.social.dto.request.ChangePasswordRequest;
import vn.datn.social.dto.request.CreateUserRequestDTO;
import vn.datn.social.dto.request.UpdateDeepUserRequestDTO;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UploadService uploadService;
    PasswordEncoder passwordEncoder;

    public UserResponseDTO createUser(CreateUserRequestDTO requestDTO, HttpServletRequest httpServletRequest) {
        if (!requestDTO.password().equals(requestDTO.confirmPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Passwords don't match");
        }
        if (userRepository.existsByEmailIgnoreCaseOrUsernameIgnoreCase(requestDTO.email(), requestDTO.username())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Email or Username already exists");
        }
        User user=userRepository.save(convertToUser(requestDTO));
        return convertToUserResponseDTO(user);
    }

    public void updateDeepUserByAdmin(Long userId, UpdateDeepUserRequestDTO requestDTO) {
        User user = findById(userId);
        String imageUrl = requestDTO.file() != null && !requestDTO.file().isEmpty()
                ? uploadService.uploadImage(requestDTO.file())
                : user.getImage();
        Integer role = requestDTO.isAdmin() ? Authorities.ROLE_ADMIN.getId() : user.getRole();
        user.setImage(imageUrl);
        user.setEmail(requestDTO.email());
        user.setUsername(requestDTO.username());
        user.setRole(role);
        user.setAddress(requestDTO.address());
        userRepository.save(user);
    }

    private User convertToUser(CreateUserRequestDTO request) {
        return User.builder()
                .email(request.email())
                .username(request.username())
                .role(Authorities.ROLE_STAFF.getId())
                .password(passwordEncoder.encode(request.password()))
                .build();
    }

    public UserResponseDTO convertToUserResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .image(user.getImage())
                .address(user.getAddress())
                .role(Authorities.find(user.getRole()).name())
                .build();
    }

    public User findById(long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found with id: " + id));
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findById(userId);
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "New password and confirm password do not match");
        }
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    public UserResponseDTO getUserById(Long userId) {
        User user = findById(userId);
        return convertToUserResponseDTO(user);
    }
}



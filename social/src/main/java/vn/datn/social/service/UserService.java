package vn.datn.social.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.commons.lang3.StringUtils;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.request.ChangePasswordRequest;
import vn.datn.social.dto.request.CreateUserRequestDTO;
import vn.datn.social.dto.request.Edit_pf_Request;
import vn.datn.social.dto.response.Edit_pf;
import vn.datn.social.dto.response.UserDto;
import vn.datn.social.dto.response.UserManageDto;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.entity.User;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.UserRepository;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;

    PasswordEncoder passwordEncoder;
    private final SimpUserRegistry userRegistry;

    public User createUser(CreateUserRequestDTO requestDTO, HttpServletRequest httpServletRequest) {
        if (!requestDTO.password().equals(requestDTO.confirmPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Passwords don't match");
        }
        if (userRepository.existsByEmailIgnoreCaseOrUsernameIgnoreCase(requestDTO.email(), requestDTO.username())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Email or Username already exists");
        }

        return userRepository.save(convertToUser(requestDTO));
    }

    private User convertToUser(CreateUserRequestDTO request) {
        return User.builder()
                .email(request.email())
                .username(request.username())
                .enabled(true)
                .isAdmin(false)
                .verificationCode(UUID.randomUUID().toString())
                .password(passwordEncoder.encode(request.password()))
                .build();
    }

    public UserResponseDTO convertToUserResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .isAdmin(user.isAdmin())
                .build();
    }

    public List<UserDto> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserManageDto convertToUserManageDTO(User user) {
        return new UserManageDto(
                user.getId(),
                user.getUsername(),
                user.getVerificationCode(),
                user.isEnabled(),
                user.getEmail(),
                user.isAdmin()
        );
    }

    public User findById(long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found with id: " + id));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "User not found with username: " + username));
    }

    public Edit_pf getUser(String username) {
        User user = findByUsername(username);
        return Edit_pf.builder()
                .address(user.getAddress())
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    public void deleteById(long id) {
        userRepository.deleteById(id);
    }

    public User get(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND, "Không tìm thấy người dùng"));
    }

    public boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new BusinessException(ApiResponseCode.ENTITY_NOT_FOUND));

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            user.setEnabled(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return true;
        }
    }

    public void saveAgaint(User user) {
        userRepository.save(user);
    }

    // Cập nhật thông tin người dùng
    public User updateUserProfile(Long userId, Edit_pf_Request request) {
        // Lấy thông tin người dùng từ security context
        User currentUser = findById(userId);

        // Cập nhật email và địa chỉ nếu có
        if (StringUtils.isNotBlank(request.email())) {
            if(userRepository.existsByEmailIgnoreCaseAndIdNot(request.email(), userId)) {
                throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Email already exists");
            }
            currentUser.setEmail(request.email());
        }

        if (StringUtils.isNotBlank(request.address())) {
            currentUser.setAddress(request.address());
        }

        // Cập nhật mật khẩu nếu có và mã hóa mật khẩu trước khi lưu
        if (StringUtils.isNotBlank(request.password())) {
            String encodedPassword = passwordEncoder.encode(request.password());
            currentUser.setPassword(encodedPassword);
        }

        // Lưu người dùng đã cập nhật
        return userRepository.save(currentUser);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());

        // Convert BLOB to Base64 string
        if (user.getImage() != null) {
            try {
                Blob imageBlob = user.getImage();
                byte[] imageBytes = imageBlob.getBytes(1, (int) imageBlob.length());
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                dto.setImage("data:image/jpeg;base64," + base64Image); // Ensure the correct prefix
                System.out.println("Successfully converted image to Base64 for user: " + user.getUsername());
            } catch (SQLException e) {
                System.err.println("Error retrieving image for user: " + user.getUsername());
            }
        } else {
            dto.setImage(null); // Handle null image case
            System.out.println("No image found for user: " + user.getUsername());
        }

        return dto;
    }

    public String getUsernameById(long id) {
        return findById(id).getUsername();
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findById(userId);
        // Kiểm tra khớp mật khẩu mới và xác nhận
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "New password and confirm password do not match");
        }
        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Current password is incorrect");
        }

        // Mã hóa và cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}



package vn.datn.social.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.datn.social.dto.request.LoginUserRequestDTO;
import vn.datn.social.dto.response.AuthResponseDTO;
import vn.datn.social.dto.response.UserResponseDTO;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.AuthService;
import vn.datn.social.service.UserService;

@Validated
@RestController
@RequestMapping("/api/authenticate")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;
    private final UserService userService;

    @PostMapping
    ResponseEntity<AuthResponseDTO> authentication(@Valid @RequestBody LoginUserRequestDTO loginUserRequestDTO) {
        return ResponseEntity.ok(authService.generateToken(loginUserRequestDTO));
    }

    @GetMapping("/me")
    ResponseEntity<UserResponseDTO> me(@CurrentUserId Long userId) {
        return ResponseEntity.ok(authService.findById(userId));
    }
}

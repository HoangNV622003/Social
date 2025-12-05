package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.datn.social.dto.response.ImageResponseDTO;
import vn.datn.social.dto.response.ProfileResponseDTO;
import vn.datn.social.security.CurrentUserId;
import vn.datn.social.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {

    ProfileService profileService;

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponseDTO> getProfile(@PathVariable Long id, @CurrentUserId Long currentUserId) {
        return ResponseEntity.ok(profileService.getProfile(id, currentUserId));
    }

    @PutMapping("/avatar")
    public ResponseEntity<ProfileResponseDTO> uploadAvatar(@RequestParam("file") MultipartFile file, @CurrentUserId Long userId) {
        return ResponseEntity.ok(profileService.changeAvatar(userId, file));
    }

    @GetMapping("/{userId}/images")
    public ResponseEntity<Page<ImageResponseDTO>> getImages(@PathVariable Long userId, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(profileService.getImages(userId, pageable));
    }
}
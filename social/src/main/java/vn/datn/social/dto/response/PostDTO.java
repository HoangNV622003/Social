package vn.datn.social.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;

    private String content;
    private byte[] image;
    private String createdBy;
    private LocalDateTime createdAt;
    private boolean isLiked; // New field
    private long likesCount; // New field for likes count
    private Page<CommentDTO> comments; // New field for comments
}

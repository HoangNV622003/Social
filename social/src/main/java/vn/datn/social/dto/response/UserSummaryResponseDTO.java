package vn.datn.social.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponseDTO {
    private Long id;
    private String username;
    private String image;
    private boolean isAdmin;
}

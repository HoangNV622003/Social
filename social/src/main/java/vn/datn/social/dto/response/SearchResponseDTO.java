package vn.datn.social.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDTO {
    List<UserSummaryResponseDTO> users;
    List<PostResponseDTO> posts;
}

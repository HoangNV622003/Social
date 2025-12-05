package vn.datn.social.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatisticResponseDTO {
    List<StatisticItemResponseDTO> users;
    List<StatisticItemResponseDTO> posts;
    List<StatisticItemResponseDTO> comments;
    List<StatisticItemResponseDTO> messages;
    List<StatisticItemResponseDTO> likes;

}

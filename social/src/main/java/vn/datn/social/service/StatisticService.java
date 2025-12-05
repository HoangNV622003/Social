package vn.datn.social.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import vn.datn.social.constant.ApiResponseCode;
import vn.datn.social.dto.response.StatisticItemResponseDTO;
import vn.datn.social.dto.response.StatisticResponseDTO;
import vn.datn.social.dto.response.projection.MonthlySummaryProjection;
import vn.datn.social.exception.BusinessException;
import vn.datn.social.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticService {
    UserRepository userRepository;

    public StatisticResponseDTO getStatistics(Integer year) {
        if (year == null || year <= 0 || year > LocalDate.now().getYear()) {
            throw new BusinessException(ApiResponseCode.BAD_REQUEST, "Năm không hợp lệ");
        }
        List<MonthlySummaryProjection> projections = userRepository.findMonthlySummaryBy(year);
        List<StatisticItemResponseDTO> users = new ArrayList<>();
        List<StatisticItemResponseDTO> comments = new ArrayList<>();
        List<StatisticItemResponseDTO> messages = new ArrayList<>();
        List<StatisticItemResponseDTO> likes = new ArrayList<>();
        List<StatisticItemResponseDTO> posts = new ArrayList<>();
        for (MonthlySummaryProjection projection : projections) {
            users.add(new StatisticItemResponseDTO(projection.getMonth(), projection.getTotalUsers()));
            comments.add(new StatisticItemResponseDTO(projection.getMonth(), projection.getTotalComments()));
            messages.add(new StatisticItemResponseDTO(projection.getMonth(), projection.getTotalMessages()));
            likes.add(new StatisticItemResponseDTO(projection.getMonth(), projection.getTotalLikes()));
            posts.add(new StatisticItemResponseDTO(projection.getMonth(), projection.getTotalPosts()));
        }
        return StatisticResponseDTO.builder()
                .users(users)
                .comments(comments)
                .messages(messages)
                .likes(likes)
                .posts(posts)
                .build();
    }
}

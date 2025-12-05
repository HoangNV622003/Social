package vn.datn.social.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.datn.social.dto.response.StatisticResponseDTO;
import vn.datn.social.service.StatisticService;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticController {
    StatisticService statisticService;
    @GetMapping
    public ResponseEntity<StatisticResponseDTO> statisticItemResponseDTO(@RequestParam("year") Integer year) {
        return ResponseEntity.ok(statisticService.getStatistics(year));
    }
}

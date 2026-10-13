package com.dsarevision.service;

import com.dsarevision.dto.ProgressSummaryDto;
import com.dsarevision.dto.UserPatternResponseDto;
import com.dsarevision.entity.UserPattern;
import com.dsarevision.exception.ResourceNotFoundException;
import com.dsarevision.repository.PatternRepository;
import com.dsarevision.repository.UserPatternRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class UserProgressService {

    private final UserPatternRepository userPatternRepository;
    private final PatternRepository patternRepository;

    public UserProgressService(UserPatternRepository userPatternRepository, PatternRepository patternRepository) {
        this.userPatternRepository = userPatternRepository;
        this.patternRepository = patternRepository;
    }

    public UserPatternResponseDto getUserProgressForPattern(Long userId, Long patternId) {
        if (!patternRepository.existsById(patternId)) {
            throw new ResourceNotFoundException("Pattern", "id", patternId);
        }

        UserPattern userPattern = userPatternRepository.findByUserIdAndPatternId(userId, patternId)
                .orElse(null);

        if (userPattern == null) {
            // Not started yet by user: return default zeroed progress
            var pattern = patternRepository.findById(patternId)
                    .orElseThrow(() -> new ResourceNotFoundException("Pattern", "id", patternId));
            UserPatternResponseDto dto = new UserPatternResponseDto();
            dto.setUserId(userId);
            dto.setPatternId(patternId);
            dto.setPatternName(pattern.getName());
            dto.setPatternCategory(pattern.getCategory());
            dto.setPatternDifficulty(pattern.getDifficulty());
            dto.setMastery(0);
            dto.setRevisionCount(0);
            dto.setDueToday(false);
            dto.setOverdue(false);
            return dto;
        }

        return toDto(userPattern);
    }

    public List<UserPatternResponseDto> getAllUserProgress(Long userId) {
        return userPatternRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<UserPatternResponseDto> getWeakAreas(Long userId, int limit) {
        return userPatternRepository.findByUserIdOrderByMasteryAsc(userId).stream()
                .filter(up -> up.getMastery() < 70)
                .limit(limit)
                .map(this::toDto)
                .toList();
    }

    public ProgressSummaryDto getProgressSummary(Long userId) {
        List<UserPattern> userPatterns = userPatternRepository.findByUserId(userId);
        long totalCatalogPatterns = patternRepository.count();
        long started = userPatterns.size();
        long mastered = userPatterns.stream().filter(up -> up.getMastery() >= 80).count();

        int overallMastery = 0;
        if (totalCatalogPatterns > 0) {
            int totalScoreSum = userPatterns.stream().mapToInt(UserPattern::getMastery).sum();
            overallMastery = (int) Math.round((double) totalScoreSum / totalCatalogPatterns);
        }

        // Category breakdown
        Map<String, int[]> categoryScores = new HashMap<>(); // [totalMastery, count]
        for (UserPattern up : userPatterns) {
            String category = up.getPattern().getCategory();
            categoryScores.computeIfAbsent(category, k -> new int[2]);
            categoryScores.get(category)[0] += up.getMastery();
            categoryScores.get(category)[1] += 1;
        }

        Map<String, Integer> categoryMasteryMap = new HashMap<>();
        for (Map.Entry<String, int[]> entry : categoryScores.entrySet()) {
            int avg = entry.getValue()[1] > 0 ? entry.getValue()[0] / entry.getValue()[1] : 0;
            categoryMasteryMap.put(entry.getKey(), avg);
        }

        ProgressSummaryDto summary = new ProgressSummaryDto();
        summary.setTotalPatterns(totalCatalogPatterns);
        summary.setStartedPatterns(started);
        summary.setMasteredPatterns(mastered);
        summary.setOverallMastery(overallMastery);
        summary.setCategoryMastery(categoryMasteryMap);
        return summary;
    }

    public UserPatternResponseDto toDto(UserPattern up) {
        LocalDate today = LocalDate.now();
        boolean isDueToday = up.getNextRevision() != null && up.getNextRevision().isEqual(today);
        boolean isOverdue = up.getNextRevision() != null && up.getNextRevision().isBefore(today);

        UserPatternResponseDto dto = new UserPatternResponseDto();
        dto.setId(up.getId());
        dto.setUserId(up.getUser().getId());
        dto.setPatternId(up.getPattern().getId());
        dto.setPatternName(up.getPattern().getName());
        dto.setPatternCategory(up.getPattern().getCategory());
        dto.setPatternDifficulty(up.getPattern().getDifficulty());
        dto.setMastery(up.getMastery());
        dto.setLastRevised(up.getLastRevised());
        dto.setNextRevision(up.getNextRevision());
        dto.setRevisionCount(up.getRevisionCount());
        dto.setDueToday(isDueToday);
        dto.setOverdue(isOverdue);
        return dto;
    }
}

package com.dsarevision.service;

import com.dsarevision.dto.DashboardResponseDto;
import com.dsarevision.dto.ProgressSummaryDto;
import com.dsarevision.dto.RevisionHistoryResponseDto;
import com.dsarevision.dto.UserPatternResponseDto;
import com.dsarevision.entity.RevisionHistory;
import com.dsarevision.repository.RevisionHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final RevisionService revisionService;
    private final UserProgressService userProgressService;
    private final RevisionHistoryRepository revisionHistoryRepository;

    public DashboardService(
            RevisionService revisionService,
            UserProgressService userProgressService,
            RevisionHistoryRepository revisionHistoryRepository) {
        this.revisionService = revisionService;
        this.userProgressService = userProgressService;
        this.revisionHistoryRepository = revisionHistoryRepository;
    }

    public DashboardResponseDto getDashboard(Long userId) {
        List<UserPatternResponseDto> todayRevisions = revisionService.getTodayRevisions(userId);
        List<UserPatternResponseDto> overdueRevisions = revisionService.getOverdueRevisions(userId);
        List<UserPatternResponseDto> upcomingRevisions = revisionService.getUpcomingRevisions(userId);
        List<UserPatternResponseDto> weakAreas = userProgressService.getWeakAreas(userId, 5);

        List<RevisionHistoryResponseDto> recentActivity = revisionService.getRevisionHistory(userId).stream()
                .limit(6)
                .toList();

        ProgressSummaryDto progressSummary = userProgressService.getProgressSummary(userId);

        long totalCompleted = revisionHistoryRepository.countByUserId(userId);
        int streakDays = calculateStreak(userId);

        DashboardResponseDto dto = new DashboardResponseDto();
        dto.setDueTodayCount(todayRevisions.size());
        dto.setOverdueCount(overdueRevisions.size());
        dto.setUpcomingCount(upcomingRevisions.size());
        dto.setOverallMastery(progressSummary.getOverallMastery());
        dto.setRevisionStreakDays(streakDays);
        dto.setTotalRevisionsCompleted(totalCompleted);

        dto.setTodayRevisions(todayRevisions);
        dto.setOverdueRevisions(overdueRevisions);
        dto.setUpcomingRevisions(upcomingRevisions);
        dto.setWeakAreas(weakAreas);
        dto.setRecentActivity(recentActivity);
        dto.setProgressSummary(progressSummary);

        return dto;
    }

    /**
     * Calculates consecutive days of active revisions leading up to today or yesterday.
     */
    private int calculateStreak(Long userId) {
        List<RevisionHistory> histories = revisionHistoryRepository.findByUserIdOrderByRevisionDateDesc(userId);
        if (histories.isEmpty()) {
            return 0;
        }

        Set<LocalDate> activeDays = new HashSet<>();
        for (RevisionHistory rh : histories) {
            activeDays.add(rh.getRevisionDate().toLocalDate());
        }

        LocalDate current = LocalDate.now();
        // If not revised today yet, check if there was a revision yesterday to maintain the streak
        if (!activeDays.contains(current)) {
            current = current.minusDays(1);
            if (!activeDays.contains(current)) {
                return 0;
            }
        }

        int streak = 0;
        while (activeDays.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }
        return streak;
    }
}

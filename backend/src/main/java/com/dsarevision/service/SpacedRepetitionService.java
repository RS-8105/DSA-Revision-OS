package com.dsarevision.service;

import com.dsarevision.exception.ApiException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Locale;

@Service
public class SpacedRepetitionService {

    // Default revision interval tiers (in days) according to PRD section 7
    private static final int[] DEFAULT_INTERVALS = {1, 3, 7, 14, 30};

    public record SchedulingResult(
            int intervalDays,
            LocalDate nextRevisionDate,
            int newMastery,
            int newRevisionCount,
            String normalizedAssessment
    ) {}

    /**
     * Calculates the next revision interval, next date, updated revision count, and mastery score.
     *
     * Rules per PRD:
     * - FORGOT:    Schedule sooner (1 day interval), decrement mastery (-10), reset stage to 1.
     * - STRUGGLED: Short interval (3 days or 1 day), preserve current mastery (0 delta), keep current count.
     * - GOOD:      Normal progression interval (+1 tier: 1d -> 3d -> 7d -> 14d -> 30d), increase mastery (+6).
     * - EASY:      Longer interval (+2 tiers or 30d max), increase mastery (+12), advance stage by 2.
     */
    public SchedulingResult calculateSchedule(int currentMastery, int currentRevisionCount, String assessment) {
        if (assessment == null || assessment.isBlank()) {
            throw new ApiException("Self-assessment is required (FORGOT, STRUGGLED, GOOD, or EASY)");
        }

        String normalized = assessment.trim().toUpperCase(Locale.ROOT);
        int intervalDays;
        int nextRevisionCount;
        int masteryDelta;

        switch (normalized) {
            case "FORGOT":
                intervalDays = 1;
                nextRevisionCount = 1;
                masteryDelta = -10;
                break;

            case "STRUGGLED":
                intervalDays = 3;
                nextRevisionCount = Math.max(1, currentRevisionCount);
                masteryDelta = 0;
                break;

            case "GOOD":
                nextRevisionCount = currentRevisionCount + 1;
                intervalDays = getIntervalForRevisionCount(nextRevisionCount);
                masteryDelta = 6;
                break;

            case "EASY":
                nextRevisionCount = Math.min(5, currentRevisionCount + 2);
                intervalDays = getIntervalForRevisionCount(nextRevisionCount);
                masteryDelta = 12;
                break;

            default:
                throw new ApiException("Invalid assessment: '" + assessment + "'. Allowed values are FORGOT, STRUGGLED, GOOD, EASY");
        }

        int newMastery = Math.clamp((long) currentMastery + masteryDelta, 0, 100);
        LocalDate nextRevisionDate = LocalDate.now().plusDays(intervalDays);

        return new SchedulingResult(intervalDays, nextRevisionDate, newMastery, nextRevisionCount, normalized);
    }

    public int getIntervalForRevisionCount(int revisionCount) {
        if (revisionCount <= 1) return DEFAULT_INTERVALS[0]; // 1 day
        if (revisionCount == 2) return DEFAULT_INTERVALS[1]; // 3 days
        if (revisionCount == 3) return DEFAULT_INTERVALS[2]; // 7 days
        if (revisionCount == 4) return DEFAULT_INTERVALS[3]; // 14 days
        return DEFAULT_INTERVALS[4];                          // 30 days
    }
}

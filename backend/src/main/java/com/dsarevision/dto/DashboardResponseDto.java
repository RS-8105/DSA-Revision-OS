package com.dsarevision.dto;

import java.util.List;

public class DashboardResponseDto {

    private int dueTodayCount;
    private int overdueCount;
    private int upcomingCount;
    private int overallMastery;
    private int revisionStreakDays;
    private long totalRevisionsCompleted;

    private List<UserPatternResponseDto> todayRevisions;
    private List<UserPatternResponseDto> overdueRevisions;
    private List<UserPatternResponseDto> upcomingRevisions;
    private List<UserPatternResponseDto> weakAreas;
    private List<RevisionHistoryResponseDto> recentActivity;
    private ProgressSummaryDto progressSummary;

    public DashboardResponseDto() {
    }

    public int getDueTodayCount() {
        return dueTodayCount;
    }

    public void setDueTodayCount(int dueTodayCount) {
        this.dueTodayCount = dueTodayCount;
    }

    public int getOverdueCount() {
        return overdueCount;
    }

    public void setOverdueCount(int overdueCount) {
        this.overdueCount = overdueCount;
    }

    public int getUpcomingCount() {
        return upcomingCount;
    }

    public void setUpcomingCount(int upcomingCount) {
        this.upcomingCount = upcomingCount;
    }

    public int getOverallMastery() {
        return overallMastery;
    }

    public void setOverallMastery(int overallMastery) {
        this.overallMastery = overallMastery;
    }

    public int getRevisionStreakDays() {
        return revisionStreakDays;
    }

    public void setRevisionStreakDays(int revisionStreakDays) {
        this.revisionStreakDays = revisionStreakDays;
    }

    public long getTotalRevisionsCompleted() {
        return totalRevisionsCompleted;
    }

    public void setTotalRevisionsCompleted(long totalRevisionsCompleted) {
        this.totalRevisionsCompleted = totalRevisionsCompleted;
    }

    public List<UserPatternResponseDto> getTodayRevisions() {
        return todayRevisions;
    }

    public void setTodayRevisions(List<UserPatternResponseDto> todayRevisions) {
        this.todayRevisions = todayRevisions;
    }

    public List<UserPatternResponseDto> getOverdueRevisions() {
        return overdueRevisions;
    }

    public void setOverdueRevisions(List<UserPatternResponseDto> overdueRevisions) {
        this.overdueRevisions = overdueRevisions;
    }

    public List<UserPatternResponseDto> getUpcomingRevisions() {
        return upcomingRevisions;
    }

    public void setUpcomingRevisions(List<UserPatternResponseDto> upcomingRevisions) {
        this.upcomingRevisions = upcomingRevisions;
    }

    public List<UserPatternResponseDto> getWeakAreas() {
        return weakAreas;
    }

    public void setWeakAreas(List<UserPatternResponseDto> weakAreas) {
        this.weakAreas = weakAreas;
    }

    public List<RevisionHistoryResponseDto> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<RevisionHistoryResponseDto> recentActivity) {
        this.recentActivity = recentActivity;
    }

    public ProgressSummaryDto getProgressSummary() {
        return progressSummary;
    }

    public void setProgressSummary(ProgressSummaryDto progressSummary) {
        this.progressSummary = progressSummary;
    }
}

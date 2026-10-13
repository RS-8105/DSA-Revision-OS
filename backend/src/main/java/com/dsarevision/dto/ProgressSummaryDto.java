package com.dsarevision.dto;

import java.util.Map;

public class ProgressSummaryDto {

    private long totalPatterns;
    private long startedPatterns;
    private long masteredPatterns; // >= 80%
    private int overallMastery;
    private Map<String, Integer> categoryMastery;

    public ProgressSummaryDto() {
    }

    public long getTotalPatterns() {
        return totalPatterns;
    }

    public void setTotalPatterns(long totalPatterns) {
        this.totalPatterns = totalPatterns;
    }

    public long getStartedPatterns() {
        return startedPatterns;
    }

    public void setStartedPatterns(long startedPatterns) {
        this.startedPatterns = startedPatterns;
    }

    public long getMasteredPatterns() {
        return masteredPatterns;
    }

    public void setMasteredPatterns(long masteredPatterns) {
        this.masteredPatterns = masteredPatterns;
    }

    public int getOverallMastery() {
        return overallMastery;
    }

    public void setOverallMastery(int overallMastery) {
        this.overallMastery = overallMastery;
    }

    public Map<String, Integer> getCategoryMastery() {
        return categoryMastery;
    }

    public void setCategoryMastery(Map<String, Integer> categoryMastery) {
        this.categoryMastery = categoryMastery;
    }
}

package com.dsarevision.dto;

import java.time.LocalDate;

public class UserPatternResponseDto {

    private Long id;
    private Long userId;
    private Long patternId;
    private String patternName;
    private String patternCategory;
    private String patternDifficulty;
    private Integer mastery;
    private LocalDate lastRevised;
    private LocalDate nextRevision;
    private Integer revisionCount;
    private boolean isDueToday;
    private boolean isOverdue;

    public UserPatternResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPatternId() {
        return patternId;
    }

    public void setPatternId(Long patternId) {
        this.patternId = patternId;
    }

    public String getPatternName() {
        return patternName;
    }

    public void setPatternName(String patternName) {
        this.patternName = patternName;
    }

    public String getPatternCategory() {
        return patternCategory;
    }

    public void setPatternCategory(String patternCategory) {
        this.patternCategory = patternCategory;
    }

    public String getPatternDifficulty() {
        return patternDifficulty;
    }

    public void setPatternDifficulty(String patternDifficulty) {
        this.patternDifficulty = patternDifficulty;
    }

    public Integer getMastery() {
        return mastery;
    }

    public void setMastery(Integer mastery) {
        this.mastery = mastery;
    }

    public LocalDate getLastRevised() {
        return lastRevised;
    }

    public void setLastRevised(LocalDate lastRevised) {
        this.lastRevised = lastRevised;
    }

    public LocalDate getNextRevision() {
        return nextRevision;
    }

    public void setNextRevision(LocalDate nextRevision) {
        this.nextRevision = nextRevision;
    }

    public Integer getRevisionCount() {
        return revisionCount;
    }

    public void setRevisionCount(Integer revisionCount) {
        this.revisionCount = revisionCount;
    }

    public boolean isDueToday() {
        return isDueToday;
    }

    public void setDueToday(boolean dueToday) {
        isDueToday = dueToday;
    }

    public boolean isOverdue() {
        return isOverdue;
    }

    public void setOverdue(boolean overdue) {
        isOverdue = overdue;
    }
}

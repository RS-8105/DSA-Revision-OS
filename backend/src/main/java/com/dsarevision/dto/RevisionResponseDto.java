package com.dsarevision.dto;

import java.time.LocalDate;

public class RevisionResponseDto {

    private Long userPatternId;
    private Long patternId;
    private String patternName;
    private String assessment;
    private Integer mastery;
    private LocalDate lastRevised;
    private LocalDate nextRevision;
    private int intervalDays;
    private Integer revisionCount;
    private String notes;

    public RevisionResponseDto() {
    }

    public Long getUserPatternId() {
        return userPatternId;
    }

    public void setUserPatternId(Long userPatternId) {
        this.userPatternId = userPatternId;
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

    public String getAssessment() {
        return assessment;
    }

    public void setAssessment(String assessment) {
        this.assessment = assessment;
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

    public int getIntervalDays() {
        return intervalDays;
    }

    public void setIntervalDays(int intervalDays) {
        this.intervalDays = intervalDays;
    }

    public Integer getRevisionCount() {
        return revisionCount;
    }

    public void setRevisionCount(Integer revisionCount) {
        this.revisionCount = revisionCount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

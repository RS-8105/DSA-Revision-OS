package com.dsarevision.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RevisionRequestDto {

    @NotNull(message = "Pattern ID is required")
    private Long patternId;

    @NotBlank(message = "Assessment rating is required (FORGOT, STRUGGLED, GOOD, or EASY)")
    private String assessment;

    private String notes;

    public RevisionRequestDto() {
    }

    public RevisionRequestDto(Long patternId, String assessment, String notes) {
        this.patternId = patternId;
        this.assessment = assessment;
        this.notes = notes;
    }

    public Long getPatternId() {
        return patternId;
    }

    public void setPatternId(Long patternId) {
        this.patternId = patternId;
    }

    public String getAssessment() {
        return assessment;
    }

    public void setAssessment(String assessment) {
        this.assessment = assessment;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

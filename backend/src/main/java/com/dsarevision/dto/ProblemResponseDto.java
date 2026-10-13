package com.dsarevision.dto;

public class ProblemResponseDto {

    private Long id;
    private Long patternId;
    private String title;
    private String difficulty;
    private String link;

    public ProblemResponseDto() {
    }

    public ProblemResponseDto(Long id, Long patternId, String title, String difficulty, String link) {
        this.id = id;
        this.patternId = patternId;
        this.title = title;
        this.difficulty = difficulty;
        this.link = link;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatternId() {
        return patternId;
    }

    public void setPatternId(Long patternId) {
        this.patternId = patternId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}

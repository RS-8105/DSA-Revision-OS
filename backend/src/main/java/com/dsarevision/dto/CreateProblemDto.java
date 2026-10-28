package com.dsarevision.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateProblemDto {

    @NotBlank(message = "Problem title is required")
    private String title;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    private String link;

    public CreateProblemDto() {
    }

    public CreateProblemDto(String title, String difficulty, String link) {
        this.title = title;
        this.difficulty = difficulty;
        this.link = link;
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

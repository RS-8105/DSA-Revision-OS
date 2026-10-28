package com.dsarevision.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePatternDto {

    @NotBlank(message = "Pattern name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    private String description;

    public CreatePatternDto() {
    }

    public CreatePatternDto(String name, String category, String difficulty, String description) {
        this.name = name;
        this.category = category;
        this.difficulty = difficulty;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

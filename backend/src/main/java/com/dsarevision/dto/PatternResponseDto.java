package com.dsarevision.dto;

import java.util.List;

public class PatternResponseDto {

    private Long id;
    private String name;
    private String category;
    private String difficulty;
    private String description;
    private Integer problemCount;
    private List<ProblemResponseDto> problems;

    public PatternResponseDto() {
    }

    public PatternResponseDto(Long id, String name, String category, String difficulty, String description, Integer problemCount) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.difficulty = difficulty;
        this.description = description;
        this.problemCount = problemCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getProblemCount() {
        return problemCount;
    }

    public void setProblemCount(Integer problemCount) {
        this.problemCount = problemCount;
    }

    public List<ProblemResponseDto> getProblems() {
        return problems;
    }

    public void setProblems(List<ProblemResponseDto> problems) {
        this.problems = problems;
    }
}

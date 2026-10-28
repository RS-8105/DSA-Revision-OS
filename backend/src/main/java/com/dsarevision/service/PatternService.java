package com.dsarevision.service;

import com.dsarevision.dto.PatternResponseDto;
import com.dsarevision.dto.ProblemResponseDto;
import com.dsarevision.entity.Pattern;
import com.dsarevision.entity.Problem;
import com.dsarevision.exception.ResourceNotFoundException;
import com.dsarevision.repository.PatternRepository;
import com.dsarevision.repository.ProblemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PatternService {

    private final PatternRepository patternRepository;
    private final ProblemRepository problemRepository;

    public PatternService(PatternRepository patternRepository, ProblemRepository problemRepository) {
        this.patternRepository = patternRepository;
        this.problemRepository = problemRepository;
    }

    public List<PatternResponseDto> getAllPatterns(String category, String difficulty) {
        List<Pattern> patterns;

        if (category != null && !category.isBlank() && difficulty != null && !difficulty.isBlank()) {
            patterns = patternRepository.findByCategoryIgnoreCase(category.trim()).stream()
                    .filter(p -> p.getDifficulty().equalsIgnoreCase(difficulty.trim()))
                    .toList();
        } else if (category != null && !category.isBlank()) {
            patterns = patternRepository.findByCategoryIgnoreCase(category.trim());
        } else if (difficulty != null && !difficulty.isBlank()) {
            patterns = patternRepository.findByDifficulty(difficulty.trim());
        } else {
            patterns = patternRepository.findAll();
        }

        return patterns.stream().map(this::toSummaryDto).toList();
    }

    public PatternResponseDto getPatternById(Long id) {
        Pattern pattern = patternRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pattern", "id", id));

        PatternResponseDto dto = toSummaryDto(pattern);
        List<ProblemResponseDto> problems = problemRepository.findByPatternId(id).stream()
                .map(this::toProblemDto)
                .toList();
        dto.setProblems(problems);
        return dto;
    }

    public List<ProblemResponseDto> getProblemsByPatternId(Long patternId) {
        if (!patternRepository.existsById(patternId)) {
            throw new ResourceNotFoundException("Pattern", "id", patternId);
        }
        return problemRepository.findByPatternId(patternId).stream()
                .map(this::toProblemDto)
                .toList();
    }

    @Transactional
    public PatternResponseDto createPattern(com.dsarevision.dto.CreatePatternDto dto) {
        if (patternRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new com.dsarevision.exception.ApiException("A pattern with this name already exists", org.springframework.http.HttpStatus.CONFLICT);
        }
        Pattern pattern = new Pattern(
                dto.getName().trim(),
                dto.getCategory().trim(),
                dto.getDifficulty().trim(),
                dto.getDescription() != null ? dto.getDescription().trim() : ""
        );
        pattern = patternRepository.save(pattern);
        return toSummaryDto(pattern);
    }

    @Transactional
    public ProblemResponseDto addProblem(Long patternId, com.dsarevision.dto.CreateProblemDto dto) {
        Pattern pattern = patternRepository.findById(patternId)
                .orElseThrow(() -> new ResourceNotFoundException("Pattern", "id", patternId));

        Problem problem = new Problem(
                pattern,
                dto.getTitle().trim(),
                dto.getDifficulty().trim(),
                dto.getLink() != null ? dto.getLink().trim() : ""
        );
        problem = problemRepository.save(problem);
        return toProblemDto(problem);
    }

    public PatternResponseDto toSummaryDto(Pattern pattern) {
        int problemCount = pattern.getProblems() != null ? pattern.getProblems().size() : 0;
        return new PatternResponseDto(
                pattern.getId(),
                pattern.getName(),
                pattern.getCategory(),
                pattern.getDifficulty(),
                pattern.getDescription(),
                problemCount
        );
    }

    public ProblemResponseDto toProblemDto(Problem problem) {
        return new ProblemResponseDto(
                problem.getId(),
                problem.getPattern() != null ? problem.getPattern().getId() : null,
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getLink()
        );
    }
}

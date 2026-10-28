package com.dsarevision.controller;

import com.dsarevision.dto.PatternResponseDto;
import com.dsarevision.dto.ProblemResponseDto;
import com.dsarevision.dto.UserPatternResponseDto;
import com.dsarevision.service.PatternService;
import com.dsarevision.service.UserProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patterns")
public class PatternController {

    private final PatternService patternService;
    private final UserProgressService userProgressService;

    public PatternController(PatternService patternService, UserProgressService userProgressService) {
        this.patternService = patternService;
        this.userProgressService = userProgressService;
    }

    @GetMapping
    public ResponseEntity<List<PatternResponseDto>> getAllPatterns(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(patternService.getAllPatterns(category, difficulty));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatternResponseDto> getPatternById(@PathVariable Long id) {
        return ResponseEntity.ok(patternService.getPatternById(id));
    }

    @GetMapping("/{id}/problems")
    public ResponseEntity<List<ProblemResponseDto>> getProblemsByPattern(@PathVariable Long id) {
        return ResponseEntity.ok(patternService.getProblemsByPatternId(id));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<UserPatternResponseDto> getPatternProgress(
            @PathVariable Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.getUserProgressForPattern(principal.getId(), id));
    }

    @PostMapping
    public ResponseEntity<PatternResponseDto> createPattern(
            @jakarta.validation.Valid @RequestBody com.dsarevision.dto.CreatePatternDto request) {
        PatternResponseDto response = patternService.createPattern(request);
        return new ResponseEntity<>(response, org.springframework.http.HttpStatus.CREATED);
    }

    @PostMapping("/{id}/problems")
    public ResponseEntity<ProblemResponseDto> addProblem(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody com.dsarevision.dto.CreateProblemDto request) {
        ProblemResponseDto response = patternService.addProblem(id, request);
        return new ResponseEntity<>(response, org.springframework.http.HttpStatus.CREATED);
    }
}

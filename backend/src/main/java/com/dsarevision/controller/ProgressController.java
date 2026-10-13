package com.dsarevision.controller;

import com.dsarevision.dto.ProgressSummaryDto;
import com.dsarevision.dto.UserPatternResponseDto;
import com.dsarevision.service.UserProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final UserProgressService userProgressService;

    public ProgressController(UserProgressService userProgressService) {
        this.userProgressService = userProgressService;
    }

    @GetMapping
    public ResponseEntity<ProgressSummaryDto> getProgressSummary(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.getProgressSummary(principal.getId()));
    }

    @GetMapping("/details")
    public ResponseEntity<List<UserPatternResponseDto>> getAllUserProgress(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.getAllUserProgress(principal.getId()));
    }

    @GetMapping("/weak-areas")
    public ResponseEntity<List<UserPatternResponseDto>> getWeakAreas(
            @RequestParam(required = false, defaultValue = "5") int limit,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.getWeakAreas(principal.getId(), limit));
    }
}

package com.dsarevision.controller;

import com.dsarevision.dto.RevisionHistoryResponseDto;
import com.dsarevision.dto.RevisionRequestDto;
import com.dsarevision.dto.RevisionResponseDto;
import com.dsarevision.dto.UserPatternResponseDto;
import com.dsarevision.service.RevisionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revisions")
public class RevisionController {

    private final RevisionService revisionService;

    public RevisionController(RevisionService revisionService) {
        this.revisionService = revisionService;
    }

    @PostMapping
    public ResponseEntity<RevisionResponseDto> recordRevision(
            @Valid @RequestBody RevisionRequestDto request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        RevisionResponseDto response = revisionService.recordRevision(principal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/history")
    public ResponseEntity<List<RevisionHistoryResponseDto>> getRevisionHistory(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(revisionService.getRevisionHistory(principal.getId()));
    }

    @GetMapping("/history/{patternId}")
    public ResponseEntity<List<RevisionHistoryResponseDto>> getRevisionHistoryForPattern(
            @PathVariable Long patternId,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(revisionService.getRevisionHistoryForPattern(principal.getId(), patternId));
    }

    @GetMapping("/today")
    public ResponseEntity<List<UserPatternResponseDto>> getTodayRevisions(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(revisionService.getTodayRevisions(principal.getId()));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<UserPatternResponseDto>> getOverdueRevisions(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(revisionService.getOverdueRevisions(principal.getId()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<UserPatternResponseDto>> getUpcomingRevisions(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsarevision.config.UserPrincipal principal) {
        return ResponseEntity.ok(revisionService.getUpcomingRevisions(principal.getId()));
    }
}

package com.dsarevision.service;

import com.dsarevision.dto.RevisionHistoryResponseDto;
import com.dsarevision.dto.RevisionRequestDto;
import com.dsarevision.dto.RevisionResponseDto;
import com.dsarevision.dto.UserPatternResponseDto;
import com.dsarevision.entity.Pattern;
import com.dsarevision.entity.RevisionHistory;
import com.dsarevision.entity.User;
import com.dsarevision.entity.UserPattern;
import com.dsarevision.exception.ResourceNotFoundException;
import com.dsarevision.repository.PatternRepository;
import com.dsarevision.repository.RevisionHistoryRepository;
import com.dsarevision.repository.UserPatternRepository;
import com.dsarevision.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class RevisionService {

    private final UserPatternRepository userPatternRepository;
    private final RevisionHistoryRepository revisionHistoryRepository;
    private final PatternRepository patternRepository;
    private final UserRepository userRepository;
    private final SpacedRepetitionService spacedRepetitionService;
    private final UserProgressService userProgressService;

    public RevisionService(
            UserPatternRepository userPatternRepository,
            RevisionHistoryRepository revisionHistoryRepository,
            PatternRepository patternRepository,
            UserRepository userRepository,
            SpacedRepetitionService spacedRepetitionService,
            UserProgressService userProgressService) {
        this.userPatternRepository = userPatternRepository;
        this.revisionHistoryRepository = revisionHistoryRepository;
        this.patternRepository = patternRepository;
        this.userRepository = userRepository;
        this.spacedRepetitionService = spacedRepetitionService;
        this.userProgressService = userProgressService;
    }

    public RevisionResponseDto recordRevision(Long userId, RevisionRequestDto request) {
        Pattern pattern = patternRepository.findById(request.getPatternId())
                .orElseThrow(() -> new ResourceNotFoundException("Pattern", "id", request.getPatternId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Find or create UserPattern progress record (prevents duplicates)
        UserPattern userPattern = userPatternRepository.findByUserIdAndPatternId(user.getId(), pattern.getId())
                .orElseGet(() -> {
                    UserPattern newUp = new UserPattern(user, pattern);
                    return userPatternRepository.save(newUp);
                });

        // Calculate schedule
        SpacedRepetitionService.SchedulingResult schedule = spacedRepetitionService.calculateSchedule(
                userPattern.getMastery(),
                userPattern.getRevisionCount(),
                request.getAssessment()
        );

        // Update progress entity
        userPattern.setLastRevised(LocalDate.now());
        userPattern.setNextRevision(schedule.nextRevisionDate());
        userPattern.setRevisionCount(schedule.newRevisionCount());
        userPattern.setMastery(schedule.newMastery());
        userPattern = userPatternRepository.save(userPattern);

        // Record audit history
        RevisionHistory history = new RevisionHistory(
                user,
                pattern,
                LocalDateTime.now(),
                schedule.normalizedAssessment(),
                request.getNotes() != null ? request.getNotes().trim() : ""
        );
        revisionHistoryRepository.save(history);

        // Prepare response
        RevisionResponseDto response = new RevisionResponseDto();
        response.setUserPatternId(userPattern.getId());
        response.setPatternId(pattern.getId());
        response.setPatternName(pattern.getName());
        response.setAssessment(schedule.normalizedAssessment());
        response.setMastery(userPattern.getMastery());
        response.setLastRevised(userPattern.getLastRevised());
        response.setNextRevision(userPattern.getNextRevision());
        response.setIntervalDays(schedule.intervalDays());
        response.setRevisionCount(userPattern.getRevisionCount());
        response.setNotes(history.getNotes());
        return response;
    }

    @Transactional(readOnly = true)
    public List<RevisionHistoryResponseDto> getRevisionHistory(Long userId) {
        return revisionHistoryRepository.findByUserIdOrderByRevisionDateDesc(userId).stream()
                .map(this::toHistoryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RevisionHistoryResponseDto> getRevisionHistoryForPattern(Long userId, Long patternId) {
        if (!patternRepository.existsById(patternId)) {
            throw new ResourceNotFoundException("Pattern", "id", patternId);
        }
        return revisionHistoryRepository.findByUserIdAndPatternIdOrderByRevisionDateDesc(userId, patternId).stream()
                .map(this::toHistoryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserPatternResponseDto> getTodayRevisions(Long userId) {
        LocalDate today = LocalDate.now();
        return userPatternRepository.findByUserIdAndNextRevision(userId, today).stream()
                .map(userProgressService::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserPatternResponseDto> getOverdueRevisions(Long userId) {
        LocalDate today = LocalDate.now();
        return userPatternRepository.findByUserIdAndNextRevisionBefore(userId, today).stream()
                .map(userProgressService::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserPatternResponseDto> getUpcomingRevisions(Long userId) {
        LocalDate today = LocalDate.now();
        return userPatternRepository.findByUserIdAndNextRevisionAfter(userId, today).stream()
                .map(userProgressService::toDto)
                .toList();
    }


    private RevisionHistoryResponseDto toHistoryDto(RevisionHistory rh) {
        RevisionHistoryResponseDto dto = new RevisionHistoryResponseDto();
        dto.setId(rh.getId());
        dto.setUserId(rh.getUser().getId());
        dto.setPatternId(rh.getPattern().getId());
        dto.setPatternName(rh.getPattern().getName());
        dto.setPatternCategory(rh.getPattern().getCategory());
        dto.setRevisionDate(rh.getRevisionDate());
        dto.setConfidence(rh.getConfidence());
        dto.setNotes(rh.getNotes());
        return dto;
    }
}

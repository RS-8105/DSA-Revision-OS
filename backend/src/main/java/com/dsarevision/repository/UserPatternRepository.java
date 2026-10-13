package com.dsarevision.repository;

import com.dsarevision.entity.Pattern;
import com.dsarevision.entity.User;
import com.dsarevision.entity.UserPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserPatternRepository extends JpaRepository<UserPattern, Long> {

    Optional<UserPattern> findByUserIdAndPatternId(Long userId, Long patternId);

    Optional<UserPattern> findByUserAndPattern(User user, Pattern pattern);

    List<UserPattern> findByUserId(Long userId);

    List<UserPattern> findByUser(User user);

    boolean existsByUserIdAndPatternId(Long userId, Long patternId);

    // Revisions due on exact date (e.g. today)
    List<UserPattern> findByUserIdAndNextRevision(Long userId, LocalDate date);

    // Overdue revisions (scheduled before date)
    List<UserPattern> findByUserIdAndNextRevisionBefore(Long userId, LocalDate date);

    // Overdue or due today
    List<UserPattern> findByUserIdAndNextRevisionLessThanEqual(Long userId, LocalDate date);

    // Upcoming revisions (scheduled after date)
    List<UserPattern> findByUserIdAndNextRevisionAfter(Long userId, LocalDate date);

    // Revisions within a date range (for calendar view)
    List<UserPattern> findByUserIdAndNextRevisionBetween(Long userId, LocalDate startDate, LocalDate endDate);

    // Analytics: weak patterns (lowest mastery)
    List<UserPattern> findByUserIdOrderByMasteryAsc(Long userId);

    // Analytics: strong patterns (highest mastery)
    List<UserPattern> findByUserIdOrderByMasteryDesc(Long userId);

    // Category breakdown
    List<UserPattern> findByUserIdAndPattern_Category(Long userId, String category);
}

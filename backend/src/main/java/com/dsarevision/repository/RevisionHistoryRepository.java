package com.dsarevision.repository;

import com.dsarevision.entity.Pattern;
import com.dsarevision.entity.RevisionHistory;
import com.dsarevision.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevisionHistoryRepository extends JpaRepository<RevisionHistory, Long> {

    List<RevisionHistory> findByUserOrderByRevisionDateDesc(User user);

    List<RevisionHistory> findByUserIdOrderByRevisionDateDesc(Long userId);

    List<RevisionHistory> findByUserIdAndPatternIdOrderByRevisionDateDesc(Long userId, Long patternId);

    List<RevisionHistory> findByUserIdAndConfidenceOrderByRevisionDateDesc(Long userId, String confidence);

    long countByUserId(Long userId);

    long countByUserIdAndPatternId(Long userId, Long patternId);
}

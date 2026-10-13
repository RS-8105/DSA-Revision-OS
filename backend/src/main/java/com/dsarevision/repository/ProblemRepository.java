package com.dsarevision.repository;

import com.dsarevision.entity.Pattern;
import com.dsarevision.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByPattern(Pattern pattern);

    List<Problem> findByPatternId(Long patternId);

    List<Problem> findByDifficulty(String difficulty);

    long countByPatternId(Long patternId);
}

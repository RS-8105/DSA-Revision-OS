package com.dsarevision.repository;

import com.dsarevision.entity.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatternRepository extends JpaRepository<Pattern, Long> {

    List<Pattern> findByCategory(String category);

    List<Pattern> findByCategoryIgnoreCase(String category);

    List<Pattern> findByDifficulty(String difficulty);

    Optional<Pattern> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}

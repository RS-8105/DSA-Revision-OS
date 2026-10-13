package com.dsarevision.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "user_patterns",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_pattern", columnNames = {"user_id", "pattern_id"})
    }
)
public class UserPattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pattern_id", nullable = false)
    private Pattern pattern;

    @Column(nullable = false)
    private Integer mastery = 0;

    @Column(name = "last_revised")
    private LocalDate lastRevised;

    @Column(name = "next_revision")
    private LocalDate nextRevision;

    @Column(name = "revision_count", nullable = false)
    private Integer revisionCount = 0;

    public UserPattern() {
    }

    public UserPattern(User user, Pattern pattern) {
        this.user = user;
        this.pattern = pattern;
        this.mastery = 0;
        this.revisionCount = 0;
    }

    public UserPattern(User user, Pattern pattern, Integer mastery, LocalDate lastRevised, LocalDate nextRevision, Integer revisionCount) {
        this.user = user;
        this.pattern = pattern;
        this.mastery = mastery != null ? mastery : 0;
        this.lastRevised = lastRevised;
        this.nextRevision = nextRevision;
        this.revisionCount = revisionCount != null ? revisionCount : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pattern getPattern() {
        return pattern;
    }

    public void setPattern(Pattern pattern) {
        this.pattern = pattern;
    }

    public Integer getMastery() {
        return mastery;
    }

    public void setMastery(Integer mastery) {
        this.mastery = mastery;
    }

    public LocalDate getLastRevised() {
        return lastRevised;
    }

    public void setLastRevised(LocalDate lastRevised) {
        this.lastRevised = lastRevised;
    }

    public LocalDate getNextRevision() {
        return nextRevision;
    }

    public void setNextRevision(LocalDate nextRevision) {
        this.nextRevision = nextRevision;
    }

    public Integer getRevisionCount() {
        return revisionCount;
    }

    public void setRevisionCount(Integer revisionCount) {
        this.revisionCount = revisionCount;
    }
}

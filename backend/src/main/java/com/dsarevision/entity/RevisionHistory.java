package com.dsarevision.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "revision_history")
public class RevisionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pattern_id", nullable = false)
    private Pattern pattern;

    @Column(name = "revision_date", nullable = false)
    private LocalDateTime revisionDate;

    @NotBlank
    @Column(nullable = false)
    private String confidence;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public RevisionHistory() {
    }

    public RevisionHistory(User user, Pattern pattern, LocalDateTime revisionDate, String confidence, String notes) {
        this.user = user;
        this.pattern = pattern;
        this.revisionDate = revisionDate;
        this.confidence = confidence;
        this.notes = notes;
    }

    @PrePersist
    protected void onCreate() {
        if (this.revisionDate == null) {
            this.revisionDate = LocalDateTime.now();
        }
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

    public LocalDateTime getRevisionDate() {
        return revisionDate;
    }

    public void setRevisionDate(LocalDateTime revisionDate) {
        this.revisionDate = revisionDate;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * LandingPageView tracks analytics for landing page views
 * Aggregates views per day for each landing page
 */
@Entity
@Table(name = "landing_page_views", uniqueConstraints = {
        @UniqueConstraint(name = "uk_landing_page_date", columnNames = {"landing_page_id", "view_date"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landing_page_id", nullable = false)
    private LandingPage landingPage;

    @Column(name = "view_date", nullable = false)
    private LocalDate viewDate;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 1;

    @Column(name = "unique_visitors")
    @Builder.Default
    private Integer uniqueVisitors = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


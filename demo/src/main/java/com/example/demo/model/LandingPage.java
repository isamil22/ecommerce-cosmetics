package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * LandingPage entity represents a customizable landing page for products
 * Admins can create landing pages with drag-and-drop sections like WordPress
 */
@Entity
@Table(name = "landing_pages", indexes = {
        @Index(name = "idx_slug", columnList = "slug"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_product_id", columnList = "product_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug; // URL-friendly identifier (e.g., 'summer-serum-2024')

    @Column(name = "meta_title")
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LandingPageStatus status = LandingPageStatus.DRAFT;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "landingPage", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sectionOrder ASC")
    @JsonManagedReference
    @Builder.Default
    private List<LandingPageSection> sections = new ArrayList<>();

    @OneToOne(mappedBy = "landingPage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private LandingPageSettings settings;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public void addSection(LandingPageSection section) {
        sections.add(section);
        section.setLandingPage(this);
    }

    public void removeSection(LandingPageSection section) {
        sections.remove(section);
        section.setLandingPage(null);
    }

    public enum LandingPageStatus {
        DRAFT,      // Not yet published
        PUBLISHED,  // Live and visible to public
        ARCHIVED    // No longer active
    }
}


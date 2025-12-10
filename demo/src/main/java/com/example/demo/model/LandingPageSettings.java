package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * LandingPageSettings stores theme and customization settings for a landing page
 */
@Entity
@Table(name = "landing_page_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landing_page_id", nullable = false, unique = true)
    @JsonBackReference
    private LandingPage landingPage;

    @Column(name = "theme_color")
    @Builder.Default
    private String themeColor = "#ff69b4"; // Primary brand color

    @Column(name = "font_family")
    @Builder.Default
    private String fontFamily = "Arial, sans-serif";

    @Column(name = "custom_css", columnDefinition = "TEXT")
    private String customCss; // Allow advanced users to add custom CSS

    @Column(name = "custom_js", columnDefinition = "TEXT")
    private String customJs; // Allow advanced users to add custom JavaScript

    @Column(name = "favicon_url", length = 500)
    private String faviconUrl;

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


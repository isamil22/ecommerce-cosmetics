package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * LandingPageSection represents individual sections within a landing page
 * Each section has a type (HERO, BENEFITS, etc.) and stores its configuration
 * as JSON
 */
@Entity
@Table(name = "landing_page_sections", indexes = {
        @Index(name = "idx_landing_page_order", columnList = "landing_page_id,section_order")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landing_page_id", nullable = false)
    @JsonBackReference
    private LandingPage landingPage;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false)
    private SectionType sectionType;

    @Column(name = "section_order", nullable = false)
    private Integer sectionOrder;

    /**
     * Section data stored as JSON
     * Contains all configuration for this section (text, images, colors, etc.)
     * Example for HERO section:
     * {
     * "headline": "Amazing Product!",
     * "subheadline": "Transform your life today",
     * "backgroundImage": "/images/hero-bg.jpg",
     * "ctaText": "Buy Now - $49.99",
     * "ctaLink": "#order",
     * "backgroundColor": "#ffeef8"
     * }
     */
    @Column(name = "section_data", columnDefinition = "JSON", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> sectionData;

    @Column(name = "is_visible")
    @Builder.Default
    private Boolean isVisible = true;

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

    /**
     * Section types matching the wireframe design
     */
    public enum SectionType {
        HERO, // Hero section with main CTA
        HERO_PREMIUM, // 3D Hero section with premium effects
        FEATURES_ZIGZAG, // Alternating text and image features
        TRUST_SIGNALS, // Trust badges (certifications, guarantees, etc.)
        PRODUCT_SHOWCASE, // Large product image with description
        KEY_BENEFITS, // 3-6 key benefits with icons
        BEFORE_AFTER, // Before/After comparison images
        HOW_IT_WORKS, // Step-by-step guide
        INGREDIENTS, // Product ingredients with images
        TESTIMONIALS, // Customer reviews and testimonials
        FAQ, // Frequently Asked Questions (accordion)
        URGENCY_BANNER, // Limited time offer with countdown
        FINAL_CTA, // Final call-to-action
        CUSTOM_HTML // Custom HTML section for advanced users
    }
}

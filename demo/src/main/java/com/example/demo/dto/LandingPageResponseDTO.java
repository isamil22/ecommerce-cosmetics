package com.example.demo.dto;

import com.example.demo.model.LandingPage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Full DTO for LandingPage with all sections and settings
 * Used when retrieving complete landing page data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String title;
    private String slug;
    private String metaTitle;
    private String metaDescription;
    private LandingPage.LandingPageStatus status;
    private LocalDateTime publishedAt;
    private Long createdBy;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<LandingPageSectionDTO> sections;
    private LandingPageSettingsDTO settings;
}


package com.example.demo.dto;

import com.example.demo.model.LandingPage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for basic LandingPage information (without sections)
 * Used in list views and summaries
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageDTO {
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
    private Integer totalViews; // Total views count
}


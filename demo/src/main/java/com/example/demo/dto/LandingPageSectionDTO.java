package com.example.demo.dto;

import com.example.demo.model.LandingPageSection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for LandingPageSection
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageSectionDTO {
    private Long id;
    private LandingPageSection.SectionType sectionType;
    private Integer sectionOrder;
    private Map<String, Object> sectionData;
    private Boolean isVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


package com.example.demo.dto;

import com.example.demo.model.LandingPage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for creating or updating a LandingPage
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase with hyphens only (e.g., 'summer-serum-2024')")
    private String slug;

    private Long productId; // Optional: link to a specific product

    private String metaTitle;

    private String metaDescription;

    private LandingPage.LandingPageStatus status;

    private List<LandingPageSectionDTO> sections;

    private LandingPageSettingsDTO settings;
}


package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for LandingPageSettings
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageSettingsDTO {
    private Long id;
    private String themeColor;
    private String fontFamily;
    private String customCss;
    private String customJs;
    private String faviconUrl;
}


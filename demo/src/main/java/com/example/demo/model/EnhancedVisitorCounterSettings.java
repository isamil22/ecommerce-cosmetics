package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

/**
 * Enhanced Visitor Counter Settings Model
 * Allows management of all visitor counter metrics individually
 */
@Entity
@Data
public class EnhancedVisitorCounterSettings {

    @Id
    private Long id = 1L; // Fixed ID for single settings record

    // Current Viewers Settings
    private boolean currentViewersEnabled = true;
    private int currentViewersMin = 5;
    private int currentViewersMax = 25;

    // Total Views Settings
    private boolean totalViewsEnabled = true;
    private int totalViewsMin = 100;
    private int totalViewsMax = 500;

    // Added Today Settings
    private boolean addedTodayEnabled = true;
    private int addedTodayMin = 1;
    private int addedTodayMax = 10;

    // Activity Settings
    private boolean activityEnabled = true;
    private int activityMin = 20;
    private int activityMax = 80;

    // Display Settings
    private boolean showBilingualText = true;
    private String customTitle = "Live Statistics";
    private String backgroundColor = "#f3f4f6";
    private String textColor = "#374151";
    private String borderColor = "#d1d5db";

    // Animation Settings
    private boolean enableAnimations = true;
    private int animationSpeed = 3000; // milliseconds between updates
    private boolean enableFadeEffect = true;

    // Global Settings
    private boolean globalEnabled = true;
    private String lastUpdated;
}

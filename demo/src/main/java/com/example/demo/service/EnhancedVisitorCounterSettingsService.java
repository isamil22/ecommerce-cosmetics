package com.example.demo.service;

import com.example.demo.model.EnhancedVisitorCounterSettings;
import com.example.demo.repositories.EnhancedVisitorCounterSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EnhancedVisitorCounterSettingsService {

    @Autowired
    private EnhancedVisitorCounterSettingsRepository repository;

    private static final Long SETTINGS_ID = 1L;

    /**
     * Get enhanced visitor counter settings
     */
    public EnhancedVisitorCounterSettings getSettings() {
        return repository.findById(SETTINGS_ID).orElseGet(() -> {
            EnhancedVisitorCounterSettings defaultSettings = new EnhancedVisitorCounterSettings();
            defaultSettings.setId(SETTINGS_ID);
            defaultSettings.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            return repository.save(defaultSettings);
        });
    }

    /**
     * Update enhanced visitor counter settings
     */
    public EnhancedVisitorCounterSettings updateSettings(EnhancedVisitorCounterSettings newSettings) {
        EnhancedVisitorCounterSettings settings = repository.findById(SETTINGS_ID)
                .orElse(new EnhancedVisitorCounterSettings());

        // Update all settings
        settings.setId(SETTINGS_ID);
        
        // Current Viewers
        settings.setCurrentViewersEnabled(newSettings.isCurrentViewersEnabled());
        settings.setCurrentViewersMin(newSettings.getCurrentViewersMin());
        settings.setCurrentViewersMax(newSettings.getCurrentViewersMax());
        
        // Total Views
        settings.setTotalViewsEnabled(newSettings.isTotalViewsEnabled());
        settings.setTotalViewsMin(newSettings.getTotalViewsMin());
        settings.setTotalViewsMax(newSettings.getTotalViewsMax());
        
        // Added Today
        settings.setAddedTodayEnabled(newSettings.isAddedTodayEnabled());
        settings.setAddedTodayMin(newSettings.getAddedTodayMin());
        settings.setAddedTodayMax(newSettings.getAddedTodayMax());
        
        // Activity
        settings.setActivityEnabled(newSettings.isActivityEnabled());
        settings.setActivityMin(newSettings.getActivityMin());
        settings.setActivityMax(newSettings.getActivityMax());
        
        // Display Settings
        settings.setShowBilingualText(newSettings.isShowBilingualText());
        settings.setCustomTitle(newSettings.getCustomTitle());
        settings.setBackgroundColor(newSettings.getBackgroundColor());
        settings.setTextColor(newSettings.getTextColor());
        settings.setBorderColor(newSettings.getBorderColor());
        
        // Animation Settings
        settings.setEnableAnimations(newSettings.isEnableAnimations());
        settings.setAnimationSpeed(newSettings.getAnimationSpeed());
        settings.setEnableFadeEffect(newSettings.isEnableFadeEffect());
        
        // Global Settings
        settings.setGlobalEnabled(newSettings.isGlobalEnabled());
        settings.setLastUpdated(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return repository.save(settings);
    }

    /**
     * Get settings for specific metric
     */
    public Object getMetricSettings(String metricType) {
        EnhancedVisitorCounterSettings settings = getSettings();
        
        switch (metricType.toLowerCase()) {
            case "currentviewers":
                return new Object() {
                    public final boolean enabled = settings.isCurrentViewersEnabled();
                    public final int min = settings.getCurrentViewersMin();
                    public final int max = settings.getCurrentViewersMax();
                };
            case "totalviews":
                return new Object() {
                    public final boolean enabled = settings.isTotalViewsEnabled();
                    public final int min = settings.getTotalViewsMin();
                    public final int max = settings.getTotalViewsMax();
                };
            case "addedtoday":
                return new Object() {
                    public final boolean enabled = settings.isAddedTodayEnabled();
                    public final int min = settings.getAddedTodayMin();
                    public final int max = settings.getAddedTodayMax();
                };
            case "activity":
                return new Object() {
                    public final boolean enabled = settings.isActivityEnabled();
                    public final int min = settings.getActivityMin();
                    public final int max = settings.getActivityMax();
                };
            default:
                return settings;
        }
    }
}

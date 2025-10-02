package com.example.demo.controller;

import com.example.demo.model.NotificationSetting;
import com.example.demo.service.NotificationSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/notification-settings")
public class NotificationSettingController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationSettingController.class);

    @Autowired
    private NotificationSettingService notificationSettingService;

    /**
     * Get notification settings
     * Public endpoint so frontend can fetch settings
     */
    @GetMapping
    public ResponseEntity<NotificationSetting> getSettings() {
        try {
            logger.info("Fetching notification settings");
            NotificationSetting settings = notificationSettingService.getSettings();
            logger.debug("Successfully retrieved notification settings: enabled={}, maxNotifications={}", 
                        settings.getEnabled(), settings.getMaxNotifications());
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            logger.error("Error fetching notification settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update notification settings
     * Restricted to ADMIN users only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSettings(@RequestBody NotificationSetting newSettings) {
        logger.info("Updating notification settings");
        
        // Validate settings
        if (!notificationSettingService.validateSettings(newSettings)) {
            logger.warn("Invalid notification settings provided: {}", newSettings);
            return ResponseEntity.badRequest()
                    .body("Invalid notification settings. Please check your input values.");
        }
        
        try {
            NotificationSetting updatedSettings = notificationSettingService.updateSettings(newSettings);
            logger.info("Successfully updated notification settings: enabled={}, maxNotifications={}", 
                       updatedSettings.getEnabled(), updatedSettings.getMaxNotifications());
            return ResponseEntity.ok(updatedSettings);
        } catch (Exception e) {
            logger.error("Error updating notification settings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update notification settings: " + e.getMessage());
        }
    }
}

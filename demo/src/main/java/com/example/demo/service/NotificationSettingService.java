package com.example.demo.service;

import com.example.demo.model.NotificationSetting;
import com.example.demo.repositories.NotificationSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationSettingService {
    
    @Autowired
    private NotificationSettingRepository notificationSettingRepository;
    
    /**
     * Get the notification settings. If none exist, create default settings.
     */
    public NotificationSetting getSettings() {
        return notificationSettingRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    // Create default settings if none exist
                    NotificationSetting defaultSettings = new NotificationSetting();
                    defaultSettings.setEnabled(false);
                    defaultSettings.setMaxNotifications(5);
                    defaultSettings.setMinIntervalSeconds(8);
                    defaultSettings.setMaxIntervalSeconds(15);
                    defaultSettings.setShowPurchaseNotifications(true);
                    defaultSettings.setShowViewingNotifications(true);
                    defaultSettings.setShowCartNotifications(true);
                    defaultSettings.setPosition("bottom-left");
                    defaultSettings.setNotificationDurationSeconds(5);
                    
                    return notificationSettingRepository.save(defaultSettings);
                });
    }
    
    /**
     * Update notification settings
     */
    public NotificationSetting updateSettings(NotificationSetting newSettings) {
        NotificationSetting existingSettings = getSettings();
        
        // Update all fields
        existingSettings.setEnabled(newSettings.getEnabled() != null ? newSettings.getEnabled() : existingSettings.getEnabled());
        existingSettings.setMaxNotifications(newSettings.getMaxNotifications() != null ? newSettings.getMaxNotifications() : existingSettings.getMaxNotifications());
        existingSettings.setMinIntervalSeconds(newSettings.getMinIntervalSeconds() != null ? newSettings.getMinIntervalSeconds() : existingSettings.getMinIntervalSeconds());
        existingSettings.setMaxIntervalSeconds(newSettings.getMaxIntervalSeconds() != null ? newSettings.getMaxIntervalSeconds() : existingSettings.getMaxIntervalSeconds());
        existingSettings.setShowPurchaseNotifications(newSettings.getShowPurchaseNotifications() != null ? newSettings.getShowPurchaseNotifications() : existingSettings.getShowPurchaseNotifications());
        existingSettings.setShowViewingNotifications(newSettings.getShowViewingNotifications() != null ? newSettings.getShowViewingNotifications() : existingSettings.getShowViewingNotifications());
        existingSettings.setShowCartNotifications(newSettings.getShowCartNotifications() != null ? newSettings.getShowCartNotifications() : existingSettings.getShowCartNotifications());
        existingSettings.setPosition(newSettings.getPosition() != null ? newSettings.getPosition() : existingSettings.getPosition());
        existingSettings.setNotificationDurationSeconds(newSettings.getNotificationDurationSeconds() != null ? newSettings.getNotificationDurationSeconds() : existingSettings.getNotificationDurationSeconds());
        
        return notificationSettingRepository.save(existingSettings);
    }
    
    /**
     * Validate notification settings
     */
    public boolean validateSettings(NotificationSetting settings) {
        if (settings.getMaxNotifications() != null && settings.getMaxNotifications() < 1) {
            return false;
        }
        if (settings.getMaxNotifications() != null && settings.getMaxNotifications() > 20) {
            return false;
        }
        if (settings.getMinIntervalSeconds() != null && settings.getMinIntervalSeconds() < 1) {
            return false;
        }
        if (settings.getMaxIntervalSeconds() != null && settings.getMaxIntervalSeconds() < 1) {
            return false;
        }
        if (settings.getMinIntervalSeconds() != null && settings.getMaxIntervalSeconds() != null 
            && settings.getMinIntervalSeconds() > settings.getMaxIntervalSeconds()) {
            return false;
        }
        if (settings.getNotificationDurationSeconds() != null && settings.getNotificationDurationSeconds() < 1) {
            return false;
        }
        if (settings.getNotificationDurationSeconds() != null && settings.getNotificationDurationSeconds() > 60) {
            return false;
        }
        return true;
    }
}

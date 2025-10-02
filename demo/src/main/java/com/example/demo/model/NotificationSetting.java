package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_settings")
public class NotificationSetting {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "enabled", nullable = false)
    private Boolean enabled = false;
    
    @Column(name = "max_notifications", nullable = false)
    private Integer maxNotifications = 5;
    
    @Column(name = "min_interval_seconds", nullable = false)
    private Integer minIntervalSeconds = 8;
    
    @Column(name = "max_interval_seconds", nullable = false)
    private Integer maxIntervalSeconds = 15;
    
    @Column(name = "show_purchase_notifications", nullable = false)
    private Boolean showPurchaseNotifications = true;
    
    @Column(name = "show_viewing_notifications", nullable = false)
    private Boolean showViewingNotifications = true;
    
    @Column(name = "show_cart_notifications", nullable = false)
    private Boolean showCartNotifications = true;
    
    @Column(name = "position", nullable = false)
    private String position = "bottom-left"; // bottom-left, bottom-right, top-left, top-right
    
    @Column(name = "notification_duration_seconds", nullable = false)
    private Integer notificationDurationSeconds = 5;
    
    // Constructors
    public NotificationSetting() {}
    
    public NotificationSetting(Boolean enabled, Integer maxNotifications, Integer minIntervalSeconds, 
                             Integer maxIntervalSeconds, Boolean showPurchaseNotifications, 
                             Boolean showViewingNotifications, Boolean showCartNotifications, 
                             String position, Integer notificationDurationSeconds) {
        this.enabled = enabled;
        this.maxNotifications = maxNotifications;
        this.minIntervalSeconds = minIntervalSeconds;
        this.maxIntervalSeconds = maxIntervalSeconds;
        this.showPurchaseNotifications = showPurchaseNotifications;
        this.showViewingNotifications = showViewingNotifications;
        this.showCartNotifications = showCartNotifications;
        this.position = position;
        this.notificationDurationSeconds = notificationDurationSeconds;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Boolean getEnabled() {
        return enabled;
    }
    
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
    
    public Integer getMaxNotifications() {
        return maxNotifications;
    }
    
    public void setMaxNotifications(Integer maxNotifications) {
        this.maxNotifications = maxNotifications;
    }
    
    public Integer getMinIntervalSeconds() {
        return minIntervalSeconds;
    }
    
    public void setMinIntervalSeconds(Integer minIntervalSeconds) {
        this.minIntervalSeconds = minIntervalSeconds;
    }
    
    public Integer getMaxIntervalSeconds() {
        return maxIntervalSeconds;
    }
    
    public void setMaxIntervalSeconds(Integer maxIntervalSeconds) {
        this.maxIntervalSeconds = maxIntervalSeconds;
    }
    
    public Boolean getShowPurchaseNotifications() {
        return showPurchaseNotifications;
    }
    
    public void setShowPurchaseNotifications(Boolean showPurchaseNotifications) {
        this.showPurchaseNotifications = showPurchaseNotifications;
    }
    
    public Boolean getShowViewingNotifications() {
        return showViewingNotifications;
    }
    
    public void setShowViewingNotifications(Boolean showViewingNotifications) {
        this.showViewingNotifications = showViewingNotifications;
    }
    
    public Boolean getShowCartNotifications() {
        return showCartNotifications;
    }
    
    public void setShowCartNotifications(Boolean showCartNotifications) {
        this.showCartNotifications = showCartNotifications;
    }
    
    public String getPosition() {
        return position;
    }
    
    public void setPosition(String position) {
        this.position = position;
    }
    
    public Integer getNotificationDurationSeconds() {
        return notificationDurationSeconds;
    }
    
    public void setNotificationDurationSeconds(Integer notificationDurationSeconds) {
        this.notificationDurationSeconds = notificationDurationSeconds;
    }
}

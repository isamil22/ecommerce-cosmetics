package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Countdown {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Settings
    private String title;
    private LocalDateTime endDate;
    private boolean enabled;
    
    // Color Settings
    private String backgroundColor;
    private String textColor;
    private String borderColor;
    private String timerBoxColor;
    private String timerTextColor;
    private String urgentBgColor;
    private String urgentTextColor;
    
    // Text Settings
    private String subtitle;
    private String urgentMessage;
    private String expiredMessage;
    private String packName;
    
    // Display Settings
    private boolean showDays;
    private boolean showHours;
    private boolean showMinutes;
    private boolean showSeconds;
    private boolean showPackName;
    private boolean showSubtitle;
    
    // Animation Settings
    private boolean enablePulse;
    private boolean enableBounce;
    private int urgentThreshold;
    
    // Layout Settings
    private int borderRadius;
    private int padding;
    private int fontSize;
    private int timerFontSize;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Basic Settings
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    // Color Settings
    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public String getTextColor() {
        return textColor;
    }

    public void setTextColor(String textColor) {
        this.textColor = textColor;
    }

    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    public String getTimerBoxColor() {
        return timerBoxColor;
    }

    public void setTimerBoxColor(String timerBoxColor) {
        this.timerBoxColor = timerBoxColor;
    }

    public String getTimerTextColor() {
        return timerTextColor;
    }

    public void setTimerTextColor(String timerTextColor) {
        this.timerTextColor = timerTextColor;
    }

    public String getUrgentBgColor() {
        return urgentBgColor;
    }

    public void setUrgentBgColor(String urgentBgColor) {
        this.urgentBgColor = urgentBgColor;
    }

    public String getUrgentTextColor() {
        return urgentTextColor;
    }

    public void setUrgentTextColor(String urgentTextColor) {
        this.urgentTextColor = urgentTextColor;
    }

    // Text Settings
    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getUrgentMessage() {
        return urgentMessage;
    }

    public void setUrgentMessage(String urgentMessage) {
        this.urgentMessage = urgentMessage;
    }

    public String getExpiredMessage() {
        return expiredMessage;
    }

    public void setExpiredMessage(String expiredMessage) {
        this.expiredMessage = expiredMessage;
    }

    public String getPackName() {
        return packName;
    }

    public void setPackName(String packName) {
        this.packName = packName;
    }

    // Display Settings
    public boolean isShowDays() {
        return showDays;
    }

    public void setShowDays(boolean showDays) {
        this.showDays = showDays;
    }

    public boolean isShowHours() {
        return showHours;
    }

    public void setShowHours(boolean showHours) {
        this.showHours = showHours;
    }

    public boolean isShowMinutes() {
        return showMinutes;
    }

    public void setShowMinutes(boolean showMinutes) {
        this.showMinutes = showMinutes;
    }

    public boolean isShowSeconds() {
        return showSeconds;
    }

    public void setShowSeconds(boolean showSeconds) {
        this.showSeconds = showSeconds;
    }

    public boolean isShowPackName() {
        return showPackName;
    }

    public void setShowPackName(boolean showPackName) {
        this.showPackName = showPackName;
    }

    public boolean isShowSubtitle() {
        return showSubtitle;
    }

    public void setShowSubtitle(boolean showSubtitle) {
        this.showSubtitle = showSubtitle;
    }

    // Animation Settings
    public boolean isEnablePulse() {
        return enablePulse;
    }

    public void setEnablePulse(boolean enablePulse) {
        this.enablePulse = enablePulse;
    }

    public boolean isEnableBounce() {
        return enableBounce;
    }

    public void setEnableBounce(boolean enableBounce) {
        this.enableBounce = enableBounce;
    }

    public int getUrgentThreshold() {
        return urgentThreshold;
    }

    public void setUrgentThreshold(int urgentThreshold) {
        this.urgentThreshold = urgentThreshold;
    }

    // Layout Settings
    public int getBorderRadius() {
        return borderRadius;
    }

    public void setBorderRadius(int borderRadius) {
        this.borderRadius = borderRadius;
    }

    public int getPadding() {
        return padding;
    }

    public void setPadding(int padding) {
        this.padding = padding;
    }

    public int getFontSize() {
        return fontSize;
    }

    public void setFontSize(int fontSize) {
        this.fontSize = fontSize;
    }

    public int getTimerFontSize() {
        return timerFontSize;
    }

    public void setTimerFontSize(int timerFontSize) {
        this.timerFontSize = timerFontSize;
    }
}
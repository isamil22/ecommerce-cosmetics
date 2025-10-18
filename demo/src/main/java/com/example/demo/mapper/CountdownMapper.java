package com.example.demo.mapper;

import com.example.demo.dto.CountdownDTO;
import com.example.demo.model.Countdown;
import org.springframework.stereotype.Component;

@Component
public class CountdownMapper {

    public CountdownDTO toDto(Countdown countdown) {
        if (countdown == null) {
            return null;
        }
        CountdownDTO dto = new CountdownDTO();
        
        // Basic Settings
        dto.setTitle(countdown.getTitle());
        dto.setEndDate(countdown.getEndDate());
        dto.setEnabled(countdown.isEnabled());
        
        // Color Settings
        dto.setBackgroundColor(countdown.getBackgroundColor());
        dto.setTextColor(countdown.getTextColor());
        dto.setBorderColor(countdown.getBorderColor());
        dto.setTimerBoxColor(countdown.getTimerBoxColor());
        dto.setTimerTextColor(countdown.getTimerTextColor());
        dto.setUrgentBgColor(countdown.getUrgentBgColor());
        dto.setUrgentTextColor(countdown.getUrgentTextColor());
        
        // Text Settings
        dto.setSubtitle(countdown.getSubtitle());
        dto.setUrgentMessage(countdown.getUrgentMessage());
        dto.setExpiredMessage(countdown.getExpiredMessage());
        dto.setPackName(countdown.getPackName());
        
        // Display Settings
        dto.setShowDays(countdown.isShowDays());
        dto.setShowHours(countdown.isShowHours());
        dto.setShowMinutes(countdown.isShowMinutes());
        dto.setShowSeconds(countdown.isShowSeconds());
        dto.setShowPackName(countdown.isShowPackName());
        dto.setShowSubtitle(countdown.isShowSubtitle());
        
        // Animation Settings
        dto.setEnablePulse(countdown.isEnablePulse());
        dto.setEnableBounce(countdown.isEnableBounce());
        dto.setUrgentThreshold(countdown.getUrgentThreshold());
        
        // Layout Settings
        dto.setBorderRadius(countdown.getBorderRadius());
        dto.setPadding(countdown.getPadding());
        dto.setFontSize(countdown.getFontSize());
        dto.setTimerFontSize(countdown.getTimerFontSize());
        
        // Default Design Setting
        dto.setUseDefaultDesign(countdown.isUseDefaultDesign());
        
        return dto;
    }

    public Countdown toEntity(CountdownDTO dto) {
        if (dto == null) {
            return null;
        }
        Countdown countdown = new Countdown();
        
        // Basic Settings
        countdown.setTitle(dto.getTitle());
        countdown.setEndDate(dto.getEndDate());
        countdown.setEnabled(dto.isEnabled());
        
        // Color Settings
        countdown.setBackgroundColor(dto.getBackgroundColor());
        countdown.setTextColor(dto.getTextColor());
        countdown.setBorderColor(dto.getBorderColor());
        countdown.setTimerBoxColor(dto.getTimerBoxColor());
        countdown.setTimerTextColor(dto.getTimerTextColor());
        countdown.setUrgentBgColor(dto.getUrgentBgColor());
        countdown.setUrgentTextColor(dto.getUrgentTextColor());
        
        // Text Settings
        countdown.setSubtitle(dto.getSubtitle());
        countdown.setUrgentMessage(dto.getUrgentMessage());
        countdown.setExpiredMessage(dto.getExpiredMessage());
        countdown.setPackName(dto.getPackName());
        
        // Display Settings
        countdown.setShowDays(dto.isShowDays());
        countdown.setShowHours(dto.isShowHours());
        countdown.setShowMinutes(dto.isShowMinutes());
        countdown.setShowSeconds(dto.isShowSeconds());
        countdown.setShowPackName(dto.isShowPackName());
        countdown.setShowSubtitle(dto.isShowSubtitle());
        
        // Animation Settings
        countdown.setEnablePulse(dto.isEnablePulse());
        countdown.setEnableBounce(dto.isEnableBounce());
        countdown.setUrgentThreshold(dto.getUrgentThreshold());
        
        // Layout Settings
        countdown.setBorderRadius(dto.getBorderRadius());
        countdown.setPadding(dto.getPadding());
        countdown.setFontSize(dto.getFontSize());
        countdown.setTimerFontSize(dto.getTimerFontSize());
        
        // Default Design Setting
        countdown.setUseDefaultDesign(dto.isUseDefaultDesign());
        
        return countdown;
    }
}
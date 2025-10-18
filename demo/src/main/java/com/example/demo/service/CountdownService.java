package com.example.demo.service;

import com.example.demo.dto.CountdownDTO;
import com.example.demo.mapper.CountdownMapper;
import com.example.demo.model.Countdown;
import com.example.demo.repositories.CountdownRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CountdownService {

    @Autowired
    private CountdownRepository countdownRepository;

    @Autowired
    private CountdownMapper countdownMapper;

    public CountdownDTO getCountdown() {
        Optional<Countdown> countdown = countdownRepository.findAll().stream().findFirst();
        return countdown.map(countdownMapper::toDto).orElse(null);
    }

    public CountdownDTO saveCountdown(CountdownDTO countdownDTO) {
        List<Countdown> countdowns = countdownRepository.findAll();
        Countdown countdown;
        if (countdowns.isEmpty()) {
            countdown = new Countdown();
        } else {
            countdown = countdowns.get(0);
        }
        // Basic Settings
        countdown.setTitle(countdownDTO.getTitle());
        countdown.setEndDate(countdownDTO.getEndDate());
        countdown.setEnabled(countdownDTO.isEnabled());
        
        // Color Settings
        countdown.setBackgroundColor(countdownDTO.getBackgroundColor());
        countdown.setTextColor(countdownDTO.getTextColor());
        countdown.setBorderColor(countdownDTO.getBorderColor());
        countdown.setTimerBoxColor(countdownDTO.getTimerBoxColor());
        countdown.setTimerTextColor(countdownDTO.getTimerTextColor());
        countdown.setUrgentBgColor(countdownDTO.getUrgentBgColor());
        countdown.setUrgentTextColor(countdownDTO.getUrgentTextColor());
        
        // Text Settings
        countdown.setSubtitle(countdownDTO.getSubtitle());
        countdown.setUrgentMessage(countdownDTO.getUrgentMessage());
        countdown.setExpiredMessage(countdownDTO.getExpiredMessage());
        countdown.setPackName(countdownDTO.getPackName());
        
        // Display Settings
        countdown.setShowDays(countdownDTO.isShowDays());
        countdown.setShowHours(countdownDTO.isShowHours());
        countdown.setShowMinutes(countdownDTO.isShowMinutes());
        countdown.setShowSeconds(countdownDTO.isShowSeconds());
        countdown.setShowPackName(countdownDTO.isShowPackName());
        countdown.setShowSubtitle(countdownDTO.isShowSubtitle());
        
        // Animation Settings
        countdown.setEnablePulse(countdownDTO.isEnablePulse());
        countdown.setEnableBounce(countdownDTO.isEnableBounce());
        countdown.setUrgentThreshold(countdownDTO.getUrgentThreshold());
        
        // Layout Settings
        countdown.setBorderRadius(countdownDTO.getBorderRadius());
        countdown.setPadding(countdownDTO.getPadding());
        countdown.setFontSize(countdownDTO.getFontSize());
        countdown.setTimerFontSize(countdownDTO.getTimerFontSize());
        
        // Default Design Setting
        countdown.setUseDefaultDesign(countdownDTO.isUseDefaultDesign());
        
        Countdown savedCountdown = countdownRepository.save(countdown);
        return countdownMapper.toDto(savedCountdown);
    }
}
package com.example.demo.controller;

import com.example.demo.model.EnhancedVisitorCounterSettings;
import com.example.demo.service.EnhancedVisitorCounterSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enhanced-visitor-counter-settings")
public class EnhancedVisitorCounterSettingsController {

    @Autowired
    private EnhancedVisitorCounterSettingsService service;

    @GetMapping
    public ResponseEntity<EnhancedVisitorCounterSettings> getSettings() {
        EnhancedVisitorCounterSettings settings = service.getSettings();
        return ResponseEntity.ok(settings);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<EnhancedVisitorCounterSettings> updateSettings(@RequestBody EnhancedVisitorCounterSettings newSettings) {
        EnhancedVisitorCounterSettings updatedSettings = service.updateSettings(newSettings);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/metric/{metricType}")
    public ResponseEntity<Object> getMetricSettings(@PathVariable String metricType) {
        Object metricSettings = service.getMetricSettings(metricType);
        return ResponseEntity.ok(metricSettings);
    }

    @PostMapping("/metric/{metricType}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Object> updateMetricSettings(@PathVariable String metricType, @RequestBody Object metricData) {
        // This endpoint can be used to update specific metrics
        // Implementation depends on your specific needs
        return ResponseEntity.ok(metricData);
    }
}

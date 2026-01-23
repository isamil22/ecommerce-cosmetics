package com.example.demo.controller;

import com.example.demo.model.Setting;
import com.example.demo.repositories.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller for managing application settings.
 */
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private com.example.demo.service.LocalFileService localFileService;

    /**
     * Retrieves all settings as a map of key-value pairs.
     * This endpoint is public to allow the frontend to fetch the Pixel ID.
     * @return A map of all settings.
     */
    @GetMapping
    public ResponseEntity<Map<String, String>> getSettings() {
        List<Setting> settings = settingRepository.findAll();
        Map<String, String> settingsMap = settings.stream()
                .collect(Collectors.toMap(Setting::getSettingKey, Setting::getValue));
        return ResponseEntity.ok(settingsMap);
    }

    /**
     * Uploads a logo and updates the site_logo_url setting.
     * @param file The logo image file.
     * @return The URL of the uploaded logo.
     */
    @PostMapping("/logo")
    @PreAuthorize("hasAuthority('SETTINGS:EDIT') or hasAuthority('SETTINGS:UPDATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Map<String, String>> uploadLogo(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            String logoUrl = localFileService.saveImage(file, "system");
            
            // Save to database
            Setting setting = settingRepository.findBySettingKey("site_logo_url")
                    .orElse(new Setting());
            setting.setSettingKey("site_logo_url");
            setting.setValue(logoUrl);
            settingRepository.save(setting);
            
            return ResponseEntity.ok(Map.of("url", logoUrl));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload logo"));
        }
    }

    /**
     * Saves or updates settings. This endpoint is restricted to ADMIN users.
     * @param settings A map of settings to save.
     * @return A success message.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('SETTINGS:EDIT') or hasAuthority('SETTINGS:UPDATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> saveSettings(@RequestBody Map<String, String> settings) {
        settings.forEach((key, value) -> {
            Setting setting = settingRepository.findBySettingKey(key)
                    .orElse(new Setting()); // Create new setting if it doesn't exist
            setting.setSettingKey(key);
            setting.setValue(value);
            settingRepository.save(setting);
        });
        return ResponseEntity.ok().body(Map.of("message", "Settings saved successfully"));
    }
}

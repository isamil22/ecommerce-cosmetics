package com.example.demo.service;

import com.example.demo.constant.SettingKeys;
import com.example.demo.model.Setting;
import com.example.demo.repositories.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;

    public String getSettingValue(String key, String defaultValue) {
        return settingRepository.findBySettingKey(key)
                .map(Setting::getValue)
                .orElse(defaultValue);
    }

    public BigDecimal getBigDecimalSetting(String key, String defaultValue) {
        try {
            return new BigDecimal(getSettingValue(key, defaultValue));
        } catch (NumberFormatException e) {
            return new BigDecimal(defaultValue);
        }
    }

    public int getIntSetting(String key, int defaultValue) {
        try {
            return Integer.parseInt(getSettingValue(key, String.valueOf(defaultValue)));
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    @Transactional
    public void updateSetting(String key, String value) {
        Setting setting = settingRepository.findBySettingKey(key)
                .orElse(new Setting(key, value));
        setting.setValue(value);
        settingRepository.save(setting);
    }

    @Transactional
    public void updateSettings(Map<String, String> settings) {
        settings.forEach(this::updateSetting);
    }

    public Map<String, Object> getAllDiscountSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put(SettingKeys.HIGH_VALUE_THRESHOLD, getBigDecimalSetting(SettingKeys.HIGH_VALUE_THRESHOLD, "500"));
        settings.put(SettingKeys.HIGH_VALUE_DISCOUNT_PERCENT,
                getBigDecimalSetting(SettingKeys.HIGH_VALUE_DISCOUNT_PERCENT, "10"));
        settings.put(SettingKeys.LOYALTY_ORDER_COUNT, getIntSetting(SettingKeys.LOYALTY_ORDER_COUNT, 3));
        settings.put(SettingKeys.LOYALTY_DISCOUNT_PERCENT,
                getBigDecimalSetting(SettingKeys.LOYALTY_DISCOUNT_PERCENT, "15"));
        return settings;
    }
}

import apiService from './apiService';

/**
 * Enhanced Visitor Counter Settings Service
 * Handles all visitor counter metrics management
 */

/**
 * Get all enhanced visitor counter settings
 */
export const getEnhancedSettings = async () => {
    const response = await apiService.get('/enhanced-visitor-counter-settings');
    return response.data;
};

/**
 * Save all enhanced visitor counter settings
 */
export const saveEnhancedSettings = async (settings) => {
    const response = await apiService.post('/enhanced-visitor-counter-settings', settings);
    return response.data;
};

/**
 * Get settings for specific metric
 */
export const getMetricSettings = async (metricType) => {
    const response = await apiService.get(`/enhanced-visitor-counter-settings/metric/${metricType}`);
    return response.data;
};

/**
 * Update specific metric settings
 */
export const updateMetricSettings = async (metricType, metricData) => {
    const response = await apiService.post(`/enhanced-visitor-counter-settings/metric/${metricType}`, metricData);
    return response.data;
};

/**
 * Generate random number within range
 */
export const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get current values for all metrics
 */
export const getCurrentMetricValues = async () => {
    const settings = await getEnhancedSettings();
    
    return {
        currentViewers: settings.currentViewersEnabled ? 
            generateRandomNumber(settings.currentViewersMin, settings.currentViewersMax) : 0,
        totalViews: settings.totalViewsEnabled ? 
            generateRandomNumber(settings.totalViewsMin, settings.totalViewsMax) : 0,
        addedToday: settings.addedTodayEnabled ? 
            generateRandomNumber(settings.addedTodayMin, settings.addedTodayMax) : 0,
        activity: settings.activityEnabled ? 
            generateRandomNumber(settings.activityMin, settings.activityMax) : 0
    };
};

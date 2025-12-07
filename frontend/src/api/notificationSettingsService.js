// frontend/src/api/notificationSettingsService.js
// Use relative URL so Nginx can proxy requests to backend in Docker
// For local development, set VITE_API_URL in .env file if needed
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Service for managing notification settings
 */
export const notificationSettingsService = {
    /**
     * Get notification settings
     */
    async getSettings() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notification-settings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error('Server error while fetching notification settings');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Validate that we received valid settings data
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format from server');
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching notification settings:', error);
            throw error;
        }
    },

    /**
     * Save notification settings (Admin only)
     */
    async saveSettings(settings) {
        try {
            // Validate input settings
            if (!settings || typeof settings !== 'object') {
                throw new Error('Invalid settings provided');
            }

            const response = await fetch(`${API_BASE_URL}/api/notification-settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const errorText = await response.text();
                
                if (response.status === 401 || response.status === 403) {
                    throw new Error('You must be an admin to save notification settings');
                } else if (response.status === 400) {
                    throw new Error(errorText || 'Invalid settings provided');
                } else if (response.status === 500) {
                    throw new Error('Server error while saving notification settings');
                }
                
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Validate response
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format from server');
            }
            
            return data;
        } catch (error) {
            console.error('Error saving notification settings:', error);
            throw error;
        }
    }
};

export default notificationSettingsService;

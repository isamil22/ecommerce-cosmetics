import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Get language from localStorage or default to 'fr' (French)
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || 'fr'; // Default to French
    });

    // Save language preference to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Translation function with support for nested keys (e.g., 'brandSettings.title')
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if path not found
            }
        }

        if (value && typeof value === 'object') {
            console.warn(`Translation key '${key}' returned an object. Expected string.`, value);
            return key;
        }

        return value || key;
    };

    const value = {
        language,
        setLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;

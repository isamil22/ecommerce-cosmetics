import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { getSettings } from '../api/settingsService';

const GoogleAnalytics = () => {
    const [analyticsId, setAnalyticsId] = useState(null);
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Defer loading of GA to improve TBT
        const timer = setTimeout(() => {
            const fetchSettings = async () => {
                try {
                    const settings = await getSettings();
                    if (settings && settings.googleAnalyticsId) {
                        setAnalyticsId(settings.googleAnalyticsId);
                    }
                } catch (error) {
                    console.error('Could not load Google Analytics settings', error);
                }
            };

            fetchSettings();
        }, 4000); // 4 seconds delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (analyticsId && !initialized) {
            ReactGA.initialize(analyticsId);
            setInitialized(true);
        }
    }, [analyticsId, initialized]);

    useEffect(() => {
        if (initialized) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [location, initialized]);

    return null;
};

export default GoogleAnalytics;

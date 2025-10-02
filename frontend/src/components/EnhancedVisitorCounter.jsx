import React, { useState, useEffect } from 'react';
import { getEnhancedSettings } from '../api/enhancedVisitorCounterService';

const EnhancedVisitorCounter = () => {
    const [settings, setSettings] = useState(null);
    const [metrics, setMetrics] = useState({
        currentViewers: 0,
        totalViews: 0,
        addedToday: 0,
        activity: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let intervalId = null;
        
        const fetchSettings = async () => {
            try {
                const data = await getEnhancedSettings();
                setSettings(data);
                setIsLoading(false);
                
                if (data.globalEnabled) {
                    // Initialize metrics
                    setMetrics({
                        currentViewers: data.currentViewersEnabled ? 
                            generateRandomValue(data.currentViewersMin, data.currentViewersMax) : 0,
                        totalViews: data.totalViewsEnabled ? 
                            generateRandomValue(data.totalViewsMin, data.totalViewsMax) : 0,
                        addedToday: data.addedTodayEnabled ? 
                            generateRandomValue(data.addedTodayMin, data.addedTodayMax) : 0,
                        activity: data.activityEnabled ? 
                            generateRandomValue(data.activityMin, data.activityMax) : 0
                    });

                    // Set up interval for updates
                    if (data.enableAnimations) {
                        intervalId = setInterval(() => {
                            updateMetrics(data);
                        }, data.animationSpeed || 3000);
                    }
                }
            } catch (error) {
                console.error('Failed to load enhanced visitor counter settings:', error);
                setIsLoading(false);
            }
        };

        fetchSettings();
        
        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    const generateRandomValue = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const updateMetrics = (settings) => {
        setMetrics(prev => ({
            currentViewers: settings.currentViewersEnabled ? 
                generateRandomValue(settings.currentViewersMin, settings.currentViewersMax) : 0,
            totalViews: settings.totalViewsEnabled ? 
                generateRandomValue(settings.totalViewsMin, settings.totalViewsMax) : 0,
            addedToday: settings.addedTodayEnabled ? 
                generateRandomValue(settings.addedTodayMin, settings.addedTodayMax) : 0,
            activity: settings.activityEnabled ? 
                generateRandomValue(settings.activityMin, settings.activityMax) : 0
        }));
    };

    if (isLoading) {
        return (
            <div className="animate-pulse bg-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    if (!settings || !settings.globalEnabled) {
        return null;
    }

    const containerStyle = {
        backgroundColor: settings.backgroundColor || '#f3f4f6',
        borderColor: settings.borderColor || '#d1d5db',
        color: settings.textColor || '#374151'
    };

    return (
        <div 
            className={`rounded-xl p-4 border-2 transition-all duration-500 ${settings.enableFadeEffect ? 'opacity-100' : ''}`}
            style={containerStyle}
        >
            {settings.customTitle && (
                <h4 className="text-lg font-semibold mb-4 text-center">{settings.customTitle}</h4>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                {/* Current Viewers */}
                {settings.currentViewersEnabled && (
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <div className="text-sm">
                            {settings.showBilingualText ? (
                                <span>
                                    مشاهد الآن / Viewing{' '}
                                    <span className="font-bold text-purple-600">{metrics.currentViewers}</span>
                                </span>
                            ) : (
                                <span>
                                    Viewing{' '}
                                    <span className="font-bold text-purple-600">{metrics.currentViewers}</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Total Views */}
                {settings.totalViewsEnabled && (
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="text-sm">
                            {settings.showBilingualText ? (
                                <span>
                                    مشاهدة / Viewed{' '}
                                    <span className="font-bold text-purple-600">{metrics.totalViews}</span>
                                </span>
                            ) : (
                                <span>
                                    Viewed{' '}
                                    <span className="font-bold text-purple-600">{metrics.totalViews}</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Added Today */}
                {settings.addedTodayEnabled && (
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        <div className="text-sm">
                            {settings.showBilingualText ? (
                                <span>
                                    أضاف اليوم / Added today{' '}
                                    <span className="font-bold text-purple-600">{metrics.addedToday}</span>
                                </span>
                            ) : (
                                <span>
                                    Added today{' '}
                                    <span className="font-bold text-purple-600">{metrics.addedToday}</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Activity */}
                {settings.activityEnabled && (
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <div className="text-sm">
                            {settings.showBilingualText ? (
                                <span>
                                    نشاط مديت / Activity{' '}
                                    <span className="font-bold text-purple-600">{metrics.activity}</span>
                                </span>
                            ) : (
                                <span>
                                    Activity{' '}
                                    <span className="font-bold text-purple-600">{metrics.activity}</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedVisitorCounter;

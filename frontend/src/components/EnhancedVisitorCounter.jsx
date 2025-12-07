import React, { useState, useEffect } from 'react';
import { getEnhancedSettings } from '../api/enhancedVisitorCounterService';
import { 
    FiUsers, FiEye, FiCalendar, FiActivity, 
    FiTrendingUp, FiClock, FiZap, FiGlobe 
} from 'react-icons/fi';

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

    return (
        <div 
            className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-pink-200 shadow-md transition-all duration-300 hover:shadow-lg hover:border-pink-300`}
        >
            {/* Only 2 most important metrics */}
            <div className="grid grid-cols-2 gap-3">
                {/* Current Viewers - MOST IMPORTANT */}
                {settings.currentViewersEnabled && (
                    <CompactMetricCard
                        icon={<FiUsers className="w-5 h-5" />}
                        title={settings.showBilingualText ? "مشاهد الآن / Viewing" : "Viewing"}
                        value={metrics.currentViewers}
                        color="pink"
                    />
                )}

                {/* Added Today - MOST IMPORTANT */}
                {settings.addedTodayEnabled && (
                    <CompactMetricCard
                        icon={<FiCalendar className="w-5 h-5" />}
                        title={settings.showBilingualText ? "أضاف اليوم / Added" : "Added"}
                        value={metrics.addedToday}
                        color="purple"
                    />
                )}
            </div>
        </div>
    );
};

// Compact Metric Card - Simplified version for smaller space
const CompactMetricCard = ({ icon, title, value, color }) => {
    const colorClasses = {
        pink: {
            bg: 'bg-white',
            border: 'border-pink-200',
            icon: 'text-pink-500',
            value: 'text-pink-600',
            hover: 'hover:border-pink-300 hover:shadow-md'
        },
        purple: {
            bg: 'bg-white',
            border: 'border-purple-200',
            icon: 'text-purple-500',
            value: 'text-purple-600',
            hover: 'hover:border-purple-300 hover:shadow-md'
        },
        blue: {
            bg: 'bg-white',
            border: 'border-blue-200',
            icon: 'text-blue-500',
            value: 'text-blue-600',
            hover: 'hover:border-blue-300 hover:shadow-md'
        },
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: 'text-orange-600',
            value: 'text-orange-700'
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: 'text-yellow-600',
            value: 'text-yellow-700'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'text-green-600',
            value: 'text-green-700'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div 
            className={`${colors.bg} ${colors.border} border rounded-lg p-3 sm:p-4 transition-all duration-200 ${colors.hover}`}
        >
            <div className="flex items-center gap-2.5">
                <div className={`${colors.icon} flex-shrink-0`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 truncate">
                        {title}
                    </p>
                    <p className={`text-xl sm:text-2xl font-bold ${colors.value}`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnhancedVisitorCounter;

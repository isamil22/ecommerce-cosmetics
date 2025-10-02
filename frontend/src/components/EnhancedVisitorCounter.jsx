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

    const containerStyle = {
        backgroundColor: settings.backgroundColor || '#f3f4f6',
        borderColor: settings.borderColor || '#d1d5db',
        color: settings.textColor || '#374151'
    };

    return (
        <div 
            className={`rounded-2xl p-6 border-2 shadow-lg transition-all duration-500 hover:shadow-xl ${settings.enableFadeEffect ? 'opacity-100' : ''}`}
            style={containerStyle}
        >
            {settings.customTitle && (
                <div className="text-center mb-6">
                    <h4 className="text-xl font-bold mb-2 flex items-center justify-center space-x-2">
                        <FiGlobe className="w-6 h-6 text-blue-600" />
                        <span>{settings.customTitle}</span>
                    </h4>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Viewers */}
                {settings.currentViewersEnabled && (
                    <MetricCard
                        icon={<FiUsers className="w-5 h-5" />}
                        title={settings.showBilingualText ? "مشاهد الآن / Viewing" : "Viewing"}
                        value={metrics.currentViewers}
                        color="orange"
                        animation="pulse"
                        description="People currently viewing"
                    />
                )}

                {/* Total Views */}
                {settings.totalViewsEnabled && (
                    <MetricCard
                        icon={<FiEye className="w-5 h-5" />}
                        title={settings.showBilingualText ? "مشاهدة / Viewed" : "Viewed"}
                        value={metrics.totalViews}
                        color="blue"
                        animation="bounce"
                        description="Total page views"
                    />
                )}

                {/* Added Today */}
                {settings.addedTodayEnabled && (
                    <MetricCard
                        icon={<FiCalendar className="w-5 h-5" />}
                        title={settings.showBilingualText ? "أضاف اليوم / Added today" : "Added today"}
                        value={metrics.addedToday}
                        color="yellow"
                        animation="ping"
                        description="New additions today"
                    />
                )}

                {/* Activity */}
                {settings.activityEnabled && (
                    <MetricCard
                        icon={<FiActivity className="w-5 h-5" />}
                        title={settings.showBilingualText ? "نشاط مديت / Activity" : "Activity"}
                        value={metrics.activity}
                        color="green"
                        animation="pulse"
                        description="Current activity level"
                    />
                )}
            </div>
        </div>
    );
};

// MetricCard Component for individual metrics
const MetricCard = ({ icon, title, value, color, animation, description }) => {
    const colorClasses = {
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: 'text-orange-600',
            dot: 'bg-orange-500',
            value: 'text-orange-700'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'text-blue-600',
            dot: 'bg-blue-500',
            value: 'text-blue-700'
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: 'text-yellow-600',
            dot: 'bg-yellow-500',
            value: 'text-yellow-700'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'text-green-600',
            dot: 'bg-green-500',
            value: 'text-green-700'
        }
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        ping: 'animate-ping'
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div 
            className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-md group`}
            title={description}
        >
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                    <div className={`${colors.icon} ${animationClasses[animation] || ''}`}>
                        {icon}
                    </div>
                </div>
                <div className={`w-3 h-3 ${colors.dot} rounded-full ${animationClasses[animation] || ''}`}></div>
            </div>
            
            <div className="space-y-1">
                <h5 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {title}
                </h5>
                <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${colors.value} transition-all duration-500`}>
                        {value}
                    </span>
                    <div className="flex space-x-1">
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`}></div>
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedVisitorCounter;

// Enhanced Countdown Timer with Urgency - Now Admin Controllable
import React, { useState, useEffect, useCallback } from 'react';
import { getCountdown } from '../api/apiService';

const EnhancedCountdown = ({ onExpire, packName, fallbackEndTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
    });
    const [isUrgent, setIsUrgent] = useState(false);
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch admin countdown settings
    const fetchCountdownSettings = useCallback(async () => {
        try {
            const response = await getCountdown();
            // console.log('Countdown API Response:', response.data); 

            if (response.data) {
                // Admin has set settings - use them with all new fields
                const adminConfig = {
                    ...response.data,
                    endDate: response.data.endDate ? new Date(response.data.endDate).getTime() : (fallbackEndTime || (new Date().getTime() + (24 * 60 * 60 * 1000))),
                    enabled: response.data.enabled !== undefined ? response.data.enabled : true,
                    // Use simple defaults if missing, but we will largely ignore specific color codes in favor of the glass theme
                    // unless they are critical. For "Pro Wow", we prefer our curated glass styles.
                    urgentThreshold: response.data.urgentThreshold || 3600,
                };
                setConfig(adminConfig);
            } else {
                // Fallback
                setConfig({
                    title: 'عرض محدود! / Offre Limitée !',
                    endDate: fallbackEndTime || (new Date().getTime() + (24 * 60 * 60 * 1000)),
                    urgentThreshold: 3600,
                    enabled: true,
                    showDays: false,
                    showHours: true,
                    showMinutes: true,
                    showSeconds: true,
                    showPackName: true,
                    showSubtitle: true
                });
            }
        } catch (error) {
            console.error('Error fetching countdown settings:', error);
            setConfig({
                title: 'عرض محدود! / Offre Limitée !',
                endDate: fallbackEndTime || (new Date().getTime() + (24 * 60 * 60 * 1000)),
                urgentThreshold: 3600,
                enabled: true
            });
        } finally {
            setIsLoading(false);
        }
    }, [fallbackEndTime]);

    useEffect(() => {
        fetchCountdownSettings();
    }, [fetchCountdownSettings]);

    // Refresh countdown settings every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchCountdownSettings();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchCountdownSettings]);

    useEffect(() => {
        if (!config || isLoading) return;

        const endTime = config.endDate;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
                if (onExpire) onExpire();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, total: distance });

            const urgentThresholdMs = (config.urgentThreshold || 3600) * 1000;
            setIsUrgent(distance < urgentThresholdMs);
        }, 1000);

        return () => clearInterval(timer);
    }, [config, onExpire, isLoading]);

    if (isLoading) {
        return (
            <div className="glass-panel-pro rounded-2xl p-4 mb-6 text-center animate-pulse">
                <div className="flex justify-center space-x-2">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!config || !config.enabled) return null;

    // Render Expired State
    if (timeLeft.total <= 0) {
        return (
            <div className="glass-panel-dark border-red-200/50 bg-red-50/50 rounded-2xl p-4 mb-6 text-center backdrop-blur-md">
                <div className="text-3xl mb-1">⏰</div>
                <p className="font-black text-lg text-red-600">
                    {config.expiredMessage || 'انتهت الفترة المحدودة! / Offre limitée expirée !'}
                </p>
            </div>
        );
    }

    const showDays = config.showDays !== false && timeLeft.days > 0;

    return (
        <div className={`
            glass-panel-pro rounded-2xl p-4 mb-6 text-center transform transition-all duration-300
            ${isUrgent ? 'border-red-200 shadow-[0_0_20px_rgba(220,38,38,0.15)]' : 'border-white/60 shadow-xl'}
        `}>
            {/* Header */}
            <div className="flex items-center justify-center mb-3 gap-2">
                <span className={`text-2xl ${isUrgent ? 'animate-bounce' : 'animate-pulse'}`}>
                    {isUrgent ? '🔥' : '⏳'}
                </span>
                <h3 className={`font-black tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r 
                    ${isUrgent ? 'from-red-600 to-pink-600' : 'from-purple-600 to-pink-500'}`}>
                    {config.title || (isUrgent ? 'Hurry Up!' : 'Limited Time Offer')}
                </h3>
            </div>

            {/* Timer Grid */}
            <div className="flex justify-center items-center gap-2 sm:gap-4 rtl:space-x-reverse mb-3 font-mono">

                {/* Days */}
                {showDays && (
                    <>
                        <TimeUnit
                            value={String(timeLeft.days).padStart(2, '0')}
                            label="Days"
                            isUrgent={isUrgent}
                        />
                        <Separator isUrgent={isUrgent} />
                    </>
                )}

                {/* Hours */}
                {(config.showHours !== false) && (
                    <>
                        <TimeUnit
                            value={String(timeLeft.hours).padStart(2, '0')}
                            label="Hours"
                            isUrgent={isUrgent}
                        />
                        <Separator isUrgent={isUrgent} />
                    </>
                )}

                {/* Minutes */}
                {(config.showMinutes !== false) && (
                    <>
                        <TimeUnit
                            value={String(timeLeft.minutes).padStart(2, '0')}
                            label="Mins"
                            isUrgent={isUrgent}
                        />
                        <Separator isUrgent={isUrgent} />
                    </>
                )}

                {/* Seconds */}
                {(config.showSeconds !== false) && (
                    <TimeUnit
                        value={String(timeLeft.seconds).padStart(2, '0')}
                        label="Secs"
                        isUrgent={isUrgent}
                        animate={true}
                    />
                )}
            </div>

            {/* Subtitle */}
            {(config.showSubtitle !== false) && (
                <p className="text-sm font-semibold text-gray-600">
                    {isUrgent
                        ? (config.urgentMessage || '⚡ High demand! Prices may increase')
                        : (config.subtitle || 'Prices reset when timer ends')}
                </p>
            )}

            {/* Pack Name Reference */}
            {(config.showPackName !== false && config.packName) && (
                <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                    {config.packName}
                </div>
            )}
        </div>
    );
};

// Helper Components
const TimeUnit = ({ value, label, isUrgent, animate }) => (
    <div className={`
        flex flex-col items-center justify-center
        w-14 h-16 sm:w-16 sm:h-20 
        bg-white/80 rounded-xl border
        ${isUrgent
            ? 'border-red-100 shadow-[0_4px_12px_rgba(220,38,38,0.1)]'
            : 'border-purple-100 shadow-sm'
        }
        ${animate && isUrgent ? 'animate-pulse-custom' : ''}
    `}>
        <span className={`text-2xl sm:text-3xl font-black leading-none ${isUrgent ? 'text-red-500' : 'text-gray-800'}`}>
            {value}
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
            {label}
        </span>
    </div>
);

const Separator = ({ isUrgent }) => (
    <div className={`text-2xl sm:text-3xl font-black -mt-4 ${isUrgent ? 'text-red-300' : 'text-gray-300'}`}>
        :
    </div>
);

export default EnhancedCountdown;

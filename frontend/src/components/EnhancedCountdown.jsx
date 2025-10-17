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
            console.log('Countdown API Response:', response.data); // Debug log
            
            if (response.data) {
                // Admin has set settings - use them with all new fields
                const adminConfig = {
                    ...response.data,
                    endDate: response.data.endDate ? new Date(response.data.endDate).getTime() : (fallbackEndTime || (new Date().getTime() + (24 * 60 * 60 * 1000))),
                    enabled: response.data.enabled !== undefined ? response.data.enabled : true,
                    
                    // Color Settings with defaults
                    backgroundColor: response.data.backgroundColor || '#fef3c7',
                    textColor: response.data.textColor || '#ea580c',
                    borderColor: response.data.borderColor || '#f97316',
                    timerBoxColor: response.data.timerBoxColor || '#ffffff',
                    timerTextColor: response.data.timerTextColor || '#ea580c',
                    urgentBgColor: response.data.urgentBgColor || '#fef2f2',
                    urgentTextColor: response.data.urgentTextColor || '#dc2626',
                    
                    // Text Settings with defaults
                    subtitle: response.data.subtitle || '💰 وفر الآن قبل انتهاء العرض / Save now before offer ends',
                    urgentMessage: response.data.urgentMessage || '⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out',
                    expiredMessage: response.data.expiredMessage || 'انتهت الفترة المحدودة! / Limited Time Expired!',
                    packName: response.data.packName || packName || 'عروض اليوم الخاصة / Today\'s Special Offers',
                    
                    // Display Settings with defaults
                    showDays: response.data.showDays || false,
                    showHours: response.data.showHours !== undefined ? response.data.showHours : true,
                    showMinutes: response.data.showMinutes !== undefined ? response.data.showMinutes : true,
                    showSeconds: response.data.showSeconds !== undefined ? response.data.showSeconds : true,
                    showPackName: response.data.showPackName !== undefined ? response.data.showPackName : true,
                    showSubtitle: response.data.showSubtitle !== undefined ? response.data.showSubtitle : true,
                    
                    // Animation Settings with defaults
                    enablePulse: response.data.enablePulse !== undefined ? response.data.enablePulse : true,
                    enableBounce: response.data.enableBounce !== undefined ? response.data.enableBounce : true,
                    urgentThreshold: response.data.urgentThreshold || 3600,
                    
                    // Layout Settings with defaults
                    borderRadius: response.data.borderRadius || 12,
                    padding: response.data.padding || 16,
                    fontSize: response.data.fontSize || 18,
                    timerFontSize: response.data.timerFontSize || 24
                };
                console.log('Using admin settings:', adminConfig); // Debug log
                setConfig(adminConfig);
            } else {
                // No admin settings yet - use fallback but still show countdown
                console.log('No admin settings found, using fallback'); // Debug log
                setConfig({
                    title: 'عرض محدود! / Limited Offer!',
                    endDate: fallbackEndTime || (new Date().getTime() + (24 * 60 * 60 * 1000)),
                    backgroundColor: '#fef3c7',
                    textColor: '#ea580c',
                    borderColor: '#f97316',
                    timerBoxColor: '#ffffff',
                    timerTextColor: '#ea580c',
                    urgentBgColor: '#fef2f2',
                    urgentTextColor: '#dc2626',
                    subtitle: '💰 وفر الآن قبل انتهاء العرض / Save now before offer ends',
                    urgentMessage: '⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out',
                    expiredMessage: 'انتهت الفترة المحدودة! / Limited Time Expired!',
                    packName: packName || 'عروض اليوم الخاصة / Today\'s Special Offers',
                    showDays: false,
                    showHours: true,
                    showMinutes: true,
                    showSeconds: true,
                    showPackName: true,
                    showSubtitle: true,
                    enablePulse: true,
                    enableBounce: true,
                    urgentThreshold: 3600,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 18,
                    timerFontSize: 24,
                    enabled: true
                });
            }
        } catch (error) {
            console.error('Error fetching countdown settings:', error);
            // Use fallback on error
            setConfig({
                title: 'عرض محدود! / Limited Offer!',
                endDate: fallbackEndTime || (new Date().getTime() + (24 * 60 * 60 * 1000)),
                backgroundColor: '#fef3c7',
                textColor: '#ea580c',
                borderColor: '#f97316',
                timerBoxColor: '#ffffff',
                timerTextColor: '#ea580c',
                urgentBgColor: '#fef2f2',
                urgentTextColor: '#dc2626',
                subtitle: '💰 وفر الآن قبل انتهاء العرض / Save now before offer ends',
                urgentMessage: '⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out',
                expiredMessage: 'انتهت الفترة المحدودة! / Limited Time Expired!',
                packName: packName || 'عروض اليوم الخاصة / Today\'s Special Offers',
                showDays: false,
                showHours: true,
                showMinutes: true,
                showSeconds: true,
                showPackName: true,
                showSubtitle: true,
                enablePulse: true,
                enableBounce: true,
                urgentThreshold: 3600,
                borderRadius: 12,
                padding: 16,
                fontSize: 18,
                timerFontSize: 24,
                enabled: true
            });
        } finally {
            setIsLoading(false);
        }
    }, [fallbackEndTime]);

    useEffect(() => {
        fetchCountdownSettings();
    }, [fetchCountdownSettings]);

    // Refresh countdown settings every 30 seconds to pick up admin changes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchCountdownSettings();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [fetchCountdownSettings]);

    useEffect(() => {
        if (!config || isLoading) return;

        // config.endDate is already a timestamp from our processing above
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

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds, total: distance });
            
            // Set urgent based on admin threshold (convert seconds to milliseconds)
            const urgentThresholdMs = (config.urgentThreshold || 3600) * 1000;
            setIsUrgent(distance < urgentThresholdMs);
        }, 1000);

        return () => clearInterval(timer);
    }, [config, onExpire, isLoading]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6 text-center">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="flex justify-center space-x-2">
                        <div className="h-12 w-12 bg-gray-300 rounded"></div>
                        <div className="h-12 w-12 bg-gray-300 rounded"></div>
                        <div className="h-12 w-12 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't show if admin has disabled countdown
    if (!config || !config.enabled) {
        return null;
    }

    if (timeLeft.total <= 0) {
        return (
            <div 
                className="rounded-xl p-4 mb-6 text-center"
                style={{
                    backgroundColor: config.urgentBgColor || '#fef2f2',
                    border: `2px solid ${config.urgentTextColor || '#dc2626'}`,
                    borderRadius: `${config.borderRadius || 12}px`,
                    padding: `${config.padding || 16}px`
                }}
            >
                <div className="text-4xl mb-2">⏰</div>
                <p 
                    className="font-bold text-lg"
                    style={{ 
                        color: config.urgentTextColor || '#dc2626',
                        fontSize: `${config.fontSize || 18}px`
                    }}
                >
                    {config.expiredMessage || 'انتهت الفترة المحدودة! / Limited Time Expired!'}
                </p>
                <p 
                    className="text-sm"
                    style={{ color: config.urgentTextColor || '#dc2626' }}
                >
                    قد تكون الأسعار تغيرت / Prices may have changed
                </p>
            </div>
        );
    }

    // Use admin colors with urgent overrides
    const bgColor = isUrgent ? (config.urgentBgColor || '#fef2f2') : (config.backgroundColor || '#fef3c7');
    const borderColor = isUrgent ? (config.urgentTextColor || '#dc2626') : (config.borderColor || '#f97316');
    const textColor = isUrgent ? (config.urgentTextColor || '#dc2626') : (config.textColor || '#ea580c');
    const timerBoxColor = config.timerBoxColor || '#ffffff';
    const timerTextColor = isUrgent ? (config.urgentTextColor || '#dc2626') : (config.timerTextColor || '#ea580c');

    return (
        <div 
            className={`rounded-xl mb-6 text-center transition-all duration-500 ${
                isUrgent && config.enablePulse ? 'animate-pulse-custom' : ''
            }`}
            style={{
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: `${config.borderRadius || 12}px`,
                padding: `${config.padding || 16}px`
            }}
        >
            <div className="flex items-center justify-center mb-3">
                <span className="text-3xl mr-2">🔥</span>
                <h3 
                    className="font-bold"
                    style={{ 
                        color: textColor,
                        fontSize: `${config.fontSize || 18}px`
                    }}
                >
                    {config.title || (isUrgent ? 'عرض ينتهي قريباً!' : 'عرض محدود!')} / 
                    {isUrgent ? 'Ending Soon!' : 'Limited Offer!'}
                </h3>
            </div>
            
            <div className="flex justify-center items-center space-x-2 sm:space-x-4 rtl:space-x-reverse mb-3">
                {/* Days */}
                {config.showDays && (
                    <>
                        <div 
                            className="rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg"
                            style={{ 
                                backgroundColor: timerBoxColor,
                                border: `2px solid ${borderColor}`
                            }}
                        >
                            <div 
                                className="font-bold"
                                style={{ 
                                    color: timerTextColor,
                                    fontSize: `${config.timerFontSize || 24}px`
                                }}
                            >
                                {String(Math.floor(timeLeft.total / (1000 * 60 * 60 * 24))).padStart(2, '0')}
                            </div>
                            <div className="text-xs text-gray-600">يوم / Days</div>
                        </div>
                        <div 
                            className="font-bold"
                            style={{ 
                                color: timerTextColor,
                                fontSize: `${config.timerFontSize || 24}px`
                            }}
                        >:</div>
                    </>
                )}
                
                {/* Hours */}
                {config.showHours && (
                    <>
                        <div 
                            className="rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg"
                            style={{ 
                                backgroundColor: timerBoxColor,
                                border: `2px solid ${borderColor}`
                            }}
                        >
                            <div 
                                className="font-bold"
                                style={{ 
                                    color: timerTextColor,
                                    fontSize: `${config.timerFontSize || 24}px`
                                }}
                            >
                                {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <div className="text-xs text-gray-600">ساعة / Hours</div>
                        </div>
                        {(config.showMinutes || config.showSeconds) && (
                            <div 
                                className="font-bold"
                                style={{ 
                                    color: timerTextColor,
                                    fontSize: `${config.timerFontSize || 24}px`
                                }}
                            >:</div>
                        )}
                    </>
                )}
                
                {/* Minutes */}
                {config.showMinutes && (
                    <>
                        <div 
                            className="rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg"
                            style={{ 
                                backgroundColor: timerBoxColor,
                                border: `2px solid ${borderColor}`
                            }}
                        >
                            <div 
                                className="font-bold"
                                style={{ 
                                    color: timerTextColor,
                                    fontSize: `${config.timerFontSize || 24}px`
                                }}
                            >
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <div className="text-xs text-gray-600">دقيقة / Minutes</div>
                        </div>
                        {config.showSeconds && (
                            <div 
                                className="font-bold"
                                style={{ 
                                    color: timerTextColor,
                                    fontSize: `${config.timerFontSize || 24}px`
                                }}
                            >:</div>
                        )}
                    </>
                )}
                
                {/* Seconds */}
                {config.showSeconds && (
                    <div 
                        className={`rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg ${
                            isUrgent && config.enableBounce ? 'animate-bounce-custom' : ''
                        }`}
                        style={{ 
                            backgroundColor: timerBoxColor,
                            border: `2px solid ${borderColor}`
                        }}
                    >
                        <div 
                            className="font-bold"
                            style={{ 
                                color: timerTextColor,
                                fontSize: `${config.timerFontSize || 24}px`
                            }}
                        >
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-600">ثانية / Seconds</div>
                    </div>
                )}
            </div>
            
            {/* Subtitle */}
            {config.showSubtitle && (
                <p 
                    className="text-sm font-semibold"
                    style={{ 
                        color: textColor,
                        fontSize: `${config.fontSize || 18}px`
                    }}
                >
                    {isUrgent ? (config.urgentMessage || '⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out') : (config.subtitle || '💰 وفر الآن قبل انتهاء العرض / Save now before offer ends')}
                </p>
            )}
            
            {/* Pack Name */}
            {config.showPackName && config.packName && (
                <p className="text-xs text-gray-500 mt-2">
                    العرض الخاص بـ {config.packName} / Special offer for {config.packName}
                </p>
            )}
        </div>
    );
};

export default EnhancedCountdown;

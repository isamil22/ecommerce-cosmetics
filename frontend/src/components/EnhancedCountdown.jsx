// Enhanced Countdown Timer with Urgency for Pack Detail Page
import React, { useState, useEffect } from 'react';

const EnhancedCountdown = ({ endTime, onExpire, packName }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
    });
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
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
            
            // Set urgent when less than 1 hour left
            setIsUrgent(distance < 3600000);
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, onExpire]);

    if (timeLeft.total <= 0) {
        return (
            <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 mb-6 text-center">
                <div className="text-4xl mb-2">⏰</div>
                <p className="text-red-700 font-bold text-lg">
                    انتهت الفترة المحدودة! / Limited Time Expired!
                </p>
                <p className="text-red-600 text-sm">
                    قد تكون الأسعار تغيرت / Prices may have changed
                </p>
            </div>
        );
    }

    return (
        <div className={`rounded-xl p-4 mb-6 text-center transition-all duration-500 ${
            isUrgent 
                ? 'bg-red-50 border-2 border-red-400 animate-pulse-custom' 
                : 'bg-orange-50 border-2 border-orange-400'
        }`}>
            <div className="flex items-center justify-center mb-3">
                <span className="text-3xl mr-2">🔥</span>
                <h3 className={`font-bold text-lg ${isUrgent ? 'text-red-700' : 'text-orange-700'}`}>
                    {isUrgent ? 'عرض ينتهي قريباً!' : 'عرض محدود!'} / 
                    {isUrgent ? 'Ending Soon!' : 'Limited Offer!'}
                </h3>
            </div>
            
            <div className="flex justify-center items-center space-x-2 sm:space-x-4 rtl:space-x-reverse mb-3">
                <div className={`bg-white rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg ${
                    isUrgent ? 'border-2 border-red-300' : 'border-2 border-orange-300'
                }`}>
                    <div className={`text-xl sm:text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                        {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600">ساعة / Hours</div>
                </div>
                
                <div className={`text-xl sm:text-2xl font-bold ${isUrgent ? 'text-red-500' : 'text-orange-500'}`}>:</div>
                
                <div className={`bg-white rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg ${
                    isUrgent ? 'border-2 border-red-300' : 'border-2 border-orange-300'
                }`}>
                    <div className={`text-xl sm:text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600">دقيقة / Minutes</div>
                </div>
                
                <div className={`text-xl sm:text-2xl font-bold ${isUrgent ? 'text-red-500' : 'text-orange-500'}`}>:</div>
                
                <div className={`bg-white rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px] shadow-lg ${
                    isUrgent ? 'border-2 border-red-300 animate-bounce-custom' : 'border-2 border-orange-300'
                }`}>
                    <div className={`text-xl sm:text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600">ثانية / Seconds</div>
                </div>
            </div>
            
            <p className={`text-sm font-semibold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                {isUrgent ? '⚡ أسرع! الوقت ينفد' : '💰 وفر الآن قبل انتهاء العرض'} / 
                {isUrgent ? '⚡ Hurry! Time running out' : '💰 Save now before offer ends'}
            </p>
            
            {packName && (
                <p className="text-xs text-gray-500 mt-2">
                    العرض الخاص بـ {packName} / Special offer for {packName}
                </p>
            )}
        </div>
    );
};

export default EnhancedCountdown;

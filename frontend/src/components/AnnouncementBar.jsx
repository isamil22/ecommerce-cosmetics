import React, { useState, useEffect, useRef } from 'react';
import { getAnnouncement } from '../api/apiService';

const AnnouncementBar = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [onlineCount, setOnlineCount] = useState(52); // Default online count
    const barRef = useRef(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const { data } = await getAnnouncement();
                if (data) {
                    // Always use the data from API, even if disabled
                    setAnnouncement(data);
                } else {
                    // Only set default if no data exists at all
                    setAnnouncement({
                        enabled: true,
                        text: "شحن مجاني للطلبات فوق $50 / Free Shipping on Orders Over $50!",
                        showOnlineCounter: true,
                        backgroundColor: "gradient",
                        textColor: "#ffffff",
                        animationType: "pulse"
                    });
                }
            } catch (error) {
                console.error('Failed to fetch announcement:', error);
                // Set default announcement on error
                setAnnouncement({
                    enabled: true,
                    text: "شحن مجاني للطلبات فوق $50 / Free Shipping on Orders Over $50!",
                    showOnlineCounter: true,
                    backgroundColor: "gradient",
                    textColor: "#ffffff",
                    animationType: "pulse"
                });
            }
        };

        fetchAnnouncement();
        // Poll for changes every 30 seconds to keep it fresh
        const interval = setInterval(fetchAnnouncement, 30000);
        return () => clearInterval(interval);
    }, []);

    // Update online count periodically
    useEffect(() => {
        const updateOnlineCount = () => {
            setOnlineCount(Math.floor(Math.random() * 50) + 20);
        };
        
        updateOnlineCount();
        const interval = setInterval(updateOnlineCount, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // This effect runs when the announcement data changes.
        // It measures the bar's height and sets a CSS variable on the root HTML element.
        // This allows other components (like App.jsx) to know the bar's height.
        if (announcement && announcement.isSticky && barRef.current) {
            const barHeight = barRef.current.offsetHeight;
            document.documentElement.style.setProperty('--announcement-bar-height', `${barHeight}px`);
        } else {
            // If the bar isn't sticky or doesn't exist, reset the height.
            document.documentElement.style.setProperty('--announcement-bar-height', '0px');
        }
    }, [announcement]);

    if (!announcement || !announcement.enabled) {
        return null;
    }

    // Determine background style
    let backgroundStyle = {};
    if (announcement.backgroundColor === 'gradient') {
        backgroundStyle = {
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)'
        };
    } else if (announcement.backgroundColor) {
        backgroundStyle = {
            backgroundColor: announcement.backgroundColor
        };
    }

    // Determine animation classes
    const animationClasses = [];
    if (announcement.animationType === 'pulse') {
        animationClasses.push('animate-pulse');
    } else if (announcement.animationType === 'bounce') {
        animationClasses.push('animate-bounce');
    }

    return (
        <div 
            ref={barRef} 
            style={{
                ...backgroundStyle,
                color: announcement.textColor || '#ffffff'
            }}
            className="text-center py-3 text-sm font-semibold relative overflow-hidden"
        >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
            
            <div className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-lg animate-bounce">🎉</span>
                <span className={animationClasses.join(' ')}>
                    {announcement.text}
                </span>
                <span className="text-lg animate-bounce">✨</span>
                
                {/* Live counter - only show if enabled */}
                {announcement.showOnlineCounter && (
                    <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">
                            {onlineCount} متصل الآن / Online now
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementBar;


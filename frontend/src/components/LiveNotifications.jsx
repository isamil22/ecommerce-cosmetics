// frontend/src/components/LiveNotifications.jsx - LIVE ACTIVITY NOTIFICATIONS
import React, { useState, useEffect } from 'react';

const LiveNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    // Sample notification data - in real app, this would come from WebSocket or API
    const sampleNotifications = [
        {
            id: 1,
            type: 'purchase',
            message: 'Someone just bought',
            product: 'CosRX BHA Blackhead Power Liquid',
            time: '2 minutes ago',
            location: 'Morocco',
            avatar: '👩'
        },
        {
            id: 2,
            type: 'viewing',
            message: 'is currently viewing',
            product: 'The Ordinary Niacinamide 10%',
            time: '1 minute ago',
            location: 'Dubai',
            avatar: '👨'
        },
        {
            id: 3,
            type: 'cart',
            message: 'added to cart',
            product: 'CeraVe Foaming Facial Cleanser',
            time: '3 minutes ago',
            location: 'Riyadh',
            avatar: '👩‍🦱'
        },
        {
            id: 4,
            type: 'purchase',
            message: 'just purchased',
            product: 'Paula\'s Choice 2% BHA Liquid',
            time: '5 minutes ago',
            location: 'Kuwait',
            avatar: '👨‍🦰'
        },
        {
            id: 5,
            type: 'viewing',
            message: 'is browsing',
            product: 'Drunk Elephant C-Firma Vitamin C',
            time: '1 minute ago',
            location: 'Qatar',
            avatar: '👩‍💼'
        }
    ];

    useEffect(() => {
        // Simulate real-time notifications
        const interval = setInterval(() => {
            const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
            const newNotification = {
                ...randomNotification,
                id: Date.now(),
                time: 'Just now'
            };
            
            setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        }, 8000 + Math.random() * 7000); // Random interval between 8-15 seconds

        return () => clearInterval(interval);
    }, []);

    if (!isVisible || notifications.length === 0) return null;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'purchase': return '🛒';
            case 'viewing': return '👀';
            case 'cart': return '➕';
            default: return '📢';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'purchase': return 'from-green-500 to-emerald-600';
            case 'viewing': return 'from-blue-500 to-cyan-600';
            case 'cart': return 'from-orange-500 to-yellow-600';
            default: return 'from-pink-500 to-purple-600';
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm">
            {/* Header */}
            <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200 p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className="font-bold text-gray-800 text-sm">Live Activity / النشاط المباشر</h3>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-b-xl shadow-lg max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                    <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 animate-slide-in-right ${
                            index === 0 ? 'bg-gradient-to-r from-green-50 to-blue-50' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                                {notification.avatar}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                    <span className="text-xs font-semibold text-gray-600">
                                        {notification.location}
                                    </span>
                                    <span className="text-xs text-gray-400">{notification.time}</span>
                                </div>
                                
                                <p className="text-sm text-gray-800 leading-tight">
                                    <span className="font-medium">{notification.message}</span>
                                    <br />
                                    <span className="font-semibold text-pink-600">
                                        "{notification.product}"
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Footer */}
                <div className="p-3 bg-gray-50 rounded-b-xl">
                    <p className="text-xs text-gray-500 text-center">
                        🔴 Live updates from customers worldwide
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LiveNotifications;

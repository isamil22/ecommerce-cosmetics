// Live Visitor Counter - Shows real-time social proof
import React, { useState, useEffect } from 'react';

const LiveVisitorCounter = ({ packId }) => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate realistic visitor data
    useEffect(() => {
        // Initial visitor count (simulate based on pack ID)
        const baseCount = 15 + (parseInt(packId) % 20);
        setVisitorCount(baseCount);
        setIsLoading(false);

        // Simulate visitor count changes
        const visitorInterval = setInterval(() => {
            setVisitorCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newCount = Math.max(8, Math.min(45, prev + change));
                return newCount;
            });
        }, 8000 + Math.random() * 7000); // Random interval 8-15 seconds

        // Simulate recent activity
        const activityInterval = setInterval(() => {
            const activities = [
                { action: 'viewing', nameAr: 'أحمد', nameEn: 'Ahmed', time: 'الآن / now' },
                { action: 'viewing', nameAr: 'فاطمة', nameEn: 'Fatima', time: 'منذ دقيقة / 1 min ago' },
                { action: 'added', nameAr: 'محمد', nameEn: 'Mohammed', time: 'منذ 3 دقائق / 3 min ago' },
                { action: 'viewing', nameAr: 'عائشة', nameEn: 'Aisha', time: 'منذ 5 دقائق / 5 min ago' },
                { action: 'added', nameAr: 'يوسف', nameEn: 'Youssef', time: 'منذ 7 دقائق / 7 min ago' }
            ];
            
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            setRecentActivity(prev => [randomActivity, ...prev.slice(0, 2)]);
        }, 12000 + Math.random() * 8000); // Random interval 12-20 seconds

        return () => {
            clearInterval(visitorInterval);
            clearInterval(activityInterval);
        };
    }, [packId]);

    if (isLoading) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="animate-pulse flex items-center">
                    <div className="w-4 h-4 bg-blue-300 rounded-full mr-2"></div>
                    <div className="h-4 bg-blue-300 rounded w-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 mb-6 shadow-lg">
            {/* Live Visitor Count */}
            <div className="flex items-center justify-center mb-4">
                <div className="flex items-center bg-white rounded-full px-3 sm:px-4 py-2 shadow-md">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-600 font-bold text-base sm:text-lg">{visitorCount}</span>
                    <span className="text-gray-600 text-xs sm:text-sm ml-2">
                        شخص يشاهد الآن / people viewing now
                    </span>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-2">
                <h4 className="text-center text-sm font-semibold text-gray-700 mb-3">
                    🔥 نشاط حديث / Recent Activity
                </h4>
                
                {recentActivity.map((activity, index) => (
                    <div 
                        key={index} 
                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-2 sm:p-3 shadow-sm transition-all duration-500 ${
                            index === 0 ? 'border-l-4 border-green-400 animate-pulse-custom' : ''
                        }`}
                    >
                        <div className="flex items-center mb-1 sm:mb-0">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                activity.action === 'added' ? 'bg-orange-400' : 'bg-blue-400'
                            }`}></div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                                {activity.nameAr} / {activity.nameEn}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-end sm:justify-start">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                activity.action === 'added' 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'bg-blue-100 text-blue-700'
                            }`}>
                                {activity.action === 'added' ? '🛒 أضاف للسلة / Added to cart' : '👀 يشاهد / Viewing'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Proof Message */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-600 bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                    💡 <strong>{Math.floor(visitorCount * 0.3)}</strong> أشخاص أضافوا هذه الحزمة اليوم / 
                    <strong>{Math.floor(visitorCount * 0.3)}</strong> people added this pack today
                </p>
            </div>
        </div>
    );
};

export default LiveVisitorCounter;

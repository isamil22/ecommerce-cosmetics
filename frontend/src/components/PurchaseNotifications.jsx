// Purchase Notifications - Shows when others buy to create urgency
import React, { useState, useEffect } from 'react';

const PurchaseNotifications = ({ packName }) => {
    const [notifications, setNotifications] = useState([]);
    const [currentNotification, setCurrentNotification] = useState(null);

    // Moroccan names for realistic notifications
    const moroccanNames = [
        { ar: 'أحمد', en: 'Ahmed', city: 'الرباط / Rabat' },
        { ar: 'فاطمة', en: 'Fatima', city: 'الدار البيضاء / Casablanca' },
        { ar: 'محمد', en: 'Mohammed', city: 'فاس / Fes' },
        { ar: 'خديجة', en: 'Khadija', city: 'مراكش / Marrakech' },
        { ar: 'يوسف', en: 'Youssef', city: 'طنجة / Tangier' },
        { ar: 'عائشة', en: 'Aisha', city: 'أكادير / Agadir' },
        { ar: 'عبد الله', en: 'Abdullah', city: 'مكناس / Meknes' },
        { ar: 'زينب', en: 'Zeinab', city: 'وجدة / Oujda' },
        { ar: 'حسن', en: 'Hassan', city: 'تطوان / Tetouan' },
        { ar: 'مريم', en: 'Maryam', city: 'الجديدة / El Jadida' }
    ];

    const purchaseMessages = [
        { ar: 'اشترى للتو', en: 'just purchased' },
        { ar: 'أضاف للسلة', en: 'added to cart' },
        { ar: 'اشترى', en: 'bought' },
        { ar: 'طلب', en: 'ordered' }
    ];

    useEffect(() => {
        const showNotification = () => {
            const randomName = moroccanNames[Math.floor(Math.random() * moroccanNames.length)];
            const randomMessage = purchaseMessages[Math.floor(Math.random() * purchaseMessages.length)];
            const timeAgo = Math.floor(Math.random() * 15) + 1; // 1-15 minutes ago

            const notification = {
                id: Date.now(),
                name: randomName,
                message: randomMessage,
                timeAgo,
                packName: packName || 'هذه الحزمة / this pack'
            };

            setCurrentNotification(notification);

            // Hide notification after 6 seconds
            setTimeout(() => {
                setCurrentNotification(null);
            }, 6000);
        };

        // Show first notification after 3 seconds
        const initialTimer = setTimeout(showNotification, 3000);

        // Then show notifications every 25-45 seconds
        const interval = setInterval(() => {
            showNotification();
        }, 25000 + Math.random() * 20000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [packName]);

    if (!currentNotification) return null;

    return (
        <div className="fixed bottom-20 left-2 sm:left-4 z-50 animate-slide-in-left max-w-[calc(100vw-1rem)] sm:max-w-sm">
            <div className="bg-white border-2 border-green-400 rounded-xl shadow-2xl p-3 sm:p-4">
                <div className="flex items-start sm:items-center">
                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mr-2 sm:mr-3 animate-bounce-custom flex-shrink-0">
                        {currentNotification.name.ar[0]}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                            <span className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                                {currentNotification.name.ar} / {currentNotification.name.en}
                            </span>
                            <span className="text-xs text-gray-500 sm:ml-2 truncate">
                                من {currentNotification.name.city}
                            </span>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-700 mb-1">
                            <span className="text-green-600 font-semibold">
                                {currentNotification.message.ar} / {currentNotification.message.en}
                            </span>
                            <br />
                            <span className="text-gray-600 text-xs truncate">
                                {currentNotification.packName}
                            </span>
                        </p>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                منذ {currentNotification.timeAgo} دقيقة / {currentNotification.timeAgo} min ago
                            </span>
                            <div className="flex items-center">
                                <span className="text-green-500 text-xs">✓</span>
                                <span className="text-xs text-green-600 ml-1">مؤكد / Verified</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Success Icon */}
                    <div className="text-green-500 text-xl ml-2">
                        🛒
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full animate-progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseNotifications;

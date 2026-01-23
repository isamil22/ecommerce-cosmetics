// Purchase Notifications - Minimalist design
import React, { useState, useEffect } from 'react';

const PurchaseNotifications = ({ packName, productImage }) => {
    const [currentNotification, setCurrentNotification] = useState(null);

    // Female names only
    const femaleNames = [
        { ar: 'فاطمة', en: 'Fatima' },
        { ar: 'خديجة', en: 'Khadija' },
        { ar: 'عائشة', en: 'Aisha' },
        { ar: 'زينب', en: 'Zeinab' },
        { ar: 'مريم', en: 'Maryam' },
        { ar: 'نور', en: 'Nour' },
        { ar: 'ليلى', en: 'Layla' },
        { ar: 'هناء', en: 'Hana' },
        { ar: 'سارة', en: 'Sarah' },
        { ar: 'رانيا', en: 'Rania' },
        { ar: 'دينا', en: 'Dina' },
        { ar: 'أمينة', en: 'Amina' }
    ];

    useEffect(() => {
        const showNotification = () => {
            const randomName = femaleNames[Math.floor(Math.random() * femaleNames.length)];

            const notification = {
                id: Date.now(),
                name: randomName,
                packName: packName || 'منتج / Product',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };

            setCurrentNotification(notification);

            // Hide notification after 5 seconds
            setTimeout(() => {
                setCurrentNotification(null);
            }, 5000);
        };

        // Show first notification after 4 seconds
        const initialTimer = setTimeout(showNotification, 4000);

        // Then show notifications every 40-60 seconds
        const interval = setInterval(() => {
            showNotification();
        }, 40000 + Math.random() * 20000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [packName]);

    if (!currentNotification) return null;

    return (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-down dir-rtl">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 w-80 transform transition-all duration-500 hover:scale-102 flex items-center gap-4 hover:shadow-2xl">
                {/* Product Image */}
                <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md border border-gray-100 group">
                        <img
                            src={productImage}
                            alt={packName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                e.target.src = 'https://placehold.co/100x100/fde4f2/E91E63?text=Product';
                            }}
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse">
                        🛒
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">
                            {currentNotification.name.ar}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded-full">
                            {currentNotification.time}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                            <span className="font-bold">اشترت للتو</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="font-medium tracking-wide opacity-90">Vient d'acheter</span>
                        </div>
                    </div>

                    <p className="text-xs font-bold text-gray-900 truncate">
                        {currentNotification.packName}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PurchaseNotifications;
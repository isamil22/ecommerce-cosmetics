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
                time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
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
        <div className="fixed top-20 right-2 sm:right-4 z-40 animate-fade-in-down">
            {/* Compact Card */}
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-pink-500 overflow-hidden hover:shadow-xl transition-shadow w-64">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5">
                    <span className="text-xs font-semibold">✨ عملية شراء / Purchase</span>
                </div>

                {/* Content */}
                <div className="p-2 space-y-1.5">
                    {/* Product Image - Smaller */}
                    {productImage && (
                        <div className="rounded-md overflow-hidden h-16">
                            <img 
                                src={productImage} 
                                alt={packName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/150x100/fde4f2/E91E63?text=Product';
                                }}
                            />
                        </div>
                    )}

                    {/* Customer + Product Info */}
                    <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-800">
                            👩 {currentNotification.name.ar}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-1">
                            اشترت للتو · just purchased
                        </p>
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                            {currentNotification.packName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {currentNotification.time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseNotifications;
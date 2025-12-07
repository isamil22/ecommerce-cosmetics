// Purchase Notifications - Professional design with women customers
import React, { useState, useEffect } from 'react';

const PurchaseNotifications = ({ packName, productImage }) => {
    const [currentNotification, setCurrentNotification] = useState(null);

    // Female names only for realistic notifications
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

    const purchaseMessages = [
        { ar: 'اشترت للتو', en: 'just purchased' },
        { ar: 'أضافت للسلة', en: 'added to cart' },
        { ar: 'اشترت', en: 'bought' },
        { ar: 'طلبت', en: 'ordered' }
    ];

    useEffect(() => {
        const showNotification = () => {
            const randomName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
            const randomMessage = purchaseMessages[Math.floor(Math.random() * purchaseMessages.length)];

            const notification = {
                id: Date.now(),
                name: randomName,
                message: randomMessage,
                packName: packName || 'منتج / Product'
            };

            setCurrentNotification(notification);

            // Hide notification after 5 seconds
            setTimeout(() => {
                setCurrentNotification(null);
            }, 5000);
        };

        // Show first notification after 4 seconds
        const initialTimer = setTimeout(showNotification, 4000);

        // Then show notifications every 40-60 seconds (less frequent)
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
        <div className="fixed top-24 right-3 sm:right-6 z-40 animate-fade-in-down max-w-sm w-full sm:w-80">
            {/* Professional Card Design */}
            <div className="bg-white rounded-xl shadow-xl border-l-4 border-pink-500 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <span className="text-sm font-bold">عملية شراء / Purchase</span>
                        </div>
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">الآن / Now</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                    {/* Product/Pack Image - Large & Prominent */}
                    {productImage && (
                        <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-100">
                            <img 
                                src={productImage} 
                                alt={packName || 'Product'} 
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/300x200/fde4f2/E91E63?text=${encodeURIComponent('Product')}`;
                                }}
                            />
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="space-y-3">
                        {/* Name */}
                        <div className="flex items-center gap-2">
                            <span className="text-lg">👩</span>
                            <div>
                                <p className="text-sm text-gray-500">عميل / Customer</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {currentNotification.name.ar}
                                </p>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 border border-pink-100">
                            <p className="text-sm">
                                <span className="font-bold text-pink-600">
                                    {currentNotification.name.ar}
                                </span>
                                <span className="text-gray-700 mx-1">
                                    {currentNotification.message.ar}
                                </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {currentNotification.message.en}
                            </p>
                        </div>

                        {/* Product/Pack Name */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">المنتج / Product</p>
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {currentNotification.packName}
                            </p>
                        </div>

                        {/* Footer Action Indicator */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">✅ تم التحقق / Verified</span>
                            <span className="text-xs font-semibold text-pink-600">🔥 محط اهتمام / Trending</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 animate-progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseNotifications;
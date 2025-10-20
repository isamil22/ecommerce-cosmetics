// Sticky Add to Cart - Follows user as they scroll
import React, { useState, useEffect } from 'react';

const StickyAddToCart = ({ 
    pack, 
    onAddToCart, 
    isVisible = true, 
    selectedCount = 0,
    totalItems = 0 
}) => {
    const [isSticky, setIsSticky] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const shouldBeSticky = scrollPosition > 800; // Show after scrolling 800px
            
            if (shouldBeSticky !== isSticky) {
                setIsSticky(shouldBeSticky);
                if (shouldBeSticky) {
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 500);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    const handleClick = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        onAddToCart();
    };

    if (!isVisible || !isSticky || !pack) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-500 ${
            isSticky ? 'translate-y-0' : 'translate-y-full'
        }`}>
            {/* Background overlay */}
            <div className="bg-gradient-to-t from-black/20 to-transparent h-20 absolute -top-20 left-0 right-0"></div>
            
            {/* Sticky bar */}
            <div className="bg-white border-t-2 border-pink-300 shadow-2xl">
                <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center justify-between gap-2">
                        {/* Pack Info */}
                        <div className="flex items-center flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 overflow-hidden">
                                {pack.images && pack.images.length > 0 ? (
                                    <img 
                                        src={pack.images[0]} 
                                        alt={pack.name || 'Product'} 
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            // Fallback to emoji if image fails to load
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                <span 
                                    className="text-lg sm:text-2xl"
                                    style={{ display: pack.images && pack.images.length > 0 ? 'none' : 'block' }}
                                >
                                    📦
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                                    {pack.name}
                                </h3>
                                <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                                    <span className="text-pink-600 font-bold text-sm sm:text-lg">
                                        ${(pack.price || 0).toFixed(2)}
                                    </span>
                                    {selectedCount > 0 && (
                                        <span className="bg-green-100 text-green-700 text-xs px-1 sm:px-2 py-1 rounded-full">
                                            {selectedCount}/{totalItems} مختار / selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleClick}
                            className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center flex-shrink-0 ${
                                isAnimating ? 'animate-bounce-custom' : ''
                            }`}
                            aria-label="Add pack to shopping cart"
                        >
                            <span className="text-lg sm:text-xl mr-1 sm:mr-2">🛒</span>
                            <div className="text-left">
                                <div className="text-xs sm:text-sm leading-tight">إضافة للسلة</div>
                                <div className="text-xs leading-tight opacity-90 hidden sm:block">Add to Cart</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Urgency indicator */}
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-center py-1">
                    <p className="text-xs font-semibold animate-pulse">
                        🔥 عرض محدود! / Limited Offer! 🔥
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StickyAddToCart;

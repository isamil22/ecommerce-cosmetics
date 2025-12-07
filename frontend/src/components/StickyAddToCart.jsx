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
            {/* Sticky bar - Minimal Design */}
            <div className="bg-white border-t-2 border-pink-300 shadow-2xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Minimal Pack Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-sm truncate">
                                {pack.name}
                            </h3>
                            <p className="text-pink-600 font-bold text-lg">
                                ${(pack.price || 0).toFixed(2)}
                            </p>
                        </div>

                        {/* Add to Cart Button - Clean & Professional */}
                        <button
                            onClick={handleClick}
                            className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 flex-shrink-0 ${
                                isAnimating ? 'animate-bounce-custom' : ''
                            }`}
                            aria-label="Add pack to shopping cart"
                        >
                            <span className="text-xl">🛒</span>
                            <span className="text-sm sm:text-base">Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyAddToCart;

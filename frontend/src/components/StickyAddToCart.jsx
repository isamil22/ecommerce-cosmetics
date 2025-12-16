// Sticky Add to Cart - Clean Luxury Version
import React, { useState, useEffect } from 'react';

const StickyAddToCart = ({
    pack,
    activeImage,
    onAddToCart,
    isVisible = true
}) => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const shouldBeSticky = scrollPosition > 600;

            if (shouldBeSticky !== isSticky) {
                setIsSticky(shouldBeSticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    if (!isVisible || !isSticky || !pack) return null;

    const displayImage = activeImage || (pack.images && pack.images.length > 0 ? pack.images[0] : (pack.image || '/placeholder-product.jpg'));

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 translate-y-0">
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">

                        {/* Information Group */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                                src={displayImage}
                                alt={pack.name}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-gray-50"
                            />
                            <div className="min-w-0 hidden sm:block">
                                <h3 className="font-bold text-gray-900 text-sm truncate">
                                    {pack.name}
                                </h3>
                                <p className="text-gray-500 text-xs">
                                    In Stock
                                </p>
                            </div>
                        </div>

                        {/* Action Group */}
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-lg text-gray-900 hidden sm:block">
                                ${(pack.price || 0).toFixed(2)}
                            </span>
                            <button
                                onClick={onAddToCart}
                                className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyAddToCart;

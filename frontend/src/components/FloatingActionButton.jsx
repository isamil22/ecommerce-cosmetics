// frontend/src/components/FloatingActionButton.jsx - FLOATING ACTION BUTTON
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FloatingActionButton = ({ cartCount }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [currentOffer, setCurrentOffer] = useState(0);

    const offers = [
        { text: "خصم 20% على الباقات / 20% OFF Packs", icon: "🎁", color: "from-pink-500 to-purple-600" },
        { text: "شحن مجاني اليوم / Free Shipping Today", icon: "🚚", color: "from-blue-500 to-cyan-600" },
        { text: "منتجات جديدة وصلت / New Products", icon: "✨", color: "from-green-500 to-emerald-600" },
        { text: "عرض محدود الوقت / Limited Time Offer", icon: "⏰", color: "from-orange-500 to-red-600" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentOffer((prev) => (prev + 1) % offers.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Offer Banner */}
            <div className={`mb-4 bg-gradient-to-r ${offers[currentOffer].color} text-white px-4 py-2 rounded-full shadow-lg animate-slide-in-right max-w-xs`}>
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-lg animate-bounce">{offers[currentOffer].icon}</span>
                    <span className="truncate">{offers[currentOffer].text}</span>
                </div>
            </div>

            {/* Main FAB */}
            <div className="relative">
                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-attention-pulse flex items-center justify-center group"
                >
                    <svg className="w-8 h-8 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>

                {/* Cart Badge */}
                {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                        {cartCount}
                    </div>
                )}

                {/* Floating Options */}
                {showOptions && (
                    <div className="absolute bottom-20 right-0 space-y-3 animate-slide-in-right">
                        {/* Quick Cart */}
                        <Link
                            to="/cart"
                            className="flex items-center gap-3 bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span className="font-semibold">السلة / Cart</span>
                            {cartCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Quick Products */}
                        <Link
                            to="/products"
                            className="flex items-center gap-3 bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="font-semibold">المنتجات / Products</span>
                        </Link>

                        {/* Quick Packs */}
                        <Link
                            to="/packs"
                            className="flex items-center gap-3 bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <span className="font-semibold">الباقات / Packs</span>
                        </Link>

                        {/* Back to Top */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-3 bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                            <span className="font-semibold">للأعلى / Top</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingActionButton;

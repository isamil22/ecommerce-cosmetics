import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ProductCard from './ProductCard';
import { formatPrice } from '../utils/currency';

// PackCard component that matches ProductCard design exactly
const PackCard = ({ pack }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [viewingCount, setViewingCount] = useState(Math.floor(Math.random() * 20) + 1);
    const [recentPurchases, setRecentPurchases] = useState(Math.floor(Math.random() * 8) + 1);
    const navigate = useNavigate();

    const fullImageUrl = pack.imageUrl || 'https://placehold.co/300x300/3B82F6/FFFFFF?text=Pack';

    // Calculate average rating from comments (if pack has comments)
    const averageRating = pack.comments && pack.comments.length > 0
        ? pack.comments.reduce((acc, comment) => acc + comment.score, 0) / pack.comments.length
        : 4.5; // Default rating for packs
    const reviewCount = pack.comments?.length || Math.floor(Math.random() * 10) + 1;

    // Stock status (packs are usually available)
    const isOutOfStock = false;
    const quantity = Math.floor(Math.random() * 15) + 5; // Random stock between 5-20
    const isLowStockStatus = quantity <= 5;

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(pack.linkTo);
    };

    // Render star rating (same as ProductCard)
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="text-yellow-400 text-sm">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="text-yellow-400 text-sm">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300 text-sm">☆</span>);
            }
        }
        return stars;
    };

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 max-w-sm mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges Section */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    📦 Pack
                </span>
                {isLowStockStatus && (
                    <span className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⚠️ {quantity} متبقي / Left
                    </span>
                )}
            </div>



            {/* Quick Actions - Appear on Hover */}
            <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <button
                    onClick={handleQuickView}
                    className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                    title="عرض سريع / Quick View"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            <Link to={pack.linkTo} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                        src={fullImageUrl}
                        alt={pack.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://placehold.co/300x300/3B82F6/FFFFFF?text=Pack';
                            setImageLoaded(true);
                        }}
                    />

                    {/* Loading Skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                    )}

                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>


                </div>

                {/* Pack Info */}
                <div className="p-4 space-y-2">
                    {/* Category Badge */}
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        Pack
                    </span>

                    {/* Pack Title */}
                    <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-tight h-12 group-hover:text-blue-600 transition-colors">
                        {pack.name}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {renderStars()}
                        </div>
                        <span className="text-xs text-gray-500">
                            ({reviewCount} {reviewCount === 1 ? 'مراجعة / review' : 'مراجعات / reviews'})
                        </span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-blue-600">
                            {formatPrice(pack.price || 0)}
                        </span>
                    </div>

                    {/* Stock Status Bar with Urgency */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">متوفر / Available</span>
                            <span className="font-bold text-red-600 animate-pulse">{quantity} متبقي فقط! / Only left!</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300 relative"
                                style={{ width: `${Math.min((quantity / 10) * 100, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Purchase Notifications */}
                    {recentPurchases > 5 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                                <span className="text-green-600 text-sm">🛒</span>
                                <span className="text-green-700 text-xs font-semibold">
                                    {recentPurchases} اشترى هذا اليوم / bought today
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="mt-auto p-4 pt-0">
                <button
                    onClick={handleQuickView}
                    className="w-full font-bold py-4 px-4 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-2 relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl shadow-lg"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="relative z-10">📦 عرض التفاصيل / View Details</span>
                    {/* Urgency Indicator */}
                    {quantity <= 5 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            سريع! / Fast!
                        </span>
                    )}
                </button>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}></div>
        </div>
    );
};

const PackRecommendations = ({ pack }) => {
    if (!pack) return null;

    // Combine all recommendations into a single array with type indicators
    const allRecommendations = [];

    // Add recommended products
    if (pack.recommendedProducts && pack.recommendedProducts.length > 0) {
        pack.recommendedProducts.forEach(product => {
            allRecommendations.push({
                ...product,
                type: 'product',
                linkTo: `/products/${product.id}`
            });
        });
    }

    // Add recommended packs
    if (pack.recommendedPacks && pack.recommendedPacks.length > 0) {
        pack.recommendedPacks.forEach(recommendedPack => {
            allRecommendations.push({
                ...recommendedPack,
                type: 'pack',
                linkTo: `/packs/${recommendedPack.id}`,
                // Convert pack to product-like format for ProductCard
                images: [recommendedPack.imageUrl],
                categoryName: 'Pack'
            });
        });
    }

    // Add recommended custom packs
    if (pack.recommendedCustomPacks && pack.recommendedCustomPacks.length > 0) {
        pack.recommendedCustomPacks.forEach(customPack => {
            allRecommendations.push({
                ...customPack,
                type: 'customPack',
                linkTo: `/custom-packs/${customPack.id}`,
                // Convert custom pack to product-like format
                images: ['https://placehold.co/300x300/purple/white?text=Custom+Pack'],
                categoryName: 'Custom Pack',
                price: customPack.pricingType === 'FIXED' ? customPack.fixedPrice : 0
            });
        });
    }

    if (allRecommendations.length === 0) return null;

    return (
        <div className="mt-12">
            {/* Unified Recommendations Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allRecommendations.map((item, index) => {
                        if (item.type === 'product') {
                            // Use ProductCard for products
                            return (
                                <ProductCard
                                    key={`product-${item.id}`}
                                    product={item}
                                />
                            );
                        } else if (item.type === 'pack') {
                            // Pack card with same design as ProductCard
                            return (
                                <PackCard key={`pack-${item.id}`} pack={item} />
                            );
                        } else if (item.type === 'customPack') {
                            // Custom pack card
                            return (
                                <div key={`custom-${item.id}`} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-purple-200">
                                    <Link to={item.linkTo}>
                                        <div className="p-6">
                                            <div className="flex items-center mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-4">
                                                    <span className="text-white font-bold text-lg">CP</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {item.minItems}-{item.maxItems} items
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-purple-600 font-bold text-xl">
                                                    {item.pricingType === 'FIXED'
                                                        ? formatPrice(item.fixedPrice || 0)
                                                        : `${(item.discountRate * 100).toFixed(0)}% off`
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    {item.pricingType === 'FIXED' ? 'Fixed Price' : 'Dynamic Discount'}
                                                </p>
                                            </div>

                                            {item.description && (
                                                <p className="text-gray-600 text-sm line-clamp-3">
                                                    {item.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                </p>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-purple-200">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    Customizable Pack
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </section>
        </div>
    );
};

export default PackRecommendations;

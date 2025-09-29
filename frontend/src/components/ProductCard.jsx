// frontend/src/components/ProductCard.jsx - ENHANCED PROFESSIONAL VERSION

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactGA from "react-ga4";
import { addToCart } from '../api/apiService';
import { toast } from 'react-toastify';

const ProductCard = ({ product, fetchCartCount, isAuthenticated }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const navigate = useNavigate();

    const fullImageUrl = (product.images && product.images.length > 0)
        ? product.images[0]
        : 'https://placehold.co/300x300/E91E63/FFFFFF?text=Product';

    // Calculate discount percentage
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    const discountPercent = hasDiscount 
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    // Stock status
    const isLowStock = product.quantity > 0 && product.quantity <= 5;
    const isOutOfStock = !product.quantity || product.quantity === 0;

    // Check if product is new (created within last 30 days)
    const isNew = product.createdAt && 
        (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) <= 30;

    // Calculate average rating from comments
    const averageRating = product.comments && product.comments.length > 0
        ? product.comments.reduce((acc, comment) => acc + comment.score, 0) / product.comments.length
        : 0;
    const reviewCount = product.comments?.length || 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isOutOfStock) {
            toast.warn('هذا المنتج غير متوفر حالياً / Product is out of stock');
            return;
        }

        setIsAddingToCart(true);

        // Google Analytics
        ReactGA.event({
            category: 'Ecommerce',
            action: 'add_to_cart',
            label: product.name,
            value: product.price
        });

        // Facebook Pixel
        if (typeof window.fbq === 'function') {
            window.fbq('track', 'AddToCart', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price,
                currency: 'USD'
            });
        }

        try {
            await addToCart(product.id, 1);
            toast.success(`✅ تم إضافة ${product.name} للسلة! / ${product.name} added to cart!`);
            if (fetchCartCount) {
                fetchCartCount();
            }
        } catch (error) {
            toast.error('فشل في الإضافة للسلة / Failed to add to cart');
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/products/${product.id}`);
    };

    // Render star rating
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
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges Section */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                {isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        ✨ جديد / NEW
                    </span>
                )}
                {hasDiscount && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        🔥 خصم {discountPercent}% / {discountPercent}% OFF
                    </span>
                )}
                {isLowStock && !isOutOfStock && (
                    <span className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⚠️ {product.quantity} متبقي / Left
                    </span>
                )}
                {isOutOfStock && (
                    <span className="bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ❌ غير متوفر / Out of Stock
                    </span>
                )}
            </div>

            {/* Quick Actions - Appear on Hover */}
            <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <button
                    onClick={handleQuickView}
                    className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                    title="عرض سريع / Quick View"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                        src={fullImageUrl}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://placehold.co/300x300/E91E63/FFFFFF?text=No+Image';
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

                {/* Product Info */}
                <div className="p-4 space-y-2">
                    {/* Category Badge */}
                    {product.categoryName && (
                        <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-1 rounded">
                            {product.categoryName}
                        </span>
                    )}

                    {/* Product Title */}
                    <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-tight h-12 group-hover:text-pink-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating & Reviews */}
                    {reviewCount > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {renderStars()}
                            </div>
                            <span className="text-xs text-gray-500">
                                ({reviewCount} {reviewCount === 1 ? 'مراجعة / review' : 'مراجعات / reviews'})
                            </span>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-pink-600">
                            ${product.price?.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.oldPrice?.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Size/Unit Info */}
                    {product.size && product.unit && (
                        <p className="text-xs text-gray-500">
                            (${(product.price / product.size).toFixed(2)} / {product.unit})
                        </p>
                    )}

                    {/* Stock Status Bar */}
                    {!isOutOfStock && product.quantity <= 10 && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">متوفر / Available</span>
                                <span className="font-semibold text-orange-600">{product.quantity} متبقي / left</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((product.quantity / 10) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="mt-auto p-4 pt-0">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-2 ${
                        isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isAddingToCart
                            ? 'bg-pink-400 text-white cursor-wait'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                    }`}
                >
                    {isAddingToCart ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>جارٍ الإضافة...</span>
                        </>
                    ) : isOutOfStock ? (
                        <span>❌ غير متوفر / Out of Stock</span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>أضف للسلة / Add to Cart</span>
                        </>
                    )}
                </button>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}></div>
        </div>
    );
};

export default ProductCard;
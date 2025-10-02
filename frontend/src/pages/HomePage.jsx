// ENHANCED HOME PAGE - Professional E-commerce Experience
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBestsellers, getNewArrivals, getApprovedReviews, getAllCategories, getHero } from '../api/apiService';
import ProductCard from '../components/ProductCard';
import CountdownBar from '../components/CountdownBar';
import TrustBadges from '../components/TrustBadges';
import EnhancedCountdown from '../components/EnhancedCountdown';
import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter';
import PurchaseNotifications from '../components/PurchaseNotifications';
import LiveNotifications from '../components/LiveNotifications';
import { toast } from 'react-toastify';

const HomePage = () => {
    const [bestsellers, setBestsellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [hero, setHero] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bestsellers');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    bestsellersResponse,
                    newArrivalsResponse,
                    reviewsResponse,
                    categoriesResponse,
                    heroResponse
                ] = await Promise.all([
                    getBestsellers(),
                    getNewArrivals(),
                    getApprovedReviews(),
                    getAllCategories(),
                    getHero()
                ]);

                const bestsellersArray = Array.isArray(bestsellersResponse.data) ? bestsellersResponse.data : bestsellersResponse.data.content;
                setBestsellers(bestsellersArray);

                const newArrivalsArray = Array.isArray(newArrivalsResponse.data) ? newArrivalsResponse.data : newArrivalsResponse.data.content;
                setNewArrivals(newArrivalsArray);

                setReviews(reviewsResponse.data);
                setCategories(categoriesResponse.data);
                setHero(heroResponse.data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not fetch data from the server.");
                toast.error("فشل في تحميل البيانات / Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper function to render stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300 text-xl">☆</span>);
            }
        }
        return <div className="flex items-center">{stars}</div>;
    };

    // Use the S3 URL directly
    const heroImageUrl = hero?.imageUrl;

    // Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="container-xl section-spacing">
                <div className="bg-gray-200 rounded-3xl h-96 animate-skeleton-pulse max-w-6xl mx-auto"></div>
            </div>
            
            {/* Categories Skeleton */}
            <div className="container-xl section-spacing-lg">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-skeleton-pulse"></div>
                <div className="grid-responsive-sm max-w-4xl mx-auto">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-40 animate-skeleton-pulse"></div>
                    ))}
                </div>
            </div>
            
            {/* Products Skeleton */}
            <div className="container-xl section-spacing-lg">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-skeleton-pulse"></div>
                <div className="grid-responsive max-w-6xl mx-auto">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-skeleton-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen">
            {/* Countdown Bar - Top Priority */}
            <CountdownBar />

            {/* Enhanced Countdown Timer */}
            <div className="container-xl section-spacing">
                <EnhancedCountdown 
                    endTime={new Date().getTime() + (24 * 60 * 60 * 1000)}
                    packName="عروض اليوم الخاصة / Today's Special Offers"
                    onExpire={() => {
                        toast.info('🕐 انتهت فترة العرض الخاص / Special offer period ended');
                    }}
                />
            </div>

            {/* Enhanced Visitor Counter */}
            <div className="container-xl section-spacing">
                <div className="max-w-4xl mx-auto">
                    <EnhancedVisitorCounter />
                </div>
            </div>

            {/* --- ENHANCED HERO SECTION --- */}
            {hero && (
                <div className="container-xl section-spacing">
                    <div
                        className="relative rounded-3xl p-8 sm:p-12 md:p-20 lg:p-28 text-center text-white overflow-hidden bg-cover bg-center shadow-2xl max-w-6xl mx-auto"
                        style={{ backgroundImage: `url(${heroImageUrl})` }}
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/80 via-purple-600/70 to-blue-600/60"></div>
                        
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                        
                    <div className="relative z-10">
                            <div className="inline-block mb-4 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-white/40">
                                <p className="text-sm font-semibold">✨ عروض حصرية / Exclusive Offers ✨</p>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
                                {hero.title}
                            </h1>
                            
                            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
                                {hero.subtitle}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link 
                                    to={hero.linkUrl} 
                                    className="group bg-white text-pink-600 font-bold py-4 px-10 rounded-full hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2"
                                >
                                    <span>{hero.linkText}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                                
                                <Link 
                                    to="/packs" 
                                    className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-pink-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    🎁 تصفح الباقات / Browse Packs
                        </Link>
                            </div>
                            
                            {/* Trust Indicators */}
                            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">✓</span>
                                    <span>شحن مجاني / Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">✓</span>
                                    <span>منتجات أصلية / Authentic Products</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">✓</span>
                                    <span>ضمان 30 يوم / 30-Day Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ENHANCED Shop By Category Section --- */}
            <div className="container-xl section-spacing-lg">
                <div className="text-center mb-12">
                    <div className="inline-block mb-3">
                        <span className="text-4xl">🛍️</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        تسوق حسب الفئة
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold text-pink-600 mb-4">
                        Shop by Category
                    </h3>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        اكتشف منتجاتنا المميزة في فئات متنوعة / Discover our featured products in various categories
                    </p>
                </div>
                
                <div className="grid-responsive-sm max-w-4xl mx-auto">
                    {categories.length > 0 ? categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/products?categoryId=${category.id}`}
                            className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden aspect-square transform hover:scale-105"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            aria-label={`تسوق ${category.name} / Shop ${category.name}`}
                        >
                            {/* Image */}
                            <img
                                src={category.imageUrl || `https://placehold.co/400x400/fde4f2/E91E63?text=${encodeURIComponent(category.name)}`}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/400x400/fde4f2/E91E63?text=${encodeURIComponent(category.name)}`;
                                }}
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300"></div>
                            
                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-6">
                                <p className="font-bold text-white text-base md:text-xl text-center leading-tight mb-2 transform group-hover:translate-y-0 transition-transform">
                                    {category.name}
                                </p>
                                <p className="text-xs md:text-sm text-center text-gray-200 max-w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 leading-snug">
                                    {category.description || 'استكشف المنتجات / Explore Products'}
                                </p>
                                
                                {/* Arrow Icon */}
                                <div className="mt-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <span className="text-white font-bold">→</span>
                                </div>
                            </div>
                            
                            {/* Corner Badge */}
                            <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                تسوق / Shop
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full text-center py-20">
                            <div className="text-6xl mb-4">🛍️</div>
                            <p className="text-2xl text-gray-600 mb-2 font-bold">لا توجد فئات متاحة حالياً</p>
                            <p className="text-xl text-gray-400">No categories available at the moment</p>
                            <p className="text-gray-500 mt-4">سنضيف فئات جديدة قريباً! / New categories coming soon!</p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="container mx-auto px-4 mb-8">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                        <p className="text-red-700 font-semibold">❌ {error}</p>
                    </div>
                </div>
            )}

            {/* --- VALUE PROPOSITION SECTION --- */}
            <div className="container mx-auto px-4 mb-20">
                <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 md:p-12 shadow-xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
                            لماذا تختار متجرنا؟
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-bold text-pink-600 mb-4">
                            Why Choose Our Store?
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                            <div className="text-5xl mb-4 text-center">🎯</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">
                                منتجات أصلية مضمونة
                            </h4>
                            <h5 className="text-lg font-semibold text-pink-600 mb-3 text-center">
                                100% Authentic Products
                            </h5>
                            <p className="text-gray-600 text-center leading-relaxed">
                                جميع منتجاتنا أصلية ومضمونة من العلامات التجارية الموثوقة
                            </p>
                            <p className="text-gray-500 text-sm text-center mt-2">
                                All our products are authentic and guaranteed from trusted brands
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                            <div className="text-5xl mb-4 text-center">🚚</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">
                                توصيل سريع ومجاني
                            </h4>
                            <h5 className="text-lg font-semibold text-blue-600 mb-3 text-center">
                                Fast & Free Delivery
                            </h5>
                            <p className="text-gray-600 text-center leading-relaxed">
                                شحن مجاني لجميع الطلبات والتوصيل خلال 3-5 أيام
                            </p>
                            <p className="text-gray-500 text-sm text-center mt-2">
                                Free shipping on all orders with delivery in 3-5 days
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                            <div className="text-5xl mb-4 text-center">💎</div>
                            <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">
                                خدمة عملاء متميزة
                            </h4>
                            <h5 className="text-lg font-semibold text-purple-600 mb-3 text-center">
                                Premium Customer Service
                            </h5>
                            <p className="text-gray-600 text-center leading-relaxed">
                                فريق دعم متاح 24/7 لمساعدتك في أي استفسار
                            </p>
                            <p className="text-gray-500 text-sm text-center mt-2">
                                24/7 support team available to help with any inquiries
                            </p>
                        </div>
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="mt-10">
                        <TrustBadges />
                    </div>
                </div>
            </div>

            {/* --- ENHANCED PRODUCTS SECTION WITH TABS --- */}
            <div className="container-xl section-spacing-lg">
                <div className="text-center mb-10">
                    <div className="inline-block mb-3">
                        <span className="text-4xl">⭐</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        منتجاتنا المميزة
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6">
                        Our Featured Products
                    </h3>
                </div>
                
                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex bg-gray-100 rounded-full p-2 shadow-lg" role="tablist" aria-label="Product categories">
                        <button
                            onClick={() => setActiveTab('bestsellers')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                                activeTab === 'bestsellers'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            role="tab"
                            aria-selected={activeTab === 'bestsellers'}
                            aria-controls="bestsellers-panel"
                        >
                            🔥 الأكثر مبيعاً / Bestsellers
                        </button>
                        <button
                            onClick={() => setActiveTab('newArrivals')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ml-2 ${
                                activeTab === 'newArrivals'
                                    ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-xl transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            role="tab"
                            aria-selected={activeTab === 'newArrivals'}
                            aria-controls="newArrivals-panel"
                        >
                            ✨ وصل حديثاً / New Arrivals
                        </button>
                    </div>
                </div>
                
                {/* Products Grid */}
                <div className="relative">
                    {activeTab === 'bestsellers' && (
                        <div 
                            id="bestsellers-panel"
                            role="tabpanel"
                            aria-labelledby="bestsellers-tab"
                            className="grid-responsive max-w-6xl mx-auto animate-fade-in"
                        >
                            {bestsellers.length > 0 ? (
                                bestsellers.map((product, index) => (
                                    <div 
                                        key={product.id}
                                        className="animate-slide-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-xl text-gray-500 mb-2">لا توجد منتجات متاحة حالياً</p>
                                    <p className="text-lg text-gray-400">No products available at the moment</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'newArrivals' && (
                        <div 
                            id="newArrivals-panel"
                            role="tabpanel"
                            aria-labelledby="newArrivals-tab"
                            className="grid-responsive max-w-6xl mx-auto animate-fade-in"
                        >
                            {newArrivals.length > 0 ? (
                                newArrivals.map((product, index) => (
                                    <div 
                                        key={product.id}
                                        className="animate-slide-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-xl text-gray-500 mb-2">لا توجد منتجات جديدة حالياً</p>
                                    <p className="text-lg text-gray-400">No new products at the moment</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        aria-label="عرض جميع المنتجات / View all products page"
                    >
                        <span>عرض جميع المنتجات / View All Products</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>

            {/* --- ENHANCED REVIEWS SECTION --- */}
            <div className="container mx-auto px-4 mb-20">
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
                    <div className="text-center mb-10">
                        <div className="inline-block mb-3">
                            <span className="text-4xl">⭐</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                            آراء عملائنا السعداء
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">
                            What Our Happy Customers Say
                        </h3>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            شاهد تجارب عملائنا الحقيقية / See real experiences from our customers
                        </p>
                    </div>
                    
                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {reviews.map((review, index) => (
                                <div 
                                    key={review.id} 
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-yellow-400"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Stars at top */}
                                    <div className="flex justify-between items-start mb-4">
                                {renderStars(review.rating)}
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                            ✓ مؤكد / Verified
                                        </span>
                                    </div>
                                    
                                    {/* Review Content */}
                                    <p className="text-gray-700 mb-6 leading-relaxed text-base italic">
                                        "{review.content}"
                                    </p>
                                    
                                    {/* Customer Info */}
                                    <div className="flex items-center pt-4 border-t border-gray-100">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                                            {(review.createdByAdmin ? 
                                                (review.customName || 'A') : 
                                                (review.userEmail || 'C')
                                            )[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {review.createdByAdmin ? 
                                                    (review.customName || 'عميل مميز / Valued Customer') : 
                                                    (review.userEmail?.split('@')[0] || 'Customer')
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                عميل موثوق / Verified Buyer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-xl text-gray-500 mb-2">لا توجد مراجعات بعد</p>
                            <p className="text-lg text-gray-400">No reviews yet - Be the first to share your experience!</p>
                        </div>
                    )}
                    
                    {/* Overall Rating Summary */}
                    {reviews.length > 0 && (
                        <div className="mt-10 bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                                <div className="text-center">
                                    <div className="text-5xl font-extrabold text-yellow-500 mb-2">
                                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                                    </div>
                                    <div className="flex justify-center mb-2">
                                        {renderStars(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)}
                                    </div>
                                    <p className="text-gray-600 font-semibold">
                                        من 5.0 / out of 5.0
                                    </p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-pink-600 mb-2">
                                        {reviews.length}+
                                    </div>
                                    <p className="text-gray-600 font-semibold">
                                        مراجعة موثوقة<br/>
                                        Verified Reviews
                                    </p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        98%
                                    </div>
                                    <p className="text-gray-600 font-semibold">
                                        رضا العملاء<br/>
                                        Customer Satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CALL TO ACTION SECTION --- */}
            <div className="container mx-auto px-4 mb-20">
                <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
                            ابدأ التسوق الآن واستمتع بالعروض!
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-bold mb-6">
                            Start Shopping Now and Enjoy Amazing Deals!
                        </h3>
                        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-95">
                            اكتشف آلاف المنتجات الأصلية بأفضل الأسعار مع شحن مجاني وضمان الجودة
                        </p>
                        <p className="text-base md:text-lg mb-10 max-w-3xl mx-auto opacity-90">
                            Discover thousands of authentic products at the best prices with free shipping and quality guarantee
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="bg-white text-pink-600 font-bold py-4 px-10 rounded-full hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center justify-center gap-2"
                            >
                                <span>🛍️ تسوق الآن / Shop Now</span>
                            </Link>
                            
                            <Link
                                to="/packs"
                                className="bg-yellow-400 text-gray-900 font-bold py-4 px-10 rounded-full hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center justify-center gap-2"
                            >
                                <span>🎁 الباقات الخاصة / Special Packs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Notifications */}
            <PurchaseNotifications packName="منتجات المتجر / Store Products" />
            
            {/* Live Activity Notifications */}
            <LiveNotifications />
        </div>
    );
};

export default HomePage;



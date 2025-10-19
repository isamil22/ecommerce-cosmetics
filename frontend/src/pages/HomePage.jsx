// ULTRA ENHANCED HOME PAGE - Premium E-commerce Experience with Sophisticated Visual Design
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBestsellers, getNewArrivals, getApprovedReviews, getAllCategories, getHero } from '../api/apiService';
import ProductCard from '../components/ProductCard';
import TrustBadges from '../components/TrustBadges';
import EnhancedCountdown from '../components/EnhancedCountdown';
// import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter'; // HIDDEN - Live Statistics
import PurchaseNotifications from '../components/PurchaseNotifications';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
            {/* Hero Skeleton */}
            <div className="container mx-auto px-8 py-20">
                <div className="bg-gray-200 rounded-3xl h-96 animate-skeleton-pulse max-w-7xl mx-auto"></div>
            </div>
            
            {/* Categories Skeleton */}
            <div className="container mx-auto px-8 py-28">
                <div className="h-12 bg-gray-200 rounded-2xl w-96 mx-auto mb-16 animate-skeleton-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 max-w-7xl mx-auto">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-3xl h-56 animate-skeleton-pulse"></div>
                    ))}
                </div>
            </div>
            
            {/* Products Skeleton */}
            <div className="container mx-auto px-8 py-28">
                <div className="h-12 bg-gray-200 rounded-2xl w-96 mx-auto mb-16 animate-skeleton-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-3xl h-96 animate-skeleton-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
            {/* Ultra Enhanced Countdown Timer - Admin Controllable */}
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <EnhancedCountdown 
                        fallbackEndTime={new Date().getTime() + (24 * 60 * 60 * 1000)}
                        packName="عروض اليوم الخاصة / Today's Special Offers"
                        onExpire={() => {
                            toast.info('🕐 انتهت فترة العرض الخاص / Special offer period ended');
                        }}
                    />
                </div>
            </div>

            {/* Enhanced Visitor Counter - HIDDEN */}
            {/* <div className="container mx-auto px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <EnhancedVisitorCounter />
                </div>
            </div> */}

            {/* --- ULTRA ENHANCED HERO SECTION --- */}
            {hero && (
                <div className="container mx-auto px-6 py-12">
                    <div
                        className="relative rounded-3xl p-12 sm:p-16 md:p-24 lg:p-28 text-center text-white overflow-hidden bg-cover bg-center shadow-2xl max-w-6xl mx-auto"
                        style={{ backgroundImage: `url(${heroImageUrl})` }}
                    >
                        {/* Ultra Enhanced Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/90 via-purple-600/80 to-blue-600/70"></div>
                        
                        {/* Ultra Enhanced Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-white rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="inline-block mb-8 bg-white/30 backdrop-blur-lg px-10 py-4 rounded-full border-2 border-white/60 shadow-2xl">
                                <p className="text-lg font-black">✨ عروض حصرية / Exclusive Offers ✨</p>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight animate-fade-in tracking-tight">
                                {hero.title}
                            </h1>
                            
                            <p className="text-xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-95 font-semibold">
                                {hero.subtitle}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link 
                                    to={hero.linkUrl} 
                                    className="group bg-white text-pink-600 font-black py-5 px-12 rounded-full hover:bg-pink-50 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-3xl flex items-center gap-3 text-lg"
                                >
                                    <span>{hero.linkText}</span>
                                    <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
                                </Link>
                                
                                <Link 
                                    to="/packs" 
                                    className="bg-transparent border-3 border-white text-white font-black py-5 px-12 rounded-full hover:bg-white hover:text-pink-600 transition-all duration-500 transform hover:scale-110 text-lg shadow-xl"
                                >
                                    🎁 تصفح الباقات / Browse Packs
                                </Link>
                            </div>
                            
                            {/* Ultra Enhanced Trust Indicators */}
                            <div className="mt-12 flex flex-wrap justify-center gap-12 text-base">
                                <div className="flex items-center gap-4 bg-white/25 backdrop-blur-lg px-8 py-4 rounded-full shadow-xl">
                                    <span className="text-4xl">✓</span>
                                    <span className="font-black">شحن مجاني / Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/25 backdrop-blur-lg px-8 py-4 rounded-full shadow-xl">
                                    <span className="text-4xl">✓</span>
                                    <span className="font-black">منتجات أصلية / Authentic Products</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/25 backdrop-blur-lg px-8 py-4 rounded-full shadow-xl">
                                    <span className="text-4xl">✓</span>
                                    <span className="font-black">ضمان 30 يوم / 30-Day Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ULTRA ENHANCED Shop By Category Section --- */}
            <div className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                        <span className="text-6xl">🛍️</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        تسوق حسب الفئة
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6">
                        Shop by Category
                    </h3>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed font-semibold">
                        اكتشف منتجاتنا المميزة في فئات متنوعة / Discover our featured products in various categories
                    </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
                    {categories.length > 0 ? categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/products?categoryId=${category.id}`}
                            className="group relative block bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden aspect-square transform hover:scale-110 hover:-translate-y-4"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            aria-label={`تسوق ${category.name} / Shop ${category.name}`}
                        >
                            {/* Image */}
                            <img
                                src={category.imageUrl || `https://placehold.co/400x400/fde4f2/E91E63?text=${encodeURIComponent(category.name)}`}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/400x400/fde4f2/E91E63?text=${encodeURIComponent(category.name)}`;
                                }}
                            />
                            
                            {/* Enhanced Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-10">
                                <p className="font-black text-white text-xl md:text-2xl text-center leading-tight mb-4 transform group-hover:translate-y-0 transition-transform duration-700">
                                    {category.name}
                                </p>
                                <p className="text-base md:text-lg text-center text-gray-200 max-w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 px-4 leading-snug">
                                    {category.description || 'استكشف المنتجات / Explore Products'}
                                </p>
                                
                                {/* Ultra Enhanced Arrow Icon */}
                                <div className="mt-6 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0 shadow-2xl">
                                    <span className="text-white font-black text-xl">→</span>
                                </div>
                            </div>
                            
                            {/* Ultra Enhanced Corner Badge */}
                            <div className="absolute top-6 right-6 bg-pink-500 text-white text-base font-black px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-xl">
                                تسوق / Shop
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full text-center py-20">
                            <div className="text-8xl mb-6">🛍️</div>
                            <p className="text-3xl text-gray-600 mb-4 font-black">لا توجد فئات متاحة حالياً</p>
                            <p className="text-2xl text-gray-400 font-semibold">No categories available at the moment</p>
                            <p className="text-gray-500 mt-6 text-lg">سنضيف فئات جديدة قريباً! / New categories coming soon!</p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="container mx-auto px-6 mb-12">
                    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl shadow-xl">
                        <p className="text-red-700 font-black text-lg">❌ {error}</p>
                    </div>
                </div>
            )}

            {/* --- ULTRA ENHANCED VALUE PROPOSITION SECTION --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-12 md:p-16 shadow-2xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                            لماذا تختار متجرنا؟
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6">
                            Why Choose Our Store?
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
                        <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-110">
                            <div className="text-8xl mb-8 text-center">🎯</div>
                            <h4 className="text-3xl font-black text-gray-900 mb-6 text-center">
                                منتجات أصلية مضمونة
                            </h4>
                            <h5 className="text-2xl font-bold text-pink-600 mb-6 text-center">
                                100% Authentic Products
                            </h5>
                            <p className="text-gray-600 text-center leading-relaxed text-xl font-semibold">
                                جميع منتجاتنا أصلية ومضمونة من العلامات التجارية الموثوقة
                            </p>
                            <p className="text-gray-500 text-lg text-center mt-4 font-medium">
                                All our products are authentic and guaranteed from trusted brands
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-110">
                            <div className="text-8xl mb-8 text-center">🚚</div>
                            <h4 className="text-3xl font-black text-gray-900 mb-6 text-center">
                                توصيل سريع ومجاني
                            </h4>
                            <h5 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                                Fast & Free Delivery
                            </h5>
                            <p className="text-gray-600 text-center leading-relaxed text-xl font-semibold">
                                شحن مجاني لجميع الطلبات والتوصيل خلال 3-5 أيام
                            </p>
                            <p className="text-gray-500 text-lg text-center mt-4 font-medium">
                                Free shipping on all orders with delivery in 3-5 days
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-110">
                            <div className="text-8xl mb-8 text-center">💎</div>
                            <h4 className="text-3xl font-black text-gray-900 mb-6 text-center">
                                خدمة عملاء متميزة
                            </h4>
                            <h5 className="text-2xl font-bold text-purple-600 mb-6 text-center">
                                Premium Customer Service
                            </h5>
                            <p className="text-gray-600 text-center leading-relaxed text-xl font-semibold">
                                فريق دعم متاح 24/7 لمساعدتك في أي استفسار
                            </p>
                            <p className="text-gray-500 text-lg text-center mt-4 font-medium">
                                24/7 support team available to help with any inquiries
                            </p>
                        </div>
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="mt-16">
                        <TrustBadges />
                    </div>
                </div>
            </div>

            {/* --- ULTRA ENHANCED PRODUCTS SECTION WITH TABS --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                        <span className="text-6xl">⭐</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        منتجاتنا المميزة
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-pink-600 mb-8">
                        Our Featured Products
                    </h3>
                </div>
                
                {/* Ultra Enhanced Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-gray-100 rounded-full p-3 shadow-xl" role="tablist" aria-label="Product categories">
                        <button
                            onClick={() => setActiveTab('bestsellers')}
                            className={`px-10 py-4 rounded-full font-black transition-all duration-500 text-lg ${
                                activeTab === 'bestsellers'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl transform scale-110'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                            }`}
                            role="tab"
                            aria-selected={activeTab === 'bestsellers'}
                            aria-controls="bestsellers-panel"
                        >
                            🔥 الأكثر مبيعاً / Bestsellers
                        </button>
                        <button
                            onClick={() => setActiveTab('newArrivals')}
                            className={`px-10 py-4 rounded-full font-black transition-all duration-500 text-lg ml-3 ${
                                activeTab === 'newArrivals'
                                    ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-xl transform scale-110'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
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
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto animate-fade-in"
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
                                <div className="col-span-full text-center py-16">
                                    <div className="text-8xl mb-6">📦</div>
                                    <p className="text-2xl text-gray-500 mb-4 font-black">لا توجد منتجات متاحة حالياً</p>
                                    <p className="text-xl text-gray-400 font-semibold">No products available at the moment</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'newArrivals' && (
                        <div 
                            id="newArrivals-panel"
                            role="tabpanel"
                            aria-labelledby="newArrivals-tab"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto animate-fade-in"
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
                                <div className="col-span-full text-center py-16">
                                    <div className="text-8xl mb-6">📦</div>
                                    <p className="text-2xl text-gray-500 mb-4 font-black">لا توجد منتجات جديدة حالياً</p>
                                    <p className="text-xl text-gray-400 font-semibold">No new products at the moment</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Ultra Enhanced View All Button */}
                <div className="text-center mt-16">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-5 px-12 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl text-lg"
                        aria-label="عرض جميع المنتجات / View all products page"
                    >
                        <span>عرض جميع المنتجات / View All Products</span>
                        <span className="text-2xl">→</span>
                    </Link>
                </div>
            </div>

            {/* --- ULTRA ENHANCED REVIEWS SECTION --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl p-12 md:p-16 shadow-2xl">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-6">
                            <span className="text-6xl">⭐</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            آراء عملائنا السعداء
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-orange-600 mb-6">
                            What Our Happy Customers Say
                        </h3>
                        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed font-semibold">
                            شاهد تجارب عملائنا الحقيقية / See real experiences from our customers
                        </p>
                    </div>
                    
                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {reviews.map((review, index) => (
                                <div 
                                    key={review.id} 
                                    className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-l-4 border-yellow-400"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Stars at top */}
                                    <div className="flex justify-between items-start mb-6">
                                        {renderStars(review.rating)}
                                        <span className="bg-green-100 text-green-700 text-sm font-black px-4 py-2 rounded-full">
                                            ✓ مؤكد / Verified
                                        </span>
                                    </div>
                                    
                                    {/* Review Content */}
                                    <p className="text-gray-700 mb-8 leading-relaxed text-lg italic font-semibold">
                                        "{review.content}"
                                    </p>
                                    
                                    {/* Customer Info */}
                                    <div className="flex items-center pt-6 border-t border-gray-100">
                                        <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-xl mr-4 shadow-xl">
                                            {(review.createdByAdmin ? 
                                                (review.customName || 'A') : 
                                                (review.userEmail || 'C')
                                            )[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg">
                                                {review.createdByAdmin ? 
                                                    (review.customName || 'عميل مميز / Valued Customer') : 
                                                    (review.userEmail?.split('@')[0] || 'Customer')
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500 font-semibold">
                                                عميل موثوق / Verified Buyer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
                            <div className="text-8xl mb-6">💬</div>
                            <p className="text-2xl text-gray-500 mb-4 font-black">لا توجد مراجعات بعد</p>
                            <p className="text-xl text-gray-400 font-semibold">No reviews yet - Be the first to share your experience!</p>
                        </div>
                    )}
                    
                    {/* Ultra Enhanced Overall Rating Summary */}
                    {reviews.length > 0 && (
                        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl">
                            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                                <div className="text-center">
                                    <div className="text-6xl font-black text-yellow-500 mb-3">
                                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                                    </div>
                                    <div className="flex justify-center mb-3">
                                        {renderStars(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)}
                                    </div>
                                    <p className="text-gray-600 font-black text-lg">
                                        من 5.0 / out of 5.0
                                    </p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-5xl font-black text-pink-600 mb-3">
                                        {reviews.length}+
                                    </div>
                                    <p className="text-gray-600 font-black text-lg">
                                        مراجعة موثوقة<br/>
                                        Verified Reviews
                                    </p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-5xl font-black text-green-600 mb-3">
                                        98%
                                    </div>
                                    <p className="text-gray-600 font-black text-lg">
                                        رضا العملاء<br/>
                                        Customer Satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ULTRA ENHANCED CALL TO ACTION SECTION --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
                    {/* Ultra Enhanced Animated Background */}
                    <div className="absolute inset-0 opacity-25">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
                            ابدأ التسوق الآن واستمتع بالعروض!
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8">
                            Start Shopping Now and Enjoy Amazing Deals!
                        </h3>
                        <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto opacity-95 font-semibold leading-relaxed">
                            اكتشف آلاف المنتجات الأصلية بأفضل الأسعار مع شحن مجاني وضمان الجودة
                        </p>
                        <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto opacity-90 font-medium leading-relaxed">
                            Discover thousands of authentic products at the best prices with free shipping and quality guarantee
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/products"
                                className="bg-white text-pink-600 font-black py-5 px-12 rounded-full hover:bg-pink-50 transition-all duration-500 transform hover:scale-110 shadow-xl inline-flex items-center justify-center gap-3 text-lg"
                            >
                                <span>🛍️ تسوق الآن / Shop Now</span>
                            </Link>
                            
                            <Link
                                to="/packs"
                                className="bg-yellow-400 text-gray-900 font-black py-5 px-12 rounded-full hover:bg-yellow-300 transition-all duration-500 transform hover:scale-110 shadow-xl inline-flex items-center justify-center gap-3 text-lg"
                            >
                                <span>🎁 الباقات الخاصة / Special Packs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Notifications */}
            <PurchaseNotifications 
                packName="منتجات المتجر / Store Products" 
                productImage={bestsellers.length > 0 && bestsellers[0].images && bestsellers[0].images.length > 0 
                    ? bestsellers[0].images[0] 
                    : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                }
            />
            
        </div>
    );
};

export default HomePage;



// ULTRA ENHANCED HOME PAGE - Premium E-commerce Experience with Sophisticated Visual Design
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBestsellers, getNewArrivals, getApprovedReviews, getAllCategories, getHero } from '../api/apiService';
import ProductCard from '../components/ProductCard';
// TrustBadges moved to WhyChooseUsSection
import EnhancedCountdown from '../components/EnhancedCountdown';
import PurchaseNotifications from '../components/PurchaseNotifications';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import CallToActionSection from '../components/home/CallToActionSection';
import { toast } from 'react-toastify';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const HomePage = () => {
    const [bestsellers, setBestsellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const INITIAL_HERO_STATE = {
        "id": 1,
        "title": "By Luna Cosmetics",
        "subtitle": "Discover Your True Beauty",
        "linkText": "Shop Now",
        "linkUrl": "/products",
        "titleFont": "'Dancing Script', cursive",
        "imageUrl": "/api/images/hero/3ac3918e-0c94-43d1-9dab-147f3644c7b8-IMG_7587.JPG",
        "mobileImageUrl": "/api/images/hero/3ac3918e-0c94-43d1-9dab-147f3644c7b8-IMG_7587.JPG"
    };

    const [hero, setHero] = useState(INITIAL_HERO_STATE);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [heroImageError, setHeroImageError] = useState(false);
    const [activeTab, setActiveTab] = useState('bestsellers');

    // --- STAR ANIMATION STATE ---
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [stars, setStars] = useState([]);

    // --- OPTIMIZED DATA FETCHING (Parallel & Progressive) ---
    useEffect(() => {
        // 1. Fetch Hero IMMEDIATELY (Critical for LCP)
        // 1. Fetch Hero IMMEDIATELY (Critical for LCP)
        const fetchHero = async () => {
            try {
                // Background update
                const heroResponse = await getHero();

                // Add cache busting to hero images to ensure fresh load
                // PERFORMANCE FIX: Removed timestamp to allow caching.
                // The backend handles updates via ETag/Last-Modified or manual cache clearing if needed.
                const freshHero = { ...heroResponse.data };

                setHero(freshHero);
                setHeroImageError(false); // Reset error state on new data
            } catch (err) {
                console.error("Error fetching hero:", err);
            }
        };

        // 2. Fetch Rest of Data in Background (Non-Critical)
        const fetchContent = async () => {
            try {
                const [
                    bestsellersResponse,
                    newArrivalsResponse,
                    reviewsResponse,
                    categoriesResponse
                ] = await Promise.all([
                    getBestsellers(),
                    getNewArrivals(),
                    getApprovedReviews(),
                    getAllCategories()
                ]);

                setBestsellers(Array.isArray(bestsellersResponse.data) ? bestsellersResponse.data : bestsellersResponse.data.content);
                setNewArrivals(Array.isArray(newArrivalsResponse.data) ? newArrivalsResponse.data : newArrivalsResponse.data.content);
                setReviews(reviewsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (err) {
                console.error("Error fetching content:", err);
                setError("لا يمكن تحميل البيانات من الخادم / Impossible de récupérer les données du serveur.");
            } finally {
                setLoading(false);
            }
        };

        // Execute in parallel
        fetchHero();
        fetchContent();

        // Generate stars - reduced count for mobile performance
        const isMobile = window.innerWidth < 768;
        const starCount = isMobile ? 15 : 30; // Reduced from 50
        const newStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1 + 'px',
            delay: Math.random() * 5 + 's',
            duration: Math.random() * 3 + 2 + 's',
        }));
        setStars(newStars);
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

    // Use the image URL from backend (now stored locally, not AWS)
    const heroImageUrl = hero?.imageUrl;

    // Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mb-4"></div>
                <div className="h-8 bg-gray-700 w-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 w-96 rounded-lg"></div>
            </div>
        </div>
    );

    // If Hero is not ready, show Skeleton.
    // If Hero IS ready but content is loading, we render Hero + Content Skeletons below (managed by conditioned rendering or just showing skeletons at bottom)
    if (!hero && loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 overflow-x-hidden">
            {/* Ultra Enhanced Countdown Timer - Admin Controllable */}
            <div className="w-full px-0 py-0 min-h-[140px] md:min-h-[160px] flex items-center justify-center">
                <div className="w-full">
                    <EnhancedCountdown
                        fallbackEndTime={new Date().getTime() + (24 * 60 * 60 * 1000)}
                        packName="عروض اليوم الخاصة / Offres Spéciales d'Aujourd'hui"
                        onExpire={() => {
                            toast.info('🕐 انتهت فترة العرض الخاص / La période de l\'offre spéciale est terminée');
                        }}
                    />
                </div>
            </div>

            {/* --- STAR HERO SECTION (WOW EDITION) --- */}
            {/* --- STAR HERO SECTION (WOW EDITION) --- */}
            {hero && (
                <div
                    id="home-hero"
                    onMouseMove={(e) => {
                        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
                        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
                        setMousePosition({ x: moveX, y: moveY });
                    }}
                    className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden bg-black"
                >
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {/* 1. Base Fallback Gradient (visible until image loads or if it fails) */}
                        <div
                            className="absolute inset-0 transition-opacity duration-1000"
                            style={{
                                background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
                                opacity: !heroImageUrl || heroImageError ? 1 : 0.5
                            }}
                        />

                        {/* 2. Actual Image (Optimized with <picture>) */}
                        {heroImageUrl && !heroImageError && (
                            <picture>
                                {/* Mobile Image (First priority for mobile) */}
                                <source
                                    media="(max-width: 768px)"
                                    srcSet={getOptimizedImageUrl(hero.mobileImageUrl || heroImageUrl, 720)}
                                />
                                {/* Desktop Image */}
                                <source
                                    media="(min-width: 769px)"
                                    srcSet={getOptimizedImageUrl(heroImageUrl, 1920)}
                                />
                                {/* Fallback <img> */}
                                <img
                                    key={heroImageUrl} // Force re-render if URL changes
                                    src={getOptimizedImageUrl(heroImageUrl, 1920)}
                                    alt="ByLuna Hero"
                                    className="w-full h-full object-cover transition-opacity duration-1000 animate-fade-in"
                                    style={{ opacity: heroImageError ? 0 : 1 }}
                                    fetchPriority="high"
                                    loading="eager"
                                    onLoad={() => console.log("✅ Hero image loaded successfully")}
                                    onError={(e) => {
                                        console.error("💥 Hero image failed to load:", e.target.src);
                                        setHeroImageError(true);
                                    }}
                                />
                            </picture>
                        )}

                        {/* 3. Dark Overlay for Contrast */}
                        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
                    </div>

                    {/* Star Layer */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        {stars.map(star => (
                            <div
                                key={star.id}
                                className="absolute bg-white rounded-full animate-twinkle"
                                style={{
                                    top: star.top,
                                    left: star.left,
                                    width: star.size,
                                    height: star.size,
                                    boxShadow: `0 0 ${parseInt(star.size) * 2}px white`,
                                    animationDelay: star.delay,
                                    animationDuration: star.duration,
                                }}
                            />
                        ))}
                    </div>

                    {/* Floating Parallax Blobs */}
                    <div
                        className="hidden md:block absolute top-1/4 left-10 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none z-0"
                        style={{ transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)` }}
                    />
                    <div
                        className="hidden md:block absolute bottom-10 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none z-0"
                        style={{ transform: `translate(${mousePosition.x * 3}px, ${mousePosition.y * 3}px)` }}
                    />

                    {/* Content Container */}
                    <div
                        className="relative z-10 container mx-auto px-4 text-center transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                    >
                        {/* Glass Badge */}
                        <div className="flex justify-center mb-6 md:mb-8">
                            <div className="glass-pill animate-fade-in-down px-4 py-1 md:px-6 md:py-2 rounded-full flex items-center gap-2 text-white font-bold tracking-wider shadow-lg backdrop-blur-md border border-white/20 text-xs md:text-sm">
                                <span className="text-yellow-400 text-base md:text-lg">✨</span>
                                <span>عروض حصرية / Offres Exclusives</span>
                            </div>
                        </div>

                        {/* Massive Glowing Title */}
                        <h1
                            className="text-4xl sm:text-5xl md:text-8xl font-black mb-4 md:mb-6 animate-fade-in tracking-tighter leading-tight"
                            style={{
                                fontFamily: hero.titleFont || 'sans-serif',
                                background: 'linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                            }}
                        >
                            {hero.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-2xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
                            {hero.subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-row gap-3 justify-center items-center mb-10 md:mb-16 animate-slide-up w-full px-4" style={{ animationDelay: '0.4s' }}>
                            <Link
                                to={hero.linkUrl}
                                className="w-auto group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 border border-white/20 text-center"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs md:text-sm">
                                    {hero.linkText} <span className="text-base">✨</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>

                            <Link
                                to="/packs"
                                className="w-auto glass-panel-pro text-white font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 border border-white/30 text-xs md:text-sm flex items-center justify-center gap-2 text-center"
                            >
                                🎁 تصفح الباقات / Packs
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute bottom-0 left-0 w-full h-16 md:h-32 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent z-10 pointer-events-none" />
                </div>
            )}

            {/* --- ULTRA ENHANCED Shop By Category Section --- */}
            <div className="w-full px-4 py-8 md:py-12">
                <div className="text-center mb-8 md:mb-12">
                    {/* ... Header stays same ... */}
                    <div className="inline-block mb-3 md:mb-4">
                        <span className="text-4xl md:text-5xl lg:text-6xl">🛍️</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight">
                        تسوق حسب الفئة
                    </h2>
                    <h3 className="text-xl md:text-3xl font-bold text-pink-600 mb-3 md:mb-4">
                        Achetez par Catégorie
                    </h3>
                    <p className="text-gray-600 text-base md:text-xl max-w-3xl mx-auto leading-relaxed font-semibold px-2">
                        اكتشف منتجاتنا المميزة في فئات متنوعة / Découvrez nos produits vedettes dans diverses catégories
                    </p>
                </div>

                {loading ? (
                    // Skeleton for Categories
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 max-w-7xl mx-auto">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-3xl h-40 animate-skeleton-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto justify-items-center">
                        {categories.length > 0 ? categories.map((category, index) => (
                            <Link
                                key={category.id}
                                to={`/products?categoryId=${category.id}`}
                                className="group relative block bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden aspect-square transform hover:scale-105"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                aria-label={`تسوق ${category.name} / Acheter ${category.name}`}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end p-3 md:p-6 pb-4 md:pb-8">
                                    <p className="font-black text-white text-lg md:text-2xl text-center leading-tight mb-2 transform group-hover:translate-y-0 transition-transform duration-500">
                                        {category.name}
                                    </p>
                                    <p className="hidden md:block text-base text-center text-gray-200 max-w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-2 leading-snug">
                                        {category.description || 'استكشف / Explorer'}
                                    </p>

                                    {/* Ultra Enhanced Arrow Icon - Hidden on small mobile to save space */}
                                    <div className="hidden md:flex mt-4 w-10 h-10 bg-pink-500 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                                        <span className="text-white font-black text-lg">→</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center py-20">
                                <div className="text-8xl mb-6">🛍️</div>
                                <p className="text-3xl text-gray-600 mb-4 font-black">لا توجد فئات متاحة حالياً</p>
                                <p className="text-2xl text-gray-400 font-semibold">Aucune catégorie disponible pour le moment</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="container mx-auto px-6 mb-12">
                    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl shadow-xl">
                        <p className="text-red-700 font-black text-lg">❌ {error}</p>
                    </div>
                </div>
            )}

            {/* --- ULTRA ENHANCED VALUE PROPOSITION SECTION --- */}
            <WhyChooseUsSection />

            {/* --- ULTRA ENHANCED PRODUCTS SECTION WITH TABS --- */}
            <div className="w-full px-4 py-8 md:py-12">
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-block mb-3 md:mb-6">
                        <span className="text-4xl md:text-6xl">⭐</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                        منتجاتنا المميزة
                    </h2>
                    <h3 className="text-xl md:text-4xl font-bold text-pink-600 mb-6 md:mb-8">
                        Nos Produits Vedettes
                    </h3>
                </div>

                {/* Ultra Enhanced Tabs */}
                <div className="flex justify-center mb-8 md:mb-16 px-2">
                    <div className="flex flex-col sm:flex-row bg-gray-100 rounded-3xl sm:rounded-full p-2 sm:p-3 shadow-lg w-full sm:w-auto" role="tablist" aria-label="Product categories">
                        <button
                            onClick={() => setActiveTab('bestsellers')}
                            className={`px-6 py-3 md:px-10 md:py-4 rounded-xl sm:rounded-full font-black transition-all duration-300 text-sm md:text-lg mb-2 sm:mb-0 ${activeTab === 'bestsellers'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl transform scale-105'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                }`}
                            role="tab"
                            aria-selected={activeTab === 'bestsellers'}
                            aria-controls="bestsellers-panel"
                        >
                            🔥 الأكثر مبيعاً / Meilleures Ventes
                        </button>
                        <button
                            onClick={() => setActiveTab('newArrivals')}
                            className={`px-6 py-3 md:px-10 md:py-4 rounded-xl sm:rounded-full font-black transition-all duration-300 text-sm md:text-lg sm:ml-3 ${activeTab === 'newArrivals'
                                ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-xl transform scale-105'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                }`}
                            role="tab"
                            aria-selected={activeTab === 'newArrivals'}
                            aria-controls="newArrivals-panel"
                        >
                            ✨ وصل حديثاً / Nouveautés
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
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-[98%] md:max-w-[95%] mx-auto animate-fade-in"
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
                                    <p className="text-xl text-gray-400 font-semibold">Aucun produit disponible pour le moment</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'newArrivals' && (
                        <div
                            id="newArrivals-panel"
                            role="tabpanel"
                            aria-labelledby="newArrivals-tab"
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-[98%] md:max-w-[95%] mx-auto animate-fade-in"
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
                                    <p className="text-xl text-gray-400 font-semibold">Pas de nouveaux produits pour le moment</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Ultra Enhanced View All Button */}
                <div className="text-center mt-12 md:mt-16">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 px-8 md:py-5 md:px-12 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl text-base md:text-lg"
                        aria-label="عرض جميع المنتجات / Voir tous les produits"
                    >
                        <span>عرض جميع المنتجات / Voir Tous les Produits</span>
                        <span className="text-xl md:text-2xl">→</span>
                    </Link>
                </div>
            </div>

            {/* --- ULTRA ENHANCED REVIEWS SECTION --- */}
            <div className="w-full px-0 py-0">
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 w-full py-6 md:py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-4 md:mb-12">
                            <div className="inline-block mb-2 md:mb-6">
                                <span className="text-3xl md:text-6xl">⭐</span>
                            </div>
                            <h2 className="text-xl md:text-6xl font-black text-gray-900 mb-2 md:mb-6 tracking-tight">
                                آراء عملائنا السعداء
                            </h2>
                            <h3 className="text-lg md:text-4xl font-bold text-orange-600 mb-2 md:mb-6">
                                Ce que disent nos clients heureux
                            </h3>
                            <p className="text-gray-600 text-sm md:text-xl max-w-3xl mx-auto leading-relaxed font-semibold">
                                شاهد تجارب عملائنا الحقيقية / Voir les expériences réelles de nos clients
                            </p>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                                {reviews.map((review, index) => (
                                    <div
                                        key={review.id}
                                        className="bg-white p-4 md:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-l-4 border-yellow-400"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Stars at top */}
                                        <div className="flex justify-between items-start mb-3 md:mb-6">
                                            {renderStars(review.rating)}
                                            <span className="bg-green-100 text-green-700 text-[10px] md:text-sm font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                                                ✓ مؤكد / Vérifié
                                            </span>
                                        </div>

                                        {/* Review Content */}
                                        <p className="text-gray-700 mb-4 md:mb-8 leading-relaxed text-sm md:text-lg italic font-semibold">
                                            "{review.content}"
                                        </p>

                                        {/* Customer Info */}
                                        <div className="flex items-center pt-4 md:pt-6 border-t border-gray-100">
                                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-base md:text-xl mr-3 md:mr-4 shadow-xl">
                                                {(review.createdByAdmin ?
                                                    (review.customName || 'A') :
                                                    (review.userEmail || 'C')
                                                )[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm md:text-lg">
                                                    {review.createdByAdmin ?
                                                        (review.customName || 'عميل مميز / Client Privilégié') :
                                                        (review.userEmail?.split('@')[0] || 'زبون / Client')
                                                    }
                                                </p>
                                                <p className="text-[10px] md:text-sm text-gray-500 font-semibold">
                                                    عميل موثوق / Acheteur Vérifié
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
                                <p className="text-xl text-gray-400 font-semibold">Pas encore d'avis - Soyez le premier à partager votre expérience !</p>
                            </div>
                        )}

                        {/* Ultra Enhanced Overall Rating Summary */}
                        {reviews.length > 0 && (
                            <div className="mt-12 md:mt-16 bg-white rounded-3xl p-6 md:p-8 shadow-xl">
                                <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                                    <div className="text-center">
                                        <div className="text-5xl md:text-6xl font-black text-yellow-500 mb-3">
                                            {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                                        </div>
                                        <div className="flex justify-center mb-3">
                                            {renderStars(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)}
                                        </div>
                                        <p className="text-gray-600 font-black text-lg">
                                            من 5.0 / sur 5.0
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-black text-pink-600 mb-3">
                                            {reviews.length}+
                                        </div>
                                        <p className="text-gray-600 font-black text-lg">
                                            مراجعة موثوقة<br />
                                            Avis Vérifiés
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-black text-green-600 mb-3">
                                            98%
                                        </div>
                                        <p className="text-gray-600 font-black text-lg">
                                            رضا العملاء<br />
                                            Satisfaction Client
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ULTRA ENHANCED CALL TO ACTION SECTION --- */}
            <CallToActionSection bestsellers={bestsellers} />
        </div>
    );
};

export default HomePage;

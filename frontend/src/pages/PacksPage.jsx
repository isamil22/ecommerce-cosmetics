import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPacks } from '../api/apiService';
import Loader from '../components/Loader';
import CountdownBar from '../components/CountdownBar';
import PackQuickView from '../components/PackQuickView';
import { formatPrice } from '../utils/currency';

// Enhanced Pack Card Component with Professional Design
const PackCard = ({ pack, index, onQuickView }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const imageUrl = pack.imageUrl || 'https://placehold.co/600x400/fde4f2/E91E63?text=Premium+Pack';

    // Calculate savings if items are listed
    const totalItemPrice = pack.items?.reduce((total, item) => {
        return total + (item.defaultProduct?.price || 0);
    }, 0) || 0;

    const savings = totalItemPrice > pack.price ? totalItemPrice - pack.price : 0;
    const savingsPercent = savings > 0 ? Math.round((savings / totalItemPrice) * 100) : 0;

    // Check if pack is new (created within last 30 days)
    const isNew = pack.createdAt &&
        (new Date() - new Date(pack.createdAt)) / (1000 * 60 * 60 * 24) <= 30;

    // Calculate average rating from comments
    const averageRating = pack.comments && pack.comments.length > 0
        ? pack.comments.reduce((acc, comment) => acc + comment.score, 0) / pack.comments.length
        : 0;
    const reviewCount = pack.comments?.length || 0;

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
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-3 border-2 border-transparent hover:border-pink-200 animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Premium Badges */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
                {isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg animate-pulse">
                        ✨ جديد / NOUVEAU
                    </span>
                )}
                {savings > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
                        💰 وفر {formatPrice(savings)} / Éco {formatPrice(savings)}
                    </span>
                )}
                {pack.items && pack.items.length > 0 && (
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
                        📦 {pack.items.length} منتج / Articles
                    </span>
                )}
            </div>

            {/* Quick Actions - Appear on Hover */}
            <div className={`absolute top-4 right-4 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onQuickView(pack);
                    }}
                    className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                    title="عرض سريع / Aperçu Rapide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            <Link to={`/packs/${pack.id}`} className="block flex-1 flex flex-col">
                {/* Enhanced Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 aspect-[4/3]">
                    <img
                        src={imageUrl}
                        alt={pack.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://placehold.co/600x400/fde4f2/E91E63?text=Premium+Pack';
                            setImageLoaded(true);
                        }}
                    />

                    {/* Loading Skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                    )}

                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Pack Value Indicator */}
                    {savingsPercent > 0 && (
                        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{savingsPercent}%
                        </div>
                    )}
                </div>

                {/* Enhanced Pack Info */}
                <div className="p-3 md:p-6 space-y-2 md:space-y-4 flex-1 flex flex-col">
                    {/* Pack Title */}
                    <div>
                        <h3 className="text-base md:text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors mb-2">
                            {pack.name}
                        </h3>

                        {/* Rating & Reviews */}
                        {reviewCount > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                    {renderStars()}
                                </div>
                                <span className="text-xs text-gray-500">
                                    ({reviewCount} {reviewCount === 1 ? 'مراجعة / avis' : 'مراجعات / avis'})
                                </span>
                            </div>
                        )}

                        {/* Description */}
                        <p className="hidden md:block text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {pack.description?.replace(/<[^>]*>/g, '') || 'Découvrez ce pack incroyable de produits de beauté premium.'}
                        </p>
                    </div>

                    {/* Pack Items Preview */}
                    {pack.items && pack.items.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs md:text-sm font-semibold text-gray-700">المنتجات في هذه الباقة / Articles dans ce pack :</h4>
                            <div className="flex flex-wrap gap-1">
                                {pack.items.slice(0, 3).map(item => (
                                    item && item.defaultProduct ? (
                                        <span key={item.id} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                                            {item.defaultProduct.name}
                                        </span>
                                    ) : null
                                ))}
                                {pack.items.length > 3 && (
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                        +{pack.items.length - 3} المزيد / de plus
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                {formatPrice(pack.price)}
                            </span>
                            {totalItemPrice > pack.price && (
                                <span className="text-sm md:text-lg text-gray-400 line-through">
                                    {formatPrice(totalItemPrice)}
                                </span>
                            )}
                        </div>

                        {savings > 0 && (
                            <p className="text-green-600 text-sm font-semibold">
                                💰 وفر {formatPrice(savings)} (-{savingsPercent}%) / Éco {formatPrice(savings)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            {/* Enhanced Action Button */}
            <div className="p-3 pt-0 md:p-6">
                <Link
                    to={`/packs/${pack.id}`}
                    className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base transition-all duration-300 transform hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl text-center group"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        عرض التفاصيل / Voir Détails
                    </span>
                </Link>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}></div>
        </div>
    );
};


const PacksPage = () => {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterBy, setFilterBy] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [quickViewPack, setQuickViewPack] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const response = await getAllPacks();
                setPacks(response.data || []);
            } catch (err) {
                console.error("Failed to fetch packs:", err);
                setError('Could not load the available packs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPacks();
    }, []);

    const handleQuickView = (pack) => {
        setQuickViewPack(pack);
        setIsQuickViewOpen(true);
    };

    const handleCloseQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewPack(null);
    };

    // Filter and sort packs
    const filteredAndSortedPacks = packs
        .filter(pack => {
            const matchesSearch = pack.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pack.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterBy === 'all' ||
                (filterBy === 'new' && pack.createdAt &&
                    (new Date() - new Date(pack.createdAt)) / (1000 * 60 * 60 * 24) <= 30) ||
                (filterBy === 'savings' && pack.items?.length > 0);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name?.localeCompare(b.name) || 0;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader />
                    <p className="text-gray-600 mt-4">...جارٍ تحميل الباقات / Chargement des packs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-semibold">خطأ في تحميل الباقات / Erreur de chargement</span>
                        </div>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
            <CountdownBar />

            {/* Hero Section with Enhanced Background */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100 opacity-60"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full -translate-y-48 translate-x-48 opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200 to-pink-200 rounded-full translate-y-40 -translate-x-40 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 w-full px-0 py-0">
                    {/* Enhanced Page Header - Full Width Stripe - Refined Sizing */}
                    <div className="w-full py-4 md:py-12 bg-transparent">
                        <div className="container mx-auto px-4 text-center">
                            <div className="mb-8 md:mb-12">
                                <div className="inline-block mb-4">
                                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                        ✨ باقات تجميل مميزة / Packs Beauté Premium
                                    </span>
                                </div>

                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                                    اكتشف باقاتنا المختارة / Découvrez Nos Packs Exclusifs
                                </h1>

                                <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                                    اكتشف باقات التجميل المختارة بعناية والتي تقدم قيمة استثنائية. / Découvrez des ensembles de beauté soigneusement sélectionnés offrant une valeur exceptionnelle.
                                </p>

                                {/* Stats - Logically Sized */}
                                <div className="grid grid-cols-3 gap-2 md:gap-6 text-center max-w-2xl mx-auto">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 shadow-md hover:shadow-lg transition-shadow border border-white/50">
                                        <div className="text-base md:text-2xl font-bold text-pink-600">{packs.length}</div>
                                        <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">باقات مميزة / Packs Premium</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow border border-white/50">
                                        <div className="text-base md:text-2xl font-bold text-purple-600">Up to 50%</div>
                                        <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">توفير / Économies</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow border border-white/50">
                                        <div className="text-base md:text-2xl font-bold text-blue-600">Free</div>
                                        <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">شحن / Livraison</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Search and Filter Section - Logically Sized */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 w-full py-3 md:py-8 mt-0 shadow-sm z-20 relative">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col lg:flex-row gap-2 md:gap-3 items-center justify-between">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ابحث عن الباقات... / Rechercher des packs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm shadow-inner text-sm md:text-base"
                                    />
                                </div>

                                {/* Filters - Side by Side on Mobile */}
                                <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                                    <select
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        className="px-3 py-2 md:px-4 md:py-3 text-xs md:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full sm:w-auto"
                                    >
                                        <option value="all">جميع الباقات / Tous les Packs</option>
                                        <option value="new">وصل حديثاً / Nouveautés</option>
                                        <option value="savings">أفضل توفير / Meilleures Économies</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full sm:w-auto"
                                    >
                                        <option value="name">الاسم / Nom</option>
                                        <option value="price-low">السعر: الأقل إلى الأكثر / Prix : Croissant</option>
                                        <option value="price-high">السعر: الأكثر إلى الأقل / Prix : Décroissant</option>
                                        <option value="newest">الأحدث أولاً / Plus Récents</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Packs Grid */}
            <div className="w-full px-4 py-8 container mx-auto">
                {filteredAndSortedPacks.length > 0 ? (
                    <>
                        <div className="text-center mb-8">
                            <p className="text-gray-600">
                                showing {filteredAndSortedPacks.length} of {packs.length} packs / Affichage de {filteredAndSortedPacks.length} sur {packs.length} packs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                            {filteredAndSortedPacks.map((pack, index) => (
                                <PackCard
                                    key={pack.id}
                                    pack={pack}
                                    index={index}
                                    onQuickView={handleQuickView}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد باقات / Aucun Pack Trouvé</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || filterBy !== 'all'
                                    ? 'حاول تعديل البحث أو الفلاتر للعثور على المزيد من الباقات. / Essayez d\'ajuster votre recherche ou vos filtres.'
                                    : 'لا توجد باقات متاحة حالياً. الرجاء التحقق لاحقاً! / Aucun pack disponible pour le moment.'
                                }
                            </p>
                            {(searchTerm || filterBy !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterBy('all');
                                        setSortBy('name');
                                    }}
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    مسح الفلاتر / Effacer les Filtres
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick View Modal */}
            <PackQuickView
                pack={quickViewPack}
                isOpen={isQuickViewOpen}
                onClose={handleCloseQuickView}
            />
        </div>
    );
};

export default PacksPage;

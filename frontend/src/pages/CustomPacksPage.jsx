// Enhanced Custom Packs Page with Professional Design
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomPacks } from '../api/apiService';
import Loader from '../components/Loader';
import CountdownBar from '../components/CountdownBar';

// Enhanced Custom Pack Card Component
const CustomPackCard = ({ pack, index, onQuickView }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Determine pricing display
    const isFixedPricing = pack.pricingType === 'FIXED';
    const priceDisplay = isFixedPricing
        ? `$${pack.fixedPrice?.toFixed(2)}`
        : `${(pack.discountRate * 100)?.toFixed(0)}% DE REMISE`;

    // Calculate item range
    const itemRange = `${pack.minItems || 1}-${pack.maxItems || 10} articles`;

    // Check if pack is new (created within last 30 days)
    const isNew = pack.createdAt &&
        (new Date() - new Date(pack.createdAt)) / (1000 * 60 * 60 * 24) <= 30;

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-3 border-2 border-transparent hover:border-purple-200 animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Premium Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        ✨ جديد / NOUVEAU
                    </span>
                )}
                <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    🎨 مخصص / PERSONNALISÉ
                </span>
                {isFixedPricing ? (
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        💰 سعر ثابت / FIXE
                    </span>
                ) : (
                    <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        🔥 خصم / REMISE
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
                    className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-purple-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                    title="عرض سريع / Aperçu Rapide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            <Link to={`/custom-packs/${pack.id}`} className="block flex-1 flex flex-col">
                {/* Enhanced Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 aspect-[4/3]">
                    {/* Custom Pack Visual */}
                    <div className="w-full h-full flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-indigo-200/50"></div>

                        {/* Pack Icon */}
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{itemRange}</h3>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                            <span className="text-xs">📦</span>
                        </div>
                        <div className="absolute top-8 right-8 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                            <span className="text-xs">✨</span>
                        </div>
                        <div className="absolute bottom-6 left-8 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '1.5s' }}>
                            <span className="text-xs">🎨</span>
                        </div>
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>

                {/* Enhanced Pack Info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                    {/* Pack Title */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors mb-2">
                            {pack.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                            {pack.description || 'Créez votre pack beauté personnalisé parfait avec notre sélection de produits premium.'}
                        </p>
                    </div>

                    {/* Pack Details */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">Plage d'articles :</span>
                            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                {itemRange}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">Tarification :</span>
                            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${isFixedPricing
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                                }`}>
                                {isFixedPricing ? 'Prix Fixe' : 'Taux de Remise'}
                            </span>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {priceDisplay}
                            </span>
                        </div>

                        <p className="text-purple-600 text-sm font-semibold">
                            🎨 Créez votre pack parfait
                        </p>
                    </div>
                </div>
            </Link>

            {/* Enhanced Action Button */}
            <div className="p-6 pt-0">
                <Link
                    to={`/custom-packs/${pack.id}`}
                    className="block w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:from-purple-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl text-center group"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        إنشاء الباقة / Créer le Pack
                    </span>
                </Link>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: '0 0 30px rgba(147, 51, 234, 0.3)' }}></div>
        </div>
    );
};

const CustomPacksPage = () => {
    const [customPacks, setCustomPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterBy, setFilterBy] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [quickViewPack, setQuickViewPack] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    useEffect(() => {
        const fetchCustomPacks = async () => {
            try {
                const response = await getAllCustomPacks();
                setCustomPacks(response.data || []);
            } catch (err) {
                console.error("Failed to fetch custom packs:", err);
                setError('Could not load the available custom packs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomPacks();
    }, []);

    const handleQuickView = (pack) => {
        setQuickViewPack(pack);
        setIsQuickViewOpen(true);
    };

    const handleCloseQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewPack(null);
    };

    // Filter and sort custom packs
    const filteredAndSortedPacks = customPacks
        .filter(pack => {
            const matchesSearch = pack.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pack.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterBy === 'all' ||
                (filterBy === 'new' && pack.createdAt &&
                    (new Date() - new Date(pack.createdAt)) / (1000 * 60 * 60 * 24) <= 30) ||
                (filterBy === 'fixed' && pack.pricingType === 'FIXED') ||
                (filterBy === 'discount' && pack.pricingType !== 'FIXED');
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name?.localeCompare(b.name) || 0;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'items-low':
                    return (a.minItems || 0) - (b.minItems || 0);
                case 'items-high':
                    return (b.maxItems || 0) - (a.maxItems || 0);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader />
                    <p className="text-gray-600 mt-4">...جارٍ تحميل منشئي الباقات / Chargement des créateurs de packs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-semibold">خطأ في تحميل الباقات المخصصة / Erreur de chargement des packs personnalisés</span>
                        </div>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
            <CountdownBar />

            {/* Hero Section with Enhanced Background - Full Width */}
            <div className="w-full px-0 py-0">
                <div className="relative overflow-hidden w-full">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-indigo-50 to-blue-100 opacity-60"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full -translate-y-48 translate-x-48 opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full translate-y-40 -translate-x-40 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="relative z-10 w-full py-8 md:py-12">
                        <div className="container mx-auto px-4 text-center">
                            {/* Enhanced Page Header */}
                            <div className="mb-8 md:mb-12">
                                <div className="inline-block mb-4">
                                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                        🎨 منشئ الباقات المخصص / Créateur de Pack Personnalisé
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
                                    اصنع باقتك الخاصة / Créez Votre Propre Pack
                                </h1>

                                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                                    صمم مجموعتك الجمالية المثالية مع منشئ الباقات المخصص لدينا. اختر منتجاتك المفضلة واستمتع بأسعار حصرية! / Concevez votre collection de beauté parfaite avec notre créateur de packs personnalisés. Choisissez vos produits préférés et profitez de prix exclusifs !
                                </p>

                                {/* Stats - Logically Sized */}
                                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center max-w-2xl mx-auto">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow">
                                        <div className="text-lg sm:text-2xl font-bold text-purple-600">{customPacks.length}</div>
                                        <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">منشئ / Créateurs</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow">
                                        <div className="text-lg sm:text-2xl font-bold text-indigo-600">30%</div>
                                        <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">توفير / Économies</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow">
                                        <div className="text-lg sm:text-2xl font-bold text-blue-600">Free</div>
                                        <div className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase tracking-wide mt-1">مخصص / Personnalisé</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Search and Filter Section - Sticky Toolbar Style */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 w-full py-4 sm:py-8 mt-0 shadow-sm z-20 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="ابحث عن منشئي الباقات... / Rechercher des créateurs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm shadow-inner text-sm sm:text-base"
                            />
                        </div>

                        {/* Filters - Side by Side on Mobile */}
                        <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full text-sm sm:text-base"
                            >
                                <option value="all">جميع المنشئين / Tous les Créateurs</option>
                                <option value="new">وصل حديثاً / Nouveautés</option>
                                <option value="fixed">ثابت / Fixe</option>
                                <option value="discount">تخفيض / Remise</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full text-sm sm:text-base"
                            >
                                <option value="name">الاسم / Nom</option>
                                <option value="newest">الأحدث أولاً / Plus Récents</option>
                                <option value="items-low">عناصر: أقل / Articles : Moins</option>
                                <option value="items-high">عناصر: أكثر / Articles : Plus</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Packs Grid */}
            <div className="w-full px-4 py-12 container mx-auto">
                {filteredAndSortedPacks.length > 0 ? (
                    <>
                        <div className="text-center mb-10">
                            <p className="text-gray-600">
                                عرض {filteredAndSortedPacks.length} من {customPacks.length} منشئي باقات / Affichage de {filteredAndSortedPacks.length} sur {customPacks.length} créateurs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {filteredAndSortedPacks.map((pack, index) => (
                                <CustomPackCard
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
                            <div className="text-6xl mb-4">🎨</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">لم يتم العثور على منشئي باقات / Aucun créateur trouvé</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || filterBy !== 'all'
                                    ? 'حاول تعديل البحث أو الفلاتر. / Essayez d\'ajuster votre recherche ou vos filtres.'
                                    : 'لا يوجد منشئي باقات مخصصة حالياً. / Aucun créateur de pack personnalisé disponible pour le moment.'
                                }
                            </p>
                            {(searchTerm || filterBy !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterBy('all');
                                        setSortBy('name');
                                    }}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    مسح الفلاتر / Effacer les Filtres
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick View Modal - Custom Pack Version */}
            {isQuickViewOpen && quickViewPack && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        <div className="relative">
                            {/* Close Button */}
                            <button
                                onClick={handleCloseQuickView}
                                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                {/* Image Section */}
                                <div className="relative bg-gradient-to-br from-purple-100 to-indigo-100 aspect-square md:aspect-auto">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800">منشئ الباقات المخصص / Créateur de Pack Personnalisé</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{quickViewPack.name}</h2>

                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {quickViewPack.description || 'Créez votre pack beauté personnalisé parfait avec notre sélection de produits premium.'}
                                        </p>

                                        {/* Pack Details */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                <span className="font-semibold text-gray-700">Plage d'articles :</span>
                                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                                    {quickViewPack.minItems || 1}-{quickViewPack.maxItems || 10} articles
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                                                <span className="font-semibold text-gray-700">Type de Tarification :</span>
                                                <span className={`px-3 py-1 rounded-full font-semibold ${quickViewPack.pricingType === 'FIXED'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {quickViewPack.pricingType === 'FIXED' ? 'Prix Fixe' : 'Taux de Remise'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                                                <span className="font-semibold text-gray-700">Prix :</span>
                                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                    {quickViewPack.pricingType === 'FIXED'
                                                        ? `$${quickViewPack.fixedPrice?.toFixed(2)}`
                                                        : `${(quickViewPack.discountRate * 100)?.toFixed(0)}% DE REMISE`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <Link
                                            to={`/custom-packs/${quickViewPack.id}`}
                                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 transform hover:from-purple-600 hover:to-indigo-700 hover:scale-105 text-center"
                                            onClick={handleCloseQuickView}
                                        >
                                            ابدأ البناء / Commencer
                                        </Link>
                                        <button
                                            onClick={handleCloseQuickView}
                                            className="px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
                                        >
                                            إغلاق / Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomPacksPage;
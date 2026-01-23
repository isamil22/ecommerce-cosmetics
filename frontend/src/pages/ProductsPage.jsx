// frontend/src/pages/ProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts, getAllCategories, getAllPacks, getProductSuggestions } from '../api/apiService';
import Loader from '../components/Loader';
import PackCard from '../components/PackCard';
import ReactGA from 'react-ga4';
import { trackEvent } from '../utils/facebookPixel';

const ProductsPage = ({ fetchCartCount, isAuthenticated }) => { // Accept props here
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        categoryId: searchParams.get('categoryId') || '',
        minPrice: '',
        maxPrice: '',
        brand: '',
        type: 'ALL',
        productType: 'products'
    });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState('name,asc');
    const [suggestions, setSuggestions] = useState([]);

    const fetchItemsAndCategories = useCallback(async (searchQuery) => {
        setLoading(true);
        setError('');
        try {
            const categoriesResponse = await getAllCategories();
            setCategories(categoriesResponse.data);

            const [sortField, sortDirection] = sort.split(',');
            const params = {
                page,
                sort: `${sortField},${sortDirection}`,
                search: searchQuery,
                categoryId: filters.categoryId || null,
                minPrice: filters.minPrice || null,
                maxPrice: filters.maxPrice || null,
                brand: filters.brand || null,
                type: filters.type === 'ALL' ? null : filters.type,
            };

            let response;
            if (filters.productType === 'packs') {
                response = await getAllPacks(params);
                setItems(response.data);
                setTotalPages(1);
            } else {
                response = await getAllProducts(params);
                setItems(response.data.content);
                setTotalPages(response.data.totalPages);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [sort, page, filters.categoryId, filters.minPrice, filters.maxPrice, filters.brand, filters.type, filters.productType]);

    useEffect(() => {
        const categoryIdFromUrl = searchParams.get('categoryId');
        if (categoryIdFromUrl && categoryIdFromUrl !== filters.categoryId) {
            setFilters(prev => ({ ...prev, categoryId: categoryIdFromUrl }));
        }
    }, [searchParams]);

    useEffect(() => {
        if (filters.search) {
            const fetchSuggestions = async () => {
                try {
                    const response = await getProductSuggestions(filters.search);
                    setSuggestions(response.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            };
            const handler = setTimeout(() => {
                fetchSuggestions();
            }, 300); // Debounce to avoid excessive API calls

            return () => {
                clearTimeout(handler);
            };
        } else {
            setSuggestions([]);
        }
    }, [filters.search]);

    useEffect(() => {
        fetchItemsAndCategories(filters.search);
    }, [fetchItemsAndCategories, filters.search]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'search' && value) {
            ReactGA.event({
                category: 'Engagement',
                action: 'search',
                label: value
            });
            // --- ADD THIS FOR FACEBOOK PIXEL ---
            // --- ADD THIS FOR FACEBOOK PIXEL ---
            trackEvent('Search', {
                search_string: value
            });
            // ------------------------------------
            // ------------------------------------
        }
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchItemsAndCategories(filters.search);
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        setFilters(prev => ({ ...prev, search: suggestion }));
        setSuggestions([]);
        fetchItemsAndCategories(suggestion); // Immediately fetch
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(0);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const CardComponent = filters.productType === 'packs' ? PackCard : ProductCard;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
            {/* Hero Section with Enhanced Background */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100 opacity-60"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full -translate-y-48 translate-x-48 opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200 to-pink-200 rounded-full translate-y-40 -translate-x-40 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 w-full px-0 py-0">
                    {/* Enhanced Page Header - Full Width Stripe - Refined Sizing */}
                    <div className="text-center py-6 sm:py-10 bg-gradient-to-r from-pink-50/50 via-purple-50/50 to-blue-50/50 w-full">
                        <div className="container mx-auto px-4">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                منتجاتنا / Nos Produits
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                                اكتشف أفضل منتجات التجميل المختارة بعناية / Découvrez les meilleurs produits de beauté sélectionnés avec soin pour vous
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Search and Filter Section - Full Width Stripe */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 w-full py-3 md:py-6">
                        <div className="container mx-auto px-4">
                            {/* Main Search Bar */}
                            <div className="mb-3 md:mb-6">
                                <div className="relative">
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                name="search"
                                                placeholder="ابحث عن المنتجات... / Rechercher des produits..."
                                                value={filters.search}
                                                onChange={handleFilterChange}
                                                autoComplete="off"
                                                className="w-full pl-10 pr-10 md:pl-12 md:pr-12 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute inset-y-0 right-0 pr-2 flex items-center"
                                            >
                                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-1.5 md:p-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                                                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Enhanced Search Suggestions */}
                                        {suggestions.length > 0 && (
                                            <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                                                {suggestions.map((suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 cursor-pointer transition-all duration-200 flex items-center gap-3 text-sm"
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                    >
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                        <span className="text-gray-700 font-medium">{suggestion}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>

                            {/* Enhanced Filter Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
                                {/* Category Filter */}
                                <div className="space-y-0.5 md:space-y-1">
                                    <label className="block text-[10px] md:text-xs font-semibold text-gray-700 mb-0.5 md:mb-1 flex items-center gap-1 md:gap-2">
                                        <svg className="h-3 w-3 md:h-4 md:w-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        الفئة / Catégorie
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={filters.categoryId}
                                        onChange={handleFilterChange}
                                        className="w-full px-2 py-1.5 md:px-3 md:py-2.5 border md:border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md text-xs md:text-sm"
                                        disabled={filters.productType === 'packs'}
                                    >
                                        <option value="">جميع الفئات / Toutes les Catégories</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range Filters */}
                                <div className="space-y-1 md:space-y-2">
                                    <label className="block text-[10px] md:text-sm font-semibold text-gray-700 mb-0.5 md:mb-2 flex items-center gap-1 md:gap-2">
                                        <svg className="h-3 w-3 md:h-5 md:w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        السعر الأدنى / Prix Minimum
                                    </label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="0 MAD"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        className="w-full px-2 py-1.5 md:px-4 md:py-3 border md:border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm md:shadow-lg hover:shadow-xl text-xs md:text-base"
                                    />
                                </div>

                                <div className="space-y-1 md:space-y-2">
                                    <label className="block text-[10px] md:text-sm font-semibold text-gray-700 mb-0.5 md:mb-2 flex items-center gap-1 md:gap-2">
                                        <svg className="h-3 w-3 md:h-5 md:w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        السعر الأعلى / Prix Maximum
                                    </label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="1000 MAD"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        className="w-full px-2 py-1.5 md:px-4 md:py-3 border md:border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm md:shadow-lg hover:shadow-xl text-xs md:text-base"
                                    />
                                </div>

                                {/* Gender Filter */}
                                <div className="space-y-1 md:space-y-2">
                                    <label className="block text-[10px] md:text-sm font-semibold text-gray-700 mb-0.5 md:mb-2 flex items-center gap-1 md:gap-2">
                                        <svg className="h-3 w-3 md:h-5 md:w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        الجنس / Genre
                                    </label>
                                    <select
                                        name="type"
                                        value={filters.type}
                                        onChange={handleFilterChange}
                                        className="w-full px-2 py-1.5 md:px-4 md:py-3 border md:border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm md:shadow-lg hover:shadow-xl text-xs md:text-base"
                                        disabled={filters.productType === 'packs'}
                                    >
                                        <option value="ALL">جميع الأجناس / Tous les Genres</option>
                                        <option value="MEN">رجال / Hommes</option>
                                        <option value="WOMEN">نساء / Femmes</option>
                                        <option value="BOTH">كلا الجنسين / Mixte</option>
                                    </select>
                                </div>

                                {/* Product Type Filter */}
                                <div className="space-y-1 md:space-y-2">
                                    <label className="block text-[10px] md:text-sm font-semibold text-gray-700 mb-0.5 md:mb-2 flex items-center gap-1 md:gap-2">
                                        <svg className="h-3 w-3 md:h-5 md:w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        النوع / Type
                                    </label>
                                    <select
                                        name="productType"
                                        value={filters.productType}
                                        onChange={handleFilterChange}
                                        className="w-full px-2 py-1.5 md:px-4 md:py-3 border md:border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm md:shadow-lg hover:shadow-xl text-xs md:text-base"
                                    >
                                        <option value="products">منتجات / Produits</option>
                                        <option value="packs">باقات / Packs</option>
                                    </select>
                                </div>

                                {/* Sort Filter */}
                                <div className="space-y-1 md:space-y-2">
                                    <label className="block text-[10px] md:text-sm font-semibold text-gray-700 mb-0.5 md:mb-2 flex items-center gap-1 md:gap-2">
                                        <svg className="h-3 w-3 md:h-5 md:w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                        الترتيب / Trier
                                    </label>
                                    <select
                                        value={sort}
                                        onChange={handleSortChange}
                                        className="w-full px-2 py-1.5 md:px-4 md:py-3 border md:border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm md:shadow-lg hover:shadow-xl text-xs md:text-base"
                                    >
                                        <option value="name,asc">الاسم: أ-ي / Nom : A-Z</option>
                                        <option value="name,desc">الاسم: ي-أ / Nom : Z-A</option>
                                        <option value="price,asc">السعر: منخفض-عالي / Prix : Croissant</option>
                                        <option value="price,desc">السعر: عالي-منخفض / Prix : Décroissant</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quick Filter Tags */}
                            <div className="mt-4 pt-3 md:mt-8 md:pt-6 border-t border-gray-200">
                                <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-4 flex items-center gap-1 md:gap-2">
                                    <svg className="h-4 w-4 md:h-5 md:w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    فلاتر سريعة / Filtres Rapides
                                </h3>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '', categoryId: '', type: 'ALL' }))}
                                        className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-xs md:text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        مسح الكل / Tout Effacer
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '0', maxPrice: '50' }))}
                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        تحت 50 MAD / Moins de 50 MAD
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '50', maxPrice: '100' }))}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        50 MAD - 100 MAD
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '100', maxPrice: '' }))}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        فوق 100 MAD / Plus de 100 MAD
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Products Section */}
            <div className="w-full px-4 py-8 container mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Loader />
                            <p className="text-gray-600 mt-4 text-lg">جاري التحميل... / Chargement...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-red-800 mb-2">خطأ في التحميل / Erreur de Chargement</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {items.length > 0 ? `${items.length} منتج متاح / ${items.length} Produits Disponibles` : 'لا توجد منتجات / Aucun Produit Trouvé'}
                                    </h2>
                                    <p className="text-gray-600">
                                        {filters.search ? `نتائج البحث عن "${filters.search}" / Résultats de recherche pour "${filters.search}"` : 'جميع المنتجات / Tous les Produits'}
                                    </p>
                                </div>

                                {/* Active Filters Display */}
                                {(filters.categoryId || filters.minPrice || filters.maxPrice || filters.type !== 'ALL') && (
                                    <div className="flex flex-wrap gap-2">
                                        {filters.categoryId && (
                                            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                                                {categories.find(c => c.id === filters.categoryId)?.name}
                                            </span>
                                        )}
                                        {(filters.minPrice || filters.maxPrice) && (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                {filters.minPrice || '0'} MAD - {filters.maxPrice || '∞'} MAD
                                            </span>
                                        )}
                                        {filters.type !== 'ALL' && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {filters.type === 'MEN' ? 'رجال / Hommes' : filters.type === 'WOMEN' ? 'نساء / Femmes' : 'كلا الجنسين / Mixte'}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Products Grid */}
                        {items.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="transform transition-all duration-300 hover:-translate-y-2"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <CardComponent
                                            product={item}
                                            pack={item}
                                            fetchCartCount={fetchCartCount}
                                            isAuthenticated={isAuthenticated}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 max-w-2xl mx-auto">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد منتجات / Aucun Produit Trouvé</h3>
                                    <p className="text-gray-600 mb-6">
                                        لم نتمكن من العثور على منتجات تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو البحث عن شيء آخر.
                                    </p>
                                    <p className="text-gray-500 text-sm mb-8">
                                        Nous n'avons trouvé aucun produit correspondant à vos critères de recherche. Essayez d'ajuster les filtres ou de chercher autre chose.
                                    </p>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, search: '', categoryId: '', minPrice: '', maxPrice: '', type: 'ALL' }))}
                                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        مسح الفلاتر / Effacer les Filtres
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Pagination */}
                        {filters.productType !== 'packs' && totalPages > 1 && (
                            <div className="mt-16 flex justify-center">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={page === 0}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${page === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                <span>السابق / Précédent</span>
                                            </div>
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${page === pageNum
                                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                                                            : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={page >= totalPages - 1}
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${page >= totalPages - 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>التالي / Suivant</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="text-center mt-4">
                                        <p className="text-sm text-gray-600">
                                            صفحة {page + 1} من {totalPages} / Page {page + 1} sur {totalPages}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
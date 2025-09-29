// frontend/src/pages/ProductsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { getAllProducts, getAllCategories, getAllPacks, getProductSuggestions } from '../api/apiService';
import Loader from '../components/Loader';
import PackCard from '../components/PackCard';
import ReactGA from 'react-ga4';

const ProductsPage = ({ fetchCartCount, isAuthenticated }) => { // Accept props here
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
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
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Search', {
                    search_string: value
                });
            }
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
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200 to-pink-200 rounded-full translate-y-40 -translate-x-40 opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <div className="relative z-10 container mx-auto px-4 py-12">
                    {/* Enhanced Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            منتجاتنا / Our Products
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            اكتشف أفضل منتجات التجميل المختارة بعناية / Discover the finest beauty products carefully selected for you
                        </p>
                    </div>

                    {/* Enhanced Search and Filter Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 mb-12">
                        {/* Main Search Bar */}
                        <div className="mb-8">
                            <div className="relative">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="ابحث عن المنتجات... / Search for products..."
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            autoComplete="off"
                                            className="w-full pl-16 pr-16 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute inset-y-0 right-0 pr-6 flex items-center"
                                        >
                                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                    
                                    {/* Enhanced Search Suggestions */}
                                    {suggestions.length > 0 && (
                                        <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    className="px-6 py-4 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 cursor-pointer transition-all duration-200 flex items-center gap-3"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    الفئة / Category
                                </label>
                                <select 
                                    name="categoryId" 
                                    value={filters.categoryId} 
                                    onChange={handleFilterChange} 
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl" 
                                    disabled={filters.productType === 'packs'}
                                >
                                    <option value="">جميع الفئات / All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range Filters */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    السعر الأدنى / Min Price
                                </label>
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="$0"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    السعر الأعلى / Max Price
                                </label>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="$1000"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                                />
                            </div>

                            {/* Gender Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    الجنس / Gender
                                </label>
                                <select 
                                    name="type" 
                                    value={filters.type} 
                                    onChange={handleFilterChange} 
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl" 
                                    disabled={filters.productType === 'packs'}
                                >
                                    <option value="ALL">جميع الأجناس / All Genders</option>
                                    <option value="MEN">رجال / Men</option>
                                    <option value="WOMEN">نساء / Women</option>
                                    <option value="BOTH">كلا الجنسين / Both</option>
                                </select>
                            </div>

                            {/* Product Type Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    النوع / Type
                                </label>
                                <select 
                                    name="productType" 
                                    value={filters.productType} 
                                    onChange={handleFilterChange} 
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                                >
                                    <option value="products">منتجات / Products</option>
                                    <option value="packs">باقات / Packs</option>
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                    الترتيب / Sort
                                </label>
                                <select 
                                    value={sort} 
                                    onChange={handleSortChange} 
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                                >
                                    <option value="name,asc">الاسم: أ-ي / Name: A-Z</option>
                                    <option value="name,desc">الاسم: ي-أ / Name: Z-A</option>
                                    <option value="price,asc">السعر: منخفض-عالي / Price: Low to High</option>
                                    <option value="price,desc">السعر: عالي-منخفض / Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Quick Filter Tags */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                فلاتر سريعة / Quick Filters
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button 
                                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '', categoryId: '', type: 'ALL' }))}
                                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    مسح الكل / Clear All
                                </button>
                                <button 
                                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '0', maxPrice: '50' }))}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    تحت $50 / Under $50
                                </button>
                                <button 
                                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '50', maxPrice: '100' }))}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    $50 - $100
                                </button>
                                <button 
                                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '100', maxPrice: '' }))}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    فوق $100 / Over $100
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Products Section */}
            <div className="relative z-10 container mx-auto px-4 pb-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Loader />
                            <p className="text-gray-600 mt-4 text-lg">جاري التحميل... / Loading...</p>
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
                            <h3 className="text-xl font-bold text-red-800 mb-2">خطأ في التحميل / Loading Error</h3>
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
                                        {items.length > 0 ? `${items.length} منتج متاح / ${items.length} Products Available` : 'لا توجد منتجات / No Products Found'}
                                    </h2>
                                    <p className="text-gray-600">
                                        {filters.search ? `نتائج البحث عن "${filters.search}" / Search results for "${filters.search}"` : 'جميع المنتجات / All Products'}
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
                                                ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                                            </span>
                                        )}
                                        {filters.type !== 'ALL' && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {filters.type === 'MEN' ? 'رجال / Men' : filters.type === 'WOMEN' ? 'نساء / Women' : 'كلا الجنسين / Both'}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Products Grid */}
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد منتجات / No Products Found</h3>
                                    <p className="text-gray-600 mb-6">
                                        لم نتمكن من العثور على منتجات تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو البحث عن شيء آخر.
                                    </p>
                                    <p className="text-gray-500 text-sm mb-8">
                                        We couldn't find any products matching your search criteria. Try adjusting the filters or searching for something else.
                                    </p>
                                    <button 
                                        onClick={() => setFilters(prev => ({ ...prev, search: '', categoryId: '', minPrice: '', maxPrice: '', type: 'ALL' }))}
                                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        مسح الفلاتر / Clear Filters
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
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                                                page === 0 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                <span>السابق / Previous</span>
                                            </div>
                                        </button>
                                        
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                                                            page === pageNum
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
                                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                                                page >= totalPages - 1 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>التالي / Next</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                    
                                    <div className="text-center mt-4">
                                        <p className="text-sm text-gray-600">
                                            صفحة {page + 1} من {totalPages} / Page {page + 1} of {totalPages}
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllOrders, deleteProduct, getPendingReviews, getAllPacks, getAllCustomPacks, getAllCategories, getAllUsers, getSettings } from '/src/api/apiService.js';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiStar, FiEye, FiEdit3, FiTrash2, FiPlus, FiArrowUpRight, FiBarChart, FiActivity, FiTarget, FiSettings, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiClock, FiZap, FiHeart, FiShield } from 'react-icons/fi';
import { usePermissions } from '../../contexts/PermissionContext';
import PermissionGuard from '../../components/PermissionGuard';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [packs, setPacks] = useState([]);
    const [customPacks, setCustomPacks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [visitorCounterSettings, setVisitorCounterSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Get translation function
    const { t } = useLanguage();

    // Get user permissions and roles
    const { hasPermission, hasRole, hasAnyPermission, permissions, roles, loading: permissionsLoading } = usePermissions();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Build array of promises based on user permissions
                const promises = [];
                const promiseNames = [];

                // Always try to fetch products and categories (basic data)
                promises.push(getAllProducts());
                promiseNames.push('products');

                promises.push(getAllCategories());
                promiseNames.push('categories');

                // Only fetch data if user has permissions
                if (hasAnyPermission(['ORDER:VIEW', 'ORDER:EDIT', 'ORDER:CREATE'])) {
                    promises.push(getAllOrders());
                    promiseNames.push('orders');
                }

                if (hasAnyPermission(['REVIEW:VIEW', 'REVIEW:EDIT', 'REVIEW:CREATE'])) {
                    promises.push(getPendingReviews());
                    promiseNames.push('reviews');
                }

                if (hasAnyPermission(['PACK:VIEW', 'PACK:EDIT', 'PACK:CREATE'])) {
                    promises.push(getAllPacks());
                    promiseNames.push('packs');
                }

                if (hasAnyPermission(['CUSTOM_PACK:VIEW', 'CUSTOM_PACK:EDIT', 'CUSTOM_PACK:CREATE'])) {
                    promises.push(getAllCustomPacks());
                    promiseNames.push('customPacks');
                }

                if (hasAnyPermission(['USER:VIEW', 'USER:EDIT', 'USER:CREATE'])) {
                    promises.push(getAllUsers());
                    promiseNames.push('users');
                }

                if (hasAnyPermission(['VISITOR_COUNTER:VIEW', 'VISITOR_COUNTER:EDIT', 'VISITOR_COUNTER:CREATE'])) {
                    promises.push(getSettings());
                    promiseNames.push('visitorCounter');
                }

                // Execute all promises
                const responses = await Promise.allSettled(promises);

                // Process responses
                responses.forEach((response, index) => {
                    const promiseName = promiseNames[index];

                    if (response.status === 'fulfilled') {
                        const data = response.value.data;

                        switch (promiseName) {
                            case 'products':
                                const productsArray = Array.isArray(data) ? data : data?.content || [];
                                setProducts(productsArray);
                                break;
                            case 'orders':
                                setOrders(data || []);
                                break;
                            case 'reviews':
                                setPendingReviews(data || []);
                                break;
                            case 'packs':
                                setPacks(data || []);
                                break;
                            case 'customPacks':
                                setCustomPacks(data || []);
                                break;
                            case 'categories':
                                setCategories(data || []);
                                break;
                            case 'users':
                                setUsers(data || []);
                                break;
                            case 'visitorCounter':
                                setVisitorCounterSettings(response.value || null);
                                break;
                        }
                    } else {
                        console.warn(`Failed to fetch ${promiseName}:`, response.reason);
                    }
                });

            } catch (err) {
                setError(t('failedToFetchDashboard'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data if permissions are loaded
        if (!permissionsLoading) {
            fetchData();
        }
    }, [permissionsLoading, hasAnyPermission, refreshing]);

    const handleDelete = async (productId) => {
        if (window.confirm(t('deleteProductConfirm'))) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter(p => p.id !== productId));
            } catch (err) {
                // Extract error message from API response
                const errorMessage = err.response?.data?.message || t('failedToDeleteProduct');
                setError(errorMessage);
                console.error('Product deletion error:', err.response?.data || err.message);
            }
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        // The useEffect will handle the refresh when refreshing state changes
        setTimeout(() => setRefreshing(false), 100);
    };

    // Calculate analytics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalPacks = packs.length;
    const totalCustomPacks = customPacks.length;
    const totalCategories = categories.length;
    const pendingReviewsCount = pendingReviews.length;

    // Calculate recent trends (last 7 days)
    const recentOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
    });

    const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Mock growth percentages (in real app, calculate from historical data)
    const revenueGrowth = 12.5;
    const ordersGrowth = 8.3;
    const usersGrowth = 15.2;
    const productsGrowth = 5.7;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">{t('loadingDashboard')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Enhanced Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FiBarChart className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-3">
                                <span>{t('adminDashboard')}</span>
                                <FiZap className="w-8 h-8 text-yellow-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center space-x-2">
                                <FiHeart className="w-4 h-4 text-pink-500" />
                                <span>{t('welcomeMessage')}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center space-x-2 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-pink-300 transition-all duration-300 group"
                        >
                            <FiRefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>{t('refresh')}</span>
                        </button>

                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                            <FiShield className="w-4 h-4 animate-pulse" />
                            <span>{t('liveStatus')}</span>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-500 flex items-center space-x-1">
                                <FiClock className="w-3 h-3" />
                                <span>{t('lastUpdated')}</span>
                            </p>
                            <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
                        <div className="flex items-center">
                            <FiAlertCircle className="mr-2 animate-bounce" />
                            <span className="font-semibold">{t('error')}:</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Revenue Card - Only visible to users with ORDER:VIEW permission */}
                    <PermissionGuard anyPermissions={['ORDER:VIEW', 'ORDER:EDIT', 'ORDER:CREATE']}>
                        <div
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
                            onMouseEnter={() => setHoveredCard('revenue')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">{t('totalRevenue')}</p>
                                        <p className="text-white text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                        <FiDollarSign className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <FiTrendingUp className="w-4 h-4 text-green-200 mr-1 animate-pulse" />
                                    <span className="text-green-200 text-sm">+{revenueGrowth}% {t('fromLastMonth')}</span>
                                </div>
                                {hoveredCard === 'revenue' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                )}
                            </div>
                        </div>
                    </PermissionGuard>

                    {/* Orders Card - Only visible to users with ORDER:VIEW permission */}
                    <PermissionGuard anyPermissions={['ORDER:VIEW', 'ORDER:EDIT', 'ORDER:CREATE']}>
                        <div
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
                            onMouseEnter={() => setHoveredCard('orders')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">{t('totalOrders')}</p>
                                        <p className="text-white text-3xl font-bold">{totalOrders}</p>
                                    </div>
                                    <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                        <FiShoppingCart className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <FiTrendingUp className="w-4 h-4 text-blue-200 mr-1 animate-pulse" />
                                    <span className="text-blue-200 text-sm">+{ordersGrowth}% {t('fromLastMonth')}</span>
                                </div>
                                {hoveredCard === 'orders' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                )}
                            </div>
                        </div>
                    </PermissionGuard>

                    {/* Users Card - Only visible to users with USER:VIEW permission */}
                    <PermissionGuard anyPermissions={['USER:VIEW', 'USER:EDIT', 'USER:CREATE']}>
                        <div
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
                            onMouseEnter={() => setHoveredCard('users')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">{t('totalUsers')}</p>
                                        <p className="text-white text-3xl font-bold">{totalUsers}</p>
                                    </div>
                                    <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                        <FiUsers className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <FiTrendingUp className="w-4 h-4 text-purple-200 mr-1 animate-pulse" />
                                    <span className="text-purple-200 text-sm">+{usersGrowth}% {t('fromLastMonth')}</span>
                                </div>
                                {hoveredCard === 'users' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                )}
                            </div>
                        </div>
                    </PermissionGuard>

                    {/* Products Card - Only visible to users with PRODUCT:VIEW permission */}
                    <PermissionGuard anyPermissions={['PRODUCT:VIEW', 'PRODUCT:EDIT', 'PRODUCT:CREATE']}>
                        <div
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
                            onMouseEnter={() => setHoveredCard('products')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm font-medium">{t('totalProducts')}</p>
                                        <p className="text-white text-3xl font-bold">{totalProducts}</p>
                                    </div>
                                    <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                        <FiPackage className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <FiTrendingUp className="w-4 h-4 text-orange-200 mr-1 animate-pulse" />
                                    <span className="text-orange-200 text-sm">+{productsGrowth}% {t('fromLastMonth')}</span>
                                </div>
                                {hoveredCard === 'products' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                )}
                            </div>
                        </div>
                    </PermissionGuard>
                </div>

                {/* Enhanced Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Packs Available - Only visible to users with PACK:VIEW permission */}
                    <PermissionGuard anyPermissions={['PACK:VIEW', 'PACK:EDIT', 'PACK:CREATE']}>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{t('packsAvailable')}</p>
                                    <p className="text-gray-900 text-2xl font-bold">{totalPacks}</p>
                                </div>
                                <div className="bg-pink-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                    <FiPackage className="w-6 h-6 text-pink-600 group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </div>
                            <Link to="/admin/packs" className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center mt-2 group/link">
                                {t('managePacksLink')} <FiArrowUpRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </PermissionGuard>

                    {/* Custom Packs - Only visible to users with CUSTOM_PACK:VIEW permission */}
                    <PermissionGuard anyPermissions={['CUSTOM_PACK:VIEW', 'CUSTOM_PACK:EDIT', 'CUSTOM_PACK:CREATE']}>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{t('customPacks')}</p>
                                    <p className="text-gray-900 text-2xl font-bold">{totalCustomPacks}</p>
                                </div>
                                <div className="bg-purple-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                    <FiTarget className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </div>
                            <Link to="/admin/custom-packs" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center mt-2 group/link">
                                {t('manageCustomPacksLink')} <FiArrowUpRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </PermissionGuard>

                    {/* Categories - Only visible to users with CATEGORY:VIEW permission */}
                    <PermissionGuard anyPermissions={['CATEGORY:VIEW', 'CATEGORY:EDIT', 'CATEGORY:CREATE']}>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{t('categories')}</p>
                                    <p className="text-gray-900 text-2xl font-bold">{totalCategories}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                    <FiBarChart className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                                </div>
                            </div>
                            <Link to="/admin/categories" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center mt-2 group/link">
                                {t('manageCategories')} <FiArrowUpRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </PermissionGuard>

                    {/* Enhanced Visitor Counter Status - Only visible to users with VISITOR_COUNTER:VIEW permission */}
                    <PermissionGuard anyPermissions={['VISITOR_COUNTER:VIEW', 'VISITOR_COUNTER:EDIT', 'VISITOR_COUNTER:CREATE']}>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{t('visitorCounter')}</p>
                                    <div className="flex items-center mt-1">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${visitorCounterSettings?.enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <p className="text-gray-900 text-lg font-bold">
                                            {visitorCounterSettings?.enabled ? t('active') : t('disabled')}
                                        </p>
                                    </div>
                                    {visitorCounterSettings?.enabled && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t('range')}: {visitorCounterSettings.min}-{visitorCounterSettings.max}
                                        </p>
                                    )}
                                </div>
                                <div className={`rounded-full p-3 group-hover:scale-110 transition-transform duration-300 ${visitorCounterSettings?.enabled ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <FiEye className={`w-6 h-6 group-hover:rotate-12 transition-transform duration-300 ${visitorCounterSettings?.enabled ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                            </div>
                            <Link to="/admin/vistorcountsetting" className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center mt-2 group/link">
                                {t('configureSettings')} <FiArrowUpRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </PermissionGuard>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Products - Only visible to users with PRODUCT:VIEW permission */}
                    <PermissionGuard anyPermissions={['PRODUCT:VIEW', 'PRODUCT:EDIT', 'PRODUCT:CREATE']}>
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                            <FiPackage className="w-5 h-5 mr-2 text-pink-600" />
                                            {t('recentProducts')}
                                        </h2>
                                        <PermissionGuard anyPermissions={['PRODUCT:CREATE', 'PRODUCT:EDIT']}>
                                            <Link to="/admin/products/new" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center">
                                                <FiPlus className="w-4 h-4 mr-2" />
                                                {t('addNew')}
                                            </Link>
                                        </PermissionGuard>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {products.slice(0, 6).map((product, index) => {
                                            // Get the first image or use a placeholder
                                            const productImage = product.images && product.images.length > 0
                                                ? product.images[0]
                                                : 'https://placehold.co/48x48/E91E63/FFFFFF?text=No+Image';

                                            return (
                                                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={productImage}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = 'https://placehold.co/48x48/E91E63/FFFFFF?text=No+Image';
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 truncate max-w-xs">{product.name}</h3>
                                                            <p className="text-sm text-gray-600">${product.price?.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Link to={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <FiEdit3 className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Link to="/admin/products" className="text-pink-600 hover:text-pink-700 font-medium flex items-center justify-center mt-6">
                                        {t('viewAllProducts')} <FiArrowUpRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </PermissionGuard>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Orders - Only visible to users with ORDER:VIEW permission */}
                        <PermissionGuard anyPermissions={['ORDER:VIEW', 'ORDER:EDIT', 'ORDER:CREATE']}>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                        <FiShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                                        {t('recentOrders')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {orders.slice(0, 4).map(order => {
                                            const orderTotal = order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.totalAmount || 0;
                                            const itemCount = order.orderItems?.length || 0;
                                            const firstProduct = order.orderItems?.[0];
                                            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            });

                                            return (
                                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                                <FiShoppingCart className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900">
                                                                    {firstProduct ? `${firstProduct.productName}${itemCount > 1 ? ` +${itemCount - 1} more` : ''}` : `Order #${order.id}`}
                                                                </p>
                                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                    <span>${orderTotal.toFixed(2)}</span>
                                                                    <span>•</span>
                                                                    <span>{orderDate}</span>
                                                                    {order.clientFullName && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span>{order.clientFullName}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                                                                    order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mt-4">
                                        {t('viewAllOrders')} <FiArrowUpRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </PermissionGuard>

                        {/* Pending Reviews - Only visible to users with REVIEW:VIEW permission */}
                        <PermissionGuard anyPermissions={['REVIEW:VIEW', 'REVIEW:EDIT', 'REVIEW:CREATE']}>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                            <FiStar className="w-5 h-5 mr-2 text-orange-600" />
                                            {t('pendingReviews')}
                                        </h2>
                                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">
                                            {pendingReviewsCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {pendingReviews.slice(0, 3).map(review => (
                                            <div key={review.id} className="p-3 bg-orange-50 rounded-lg">
                                                <p className="text-sm text-gray-700 line-clamp-2">"{review.content}"</p>
                                                <p className="text-xs text-gray-500 mt-1">by {review.userEmail}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to="/admin/reviews" className="text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center mt-4">
                                        {t('manageReviews')} <FiArrowUpRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </PermissionGuard>

                        {/* Quick Actions - Only show actions user has permissions for */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <FiActivity className="w-5 h-5 mr-2 text-green-600" />
                                    {t('quickActions')}
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {/* Add New Product - Only visible to users with PRODUCT:CREATE permission */}
                                <PermissionGuard anyPermissions={['PRODUCT:CREATE', 'PRODUCT:EDIT']}>
                                    <Link to="/admin/products/new" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        <FiPlus className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="text-green-800 font-medium">{t('addNewProduct')}</span>
                                    </Link>
                                </PermissionGuard>

                                {/* Create New Pack - Only visible to users with PACK:CREATE permission */}
                                <PermissionGuard anyPermissions={['PACK:CREATE', 'PACK:EDIT']}>
                                    <Link to="/admin/packs/new" className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                                        <FiPackage className="w-5 h-5 text-pink-600 mr-3" />
                                        <span className="text-pink-800 font-medium">{t('createNewPack')}</span>
                                    </Link>
                                </PermissionGuard>

                                {/* New Custom Pack - Only visible to users with CUSTOM_PACK:CREATE permission */}
                                <PermissionGuard anyPermissions={['CUSTOM_PACK:CREATE', 'CUSTOM_PACK:EDIT']}>
                                    <Link to="/admin/custom-packs/new" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                        <FiTarget className="w-5 h-5 text-purple-600 mr-3" />
                                        <span className="text-purple-800 font-medium">{t('newCustomPack')}</span>
                                    </Link>
                                </PermissionGuard>

                                {/* Add Category - Only visible to users with CATEGORY:CREATE permission */}
                                <PermissionGuard anyPermissions={['CATEGORY:CREATE', 'CATEGORY:EDIT']}>
                                    <Link to="/admin/categories/new" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        <FiBarChart className="w-5 h-5 text-blue-600 mr-3" />
                                        <span className="text-blue-800 font-medium">{t('addCategory')}</span>
                                    </Link>
                                </PermissionGuard>

                                {/* Review Form Settings - Only visible to users with REVIEW:EDIT permission */}
                                <PermissionGuard anyPermissions={['REVIEW:EDIT', 'REVIEW:CREATE']}>
                                    <Link to="/admin/review-form-settings" className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                        <FiSettings className="w-5 h-5 text-orange-600 mr-3" />
                                        <span className="text-orange-800 font-medium">{t('reviewFormSettings')}</span>
                                    </Link>
                                </PermissionGuard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
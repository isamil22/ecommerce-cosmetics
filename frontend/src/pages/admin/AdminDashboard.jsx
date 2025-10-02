import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllOrders, deleteProduct, getPendingReviews, getAllPacks, getAllCustomPacks, getAllCategories, getAllUsers } from '/src/api/apiService.js';
import { getSettings } from '/src/api/visitorCountSettingService.js';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiStar, FiEye, FiEdit3, FiTrash2, FiPlus, FiArrowUpRight, FiBarChart, FiActivity, FiTarget, FiSettings } from 'react-icons/fi';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all dashboard data at the same time
                const [productsResponse, ordersResponse, reviewsResponse, packsResponse, customPacksResponse, categoriesResponse, usersResponse, visitorCounterResponse] = await Promise.all([
                    getAllProducts(),
                    getAllOrders(),
                    getPendingReviews(),
                    getAllPacks(),
                    getAllCustomPacks(),
                    getAllCategories(),
                    getAllUsers(),
                    getSettings().catch(() => null) // Don't fail if visitor counter settings fail
                ]);

                // Handle products data
                const productsArray = Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data?.content || [];
                setProducts(productsArray);

                setOrders(ordersResponse.data || []);
                setPendingReviews(reviewsResponse.data || []);
                setPacks(packsResponse.data || []);
                setCustomPacks(customPacksResponse.data || []);
                setCategories(categoriesResponse.data || []);
                setUsers(usersResponse.data || []);
                setVisitorCounterSettings(visitorCounterResponse || null);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter(p => p.id !== productId));
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
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
                    <p className="text-gray-600 text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Live Status: Online
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Last updated</p>
                            <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <FiActivity className="mr-2" />
                            <span className="font-semibold">Error:</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    </div>
                )}

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                                    <p className="text-white text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                                </div>
                                <div className="bg-white/20 rounded-full p-3">
                                    <FiDollarSign className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <FiTrendingUp className="w-4 h-4 text-green-200 mr-1" />
                                <span className="text-green-200 text-sm">+{revenueGrowth}% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                                    <p className="text-white text-3xl font-bold">{totalOrders}</p>
                                </div>
                                <div className="bg-white/20 rounded-full p-3">
                                    <FiShoppingCart className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <FiTrendingUp className="w-4 h-4 text-blue-200 mr-1" />
                                <span className="text-blue-200 text-sm">+{ordersGrowth}% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Users Card */}
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Total Users</p>
                                    <p className="text-white text-3xl font-bold">{totalUsers}</p>
                                </div>
                                <div className="bg-white/20 rounded-full p-3">
                                    <FiUsers className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <FiTrendingUp className="w-4 h-4 text-purple-200 mr-1" />
                                <span className="text-purple-200 text-sm">+{usersGrowth}% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Products Card */}
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium">Total Products</p>
                                    <p className="text-white text-3xl font-bold">{totalProducts}</p>
                                </div>
                                <div className="bg-white/20 rounded-full p-3">
                                    <FiPackage className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                <FiTrendingUp className="w-4 h-4 text-orange-200 mr-1" />
                                <span className="text-orange-200 text-sm">+{productsGrowth}% from last month</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Packs Available</p>
                                <p className="text-gray-900 text-2xl font-bold">{totalPacks}</p>
                            </div>
                            <div className="bg-pink-100 rounded-full p-3">
                                <FiPackage className="w-6 h-6 text-pink-600" />
                            </div>
                        </div>
                        <Link to="/admin/packs" className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center mt-2">
                            Manage Packs <FiArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Custom Packs</p>
                                <p className="text-gray-900 text-2xl font-bold">{totalCustomPacks}</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <FiTarget className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <Link to="/admin/custom-packs" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center mt-2">
                            Manage Custom Packs <FiArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Categories</p>
                                <p className="text-gray-900 text-2xl font-bold">{totalCategories}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <FiBarChart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <Link to="/admin/categories" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center mt-2">
                            Manage Categories <FiArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* Visitor Counter Status */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Visitor Counter</p>
                                <div className="flex items-center mt-1">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${visitorCounterSettings?.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <p className="text-gray-900 text-lg font-bold">
                                        {visitorCounterSettings?.enabled ? 'Active' : 'Disabled'}
                                    </p>
                                </div>
                                {visitorCounterSettings?.enabled && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Range: {visitorCounterSettings.min}-{visitorCounterSettings.max}
                                    </p>
                                )}
                            </div>
                            <div className={`rounded-full p-3 ${visitorCounterSettings?.enabled ? 'bg-green-100' : 'bg-red-100'}`}>
                                <FiEye className={`w-6 h-6 ${visitorCounterSettings?.enabled ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                        </div>
                        <Link to="/admin/vistorcountsetting" className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center mt-2">
                            Configure Settings <FiArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Products */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <FiPackage className="w-5 h-5 mr-2 text-pink-600" />
                                        Recent Products
                                    </h2>
                                    <Link to="/admin/products/new" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center">
                                        <FiPlus className="w-4 h-4 mr-2" />
                                        Add New
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {products.slice(0, 6).map((product, index) => (
                                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                    {product.name?.charAt(0) || 'P'}
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
                                    ))}
                                </div>
                                <Link to="/admin/products" className="text-pink-600 hover:text-pink-700 font-medium flex items-center justify-center mt-6">
                                    View all products <FiArrowUpRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <FiShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                                    Recent Orders
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {orders.slice(0, 4).map(order => (
                                        <div key={order.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900">#{order.id}</p>
                                                <p className="text-sm text-gray-600">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mt-4">
                                    View all orders <FiArrowUpRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Pending Reviews */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                        <FiStar className="w-5 h-5 mr-2 text-orange-600" />
                                        Pending Reviews
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
                                    Manage reviews <FiArrowUpRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <FiActivity className="w-5 h-5 mr-2 text-green-600" />
                                    Quick Actions
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <Link to="/admin/products/new" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                    <FiPlus className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="text-green-800 font-medium">Add New Product</span>
                                </Link>
                                <Link to="/admin/packs/new" className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                                    <FiPackage className="w-5 h-5 text-pink-600 mr-3" />
                                    <span className="text-pink-800 font-medium">Create New Pack</span>
                                </Link>
                                <Link to="/admin/custom-packs/new" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                    <FiTarget className="w-5 h-5 text-purple-600 mr-3" />
                                    <span className="text-purple-800 font-medium">New Custom Pack</span>
                                </Link>
                                <Link to="/admin/categories/new" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                    <FiBarChart className="w-5 h-5 text-blue-600 mr-3" />
                                    <span className="text-blue-800 font-medium">Add Category</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
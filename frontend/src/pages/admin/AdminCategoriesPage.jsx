import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, deleteCategory, getAllProducts } from '../../api/apiService';
import { toast } from 'react-toastify';
import {
    FiGrid, FiPlus, FiEdit3, FiTrash2, FiSearch, FiFilter,
    FiTrendingUp, FiTrendingDown, FiRefreshCw, FiSettings,
    FiCheckCircle, FiAlertTriangle, FiX, FiPackage, FiEye,
    FiDownload, FiUpload, FiSave, FiZap, FiStar, FiHeart,
    FiBarChart, FiUsers, FiDollarSign, FiClock, FiTarget,
    FiShield, FiActivity, FiGlobe, FiLayers, FiTag
} from 'react-icons/fi';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to fetch categories.');
            toast.error('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts();
            setProducts(response.data.content || response.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + N for new category
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                window.location.href = '/admin/categories/new';
            }
            // Ctrl/Cmd + F for focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.querySelector('input[placeholder="Search categories..."]')?.focus();
            }
            // Escape to clear search
            if (e.key === 'Escape' && searchTerm) {
                setSearchTerm('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchCategories();
        setRefreshing(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                setDeletingCategoryId(id);
                await deleteCategory(id);
                toast.success('Category deleted successfully!');
                fetchCategories(); // Refresh list
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to delete category. It might be in use by some products.';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setDeletingCategoryId(null);
            }
        }
    };

    // Calculate analytics
    const analytics = useMemo(() => {
        const totalCategories = categories.length;
        const categoriesWithProducts = categories.filter(category =>
            products.some(product => product.categoryId === category.id)
        ).length;
        const emptyCategories = totalCategories - categoriesWithProducts;
        const totalProducts = products.length;

        return { totalCategories, categoriesWithProducts, emptyCategories, totalProducts };
    }, [categories, products]);

    // Filter and sort categories
    const filteredAndSortedCategories = useMemo(() => {
        let filtered = categories.filter(category =>
            category.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'products':
                    aValue = products.filter(p => p.categoryId === a.id).length;
                    bValue = products.filter(p => p.categoryId === b.id).length;
                    break;
                default:
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [categories, products, searchTerm, sortBy, sortOrder]);

    const getProductCount = (categoryId) => {
        return products.filter(product => product.categoryId === categoryId).length;
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="p-6">
                {/* Analytics skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div className="bg-gray-200 rounded-full p-3 w-12 h-12"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Categories skeleton */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-6">
                                    <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="flex space-x-2 pt-3">
                                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Enhanced Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FiGrid className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-3">
                                <span>Category Management</span>
                                <FiZap className="w-8 h-8 text-yellow-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center space-x-2">
                                <FiHeart className="w-4 h-4 text-pink-500" />
                                <span>Organize your product catalog with beautiful categories</span>
                            </p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+N</kbd>
                                    <span className="ml-2">New Category</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+F</kbd>
                                    <span className="ml-2">Search</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Esc</kbd>
                                    <span className="ml-2">Clear Search</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center space-x-2 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-purple-300 transition-all duration-300 group"
                        >
                            <FiRefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>

                        <Link
                            to="/admin/categories/new"
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                        >
                            <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-medium">Add New Category</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
                        <div className="flex items-center">
                            <FiAlertTriangle className="mr-2 animate-bounce" />
                            <span className="font-semibold">Error:</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    </div>
                )}

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Categories</p>
                                <p className="text-gray-900 text-2xl font-bold">{analytics.totalCategories}</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <FiGrid className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">With Products</p>
                                <p className="text-green-600 text-2xl font-bold">{analytics.categoriesWithProducts}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <FiCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Empty Categories</p>
                                <p className="text-yellow-600 text-2xl font-bold">{analytics.emptyCategories}</p>
                            </div>
                            <div className="bg-yellow-100 rounded-full p-3">
                                <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                                <p className="text-blue-600 text-2xl font-bold">{analytics.totalProducts}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <FiPackage className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="products">Sort by Product Count</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {sortOrder === 'asc' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* View Mode */}
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:bg-gray-50'} transition-colors`}
                                    title="Grid View"
                                >
                                    <FiGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:bg-gray-50'} transition-colors`}
                                    title="List View"
                                >
                                    <FiLayers className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Clear Search */}
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center"
                                    title="Clear search"
                                >
                                    <FiX className="w-4 h-4 mr-2" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories Display */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Categories ({filteredAndSortedCategories.length})
                                </h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleRefresh}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center"
                                >
                                    <FiRefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories Display */}
                    <div className="p-6">
                        {filteredAndSortedCategories.length === 0 ? (
                            <div className="text-center py-12">
                                <FiGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {searchTerm ? 'No categories found' : 'No categories available'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first category'}
                                </p>
                                <Link
                                    to="/admin/categories/new"
                                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center mx-auto w-fit"
                                >
                                    <FiPlus className="w-5 h-5 mr-2" />
                                    {searchTerm ? 'Clear Search' : 'Create Your First Category'}
                                </Link>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                            }>
                                {filteredAndSortedCategories.map(category => {
                                    const productCount = getProductCount(category.id);
                                    const isEmpty = productCount === 0;

                                    return (
                                        <div
                                            key={category.id}
                                            className={`group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                                                }`}
                                        >
                                            {viewMode === 'grid' ? (
                                                <>
                                                    {/* Category Image */}
                                                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                                                        {category.imageUrl ? (
                                                            <img
                                                                src={category.imageUrl}
                                                                alt={category.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-center">
                                                                <FiGrid className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                                                                <p className="text-purple-600 font-medium">No Image</p>
                                                            </div>
                                                        )}

                                                        {/* Status Badge */}
                                                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${isEmpty ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'
                                                            }`}>
                                                            {isEmpty ? (
                                                                <>
                                                                    <FiAlertTriangle className="w-3 h-3 inline mr-1" />
                                                                    Empty
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiCheckCircle className="w-3 h-3 inline mr-1" />
                                                                    {productCount} products
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Category Info */}
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                                {category.name}
                                                            </h3>
                                                            {category.description && (
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                    {category.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">
                                                                ID: {category.id}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {productCount} products
                                                            </span>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                                                            <Link
                                                                to={`/admin/categories/edit/${category.id}`}
                                                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                                                            >
                                                                <FiEdit3 className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(category.id)}
                                                                disabled={deletingCategoryId === category.id}
                                                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                                            >
                                                                {deletingCategoryId === category.id ? (
                                                                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                                ) : (
                                                                    <FiTrash2 className="w-4 h-4 mr-2" />
                                                                )}
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* List View */}
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        {/* Category Image */}
                                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {category.imageUrl ? (
                                                                <img
                                                                    src={category.imageUrl}
                                                                    alt={category.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <FiGrid className="w-8 h-8 text-purple-400" />
                                                            )}
                                                        </div>

                                                        {/* Category Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-3">
                                                                <h3 className="font-bold text-gray-900 truncate">
                                                                    {category.name}
                                                                </h3>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isEmpty ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                    {isEmpty ? 'Empty' : `${productCount} products`}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                                <span>ID: {category.id}</span>
                                                                {category.description && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="truncate">{category.description}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                to={`/admin/categories/edit/${category.id}`}
                                                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                                                                title="Edit Category"
                                                            >
                                                                <FiEdit3 className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(category.id)}
                                                                disabled={deletingCategoryId === category.id}
                                                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Delete Category"
                                                            >
                                                                {deletingCategoryId === category.id ? (
                                                                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;
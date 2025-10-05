import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct, getAllCategories, updateProductQuick } from '../../api/apiService';
import { toast } from 'react-toastify';
import QuickEditModal from '../../components/QuickEditModal';
import { 
    FiSearch, FiPlus, FiEdit3, FiTrash2, 
    FiStar, FiPackage, FiTrendingUp, FiTrendingDown, FiDownload,
    FiCheck, FiX, FiAlertTriangle, FiCheckCircle,
    FiGrid, FiList, FiRefreshCw, FiSettings, FiBarChart,
    FiDollarSign, FiUsers, FiZap, FiHeart, FiShield, FiEye,
    FiFilter, FiSortAsc, FiSortDesc, FiMoreVertical
} from 'react-icons/fi';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    
    // Quick Edit Modal State
    const [editingProduct, setEditingProduct] = useState(null);
    const [showQuickEdit, setShowQuickEdit] = useState(false);
    
    // Animation States
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleQuickEdit = (product) => {
        setEditingProduct(product);
        setShowQuickEdit(true);
    };

    const handleQuickSave = async (productId, updatedData) => {
        try {
            await updateProductQuick(productId, updatedData);
            // Update the products list
            setProducts(products.map(p => 
                p.id === productId ? { ...p, ...updatedData } : p
            ));
        } catch (error) {
            throw error; // Re-throw to be handled by the modal
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            setProducts(response.data.content || response.data);
        } catch (err) {
            setError('Failed to fetch products.');
            toast.error('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchProducts();
        setRefreshing(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + N for new product
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                window.location.href = '/admin/products/new';
            }
            // Ctrl/Cmd + F for focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.querySelector('input[placeholder="Search products..."]')?.focus();
            }
            // Escape to close modal
            if (e.key === 'Escape' && showQuickEdit) {
                setShowQuickEdit(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showQuickEdit]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !selectedCategory || product.categoryId?.toString() === selectedCategory;
            
            const matchesStock = stockFilter === 'all' || 
                               (stockFilter === 'in-stock' && product.quantity > 0) ||
                               (stockFilter === 'low-stock' && product.quantity > 0 && product.quantity <= 10) ||
                               (stockFilter === 'out-of-stock' && product.quantity === 0);
            
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'active' && product.status !== 'DISABLED') ||
                                (statusFilter === 'disabled' && product.status === 'DISABLED') ||
                                (statusFilter === 'featured' && product.bestseller) ||
                                (statusFilter === 'new' && product.newArrival);

            return matchesSearch && matchesCategory && matchesStock && matchesStatus;
        });

        // Sort products
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'price':
                    aValue = a.price || 0;
                    bValue = b.price || 0;
                    break;
                case 'stock':
                    aValue = a.quantity || 0;
                    bValue = b.quantity || 0;
                    break;
                case 'date':
                    aValue = new Date(a.createdAt || 0);
                    bValue = new Date(b.createdAt || 0);
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
    }, [products, searchTerm, selectedCategory, stockFilter, statusFilter, sortBy, sortOrder]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                toast.success('Product deleted successfully!');
                setProducts(products.filter(p => p.id !== id));
            } catch (err) {
                setError('Failed to delete product.');
                toast.error('Failed to delete product.');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) {
            toast.warning('No products selected for deletion');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`)) {
            try {
                setLoading(true);
                const deletePromises = selectedProducts.map(id => deleteProduct(id));
                const results = await Promise.allSettled(deletePromises);
                
                const successful = results.filter(result => result.status === 'fulfilled').length;
                const failed = results.filter(result => result.status === 'rejected').length;
                
                if (successful > 0) {
                    setProducts(products.filter(p => !selectedProducts.includes(p.id)));
                    toast.success(`${successful} product(s) deleted successfully!`);
                }
                
                if (failed > 0) {
                    toast.error(`Failed to delete ${failed} product(s). Please try again.`);
                }
                
                setSelectedProducts([]);
                setShowBulkActions(false);
            } catch (err) {
                console.error('Bulk delete error:', err);
                toast.error('Failed to delete products. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const selectAllProducts = () => {
        setSelectedProducts(filteredAndSortedProducts.map(p => p.id));
    };

    const clearSelection = () => {
        setSelectedProducts([]);
    };

    const exportToCSV = () => {
        try {
            if (filteredAndSortedProducts.length === 0) {
                toast.warning('No products to export');
                return;
            }

            const csvData = filteredAndSortedProducts.map(product => ({
                Name: product.name || 'N/A',
                Brand: product.brand || 'N/A',
                Price: product.price || 0,
                Stock: product.quantity || 0,
                Category: categories.find(c => c.id === product.categoryId)?.name || 'N/A',
                Status: product.status || 'ACTIVE',
                Featured: product.bestseller ? 'Yes' : 'No',
                'New Arrival': product.newArrival ? 'Yes' : 'No',
                Created: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'
            }));

            const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success(`Successfully exported ${filteredAndSortedProducts.length} products!`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export products. Please try again.');
        }
    };

    // Calculate analytics
    const analytics = useMemo(() => {
        const totalProducts = products.length;
        const inStock = products.filter(p => p.quantity > 0).length;
        const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
        const outOfStock = products.filter(p => p.quantity === 0).length;
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;

        return { totalProducts, inStock, lowStock, outOfStock, totalValue, avgPrice };
    }, [products]);

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { status: 'out', color: 'red', icon: FiX };
        if (quantity <= 10) return { status: 'low', color: 'yellow', icon: FiAlertTriangle };
        return { status: 'good', color: 'green', icon: FiCheckCircle };
    };

    const getStockColor = (quantity) => {
        if (quantity === 0) return 'bg-red-100 text-red-800 border-red-200';
        if (quantity <= 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                    {[...Array(6)].map((_, i) => (
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

                {/* Search skeleton */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="animate-pulse">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="h-12 bg-gray-200 rounded-lg w-full max-w-md"></div>
                            <div className="flex flex-wrap items-center gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-200 rounded-lg w-32"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products skeleton */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-6">
                                    <div className="animate-pulse">
                                        <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                            <div className="flex space-x-2 pt-3">
                                                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                            </div>
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
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FiPackage className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-3">
                                <span>Product Management</span>
                                <FiZap className="w-8 h-8 text-yellow-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center space-x-2">
                                <FiHeart className="w-4 h-4 text-pink-500" />
                                <span>Manage your product catalog with advanced tools and insights</span>
                            </p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+N</kbd>
                                    <span className="ml-2">New Product</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+F</kbd>
                                    <span className="ml-2">Search</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Esc</kbd>
                                    <span className="ml-2">Close Modal</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center space-x-2 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-pink-300 transition-all duration-300 group"
                        >
                            <FiRefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                        
                        <button
                            onClick={exportToCSV}
                            className="flex items-center space-x-2 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-pink-300 transition-all duration-300 group"
                        >
                            <FiDownload className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span>Export CSV</span>
                        </button>
                        
                        <Link 
                            to="/admin/products/new" 
                            className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                        >
                            <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-medium">Add New Product</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                                <p className="text-gray-900 text-2xl font-bold">{analytics.totalProducts}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <FiPackage className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">In Stock</p>
                                <p className="text-green-600 text-2xl font-bold">{analytics.inStock}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <FiCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Low Stock</p>
                                <p className="text-yellow-600 text-2xl font-bold">{analytics.lowStock}</p>
                            </div>
                            <div className="bg-yellow-100 rounded-full p-3">
                                <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
                                <p className="text-red-600 text-2xl font-bold">{analytics.outOfStock}</p>
                            </div>
                            <div className="bg-red-100 rounded-full p-3">
                                <FiX className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                                <p className="text-gray-900 text-2xl font-bold">${analytics.totalValue.toFixed(2)}</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <FiDollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Avg Price</p>
                                <p className="text-gray-900 text-2xl font-bold">${analytics.avgPrice.toFixed(2)}</p>
                            </div>
                            <div className="bg-pink-100 rounded-full p-3">
                                <FiBarChart className="w-6 h-6 text-pink-600" />
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
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>

                            {/* Stock Filter */}
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="all">All Stock</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="disabled">Disabled</option>
                                <option value="featured">Featured</option>
                                <option value="new">New Arrivals</option>
                            </select>

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="price">Sort by Price</option>
                                    <option value="stock">Sort by Stock</option>
                                    <option value="date">Sort by Date</option>
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
                                    className={`p-3 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-50'} transition-colors`}
                                    title="Grid View"
                                >
                                    <FiGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-gray-50'} transition-colors`}
                                    title="List View"
                                >
                                    <FiList className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Clear Filters */}
                            {(searchTerm || selectedCategory || stockFilter !== 'all' || statusFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('');
                                        setStockFilter('all');
                                        setStatusFilter('all');
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center"
                                    title="Clear all filters"
                                >
                                    <FiX className="w-4 h-4 mr-2" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedProducts.length > 0 && (
                        <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-pink-800 font-medium">
                                        {selectedProducts.length} product(s) selected
                                    </span>
                                    <button
                                        onClick={clearSelection}
                                        className="ml-4 text-pink-600 hover:text-pink-700 text-sm"
                                    >
                                        Clear selection
                                    </button>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handleBulkDelete}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                    >
                                        <FiTrash2 className="w-4 h-4 mr-2" />
                                        Delete Selected
                                    </button>
                                    <button
                                        onClick={exportToCSV}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                    >
                                        <FiDownload className="w-4 h-4 mr-2" />
                                        Export Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Grid/List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Products ({filteredAndSortedProducts.length})
                                </h2>
                                {filteredAndSortedProducts.length > 0 && (
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.length === filteredAndSortedProducts.length}
                                            onChange={(e) => e.target.checked ? selectAllProducts() : clearSelection()}
                                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Select All</span>
                                    </label>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={exportToCSV}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center"
                                >
                                    <FiDownload className="w-4 h-4 mr-2" />
                                    Export All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Display */}
                    <div className="p-6">
                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                                <Link
                                    to="/admin/products/new"
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center mx-auto w-fit"
                                >
                                    <FiPlus className="w-5 h-5 mr-2" />
                                    Add Your First Product
                                </Link>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' 
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                            }>
                                {filteredAndSortedProducts.map(product => {
                                    const stockStatus = getStockStatus(product.quantity);
                                    const StockIcon = stockStatus.icon;
                                    
                                    return (
                                        <div
                                            key={product.id}
                                            className={`group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                                viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                                            }`}
                                        >
                                            {/* Selection Checkbox */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => toggleProductSelection(product.id)}
                                                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                />
                                            </div>

                                            {viewMode === 'grid' ? (
                                                <>
                                                    {/* Product Image Placeholder */}
                                                    <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-center">
                                                                <FiPackage className="w-16 h-16 text-pink-400 mx-auto mb-2" />
                                                                <p className="text-pink-600 font-medium">No Image</p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Stock Status Badge */}
                                                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold border ${getStockColor(product.quantity)}`}>
                                                            <StockIcon className="w-3 h-3 inline mr-1" />
                                                            {product.quantity} in stock
                                                        </div>

                                                        {/* Status Badges */}
                                                        <div className="absolute top-3 left-3 flex flex-col space-y-1">
                                                            {product.bestseller && (
                                                                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                                                    <FiStar className="w-3 h-3 mr-1" />
                                                                    Featured
                                                                </span>
                                                            )}
                                                            {product.newArrival && (
                                                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                ${product.price?.toFixed(2) || '0.00'}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                ID: {product.id}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                                            <span>
                                                                Category: {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                                                            </span>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                                                            <button
                                                                onClick={() => handleQuickEdit(product)}
                                                                className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                                                            >
                                                                <FiSettings className="w-4 h-4 mr-2" />
                                                                Quick Edit
                                                            </button>
                                                            <Link
                                                                to={`/admin/products/edit/${product.id}`}
                                                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                                                            >
                                                                <FiEdit3 className="w-4 h-4 mr-2" />
                                                                Full Edit
                                                            </Link>
                                                            <Link
                                                                to={`/admin/products/${product.id}/comments`}
                                                                className="bg-green-50 hover:bg-green-100 text-green-600 py-2 px-3 rounded-lg transition-colors"
                                                            >
                                                                <FiUsers className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg transition-colors"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* List View */}
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        {/* Product Image */}
                                                        <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {product.images && product.images.length > 0 ? (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <FiPackage className="w-8 h-8 text-pink-400" />
                                                            )}
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-3">
                                                                <h3 className="font-bold text-gray-900 truncate">
                                                                    {product.name}
                                                                </h3>
                                                                {product.bestseller && (
                                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                                                        <FiStar className="w-3 h-3 mr-1" />
                                                                        Featured
                                                                    </span>
                                                                )}
                                                                {product.newArrival && (
                                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                                <span>{product.brand}</span>
                                                                <span>•</span>
                                                                <span>${product.price?.toFixed(2) || '0.00'}</span>
                                                                <span>•</span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStockColor(product.quantity)}`}>
                                                                    <StockIcon className="w-3 h-3 inline mr-1" />
                                                                    {product.quantity} in stock
                                                                </span>
                                                                <span>•</span>
                                                                <span>{categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleQuickEdit(product)}
                                                                className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-2 rounded-lg transition-colors"
                                                                title="Quick Edit"
                                                            >
                                                                <FiSettings className="w-4 h-4" />
                                                            </button>
                                                            <Link
                                                                to={`/admin/products/edit/${product.id}`}
                                                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                                                                title="Full Edit"
                                                            >
                                                                <FiEdit3 className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                to={`/admin/products/${product.id}/comments`}
                                                                className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition-colors"
                                                                title="Manage Comments"
                                                            >
                                                                <FiUsers className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                                                                title="Delete Product"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
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

            {/* Quick Edit Modal */}
            <QuickEditModal
                isOpen={showQuickEdit}
                onClose={() => setShowQuickEdit(false)}
                product={editingProduct}
                onSave={handleQuickSave}
                categories={categories}
            />
        </div>
    );
};

export default AdminProductsPage;

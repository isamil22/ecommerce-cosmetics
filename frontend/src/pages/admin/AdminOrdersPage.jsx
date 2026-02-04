import React, { useState, useEffect, useMemo } from 'react';
import {
    getAllOrders,
    deleteOrder,
    updateOrderStatus,
    getDeletedOrders,
    restoreOrder,
    exportOrders
} from '../../api/apiService';
import OrderFeedbackSection from '../../components/OrderFeedbackSection';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from '../../contexts/LanguageContext';

// Advanced Chart Components
const MiniChart = ({ data, type = 'line', color = 'blue' }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <polyline
                    fill="none"
                    stroke={`rgb(${type === 'line' ? '59, 130, 246' : '34, 197, 94'})`}
                    strokeWidth="2"
                    points={points}
                />
            </svg>
        </div>
    );
};

const StatusBadge = ({ status, count, percentage }) => {
    const { t } = useLanguage();
    return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${status === 'PREPARING' ? 'bg-yellow-400' :
                status === 'DELIVERING' ? 'bg-blue-400' :
                    status === 'DELIVERED' ? 'bg-green-400' :
                        'bg-red-400'
                }`}></div>
            <span className="text-sm font-medium text-gray-700">{t(`ordersPage.status_${status}`)}</span>
        </div>
        <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{count}</div>
            <div className="text-xs text-gray-500">{percentage}%</div>
        </div>
    </div>
    );
};

const OrderTimeline = ({ order }) => {
    const { t } = useLanguage();
    const timeline = [
        { status: 'PREPARING', label: t('ordersPage.timeline_placed'), time: order.createdAt, completed: true },
        { status: 'DELIVERING', label: t('ordersPage.timeline_transit'), time: order.status === 'DELIVERING' || order.status === 'DELIVERED' ? order.updatedAt : null, completed: order.status === 'DELIVERING' || order.status === 'DELIVERED' },
        { status: 'DELIVERED', label: t('ordersPage.timeline_delivered'), time: order.status === 'DELIVERED' ? order.updatedAt : null, completed: order.status === 'DELIVERED' }
    ];

    return (
        <div className="space-y-3">
            {timeline.map((item, index) => (
                <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                        {item.completed ? (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <span className="text-xs text-gray-600">{index + 1}</span>
                        )}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        {item.time && (
                            <p className="text-xs text-gray-500">{new Date(item.time).toLocaleString()}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const AdminOrdersPage = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [deletedOrders, setDeletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Enhanced state management
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const [activeOrdersRes, deletedOrdersRes] = await Promise.all([
                getAllOrders(),
                getDeletedOrders()
            ]);
            setOrders(activeOrdersRes.data);
            setDeletedOrders(deletedOrdersRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders.');
            toast.error('Failed to fetch orders.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced filtering and processing
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = showDeleted ? deletedOrders : orders;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.clientFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id?.toString().includes(searchTerm) ||
                order.phoneNumber?.includes(searchTerm) ||
                order.address?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Apply date filter
        if (dateFilter !== 'ALL') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'TODAY':
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
                case 'THIS_WEEK':
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
                case 'THIS_MONTH':
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
                    break;
                default:
                    break;
            }
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'clientFullName':
                    aValue = a.clientFullName?.toLowerCase() || '';
                    bValue = b.clientFullName?.toLowerCase() || '';
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    aValue = a.createdAt;
                    bValue = b.createdAt;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [orders, deletedOrders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder, showDeleted]);

    // Pagination
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

    // Advanced Statistics with Analytics
    const stats = useMemo(() => {
        const totalOrders = orders.length;
        const totalDeleted = deletedOrders.length;
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.orderItems?.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0) || 0);
        }, 0);

        const statusCounts = orders.reduce((counts, order) => {
            counts[order.status] = (counts[order.status] || 0) + 1;
            return counts;
        }, {});

        // Advanced analytics
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today.toDateString()).length;
        const yesterdayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === yesterday.toDateString()).length;
        const weekOrders = orders.filter(order => new Date(order.createdAt) >= lastWeek).length;
        const monthOrders = orders.filter(order => new Date(order.createdAt) >= lastMonth).length;

        // Revenue trends
        const revenueToday = orders.filter(order => new Date(order.createdAt).toDateString() === today.toDateString())
            .reduce((sum, order) => sum + (order.orderItems?.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0) || 0), 0);

        const revenueYesterday = orders.filter(order => new Date(order.createdAt).toDateString() === yesterday.toDateString())
            .reduce((sum, order) => sum + (order.orderItems?.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0) || 0), 0);

        // Customer insights
        const uniqueCustomers = new Set(orders.map(order => order.clientFullName)).size;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Generate sample chart data for demo
        const chartData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return orders.filter(order => new Date(order.createdAt).toDateString() === date.toDateString()).length;
        });

        const revenueChartData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return orders.filter(order => new Date(order.createdAt).toDateString() === date.toDateString())
                .reduce((sum, order) => sum + (order.orderItems?.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0) || 0), 0);
        });

        return {
            totalOrders,
            totalDeleted,
            totalRevenue,
            statusCounts,
            todayOrders,
            yesterdayOrders,
            weekOrders,
            monthOrders,
            revenueToday,
            revenueYesterday,
            uniqueCustomers,
            averageOrderValue,
            chartData,
            revenueChartData,
            orderGrowth: yesterdayOrders > 0 ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1) : 0,
            revenueGrowth: revenueYesterday > 0 ? ((revenueToday - revenueYesterday) / revenueYesterday * 100).toFixed(1) : 0
        };
    }, [orders, deletedOrders]);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    // Enhanced handler functions
    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(orderId);
                toast.success('Order deleted successfully!');
                fetchAllOrders();
            } catch (err) {
                toast.error('Failed to delete order.');
                console.error(err);
            }
        }
    };

    const handleRestoreOrder = async (orderId) => {
        try {
            await restoreOrder(orderId);
            toast.success('Order restored successfully!');
            fetchAllOrders();
        } catch (err) {
            toast.error('Failed to restore order.');
            console.error(err);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            toast.success('Order status updated!');
            fetchAllOrders();
        } catch (err) {
            toast.error('Failed to update order status.');
            console.error(err);
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        if (selectedOrders.length === 0) {
            toast.warn('Please select orders to update.');
            return;
        }

        if (window.confirm(`Are you sure you want to update ${selectedOrders.length} orders to ${status}?`)) {
            try {
                const promises = selectedOrders.map(orderId => updateOrderStatus(orderId, status));
                await Promise.all(promises);
                toast.success(`${selectedOrders.length} orders updated successfully!`);
                setSelectedOrders([]);
                fetchAllOrders();
            } catch (err) {
                toast.error('Failed to update some orders.');
                console.error(err);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedOrders.length === 0) {
            toast.warn('Please select orders to delete.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
            try {
                const promises = selectedOrders.map(orderId => deleteOrder(orderId));
                await Promise.all(promises);
                toast.success(`${selectedOrders.length} orders deleted successfully!`);
                setSelectedOrders([]);
                fetchAllOrders();
            } catch (err) {
                toast.error('Failed to delete some orders.');
                console.error(err);
            }
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedOrders(paginatedOrders.map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectOrder = (orderId, checked) => {
        if (checked) {
            setSelectedOrders(prev => [...prev, orderId]);
        } else {
            setSelectedOrders(prev => prev.filter(id => id !== orderId));
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setDateFilter('ALL');
        setSortBy('createdAt');
        setSortOrder('desc');
        setCurrentPage(1);
        setSelectedOrders([]);
    };

    const handleExport = async () => {
        try {
            const response = await exportOrders();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orders.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('Orders exported successfully!');
        } catch (err) {
            toast.error(t('ordersPage.errorExport'));
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PREPARING': return 'bg-yellow-100 text-yellow-800';
            case 'DELIVERING': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading and error states
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('ordersPage.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={fetchAllOrders}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                            <p className="text-gray-600 mt-1">{t('ordersPage.subtitle')}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleExport}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {t('ordersPage.export')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Advanced Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Stats Row */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">{t('ordersPage.totalOrders')}</p>
                                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                                    <div className="flex items-center mt-2">
                                        <svg className={`w-4 h-4 mr-1 ${stats.orderGrowth >= 0 ? 'text-green-300' : 'text-red-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d={stats.orderGrowth >= 0 ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"} clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{stats.orderGrowth}%</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <MiniChart data={stats.chartData} type="line" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">{t('ordersPage.totalRevenue')}</p>
                                    <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                                    <div className="flex items-center mt-2">
                                        <svg className={`w-4 h-4 mr-1 ${stats.revenueGrowth >= 0 ? 'text-green-300' : 'text-red-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d={stats.revenueGrowth >= 0 ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"} clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{stats.revenueGrowth}%</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-green-400 bg-opacity-30 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <MiniChart data={stats.revenueChartData} type="bar" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">{t('ordersPage.averageOrder')}</p>
                                    <p className="text-3xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
                                    <p className="text-purple-200 text-sm mt-2">{stats.uniqueCustomers} {t('ordersPage.uniqueCustomers')}</p>
                                </div>
                                <div className="w-16 h-16 bg-purple-400 bg-opacity-30 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ordersPage.status')}</h3>
                        <div className="space-y-3">
                            <StatusBadge
                                status="PREPARING"
                                count={stats.statusCounts.PREPARING || 0}
                                percentage={stats.totalOrders > 0 ? ((stats.statusCounts.PREPARING || 0) / stats.totalOrders * 100).toFixed(1) : 0}
                            />
                            <StatusBadge
                                status="DELIVERING"
                                count={stats.statusCounts.DELIVERING || 0}
                                percentage={stats.totalOrders > 0 ? ((stats.statusCounts.DELIVERING || 0) / stats.totalOrders * 100).toFixed(1) : 0}
                            />
                            <StatusBadge
                                status="DELIVERED"
                                count={stats.statusCounts.DELIVERED || 0}
                                percentage={stats.totalOrders > 0 ? ((stats.statusCounts.DELIVERED || 0) / stats.totalOrders * 100).toFixed(1) : 0}
                            />
                            <StatusBadge
                                status="CANCELED"
                                count={stats.statusCounts.CANCELED || 0}
                                percentage={stats.totalOrders > 0 ? ((stats.statusCounts.CANCELED || 0) / stats.totalOrders * 100).toFixed(1) : 0}
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.todayOrders}</div>
                        <div className="text-sm text-gray-600">{t('ordersPage.todaysOrders')}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.revenueToday)}</div>
                        <div className="text-sm text-gray-600">{t('ordersPage.revenueToday')}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.weekOrders}</div>
                        <div className="text-sm text-gray-600">{t('ordersPage.date_THIS_WEEK')}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.monthOrders}</div>
                        <div className="text-sm text-gray-600">{t('ordersPage.date_THIS_MONTH')}</div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            {/* Search */}
                            <div className="flex-1 min-w-64">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('ordersPage.searchPlaceholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">{t('ordersPage.status_ALL')}</option>
                                <option value="PREPARING">{t('ordersPage.status_PREPARING')}</option>
                                <option value="DELIVERING">{t('ordersPage.status_DELIVERING')}</option>
                                <option value="DELIVERED">{t('ordersPage.status_DELIVERED')}</option>
                                <option value="CANCELED">{t('ordersPage.status_CANCELLED')}</option>
                            </select>

                            {/* Date Filter */}
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">{t('ordersPage.date_ALL')}</option>
                                <option value="TODAY">{t('ordersPage.date_TODAY')}</option>
                                <option value="THIS_WEEK">{t('ordersPage.date_THIS_WEEK')}</option>
                                <option value="THIS_MONTH">{t('ordersPage.date_THIS_MONTH')}</option>
                            </select>

                            {/* Toggle Deleted Orders */}
                            <button
                                onClick={() => setShowDeleted(!showDeleted)}
                                className={`px-4 py-2 rounded-lg transition-colors ${showDeleted
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {showDeleted ? t('ordersPage.showActive') : t('ordersPage.showDeleted')}
                            </button>

                            {/* {t('ordersPage.resetFilters')} */}
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                {t('ordersPage.resetFilters')}
                            </button>
                        </div>

                        {/* Bulk Actions */}
                        {selectedOrders.length > 0 && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm text-blue-800">
                                    {selectedOrders.length} {t('ordersPage.selected')}
                                </span>
                                <div className="flex gap-2">
                                    <select
                                        onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                                        className="px-3 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">{t('ordersPage.updateStatus')}</option>
                                        <option value="PREPARING">{t('ordersPage.status_PREPARING')}</option>
                                        <option value="DELIVERING">{t('ordersPage.status_DELIVERING')}</option>
                                        <option value="DELIVERED">{t('ordersPage.status_DELIVERED')}</option>
                                        <option value="CANCELED">{t('ordersPage.status_CANCELLED')}</option>
                                    </select>
                                    {!showDeleted && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete Selected
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('id')}
                                    >
                                        <div className="flex items-center">
                                            {t('ordersPage.orderId')}
                                            {sortBy === 'id' && (
                                                <svg className={`w-4 h-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('clientFullName')}
                                    >
                                        <div className="flex items-center">
                                            {t('ordersPage.customer')}
                                            {sortBy === 'clientFullName' && (
                                                <svg className={`w-4 h-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact Info
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        <div className="flex items-center">
                                            Created
                                            {sortBy === 'createdAt' && (
                                                <svg className={`w-4 h-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            {sortBy === 'status' && (
                                                <svg className={`w-4 h-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedOrders.map((order) => {
                                    const orderTotal = order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.clientFullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.address}, {order.city}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {order.phoneNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {!showDeleted ? (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                                                    >
                                                        <option value="PREPARING">{t('ordersPage.status_PREPARING')}</option>
                                                        <option value="DELIVERING">{t('ordersPage.status_DELIVERING')}</option>
                                                        <option value="DELIVERED">{t('ordersPage.status_DELIVERED')}</option>
                                                        <option value="CANCELED">{t('ordersPage.status_CANCELLED')}</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(orderTotal)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    {showDeleted ? (
                                                        <button
                                                            onClick={() => handleRestoreOrder(order.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Restore Order"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDeleteOrder(order.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete Order"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(Math.ceil(filteredAndSortedOrders.length / itemsPerPage), currentPage + 1))}
                                disabled={currentPage >= Math.ceil(filteredAndSortedOrders.length / itemsPerPage)}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(currentPage - 1) * itemsPerPage + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{filteredAndSortedOrders.length}</span>{' '}
                                    results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: Math.ceil(filteredAndSortedOrders.length / itemsPerPage) }, (_, i) => i + 1)
                                        .filter(page => {
                                            const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
                                            return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                                        })
                                        .map((page, index, array) => (
                                            <React.Fragment key={page}>
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                        ...
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        ))}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(Math.ceil(filteredAndSortedOrders.length / itemsPerPage), currentPage + 1))}
                                        disabled={currentPage >= Math.ceil(filteredAndSortedOrders.length / itemsPerPage)}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Order Details Modal with Timeline */}
                {showOrderModal && selectedOrder && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-7xl shadow-2xl rounded-xl bg-white">
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Order Details - #{selectedOrder.id}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">Detailed order information and timeline</p>
                                    </div>
                                    <button
                                        onClick={() => setShowOrderModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* {t('ordersPage.customer')} & Order Info */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    {t('ordersPage.modal.clientInfo')}
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p><span className="font-medium text-gray-600">{t('ordersPage.modal.name')}</span> <span className="text-gray-900">{selectedOrder.clientFullName}</span></p>
                                                    <p><span className="font-medium text-gray-600">{t('ordersPage.modal.phone')}</span> <span className="text-gray-900">{selectedOrder.phoneNumber}</span></p>
                                                    <p><span className="font-medium text-gray-600">{t('ordersPage.modal.city')}</span> <span className="text-gray-900">{selectedOrder.city}</span></p>
                                                    <p><span className="font-medium text-gray-600">{t('ordersPage.modal.address')}</span> <span className="text-gray-900">{selectedOrder.address}</span></p>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    {t('ordersPage.modal.orderInfo')}
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p><span className="font-medium text-gray-600">{t('ordersPage.orderId')}:</span> <span className="text-gray-900">#{selectedOrder.id}</span></p>
                                                    <p><span className="font-medium text-gray-600">Status:</span>
                                                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                                            {selectedOrder.status}
                                                        </span>
                                                    </p>
                                                    <p><span className="font-medium text-gray-600">Created:</span> <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span></p>
                                                    {selectedOrder.couponCode && (
                                                        <p><span className="font-medium text-gray-600">{t('ordersPage.modal.coupon')}</span> <span className="text-gray-900 bg-yellow-100 px-2 py-1 rounded text-xs">{selectedOrder.couponCode}</span></p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Order Items */}
                                        <div className="bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                                            <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                                                <h4 className="font-semibold text-gray-900 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                    </svg>
                                                    {t('ordersPage.modal.orderItems')}
                                                </h4>
                                            </div>
                                            <div className="p-4">
                                                <div className="space-y-4">
                                                    {selectedOrder.orderItems?.map((item, index) => (
                                                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                            <img
                                                                src={item.imageUrl || 'https://placehold.co/80x80'}
                                                                alt={item.productName}
                                                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                                                                {item.variantName && (
                                                                    <div className="mt-1">
                                                                        {(() => {
                                                                            try {
                                                                                const parsed = JSON.parse(item.variantName);
                                                                                if (Array.isArray(parsed)) {
                                                                                    // It's a Pack layout
                                                                                    return (
                                                                                        <>
                                                                                            <p className="text-xs font-medium text-gray-500 mb-1">{t('ordersPage.modal.packContents')}</p>
                                                                                            <div className="flex -space-x-2 overflow-hidden">
                                                                                                {parsed.map((subItem, subIndex) => (
                                                                                                    <img
                                                                                                        key={subIndex}
                                                                                                        src={subItem.image}
                                                                                                        alt={subItem.name || 'Product'}
                                                                                                        title={subItem.name}
                                                                                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                                                                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                                                                    />
                                                                                                ))}
                                                                                            </div>
                                                                                        </>
                                                                                    );
                                                                                }
                                                                            } catch (e) {
                                                                                // Ignore parsing error, it's a regular string
                                                                            }

                                                                            // Default String Render
                                                                            return (
                                                                                <p className="text-xs text-gray-500">
                                                                                    <span className="font-medium">{t('ordersPage.modal.variant')}</span> {item.variantName}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center space-x-4 mt-1">
                                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                        {t('ordersPage.modal.qty')} {item.quantity}
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">× {formatCurrency(item.price)}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-lg font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                                        </div>
                                                    )) || <p className="text-sm text-gray-500 text-center py-4">{t('ordersPage.modal.noItems')}</p>}
                                                </div>

                                                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                                                    <div className="mt-6 pt-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-gray-600">{t('ordersPage.modal.subtotal')}</span>
                                                                <span className="font-medium">{formatCurrency(selectedOrder.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                                                            </div>
                                                            {selectedOrder.discountAmount > 0 && (
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-gray-600">{t('ordersPage.modal.discount')}</span>
                                                                    <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discountAmount)}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-gray-600">Shipping:</span>
                                                                <span className="font-medium text-gray-700">
                                                                    {selectedOrder.shippingCost > 0 ? formatCurrency(selectedOrder.shippingCost) : <span className="text-green-600">{t('ordersPage.modal.free')}</span>}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-xl font-bold pt-2 border-t">
                                                                <span className="text-gray-900">{t('ordersPage.modal.total')}</span>
                                                                <span className="text-blue-600">
                                                                    {formatCurrency(
                                                                        selectedOrder.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                                                                        - (selectedOrder.discountAmount || 0)
                                                                        + (selectedOrder.shippingCost || 0)
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Timeline & Actions */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                {t('ordersPage.modal.timeline')}
                                            </h4>
                                            <OrderTimeline order={selectedOrder} />
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                                {t('ordersPage.modal.quickActions')}
                                            </h5>
                                            <div className="space-y-2">
                                                {selectedOrder.status === 'PREPARING' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'DELIVERING')}
                                                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                                                    >
                                                        🚚 {t('ordersPage.modal.markDelivering')}
                                                    </button>
                                                )}
                                                {selectedOrder.status === 'DELIVERING' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'DELIVERED')}
                                                        className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
                                                    >
                                                        ✅ {t('ordersPage.modal.markDelivered')}
                                                    </button>
                                                )}
                                                {selectedOrder.status !== 'CANCELED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'CANCELED')}
                                                        className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                                                    >
                                                        ❌ {t('ordersPage.modal.cancelOrder')}
                                                    </button>
                                                )}
                                                {showDeleted && (
                                                    <button
                                                        onClick={() => handleRestore(selectedOrder.id)}
                                                        className="w-full px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-all duration-200 font-medium"
                                                    >
                                                        🔄 {t('ordersPage.modal.restoreOrder')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* {t('ordersPage.customer')} Feedback Section */}
                                        <OrderFeedbackSection orderId={selectedOrder.id} />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowOrderModal(false)}
                                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                    >
                                        {t('ordersPage.modal.close')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;

import React, { useState, useEffect } from 'react';
import {
    getAllOrders,
    deleteOrder,
    updateOrderStatus,
    getDeletedOrders,
    restoreOrder,
    exportOrders
} from '../../api/apiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [deletedOrders, setDeletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchAllOrders();
    }, []);

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
        if (window.confirm('Are you sure you want to restore this order?')) {
            try {
                await restoreOrder(orderId);
                toast.success('Order restored successfully!');
                fetchAllOrders();
            } catch (err) {
                toast.error('Failed to restore order.');
                console.error(err);
            }
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
            toast.error('Failed to export orders.');
            console.error(err);
        }
    };

    const renderOrderItems = (items) => {
        if (!items || items.length === 0) {
            return <p>No items in this order.</p>;
        }
        return (
            <div className="p-4 bg-gray-50">
                <h4 className="font-bold mb-2">Order Items:</h4>
                <ul className="list-disc list-inside">
                    {items.map(item => (
                        <li key={item.id} className="flex items-center text-sm mb-2">
                            {/* --- NEW --- Image tag added here */}
                            <img src={item.imageUrl || 'https://placehold.co/60x60'} alt={item.productName} className="w-12 h-12 object-cover rounded-md mr-4" />
                            <div>
                                <div>{item.productName}</div>
                                <div>Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Orders</h1>
                <button
                    onClick={handleExport}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Export Orders
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                <h2 className="text-xl font-semibold mb-3">Active Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border"></th>
                            <th className="px-4 py-2 border">Order ID</th>
                            <th className="px-4 py-2 border">Customer</th>
                            <th className="px-4 py-2 border">Address</th>
                            <th className="px-4 py-2 border">Phone</th>
                            <th className="px-4 py-2 border">Created At</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => {
                                            const newOrders = orders.map(o => o.id === order.id ? { ...o, expanded: !o.expanded } : o);
                                            setOrders(newOrders);
                                        }}
                                        >
                                            {order.expanded ? '-' : '+'}
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2">{order.id}</td>
                                    <td className="border px-4 py-2">{order.clientFullName}</td>
                                    <td className="border px-4 py-2">{order.address}, {order.city}</td>
                                    <td className="border px-4 py-2">{order.phoneNumber}</td>
                                    <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="border px-4 py-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="p-1 border rounded"
                                        >
                                            <option value="PREPARING">Preparing</option>
                                            <option value="DELIVERING">Delivering</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELED">Canceled</option>
                                        </select>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {order.expanded && (
                                    <tr>
                                        <td colSpan="8" className="border px-4 py-2">
                                            {renderOrderItems(order.orderItems)}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-100 shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Deleted Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border">Order ID</th>
                            <th className="px-4 py-2 border">Customer</th>
                            <th className="px-4 py-2 border">Address</th>
                            <th className="px-4 py-2 border">Created At</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deletedOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="border px-4 py-2">{order.id}</td>
                                <td className="border px-4 py-2">{order.clientFullName}</td>
                                <td className="border px-4 py-2">{order.address}, {order.city}</td>
                                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="border px-4 py-2">{order.status}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleRestoreOrder(order.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Restore
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminOrdersPage;
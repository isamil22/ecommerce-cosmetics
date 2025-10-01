import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const QuickEditModal = ({ isOpen, onClose, product, onSave, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        categoryId: '',
        bestseller: false,
        newArrival: false,
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                quantity: product.quantity || '',
                categoryId: product.categoryId || '',
                bestseller: product.bestseller || false,
                newArrival: product.newArrival || false,
                status: product.status || 'ACTIVE'
            });
            setErrors({});
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Product name must be at least 2 characters';
        }
        
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        } else if (formData.price > 999999) {
            newErrors.price = 'Price must be less than $999,999';
        }
        
        if (formData.quantity === '' || formData.quantity < 0) {
            newErrors.quantity = 'Quantity must be 0 or greater';
        } else if (formData.quantity > 999999) {
            newErrors.quantity = 'Quantity must be less than 999,999';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            await onSave(product.id, formData);
            toast.success('Product updated successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to update product');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            price: '',
            quantity: '',
            categoryId: '',
            bestseller: false,
            newArrival: false,
            status: 'ACTIVE'
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Quick Edit Product</h2>
                            <p className="text-pink-100 mt-1">Make quick changes to your product</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-pink-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            maxLength={100}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                                errors.name ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="Enter product name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <FiAlertTriangle className="w-4 h-4 mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Price and Quantity Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                max="999999"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                                    errors.price ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertTriangle className="w-4 h-4 mr-1" />
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="0"
                                max="999999"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                                    errors.quantity ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="0"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertTriangle className="w-4 h-4 mr-1" />
                                    {errors.quantity}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="DISABLED">Disabled</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="bestseller"
                                name="bestseller"
                                checked={formData.bestseller}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <label htmlFor="bestseller" className="ml-3 text-sm font-medium text-gray-700">
                                Featured Product
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="newArrival"
                                name="newArrival"
                                checked={formData.newArrival}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <label htmlFor="newArrival" className="ml-3 text-sm font-medium text-gray-700">
                                New Arrival
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuickEditModal;

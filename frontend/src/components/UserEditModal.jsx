import React, { useState, useEffect } from 'react';
import { updateUser } from '../api/apiService';
import { 
    FiX, FiUser, FiMail, FiShield, FiCheckCircle, 
    FiXCircle, FiPhone, FiImage, FiFileText, FiSave,
    FiEye, FiEyeOff
} from 'react-icons/fi';

const UserEditModal = ({ user, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'USER',
        emailConfirmation: false,
        isActive: true,
        phoneNumber: '',
        profileImageUrl: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                role: user.role || 'USER',
                emailConfirmation: user.emailConfirmation || false,
                isActive: user.isActive !== undefined ? user.isActive : true,
                phoneNumber: user.phoneNumber || '',
                profileImageUrl: user.profileImageUrl || '',
                notes: user.notes || ''
            });
            setError('');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateUser(user.id, formData);
            onSuccess('User updated successfully!');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <FiUser className="h-6 w-6 text-pink-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit User: {user?.fullName || user?.email}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FiUser className="inline mr-2" />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FiMail className="inline mr-2" />
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                    </div>

                    {/* Role and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FiShield className="inline mr-2" />
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="emailConfirmation"
                                    checked={formData.emailConfirmation}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData.emailConfirmation ? 'bg-green-600' : 'bg-gray-200'
                                }`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData.emailConfirmation ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                                    <FiCheckCircle className="mr-1" />
                                    Email Confirmed
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData.isActive ? 'bg-green-600' : 'bg-gray-200'
                                }`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                                    <FiEye className="mr-1" />
                                    Active
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FiPhone className="inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FiImage className="inline mr-2" />
                                Profile Image URL
                            </label>
                            <input
                                type="url"
                                name="profileImageUrl"
                                value={formData.profileImageUrl}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiFileText className="inline mr-2" />
                            Admin Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Add any notes about this user..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FiSave className="mr-2" />
                                    Update User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;

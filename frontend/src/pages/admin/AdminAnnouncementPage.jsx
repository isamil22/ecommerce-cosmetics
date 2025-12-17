import React, { useState, useEffect } from 'react';
import { getAnnouncement, updateAnnouncement } from '../../api/apiService';
import { FiBell, FiSave, FiEye, FiEyeOff, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiType, FiZap, FiUsers } from 'react-icons/fi';
import { usePermissions } from '../../contexts/PermissionContext';
import PermissionGuard from '../../components/PermissionGuard';

const AdminAnnouncementPage = () => {
    const [announcement, setAnnouncement] = useState({
        text: "شحن مجاني للطلبات فوق $50 / Free Shipping on Orders Over $50!",
        backgroundColor: "gradient",
        textColor: "#ffffff",
        enabled: true,
        animationType: "pulse",
        isSticky: false,
        fontWeight: "normal",
        showOnlineCounter: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [previewMode, setPreviewMode] = useState(true);

    const { hasPermission } = usePermissions();

    useEffect(() => {
        fetchAnnouncement();
    }, []);

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            const response = await getAnnouncement();
            if (response.data) {
                setAnnouncement(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch announcement:', error);
            setMessage('Failed to load announcement settings');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateAnnouncement(announcement);
            setMessage('Announcement updated successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Failed to update announcement:', error);
            setMessage('Failed to update announcement');
            setMessageType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setAnnouncement(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetMessage = () => {
        setMessage('');
        setMessageType('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading announcement settings...</p>
                </div>
            </div>
        );
    }

    return (
        <PermissionGuard anyPermissions={['ANNOUNCEMENT:VIEW', 'ANNOUNCEMENT:EDIT']}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiBell className="w-8 h-8 text-white animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                        Announcement Management
                                    </h1>
                                    <p className="text-gray-600 mt-2">Manage your site's announcement bar settings</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${previewMode
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {previewMode ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    {previewMode ? 'Hide Preview' : 'Show Preview'}
                                </button>
                                <button
                                    onClick={fetchAnnouncement}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-all"
                                >
                                    <FiRefreshCw className="w-4 h-4" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'success'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            {messageType === 'success' ?
                                <FiCheckCircle className="w-5 h-5" /> :
                                <FiAlertCircle className="w-5 h-5" />
                            }
                            <span>{message}</span>
                            <button onClick={resetMessage} className="ml-auto text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Settings Form */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <FiBell className="w-6 h-6 text-pink-500" />
                                Announcement Settings
                            </h2>

                            <div className="space-y-6">
                                {/* Enable/Disable */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Enable Announcement</h3>
                                        <p className="text-sm text-gray-600">Show or hide the announcement bar</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={announcement.enabled}
                                            onChange={(e) => handleInputChange('enabled', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                    </label>
                                </div>

                                {/* Text Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiType className="w-4 h-4 inline mr-2" />
                                        Announcement Text
                                    </label>
                                    <textarea
                                        value={announcement.text}
                                        onChange={(e) => handleInputChange('text', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                                        rows="3"
                                        placeholder="Enter your announcement text..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Supports both Arabic and English text</p>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiType className="w-4 h-4 inline mr-2" />
                                        Background Style
                                    </label>
                                    <select
                                        value={announcement.backgroundColor}
                                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    >
                                        <option value="gradient">Gradient (Pink to Purple to Blue)</option>
                                        <option value="#ef4444">Red</option>
                                        <option value="#3b82f6">Blue</option>
                                        <option value="#10b981">Green</option>
                                        <option value="#f59e0b">Yellow</option>
                                        <option value="#8b5cf6">Purple</option>
                                        <option value="#ec4899">Pink</option>
                                    </select>
                                </div>

                                {/* Text Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Text Color
                                    </label>
                                    <input
                                        type="color"
                                        value={announcement.textColor}
                                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                                        className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Animation Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiZap className="w-4 h-4 inline mr-2" />
                                        Animation Type
                                    </label>
                                    <select
                                        value={announcement.animationType}
                                        onChange={(e) => handleInputChange('animationType', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    >
                                        <option value="none">No Animation</option>
                                        <option value="pulse">Pulse</option>
                                        <option value="bounce">Bounce</option>
                                    </select>
                                </div>

                                {/* Online Counter */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <FiUsers className="w-4 h-4" />
                                            Show Online Counter
                                        </h3>
                                        <p className="text-sm text-gray-600">Display "X users online now"</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={announcement.showOnlineCounter}
                                            onChange={(e) => handleInputChange('showOnlineCounter', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                    </label>
                                </div>

                                {/* Sticky Position */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Sticky Position</h3>
                                        <p className="text-sm text-gray-600">Keep announcement bar at top when scrolling</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={announcement.isSticky}
                                            onChange={(e) => handleInputChange('isSticky', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                    </label>
                                </div>

                                {/* Save Button */}
                                <PermissionGuard anyPermissions={['ANNOUNCEMENT:EDIT']}>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="w-5 h-5" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </PermissionGuard>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <FiEye className="w-6 h-6 text-blue-500" />
                                Live Preview
                            </h2>

                            {previewMode ? (
                                <div className="space-y-4">
                                    {/* Preview Announcement Bar */}
                                    <div
                                        style={{
                                            background: announcement.backgroundColor === 'gradient'
                                                ? 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)'
                                                : announcement.backgroundColor,
                                            color: announcement.textColor
                                        }}
                                        className="text-center py-3 text-sm font-semibold relative overflow-hidden rounded-lg"
                                    >
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>

                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            <span className="text-lg animate-bounce">🎉</span>
                                            <span className={announcement.animationType === 'pulse' ? 'animate-pulse' : announcement.animationType === 'bounce' ? 'animate-bounce' : ''}>
                                                {announcement.text || 'Enter your announcement text...'}
                                            </span>
                                            <span className="text-lg animate-bounce">✨</span>

                                            {/* Live counter - only show if enabled */}
                                            {announcement.showOnlineCounter && (
                                                <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-xs">
                                                        {Math.floor(Math.random() * 50) + 20} متصل الآن / Online now
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">Preview Settings:</h3>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Status: {announcement.enabled ? 'Enabled' : 'Disabled'}</li>
                                            <li>• Background: {announcement.backgroundColor}</li>
                                            <li>• Animation: {announcement.animationType}</li>
                                            <li>• Online Counter: {announcement.showOnlineCounter ? 'Shown' : 'Hidden'}</li>
                                            <li>• Sticky: {announcement.isSticky ? 'Yes' : 'No'}</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FiEye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Click "Show Preview" to see how your announcement will look</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PermissionGuard>
    );
};

export default AdminAnnouncementPage;
import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../api/settingsService';
import { toast } from 'react-toastify';
import { FiFacebook, FiTarget, FiBarChart, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const SettingsPage = () => {
    const [pixelId, setPixelId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.facebookPixelId) {
                    setPixelId(settings.facebookPixelId);
                }
            } catch (err) {
                toast.error('Failed to load settings.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSettings({ facebookPixelId: pixelId });
            toast.success('Facebook Pixel settings saved successfully!');
        } catch (err) {
            toast.error('Failed to save settings. You must be an admin.');
        } finally {
            setIsSaving(false);
        }
    };

    const isValidPixelId = (id) => {
        return /^\d{15,16}$/.test(id);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Facebook Pixel settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                        <FiFacebook className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Facebook Pixel Configuration
                    </h1>
                    <p className="text-gray-600 text-lg">Configure your Facebook Pixel for advanced marketing analytics</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Status Banner */}
                    <div className={`px-6 py-4 ${pixelId ? 'bg-green-50 border-b border-green-200' : 'bg-yellow-50 border-b border-yellow-200'}`}>
                        <div className="flex items-center">
                            {pixelId ? (
                                <>
                                    <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <h3 className="text-green-800 font-semibold">Facebook Pixel Active</h3>
                                        <p className="text-green-600 text-sm">Your pixel is configured and tracking events</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                                    <div>
                                        <h3 className="text-yellow-800 font-semibold">Facebook Pixel Not Configured</h3>
                                        <p className="text-yellow-600 text-sm">Add your Pixel ID to start tracking user behavior</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Pixel ID Input Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FiTarget className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-800">Pixel Configuration</h2>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                                <label htmlFor="pixelId" className="block text-sm font-bold text-gray-700 mb-3">
                                    Facebook Pixel ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="pixelId"
                                        value={pixelId}
                                        onChange={(e) => setPixelId(e.target.value)}
                                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-lg font-mono transition-all duration-300 focus:outline-none ${
                                            pixelId && isValidPixelId(pixelId) 
                                                ? 'border-green-400 bg-green-50 focus:ring-green-500' 
                                                : pixelId && !isValidPixelId(pixelId)
                                                ? 'border-red-400 bg-red-50 focus:ring-red-500'
                                                : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                        placeholder="Enter your 15-16 digit Facebook Pixel ID"
                                    />
                                    {pixelId && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {isValidPixelId(pixelId) ? (
                                                <FiCheckCircle className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <FiAlertCircle className="w-6 h-6 text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Help Text */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-start">
                                        <FiInfo className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-600">
                                            This ID will be used to track user activity for marketing purposes and conversion optimization.
                                        </p>
                                    </div>
                                    {pixelId && !isValidPixelId(pixelId) && (
                                        <div className="flex items-start">
                                            <FiAlertCircle className="w-4 h-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                                            <p className="text-sm text-red-600">
                                                Please enter a valid 15-16 digit Facebook Pixel ID.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <FiBarChart className="w-6 h-6 text-purple-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-800">Tracking Features</h2>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                                    <h3 className="font-semibold text-pink-800 mb-2">📊 Page Views</h3>
                                    <p className="text-sm text-pink-600">Automatic tracking of all page visits</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                                    <h3 className="font-semibold text-blue-800 mb-2">🛒 Add to Cart</h3>
                                    <p className="text-sm text-blue-600">Track when users add products to cart</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-2">💳 Checkout</h3>
                                    <p className="text-sm text-green-600">Monitor checkout initiation events</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                                    <h3 className="font-semibold text-purple-800 mb-2">🎯 Purchases</h3>
                                    <p className="text-sm text-purple-600">Track completed transactions</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                onClick={() => setPixelId('')}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !pixelId || !isValidPixelId(pixelId)}
                                className={`px-8 py-3 font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    isSaving || !pixelId || !isValidPixelId(pixelId)
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                                }`}
                            >
                                {isSaving ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Facebook Pixel Settings'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

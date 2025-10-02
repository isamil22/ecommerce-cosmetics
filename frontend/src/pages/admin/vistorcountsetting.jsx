import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../api/visitorCountSettingService';
import { toast } from 'react-toastify';
import { FiUsers, FiSettings, FiEye, FiSave, FiRefreshCw } from 'react-icons/fi';

const VisitorCounterSettingsPage = () => {
    const [settings, setSettings] = useState({
        enabled: false,
        min: 10,
        max: 50,
    });
    const [originalSettings, setOriginalSettings] = useState({
        enabled: false,
        min: 10,
        max: 50,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                const newSettings = {
                    enabled: data.enabled || false,
                    min: parseInt(data.min, 10) || 10,
                    max: parseInt(data.max, 10) || 50,
                };
                setSettings(newSettings);
                setOriginalSettings(newSettings);
            } catch (err) {
                toast.error('Failed to load settings.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        // Check if settings have changed
        const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
        setHasChanges(changed);
    }, [settings, originalSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : parseInt(value) || 0;
        
        setSettings(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        
        // Validation
        if (settings.min >= settings.max) {
            toast.error('Minimum visitors must be less than maximum visitors.');
            return;
        }
        
        if (settings.min < 1 || settings.max < 1) {
            toast.error('Visitor counts must be at least 1.');
            return;
        }

        setIsSaving(true);
        try {
            const savedSettings = await saveSettings(settings);
            setOriginalSettings(savedSettings);
            setHasChanges(false);
            toast.success('Visitor counter settings saved successfully!');
        } catch (err) {
            toast.error('Failed to save settings. You must be an admin.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setSettings(originalSettings);
        setHasChanges(false);
        toast.info('Settings reset to original values.');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <FiRefreshCw className="w-5 h-5 animate-spin text-pink-600" />
                    <span className="text-gray-600">Loading visitor counter settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Visitor Counter</h1>
                    <p className="text-lg text-gray-600">Configure visitor counter display settings for your store</p>
                </div>

                {/* Main Settings Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <form onSubmit={handleSaveSettings} className="space-y-8">
                        {/* Enable/Disable Toggle */}
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-4">
                                <FiUsers className="w-6 h-6 text-gray-500" />
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="enabled"
                                        checked={settings.enabled}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        settings.enabled ? 'bg-pink-600' : 'bg-gray-200'
                                    }`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.enabled ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </div>
                                    <span className="ml-3 text-lg font-medium text-gray-900">
                                        Enable Visitor Counter
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Settings Fields */}
                        {settings.enabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Minimum Visitors */}
                                <div className="space-y-2">
                                    <label htmlFor="min" className="block text-sm font-semibold text-gray-700">
                                        Minimum Visitors
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="min"
                                            id="min"
                                            value={settings.min}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg"
                                            min="1"
                                            placeholder="Enter minimum visitors"
                                        />
                                        <FiUsers className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Maximum Visitors */}
                                <div className="space-y-2">
                                    <label htmlFor="max" className="block text-sm font-semibold text-gray-700">
                                        Maximum Visitors
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="max"
                                            id="max"
                                            value={settings.max}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg"
                                            min={settings.min + 1}
                                            placeholder="Enter maximum visitors"
                                        />
                                        <FiUsers className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Live Preview */}
                        {settings.enabled && (
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiEye className="w-5 h-5 text-pink-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Current visitor count:</span>
                                        <span className="text-2xl font-bold text-pink-600">
                                            {Math.floor((settings.min + settings.max) / 2)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Range: {settings.min} - {settings.max} visitors
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={!hasChanges || isSaving}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                                    hasChanges && !isSaving
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <FiRefreshCw className="w-5 h-5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-5 h-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                            
                            {hasChanges && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    <FiRefreshCw className="w-5 h-5" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>

                        {/* Status Indicator */}
                        {hasChanges && (
                            <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                                <FiSettings className="w-5 h-5" />
                                <span className="text-sm font-medium">You have unsaved changes</span>
                            </div>
                        )}
                    </form>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How it works</h3>
                    <ul className="text-blue-800 space-y-1">
                        <li>• Visitor counter displays a random number between your min and max values</li>
                        <li>• The number changes every 2-5 seconds to simulate real activity</li>
                        <li>• This creates urgency and social proof for your customers</li>
                        <li>• Only visible when enabled and on product/pack detail pages</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VisitorCounterSettingsPage;
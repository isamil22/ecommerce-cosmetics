import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../api/apiService';
import { toast } from 'react-toastify';
import {
    FiSettings, FiSave, FiRefreshCw, FiEye, FiEyeOff,
    FiMessageSquare, FiToggleRight, FiCheck
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const ReviewFormSettingsPage = () => {
    const { t } = useLanguage();
    const [settings, setSettings] = useState({
        reviewFormEnabled: true
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await getSettings();
            setSettings({
                reviewFormEnabled: response.reviewFormEnabled === 'true'
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error(t('reviewFormSettings.messages.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: checked
        }));
        setHasChanges(true);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await saveSettings({
                reviewFormEnabled: settings.reviewFormEnabled.toString()
            });
            setHasChanges(false);
            toast.success(t('reviewFormSettings.messages.saved'));
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error(t('reviewFormSettings.messages.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        fetchSettings();
        setHasChanges(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiRefreshCw className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <FiMessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{t('reviewFormSettingsPage.title')}</h1>
                            <p className="text-gray-600">{t('reviewFormSettingsPage.subtitle')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings Panel */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSaveSettings} className="space-y-8">
                            {/* Review Form Settings */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FiSettings className="w-6 h-6 text-gray-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">{t('reviewFormSettingsPage.configTitle')}</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Enable/Disable Review Form */}
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                {settings.reviewFormEnabled ? (
                                                    <FiEye className="w-6 h-6 text-green-600 mr-3" />
                                                ) : (
                                                    <FiEyeOff className="w-6 h-6 text-gray-400 mr-3" />
                                                )}
                                                <div>
                                                    <label htmlFor="reviewFormEnabled" className="text-lg font-medium text-gray-900">
                                                        {t('reviewFormSettingsPage.showReviewForm')}
                                                    </label>
                                                    <p className="text-sm text-gray-600">
                                                        {t('reviewFormSettingsPage.showReviewFormDesc')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="reviewFormEnabled"
                                                id="reviewFormEnabled"
                                                checked={settings.reviewFormEnabled}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                        </label>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                                            <FiEye className="w-5 h-5 mr-2" />
                                            {t('reviewFormSettingsPage.preview')}
                                        </h3>
                                        <div className="text-sm text-blue-800">
                                            {settings.reviewFormEnabled ? (
                                                <div className="flex items-center text-green-700">
                                                    <FiCheck className="w-4 h-4 mr-2" />
                                                    {t('reviewFormSettingsPage.visibleMsg')}
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-700">
                                                    <FiEyeOff className="w-4 h-4 mr-2" />
                                                    {t('reviewFormSettingsPage.hiddenMsg')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={!hasChanges}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiRefreshCw className="w-4 h-4" />
                                        <span>{t('reviewFormSettingsPage.reset')}</span>
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {hasChanges && (
                                        <span className="text-sm text-orange-600 font-medium">
                                            {t('reviewFormSettingsPage.unsavedChanges')}
                                        </span>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSaving || !hasChanges}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        {isSaving ? (
                                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <FiSave className="w-4 h-4" />
                                        )}
                                        <span>{isSaving ? t('reviewFormSettingsPage.saving') : t('reviewFormSettingsPage.save')}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Information Panel */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiSettings className="w-5 h-5 mr-2 text-pink-500" />
                                {t('reviewFormSettingsPage.quickInfo')}
                            </h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>{t('reviewFormSettingsPage.quickInfo1')}</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>{t('reviewFormSettingsPage.quickInfo2')}</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>{t('reviewFormSettingsPage.quickInfo3')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Current Status */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiToggleRight className="w-5 h-5 mr-2 text-green-500" />
                                {t('reviewFormSettingsPage.currentStatus')}
                            </h3>
                            <div className="flex items-center space-x-3">
                                {settings.reviewFormEnabled ? (
                                    <>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-green-700 font-medium">{t('reviewFormSettingsPage.enabled')}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-red-700 font-medium">{t('reviewFormSettingsPage.disabled')}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewFormSettingsPage;

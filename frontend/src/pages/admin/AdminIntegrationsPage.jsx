import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../api/settingsService';
import { toast } from 'react-toastify';
import { FiFacebook, FiCheckCircle, FiAlertCircle, FiInfo, FiLayers, FiActivity } from 'react-icons/fi';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminIntegrationsPage = () => {
    const { updateSettingsState } = useSiteSettings();
    const { t } = useLanguage();

    // Pixel State
    const [pixelId, setPixelId] = useState('');
    // Google Analytics State
    const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.facebookPixelId) {
                    setPixelId(settings.facebookPixelId);
                }
                if (settings.googleAnalyticsId) {
                    setGoogleAnalyticsId(settings.googleAnalyticsId);
                }
            } catch (err) {
                toast.error(t('integrationsPage.messages.loadFailed'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSavePixel = async () => {
        setIsSaving(true);
        try {
            await saveSettings({ facebookPixelId: pixelId });
            toast.success(t('integrationsPage.messages.pixelSaved'));
            updateSettingsState({ facebookPixelId: pixelId });
        } catch (err) {
            toast.error(t('integrationsPage.messages.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveGA = async () => {
        setIsSaving(true);
        try {
            await saveSettings({ googleAnalyticsId: googleAnalyticsId });
            toast.success(t('integrationsPage.messages.gaSaved'));
            updateSettingsState({ googleAnalyticsId: googleAnalyticsId });
        } catch (err) {
            toast.error(t('integrationsPage.messages.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const isValidPixelId = (id) => {
        return /^\d{15,16}$/.test(id);
    };

    const isValidGAId = (id) => {
        return /^G-[A-Z0-9]+$/.test(id);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{t('integrationsPage.title')}</h1>
                    <p className="text-gray-600 mt-2">{t('integrationsPage.subtitle')}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Status Banner */}
                    <div className={`px-6 py-4 ${pixelId ? 'bg-green-50 border-b border-green-200' : 'bg-yellow-50 border-b border-yellow-200'}`}>
                        <div className="flex items-center">
                            {pixelId ? (
                                <>
                                    <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <h3 className="text-green-800 font-semibold">{t('integrationsPage.facebookPixel.activeTitle')}</h3>
                                        <p className="text-green-600 text-sm">{t('integrationsPage.facebookPixel.activeDesc')}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                                    <div>
                                        <h3 className="text-yellow-800 font-semibold">{t('integrationsPage.facebookPixel.inactiveTitle')}</h3>
                                        <p className="text-yellow-600 text-sm">{t('integrationsPage.facebookPixel.inactiveDesc')}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FiFacebook className="mr-3 text-blue-600" />
                                {t('integrationsPage.facebookPixel.configTitle')}
                            </h2>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <label htmlFor="pixelId" className="block text-sm font-bold text-gray-700 mb-3">
                                    {t('integrationsPage.facebookPixel.label')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="pixelId"
                                        value={pixelId}
                                        onChange={(e) => setPixelId(e.target.value)}
                                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-lg font-mono transition-all duration-300 focus:outline-none ${pixelId && isValidPixelId(pixelId)
                                            ? 'border-green-400 bg-green-50 focus:ring-green-500'
                                            : pixelId && !isValidPixelId(pixelId)
                                                ? 'border-red-400 bg-red-50 focus:ring-red-500'
                                                : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder={t('integrationsPage.facebookPixel.placeholder')}
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
                                            {t('integrationsPage.facebookPixel.helpText')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-100 pt-8">
                            <button
                                onClick={() => setPixelId('')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleSavePixel}
                                disabled={isSaving || !pixelId || !isValidPixelId(pixelId)}
                                className={`px-8 py-3 font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSaving || !pixelId || !isValidPixelId(pixelId)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                                    }`}
                            >
                                {isSaving ? t('integrationsPage.actions.saving') : t('integrationsPage.actions.save')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
                    {/* Status Banner */}
                    <div className={`px-6 py-4 ${googleAnalyticsId ? 'bg-green-50 border-b border-green-200' : 'bg-yellow-50 border-b border-yellow-200'}`}>
                        <div className="flex items-center">
                            {googleAnalyticsId ? (
                                <>
                                    <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <h3 className="text-green-800 font-semibold">{t('integrationsPage.googleAnalytics.activeTitle')}</h3>
                                        <p className="text-green-600 text-sm">{t('integrationsPage.googleAnalytics.activeDesc')}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                                    <div>
                                        <h3 className="text-yellow-800 font-semibold">{t('integrationsPage.googleAnalytics.inactiveTitle')}</h3>
                                        <p className="text-yellow-600 text-sm">{t('integrationsPage.googleAnalytics.inactiveDesc')}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FiActivity className="mr-3 text-orange-600" />
                                {t('integrationsPage.googleAnalytics.configTitle')}
                            </h2>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <label htmlFor="googleAnalyticsId" className="block text-sm font-bold text-gray-700 mb-3">
                                    {t('integrationsPage.googleAnalytics.label')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="googleAnalyticsId"
                                        value={googleAnalyticsId}
                                        onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-lg font-mono transition-all duration-300 focus:outline-none ${googleAnalyticsId && isValidGAId(googleAnalyticsId)
                                            ? 'border-green-400 bg-green-50 focus:ring-green-500'
                                            : googleAnalyticsId && !isValidGAId(googleAnalyticsId)
                                                ? 'border-red-400 bg-red-50 focus:ring-red-500'
                                                : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder={t('integrationsPage.googleAnalytics.placeholder')}
                                    />
                                    {googleAnalyticsId && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {isValidGAId(googleAnalyticsId) ? (
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
                                            {t('integrationsPage.googleAnalytics.helpText')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-100 pt-8">
                            <button
                                onClick={() => setGoogleAnalyticsId('')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            >
                                {t('integrationsPage.actions.clear')}
                            </button>
                            <button
                                onClick={handleSaveGA}
                                disabled={isSaving || !googleAnalyticsId || !isValidGAId(googleAnalyticsId)}
                                className={`px-8 py-3 font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSaving || !googleAnalyticsId || !isValidGAId(googleAnalyticsId)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                                    }`}
                            >
                                {isSaving ? t('integrationsPage.actions.saving') : t('integrationsPage.actions.save')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminIntegrationsPage;

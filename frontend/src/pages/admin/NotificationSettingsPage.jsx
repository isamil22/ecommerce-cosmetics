import React, { useState, useEffect } from 'react';
import { notificationSettingsService } from '../../api/notificationSettingsService';
import { toast } from 'react-toastify';
import {
    FiBell,
    FiBellOff,
    FiSettings,
    FiSave,
    FiRefreshCw,
    FiCheckCircle,
    FiAlertCircle,
    FiEye,
    FiEyeOff,
    FiShoppingCart,
    FiUsers,
    FiClock,
    FiMapPin
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const NotificationSettingsPage = () => {
    const { t } = useLanguage();
    const [settings, setSettings] = useState({
        enabled: false,
        maxNotifications: 5,
        minIntervalSeconds: 8,
        maxIntervalSeconds: 15,
        showPurchaseNotifications: true,
        showViewingNotifications: true,
        showCartNotifications: true,
        position: 'bottom-left',
        notificationDurationSeconds: 5
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await notificationSettingsService.getSettings();
                setSettings(data);
                setOriginalSettings({ ...data });
            } catch (err) {
                toast.error(t('notificationSettings.messages.loadFailed'));
                console.error('Error loading settings:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [t]);

    // Check for changes
    useEffect(() => {
        if (originalSettings) {
            const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
            setHasChanges(changed);
        }
    }, [settings, originalSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked :
            type === 'number' ? parseInt(value, 10) : value;

        setSettings(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const validateSettings = () => {
        if (settings.maxNotifications < 1 || settings.maxNotifications > 20) {
            toast.error(t('notificationSettings.validation.maxNotifications'));
            return false;
        }
        if (settings.minIntervalSeconds < 1 || settings.minIntervalSeconds > 60) {
            toast.error(t('notificationSettings.validation.minInterval'));
            return false;
        }
        if (settings.maxIntervalSeconds < 1 || settings.maxIntervalSeconds > 60) {
            toast.error(t('notificationSettings.validation.maxInterval'));
            return false;
        }
        if (settings.minIntervalSeconds > settings.maxIntervalSeconds) {
            toast.error(t('notificationSettings.validation.intervalRange'));
            return false;
        }
        if (settings.notificationDurationSeconds < 1 || settings.notificationDurationSeconds > 60) {
            toast.error(t('notificationSettings.validation.duration'));
            return false;
        }
        return true;
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();

        if (!validateSettings()) {
            return;
        }

        setIsSaving(true);
        try {
            await notificationSettingsService.saveSettings(settings);
            setOriginalSettings({ ...settings });
            setHasChanges(false);
            toast.success(t('notificationSettings.messages.saveSuccess'));
        } catch (err) {
            console.error('Error saving settings:', err);
            toast.error(t('notificationSettings.messages.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (originalSettings) {
            setSettings({ ...originalSettings });
            setHasChanges(false);
            toast.info(t('notificationSettings.messages.reset'));
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <FiRefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-600" />
                        <p className="text-gray-600">{t('notificationSettings.loading')}</p>
                    </div>
                </div>
            </div>
        );
    }

    const positionOptions = [
        { value: 'bottom-left', label: t('notificationSettings.config.position.bottomLeft') },
        { value: 'bottom-right', label: t('notificationSettings.config.position.bottomRight') },
        { value: 'top-left', label: t('notificationSettings.config.position.topLeft') },
        { value: 'top-right', label: t('notificationSettings.config.position.topRight') }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <FiBell className="w-8 h-8 mr-3 text-pink-600" />
                            {t('notificationSettings.title')}
                        </h1>
                        <p className="text-gray-600 mt-2">{t('notificationSettings.subtitle')}</p>
                    </div>
                    {hasChanges && (
                        <div className="flex items-center text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                            <FiAlertCircle className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">{t('notificationSettings.unsavedChanges')}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Settings Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <FiSettings className="w-6 h-6 mr-2" />
                            {t('notificationSettings.config.title')}
                        </h2>
                    </div>

                    <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
                        {/* Enable/Disable Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {settings.enabled ? (
                                        <FiBell className="w-6 h-6 text-green-600 mr-3" />
                                    ) : (
                                        <FiBellOff className="w-6 h-6 text-gray-400 mr-3" />
                                    )}
                                    <div>
                                        <label htmlFor="enabled" className="text-lg font-medium text-gray-900">
                                            {t('notificationSettings.config.enable')}
                                        </label>
                                        <p className="text-sm text-gray-600">
                                            {t('notificationSettings.config.enableDesc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enabled"
                                    id="enabled"
                                    checked={settings.enabled}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                            </label>
                        </div>

                        {/* Notification Settings */}
                        {settings.enabled && (
                            <div className="space-y-6">
                                {/* Max Notifications */}
                                <div>
                                    <label htmlFor="maxNotifications" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('notificationSettings.config.maxNotifications')}
                                    </label>
                                    <input
                                        type="number"
                                        name="maxNotifications"
                                        id="maxNotifications"
                                        value={settings.maxNotifications}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                        min="1"
                                        max="20"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('notificationSettings.config.maxNotificationsHelp')}</p>
                                </div>

                                {/* Interval Settings */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="minIntervalSeconds" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FiClock className="w-4 h-4 inline mr-1" />
                                            {t('notificationSettings.config.minInterval')}
                                        </label>
                                        <input
                                            type="number"
                                            name="minIntervalSeconds"
                                            id="minIntervalSeconds"
                                            value={settings.minIntervalSeconds}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                            min="1"
                                            max="60"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="maxIntervalSeconds" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FiClock className="w-4 h-4 inline mr-1" />
                                            {t('notificationSettings.config.maxInterval')}
                                        </label>
                                        <input
                                            type="number"
                                            name="maxIntervalSeconds"
                                            id="maxIntervalSeconds"
                                            value={settings.maxIntervalSeconds}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                            min="1"
                                            max="60"
                                        />
                                    </div>
                                </div>

                                {/* Notification Types */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">{t('notificationSettings.config.types.title')}</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <FiShoppingCart className="w-5 h-5 text-green-600 mr-3" />
                                                <div>
                                                    <label htmlFor="showPurchaseNotifications" className="font-medium text-gray-900">
                                                        {t('notificationSettings.config.types.purchase')}
                                                    </label>
                                                    <p className="text-sm text-gray-600">{t('notificationSettings.config.types.purchaseDesc')}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="showPurchaseNotifications"
                                                    id="showPurchaseNotifications"
                                                    checked={settings.showPurchaseNotifications}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <FiEye className="w-5 h-5 text-blue-600 mr-3" />
                                                <div>
                                                    <label htmlFor="showViewingNotifications" className="font-medium text-gray-900">
                                                        {t('notificationSettings.config.types.viewing')}
                                                    </label>
                                                    <p className="text-sm text-gray-600">{t('notificationSettings.config.types.viewingDesc')}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="showViewingNotifications"
                                                    id="showViewingNotifications"
                                                    checked={settings.showViewingNotifications}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <FiUsers className="w-5 h-5 text-orange-600 mr-3" />
                                                <div>
                                                    <label htmlFor="showCartNotifications" className="font-medium text-gray-900">
                                                        {t('notificationSettings.config.types.cart')}
                                                    </label>
                                                    <p className="text-sm text-gray-600">{t('notificationSettings.config.types.cartDesc')}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="showCartNotifications"
                                                    id="showCartNotifications"
                                                    checked={settings.showCartNotifications}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Position and Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FiMapPin className="w-4 h-4 inline mr-1" />
                                            {t('notificationSettings.config.position.title')}
                                        </label>
                                        <select
                                            name="position"
                                            id="position"
                                            value={settings.position}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                        >
                                            {positionOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="notificationDurationSeconds" className="block text-sm font-medium text-gray-700 mb-2">
                                            <FiClock className="w-4 h-4 inline mr-1" />
                                            {t('notificationSettings.config.duration')}
                                        </label>
                                        <input
                                            type="number"
                                            name="notificationDurationSeconds"
                                            id="notificationDurationSeconds"
                                            value={settings.notificationDurationSeconds}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                            min="1"
                                            max="60"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all ${!isSaving
                                    ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                        {t('notificationSettings.actions.saving')}
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-5 h-5 mr-2" />
                                        {t('notificationSettings.actions.save')}
                                    </>
                                )}
                            </button>

                            {hasChanges && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    {t('notificationSettings.actions.reset')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-green-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <FiEye className="w-6 h-6 mr-2" />
                            {t('notificationSettings.preview.title')}
                        </h2>
                    </div>

                    <div className="p-6">
                        {settings.enabled ? (
                            <div className="space-y-6">
                                {/* Preview Notification */}
                                <div className={`bg-white rounded-xl shadow-lg border-2 border-blue-200 p-4 ${settings.position.includes('left') ? 'mr-auto' : 'ml-auto'
                                    }`} style={{ maxWidth: '300px' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            <h3 className="font-bold text-gray-800 text-sm">{t('notificationSettings.preview.liveActivity')}</h3>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                                            👩
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">🛒</span>
                                                <span className="text-xs font-semibold text-gray-600">Morocco</span>
                                                <span className="text-xs text-gray-400">2 minutes ago</span>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-tight">
                                                <span className="font-medium">{t('notificationSettings.preview.someoneBought')}</span>
                                                <br />
                                                <span className="font-semibold text-pink-600">
                                                    "CosRX BHA Blackhead Power Liquid"
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Settings Summary */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-medium text-gray-900 mb-3">{t('notificationSettings.preview.currentSettings')}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('notificationSettings.preview.status')}:</span>
                                            <span className="text-green-600 font-medium flex items-center">
                                                <FiCheckCircle className="w-4 h-4 mr-1" />
                                                {t('notificationSettings.preview.enabled')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('notificationSettings.config.maxNotifications')}:</span>
                                            <span className="font-medium">{settings.maxNotifications}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('notificationSettings.config.minInterval')}:</span>
                                            <span className="font-medium">{settings.minIntervalSeconds}-{settings.maxIntervalSeconds}s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('notificationSettings.config.position.title')}:</span>
                                            <span className="font-medium">{settings.position}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('notificationSettings.config.duration')}:</span>
                                            <span className="font-medium">{settings.notificationDurationSeconds}s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('notificationSettings.preview.typesEnabled')}:</span>
                                            <span className="font-medium text-pink-600">
                                                {[settings.showPurchaseNotifications && t('notificationSettings.config.types.purchase'),
                                                settings.showViewingNotifications && t('notificationSettings.config.types.viewing'),
                                                settings.showCartNotifications && t('notificationSettings.config.types.cart')].filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FiBellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('notificationSettings.preview.disabled')}</h3>
                                <p className="text-gray-600">{t('notificationSettings.config.enableDesc')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettingsPage;


                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <FiEye className="w-5 h-5 text-blue-600 mr-3" />
                                            <div>
                                                <label htmlFor="showViewingNotifications" className="font-medium text-gray-900">
                                                    Viewing Notifications
                                                </label>
                                                <p className="text-sm text-gray-600">Show when customers view products</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="showViewingNotifications"
                                                id="showViewingNotifications"
                                                checked={settings.showViewingNotifications}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <FiUsers className="w-5 h-5 text-orange-600 mr-3" />
                                            <div>
                                                <label htmlFor="showCartNotifications" className="font-medium text-gray-900">
                                                    Cart Notifications
                                                </label>
                                                <p className="text-sm text-gray-600">Show when customers add items to cart</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="showCartNotifications"
                                                id="showCartNotifications"
                                                checked={settings.showCartNotifications}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                        </label>
                                    </div>
                                </div >
                            </div >

    {/* Position and Duration */ }
    < div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
                                <div>
                                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiMapPin className="w-4 h-4 inline mr-1" />
                                        Notification Position
                                    </label>
                                    <select
                                        name="position"
                                        id="position"
                                        value={settings.position}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                    >
                                        {positionOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="notificationDurationSeconds" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiClock className="w-4 h-4 inline mr-1" />
                                        Duration (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        name="notificationDurationSeconds"
                                        id="notificationDurationSeconds"
                                        value={settings.notificationDurationSeconds}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                                        min="1"
                                        max="60"
                                    />
                                </div>
                            </div >
                        </div >
                    )}

{/* Action Buttons */ }
<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
    <button
        type="submit"
        disabled={isSaving}
        className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all ${!isSaving
            ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
    >
        {isSaving ? (
            <>
                <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Saving...
            </>
        ) : (
            <>
                <FiSave className="w-5 h-5 mr-2" />
                Save Changes
            </>
        )}
    </button>

    {hasChanges && (
        <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
            Reset
        </button>
    )}
</div>
                </form >
            </div >

    {/* Live Preview */ }
    < div className = "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" >
                <div className="bg-gradient-to-r from-blue-500 to-green-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                        <FiEye className="w-6 h-6 mr-2" />
                        Live Preview
                    </h2>
                </div>

                <div className="p-6">
                    {settings.enabled ? (
                        <div className="space-y-6">
                            {/* Preview Notification */}
                            <div className={`bg-white rounded-xl shadow-lg border-2 border-blue-200 p-4 ${settings.position.includes('left') ? 'mr-auto' : 'ml-auto'
                                }`} style={{ maxWidth: '300px' }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <h3 className="font-bold text-gray-800 text-sm">Live Activity</h3>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                                        👩
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">🛒</span>
                                            <span className="text-xs font-semibold text-gray-600">Morocco</span>
                                            <span className="text-xs text-gray-400">2 minutes ago</span>
                                        </div>
                                        <p className="text-sm text-gray-800 leading-tight">
                                            <span className="font-medium">Someone just bought</span>
                                            <br />
                                            <span className="font-semibold text-pink-600">
                                                "CosRX BHA Blackhead Power Liquid"
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Settings Summary */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Current Settings</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="text-green-600 font-medium flex items-center">
                                            <FiCheckCircle className="w-4 h-4 mr-1" />
                                            Enabled
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Max Notifications:</span>
                                        <span className="font-medium">{settings.maxNotifications}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Interval:</span>
                                        <span className="font-medium">{settings.minIntervalSeconds}-{settings.maxIntervalSeconds}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Position:</span>
                                        <span className="font-medium">{settings.position}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="font-medium">{settings.notificationDurationSeconds}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Types Enabled:</span>
                                        <span className="font-medium text-pink-600">
                                            {[settings.showPurchaseNotifications && 'Purchase',
                                            settings.showViewingNotifications && 'Viewing',
                                            settings.showCartNotifications && 'Cart'].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FiBellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications Disabled</h3>
                            <p className="text-gray-600">Enable live notifications to see a preview here</p>
                        </div>
                    )}
                </div>
            </div >
        </div >
    </div >
);
};

export default NotificationSettingsPage;

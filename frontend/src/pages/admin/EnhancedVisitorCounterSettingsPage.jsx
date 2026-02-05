import React, { useState, useEffect } from 'react';
import { getEnhancedSettings, saveEnhancedSettings } from '../../api/enhancedVisitorCounterService';
import { toast } from 'react-toastify';
import {
    FiUsers, FiEye, FiCalendar, FiActivity,
    FiSettings, FiSave, FiRefreshCw, FiEye as FiPreview,
    FiGlobe, FiEdit, FiClock, FiToggleRight, FiTrendingUp
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const EnhancedVisitorCounterSettingsPage = () => {
    const { t } = useLanguage();
    const [settings, setSettings] = useState({
        // Current Viewers
        currentViewersEnabled: true,
        currentViewersMin: 5,
        currentViewersMax: 25,

        // Total Views
        totalViewsEnabled: true,
        totalViewsMin: 100,
        totalViewsMax: 500,

        // Added Today
        addedTodayEnabled: true,
        addedTodayMin: 1,
        addedTodayMax: 10,

        // Activity
        activityEnabled: true,
        activityMin: 20,
        activityMax: 80,

        // Display Settings
        showBilingualText: true,
        customTitle: 'Live Statistics',
        backgroundColor: '#f3f4f6',
        textColor: '#374151',
        borderColor: '#d1d5db',

        // Animation Settings
        enableAnimations: true,
        animationSpeed: 3000,
        enableFadeEffect: true,

        // Global Settings
        globalEnabled: true
    });

    const [originalSettings, setOriginalSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getEnhancedSettings();
                const newSettings = {
                    currentViewersEnabled: data.currentViewersEnabled || true,
                    currentViewersMin: data.currentViewersMin || 5,
                    currentViewersMax: data.currentViewersMax || 25,
                    totalViewsEnabled: data.totalViewsEnabled || true,
                    totalViewsMin: data.totalViewsMin || 100,
                    totalViewsMax: data.totalViewsMax || 500,
                    addedTodayEnabled: data.addedTodayEnabled || true,
                    addedTodayMin: data.addedTodayMin || 1,
                    addedTodayMax: data.addedTodayMax || 10,
                    activityEnabled: data.activityEnabled || true,
                    activityMin: data.activityMin || 20,
                    activityMax: data.activityMax || 80,
                    showBilingualText: data.showBilingualText !== false,
                    customTitle: data.customTitle || 'Live Statistics',
                    backgroundColor: data.backgroundColor || '#f3f4f6',
                    textColor: data.textColor || '#374151',
                    borderColor: data.borderColor || '#d1d5db',
                    enableAnimations: data.enableAnimations !== false,
                    animationSpeed: data.animationSpeed || 3000,
                    enableFadeEffect: data.enableFadeEffect !== false,
                    globalEnabled: data.globalEnabled !== false
                };
                setSettings(newSettings);
                setOriginalSettings(newSettings);
            } catch (err) {
                toast.error(t('enhancedVisitorCounter.messages.loadFailed'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [t]);

    useEffect(() => {
        const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
        setHasChanges(changed);
    }, [settings, originalSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked :
            type === 'number' ? parseInt(value) || 0 : value;

        setSettings(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();

        // Validation
        if (settings.currentViewersMin >= settings.currentViewersMax) {
            toast.error(t('enhancedVisitorCounter.validation.currentViewersRange'));
            return;
        }
        if (settings.totalViewsMin >= settings.totalViewsMax) {
            toast.error(t('enhancedVisitorCounter.validation.totalViewsRange'));
            return;
        }
        if (settings.addedTodayMin >= settings.addedTodayMax) {
            toast.error(t('enhancedVisitorCounter.validation.addedTodayRange'));
            return;
        }
        if (settings.activityMin >= settings.activityMax) {
            toast.error(t('enhancedVisitorCounter.validation.activityRange'));
            return;
        }

        setIsSaving(true);
        try {
            const savedSettings = await saveEnhancedSettings(settings);
            setOriginalSettings(savedSettings);
            setHasChanges(false);
            toast.success(t('enhancedVisitorCounter.messages.saveSuccess'));
        } catch (err) {
            toast.error(t('enhancedVisitorCounter.messages.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setSettings(originalSettings);
        setHasChanges(false);
        toast.info(t('enhancedVisitorCounter.messages.reset'));
    };

    const generateRandomValue = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <FiRefreshCw className="w-5 h-5 animate-spin text-pink-600" />
                    <span className="text-gray-600">{t('enhancedVisitorCounter.loading')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('enhancedVisitorCounter.title')}</h1>
                    <p className="text-lg text-gray-600">{t('enhancedVisitorCounter.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings Panel */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSaveSettings} className="space-y-8">
                            {/* Global Settings */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FiSettings className="w-6 h-6 text-gray-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">{t('enhancedVisitorCounter.globalSettings.title')}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center space-x-2">
                                            <FiToggleRight className="w-5 h-5 text-gray-500" />
                                            <span className="text-lg font-medium">{t('enhancedVisitorCounter.globalSettings.enableSystem')}</span>
                                        </label>
                                        <input
                                            type="checkbox"
                                            name="globalEnabled"
                                            checked={settings.globalEnabled}
                                            onChange={handleChange}
                                            className="h-6 w-11 rounded-full bg-gray-200 transition-colors focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('enhancedVisitorCounter.globalSettings.customTitle')}</label>
                                            <input
                                                type="text"
                                                name="customTitle"
                                                value={settings.customTitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                                placeholder={t('enhancedVisitorCounter.globalSettings.customTitlePlaceholder')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('enhancedVisitorCounter.globalSettings.animationSpeed')}</label>
                                            <input
                                                type="number"
                                                name="animationSpeed"
                                                value={settings.animationSpeed}
                                                onChange={handleChange}
                                                min="1000"
                                                max="10000"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metric Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Viewers */}
                                <MetricSettingsCard
                                    title={t('enhancedVisitorCounter.metrics.currentViewers.title')}
                                    subtitle={t('enhancedVisitorCounter.metrics.currentViewers.subtitle')}
                                    icon={<FiUsers className="w-6 h-6" />}
                                    color="orange"
                                    enabled={settings.currentViewersEnabled}
                                    min={settings.currentViewersMin}
                                    max={settings.currentViewersMax}
                                    onToggle={(checked) => handleChange({ target: { name: 'currentViewersEnabled', type: 'checkbox', checked } })}
                                    onMinChange={(value) => handleChange({ target: { name: 'currentViewersMin', type: 'number', value } })}
                                    onMaxChange={(value) => handleChange({ target: { name: 'currentViewersMax', type: 'number', value } })}
                                    previewValue={generateRandomValue(settings.currentViewersMin, settings.currentViewersMax)}
                                    t={t}
                                />

                                {/* Total Views */}
                                <MetricSettingsCard
                                    title={t('enhancedVisitorCounter.metrics.totalViews.title')}
                                    subtitle={t('enhancedVisitorCounter.metrics.totalViews.subtitle')}
                                    icon={<FiEye className="w-6 h-6" />}
                                    color="blue"
                                    enabled={settings.totalViewsEnabled}
                                    min={settings.totalViewsMin}
                                    max={settings.totalViewsMax}
                                    onToggle={(checked) => handleChange({ target: { name: 'totalViewsEnabled', type: 'checkbox', checked } })}
                                    onMinChange={(value) => handleChange({ target: { name: 'totalViewsMin', type: 'number', value } })}
                                    onMaxChange={(value) => handleChange({ target: { name: 'totalViewsMax', type: 'number', value } })}
                                    previewValue={generateRandomValue(settings.totalViewsMin, settings.totalViewsMax)}
                                    t={t}
                                />

                                {/* Added Today */}
                                <MetricSettingsCard
                                    title={t('enhancedVisitorCounter.metrics.addedToday.title')}
                                    subtitle={t('enhancedVisitorCounter.metrics.addedToday.subtitle')}
                                    icon={<FiCalendar className="w-6 h-6" />}
                                    color="yellow"
                                    enabled={settings.addedTodayEnabled}
                                    min={settings.addedTodayMin}
                                    max={settings.addedTodayMax}
                                    onToggle={(checked) => handleChange({ target: { name: 'addedTodayEnabled', type: 'checkbox', checked } })}
                                    onMinChange={(value) => handleChange({ target: { name: 'addedTodayMin', type: 'number', value } })}
                                    onMaxChange={(value) => handleChange({ target: { name: 'addedTodayMax', type: 'number', value } })}
                                    previewValue={generateRandomValue(settings.addedTodayMin, settings.addedTodayMax)}
                                    t={t}
                                />

                                {/* Activity */}
                                <MetricSettingsCard
                                    title={t('enhancedVisitorCounter.metrics.activity.title')}
                                    subtitle={t('enhancedVisitorCounter.metrics.activity.subtitle')}
                                    icon={<FiActivity className="w-6 h-6" />}
                                    color="green"
                                    enabled={settings.activityEnabled}
                                    min={settings.activityMin}
                                    max={settings.activityMax}
                                    onToggle={(checked) => handleChange({ target: { name: 'activityEnabled', type: 'checkbox', checked } })}
                                    onMinChange={(value) => handleChange({ target: { name: 'activityMin', type: 'number', value } })}
                                    onMaxChange={(value) => handleChange({ target: { name: 'activityMax', type: 'number', value } })}
                                    previewValue={generateRandomValue(settings.activityMin, settings.activityMax)}
                                    t={t}
                                />
                            </div>

                            {/* Display Settings */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FiEdit className="w-6 h-6 text-gray-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">{t('enhancedVisitorCounter.displaySettings.title')}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('enhancedVisitorCounter.displaySettings.backgroundColor')}</label>
                                        <input
                                            type="color"
                                            name="backgroundColor"
                                            value={settings.backgroundColor}
                                            onChange={handleChange}
                                            className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('enhancedVisitorCounter.displaySettings.textColor')}</label>
                                        <input
                                            type="color"
                                            name="textColor"
                                            value={settings.textColor}
                                            onChange={handleChange}
                                            className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('enhancedVisitorCounter.displaySettings.borderColor')}</label>
                                        <input
                                            type="color"
                                            name="borderColor"
                                            value={settings.borderColor}
                                            onChange={handleChange}
                                            className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={!hasChanges || isSaving}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-white transition-all ${hasChanges && !isSaving
                                                ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                                : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <FiRefreshCw className="w-5 h-5 animate-spin" />
                                                <span>{t('enhancedVisitorCounter.actions.saving')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="w-5 h-5" />
                                                <span>{t('enhancedVisitorCounter.actions.save')}</span>
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
                                            <span>{t('enhancedVisitorCounter.actions.reset')}</span>
                                        </button>
                                    )}
                                </div>

                                {hasChanges && (
                                    <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg mt-4">
                                        <FiSettings className="w-5 h-5" />
                                        <span className="text-sm font-medium">{t('enhancedVisitorCounter.messages.unsavedChanges')}</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                            <div className="flex items-center space-x-2 mb-6">
                                <FiPreview className="w-6 h-6 text-gray-500" />
                                <h3 className="text-xl font-bold text-gray-900">{t('enhancedVisitorCounter.preview.title')}</h3>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="ml-auto text-sm text-pink-600 hover:text-pink-700"
                                >
                                    {showPreview ? t('enhancedVisitorCounter.preview.hide') : t('enhancedVisitorCounter.preview.show')}
                                </button>
                            </div>

                            {showPreview && (
                                <div
                                    className="rounded-2xl p-6 border-2 shadow-lg"
                                    style={{
                                        backgroundColor: settings.backgroundColor,
                                        borderColor: settings.borderColor,
                                        color: settings.textColor
                                    }}
                                >
                                    <div className="text-center mb-6">
                                        <h4 className="text-xl font-bold mb-2 flex items-center justify-center space-x-2">
                                            <FiGlobe className="w-6 h-6 text-blue-600" />
                                            <span>{settings.customTitle}</span>
                                        </h4>
                                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {settings.currentViewersEnabled && (
                                            <PreviewMetricCard
                                                icon={<FiUsers className="w-5 h-5" />}
                                                title={settings.showBilingualText ? t('enhancedVisitorCounter.metrics.currentViewers.subtitle') : t('enhancedVisitorCounter.metrics.currentViewers.title')}
                                                value={generateRandomValue(settings.currentViewersMin, settings.currentViewersMax)}
                                                color="orange"
                                                animation="pulse"
                                                description={t('enhancedVisitorCounter.metrics.currentViewers.description')}
                                            />
                                        )}
                                        {settings.totalViewsEnabled && (
                                            <PreviewMetricCard
                                                icon={<FiEye className="w-5 h-5" />}
                                                title={settings.showBilingualText ? t('enhancedVisitorCounter.metrics.totalViews.subtitle') : t('enhancedVisitorCounter.metrics.totalViews.title')}
                                                value={generateRandomValue(settings.totalViewsMin, settings.totalViewsMax)}
                                                color="blue"
                                                animation="bounce"
                                                description={t('enhancedVisitorCounter.metrics.totalViews.description')}
                                            />
                                        )}
                                        {settings.addedTodayEnabled && (
                                            <PreviewMetricCard
                                                icon={<FiCalendar className="w-5 h-5" />}
                                                title={settings.showBilingualText ? t('enhancedVisitorCounter.metrics.addedToday.subtitle') : t('enhancedVisitorCounter.metrics.addedToday.title')}
                                                value={generateRandomValue(settings.addedTodayMin, settings.addedTodayMax)}
                                                color="yellow"
                                                animation="ping"
                                                description={t('enhancedVisitorCounter.metrics.addedToday.description')}
                                            />
                                        )}
                                        {settings.activityEnabled && (
                                            <PreviewMetricCard
                                                icon={<FiActivity className="w-5 h-5" />}
                                                title={settings.showBilingualText ? t('enhancedVisitorCounter.metrics.activity.subtitle') : t('enhancedVisitorCounter.metrics.activity.title')}
                                                value={generateRandomValue(settings.activityMin, settings.activityMax)}
                                                color="green"
                                                animation="pulse"
                                                description={t('enhancedVisitorCounter.metrics.activity.description')}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Metric Settings Card Component
const MetricSettingsCard = ({
    title, subtitle, icon, color, enabled, min, max,
    onToggle, onMinChange, onMaxChange, previewValue, t
}) => {
    const colorClasses = {
        orange: 'border-orange-200 bg-orange-50',
        blue: 'border-blue-200 bg-blue-50',
        yellow: 'border-yellow-200 bg-yellow-50',
        green: 'border-green-200 bg-green-50'
    };

    const dotColors = {
        orange: 'bg-orange-500',
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500'
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 border-2 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                </div>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                />
            </div>

            {enabled && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">{t('enhancedVisitorCounter.metrics.min')}</label>
                            <input
                                type="number"
                                value={min}
                                onChange={(e) => onMinChange(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">{t('enhancedVisitorCounter.metrics.max')}</label>
                            <input
                                type="number"
                                value={max}
                                onChange={(e) => onMaxChange(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                                min={min + 1}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${dotColors[color]}`}></div>
                        <span>{t('enhancedVisitorCounter.metrics.preview')}: {previewValue}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// PreviewMetricCard Component for settings preview (unchanged except for translation logic passed from parent)
const PreviewMetricCard = ({ icon, title, value, color, animation, description }) => {
    const colorClasses = {
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: 'text-orange-600',
            dot: 'bg-orange-500',
            value: 'text-orange-700'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'text-blue-600',
            dot: 'bg-blue-500',
            value: 'text-blue-700'
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: 'text-yellow-600',
            dot: 'bg-yellow-500',
            value: 'text-yellow-700'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'text-green-600',
            dot: 'bg-green-500',
            value: 'text-green-700'
        }
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        ping: 'animate-ping'
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div
            className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-md group`}
            title={description}
        >
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                    <div className={`${colors.icon} ${animationClasses[animation] || ''}`}>
                        {icon}
                    </div>
                </div>
                <div className={`w-3 h-3 ${colors.dot} rounded-full ${animationClasses[animation] || ''}`}></div>
            </div>

            <div className="space-y-1">
                <h5 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {title}
                </h5>
                <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${colors.value} transition-all duration-500`}>
                        {value}
                    </span>
                    <div className="flex space-x-1">
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`}></div>
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedVisitorCounterSettingsPage;
// Current Viewers
currentViewersEnabled: true,
    currentViewersMin: 5,
        currentViewersMax: 25,

            // Total Views
            totalViewsEnabled: true,
                totalViewsMin: 100,
                    totalViewsMax: 500,

                        // Added Today
                        addedTodayEnabled: true,
                            addedTodayMin: 1,
                                addedTodayMax: 10,

                                    // Activity
                                    activityEnabled: true,
                                        activityMin: 20,
                                            activityMax: 80,

                                                // Display Settings
                                                showBilingualText: true,
                                                    customTitle: 'Live Statistics',
                                                        backgroundColor: '#f3f4f6',
                                                            textColor: '#374151',
                                                                borderColor: '#d1d5db',

                                                                    // Animation Settings
                                                                    enableAnimations: true,
                                                                        animationSpeed: 3000,
                                                                            enableFadeEffect: true,

                                                                                // Global Settings
                                                                                globalEnabled: true
    });

const [originalSettings, setOriginalSettings] = useState({});
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [hasChanges, setHasChanges] = useState(false);
const [showPreview, setShowPreview] = useState(true);

useEffect(() => {
    const fetchSettings = async () => {
        try {
            const data = await getEnhancedSettings();
            const newSettings = {
                currentViewersEnabled: data.currentViewersEnabled || true,
                currentViewersMin: data.currentViewersMin || 5,
                currentViewersMax: data.currentViewersMax || 25,
                totalViewsEnabled: data.totalViewsEnabled || true,
                totalViewsMin: data.totalViewsMin || 100,
                totalViewsMax: data.totalViewsMax || 500,
                addedTodayEnabled: data.addedTodayEnabled || true,
                addedTodayMin: data.addedTodayMin || 1,
                addedTodayMax: data.addedTodayMax || 10,
                activityEnabled: data.activityEnabled || true,
                activityMin: data.activityMin || 20,
                activityMax: data.activityMax || 80,
                showBilingualText: data.showBilingualText !== false,
                customTitle: data.customTitle || 'Live Statistics',
                backgroundColor: data.backgroundColor || '#f3f4f6',
                textColor: data.textColor || '#374151',
                borderColor: data.borderColor || '#d1d5db',
                enableAnimations: data.enableAnimations !== false,
                animationSpeed: data.animationSpeed || 3000,
                enableFadeEffect: data.enableFadeEffect !== false,
                globalEnabled: data.globalEnabled !== false
            };
            setSettings(newSettings);
            setOriginalSettings(newSettings);
        } catch (err) {
            toast.error('Failed to load enhanced visitor counter settings.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchSettings();
}, []);

useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
}, [settings, originalSettings]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked :
        type === 'number' ? parseInt(value) || 0 : value;

    setSettings(prev => ({
        ...prev,
        [name]: newValue,
    }));
};

const handleSaveSettings = async (e) => {
    e.preventDefault();

    // Validation
    if (settings.currentViewersMin >= settings.currentViewersMax) {
        toast.error('Current viewers minimum must be less than maximum.');
        return;
    }
    if (settings.totalViewsMin >= settings.totalViewsMax) {
        toast.error('Total views minimum must be less than maximum.');
        return;
    }
    if (settings.addedTodayMin >= settings.addedTodayMax) {
        toast.error('Added today minimum must be less than maximum.');
        return;
    }
    if (settings.activityMin >= settings.activityMax) {
        toast.error('Activity minimum must be less than maximum.');
        return;
    }

    setIsSaving(true);
    try {
        const savedSettings = await saveEnhancedSettings(settings);
        setOriginalSettings(savedSettings);
        setHasChanges(false);
        toast.success('Enhanced visitor counter settings saved successfully!');
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

const generateRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center space-x-2">
                <FiRefreshCw className="w-5 h-5 animate-spin text-pink-600" />
                <span className="text-gray-600">Loading enhanced visitor counter settings...</span>
            </div>
        </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Enhanced Visitor Counter Management</h1>
                <p className="text-lg text-gray-600">Control every aspect of your visitor counter display</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings Panel */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSaveSettings} className="space-y-8">
                        {/* Global Settings */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <FiSettings className="w-6 h-6 text-gray-500" />
                                <h2 className="text-2xl font-bold text-gray-900">Global Settings</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2">
                                        <FiToggleRight className="w-5 h-5 text-gray-500" />
                                        <span className="text-lg font-medium">Enable Visitor Counter System</span>
                                    </label>
                                    <input
                                        type="checkbox"
                                        name="globalEnabled"
                                        checked={settings.globalEnabled}
                                        onChange={handleChange}
                                        className="h-6 w-11 rounded-full bg-gray-200 transition-colors focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Title</label>
                                        <input
                                            type="text"
                                            name="customTitle"
                                            value={settings.customTitle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="Live Statistics"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Animation Speed (ms)</label>
                                        <input
                                            type="number"
                                            name="animationSpeed"
                                            value={settings.animationSpeed}
                                            onChange={handleChange}
                                            min="1000"
                                            max="10000"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metric Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Viewers */}
                            <MetricSettingsCard
                                title="Current Viewers"
                                subtitle="مشاهد الآن / Viewing"
                                icon={<FiUsers className="w-6 h-6" />}
                                color="orange"
                                enabled={settings.currentViewersEnabled}
                                min={settings.currentViewersMin}
                                max={settings.currentViewersMax}
                                onToggle={(checked) => handleChange({ target: { name: 'currentViewersEnabled', type: 'checkbox', checked } })}
                                onMinChange={(value) => handleChange({ target: { name: 'currentViewersMin', type: 'number', value } })}
                                onMaxChange={(value) => handleChange({ target: { name: 'currentViewersMax', type: 'number', value } })}
                                previewValue={generateRandomValue(settings.currentViewersMin, settings.currentViewersMax)}
                            />

                            {/* Total Views */}
                            <MetricSettingsCard
                                title="Total Views"
                                subtitle="مشاهدة / Viewed"
                                icon={<FiEye className="w-6 h-6" />}
                                color="blue"
                                enabled={settings.totalViewsEnabled}
                                min={settings.totalViewsMin}
                                max={settings.totalViewsMax}
                                onToggle={(checked) => handleChange({ target: { name: 'totalViewsEnabled', type: 'checkbox', checked } })}
                                onMinChange={(value) => handleChange({ target: { name: 'totalViewsMin', type: 'number', value } })}
                                onMaxChange={(value) => handleChange({ target: { name: 'totalViewsMax', type: 'number', value } })}
                                previewValue={generateRandomValue(settings.totalViewsMin, settings.totalViewsMax)}
                            />

                            {/* Added Today */}
                            <MetricSettingsCard
                                title="Added Today"
                                subtitle="أضاف اليوم / Added today"
                                icon={<FiCalendar className="w-6 h-6" />}
                                color="yellow"
                                enabled={settings.addedTodayEnabled}
                                min={settings.addedTodayMin}
                                max={settings.addedTodayMax}
                                onToggle={(checked) => handleChange({ target: { name: 'addedTodayEnabled', type: 'checkbox', checked } })}
                                onMinChange={(value) => handleChange({ target: { name: 'addedTodayMin', type: 'number', value } })}
                                onMaxChange={(value) => handleChange({ target: { name: 'addedTodayMax', type: 'number', value } })}
                                previewValue={generateRandomValue(settings.addedTodayMin, settings.addedTodayMax)}
                            />

                            {/* Activity */}
                            <MetricSettingsCard
                                title="Activity Level"
                                subtitle="نشاط مديت / Activity"
                                icon={<FiActivity className="w-6 h-6" />}
                                color="green"
                                enabled={settings.activityEnabled}
                                min={settings.activityMin}
                                max={settings.activityMax}
                                onToggle={(checked) => handleChange({ target: { name: 'activityEnabled', type: 'checkbox', checked } })}
                                onMinChange={(value) => handleChange({ target: { name: 'activityMin', type: 'number', value } })}
                                onMaxChange={(value) => handleChange({ target: { name: 'activityMax', type: 'number', value } })}
                                previewValue={generateRandomValue(settings.activityMin, settings.activityMax)}
                            />
                        </div>

                        {/* Display Settings */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <FiEdit className="w-6 h-6 text-gray-500" />
                                <h2 className="text-2xl font-bold text-gray-900">Display Settings</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                                    <input
                                        type="color"
                                        name="backgroundColor"
                                        value={settings.backgroundColor}
                                        onChange={handleChange}
                                        className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                                    <input
                                        type="color"
                                        name="textColor"
                                        value={settings.textColor}
                                        onChange={handleChange}
                                        className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                                    <input
                                        type="color"
                                        name="borderColor"
                                        value={settings.borderColor}
                                        onChange={handleChange}
                                        className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={!hasChanges || isSaving}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold text-white transition-all ${hasChanges && !isSaving
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
                                            <span>Save All Settings</span>
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
                                        <span>Reset Changes</span>
                                    </button>
                                )}
                            </div>

                            {hasChanges && (
                                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg mt-4">
                                    <FiSettings className="w-5 h-5" />
                                    <span className="text-sm font-medium">You have unsaved changes</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <FiPreview className="w-6 h-6 text-gray-500" />
                            <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="ml-auto text-sm text-pink-600 hover:text-pink-700"
                            >
                                {showPreview ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {showPreview && (
                            <div
                                className="rounded-2xl p-6 border-2 shadow-lg"
                                style={{
                                    backgroundColor: settings.backgroundColor,
                                    borderColor: settings.borderColor,
                                    color: settings.textColor
                                }}
                            >
                                <div className="text-center mb-6">
                                    <h4 className="text-xl font-bold mb-2 flex items-center justify-center space-x-2">
                                        <FiGlobe className="w-6 h-6 text-blue-600" />
                                        <span>{settings.customTitle}</span>
                                    </h4>
                                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {settings.currentViewersEnabled && (
                                        <PreviewMetricCard
                                            icon={<FiUsers className="w-5 h-5" />}
                                            title={settings.showBilingualText ? "مشاهد الآن / Viewing" : "Viewing"}
                                            value={generateRandomValue(settings.currentViewersMin, settings.currentViewersMax)}
                                            color="orange"
                                            animation="pulse"
                                            description="People currently viewing"
                                        />
                                    )}
                                    {settings.totalViewsEnabled && (
                                        <PreviewMetricCard
                                            icon={<FiEye className="w-5 h-5" />}
                                            title={settings.showBilingualText ? "مشاهدة / Viewed" : "Viewed"}
                                            value={generateRandomValue(settings.totalViewsMin, settings.totalViewsMax)}
                                            color="blue"
                                            animation="bounce"
                                            description="Total page views"
                                        />
                                    )}
                                    {settings.addedTodayEnabled && (
                                        <PreviewMetricCard
                                            icon={<FiCalendar className="w-5 h-5" />}
                                            title={settings.showBilingualText ? "أضاف اليوم / Added today" : "Added today"}
                                            value={generateRandomValue(settings.addedTodayMin, settings.addedTodayMax)}
                                            color="yellow"
                                            animation="ping"
                                            description="New additions today"
                                        />
                                    )}
                                    {settings.activityEnabled && (
                                        <PreviewMetricCard
                                            icon={<FiActivity className="w-5 h-5" />}
                                            title={settings.showBilingualText ? "نشاط مديت / Activity" : "Activity"}
                                            value={generateRandomValue(settings.activityMin, settings.activityMax)}
                                            color="green"
                                            animation="pulse"
                                            description="Current activity level"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

// Metric Settings Card Component
const MetricSettingsCard = ({
    title, subtitle, icon, color, enabled, min, max,
    onToggle, onMinChange, onMaxChange, previewValue
}) => {
    const colorClasses = {
        orange: 'border-orange-200 bg-orange-50',
        blue: 'border-blue-200 bg-blue-50',
        yellow: 'border-yellow-200 bg-yellow-50',
        green: 'border-green-200 bg-green-50'
    };

    const dotColors = {
        orange: 'bg-orange-500',
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500'
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 border-2 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                </div>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                />
            </div>

            {enabled && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                            <input
                                type="number"
                                value={min}
                                onChange={(e) => onMinChange(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
                            <input
                                type="number"
                                value={max}
                                onChange={(e) => onMaxChange(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                                min={min + 1}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${dotColors[color]}`}></div>
                        <span>Preview: {previewValue}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// PreviewMetricCard Component for settings preview
const PreviewMetricCard = ({ icon, title, value, color, animation, description }) => {
    const colorClasses = {
        orange: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: 'text-orange-600',
            dot: 'bg-orange-500',
            value: 'text-orange-700'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'text-blue-600',
            dot: 'bg-blue-500',
            value: 'text-blue-700'
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: 'text-yellow-600',
            dot: 'bg-yellow-500',
            value: 'text-yellow-700'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'text-green-600',
            dot: 'bg-green-500',
            value: 'text-green-700'
        }
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        ping: 'animate-ping'
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div
            className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-md group`}
            title={description}
        >
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                    <div className={`${colors.icon} ${animationClasses[animation] || ''}`}>
                        {icon}
                    </div>
                </div>
                <div className={`w-3 h-3 ${colors.dot} rounded-full ${animationClasses[animation] || ''}`}></div>
            </div>

            <div className="space-y-1">
                <h5 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {title}
                </h5>
                <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${colors.value} transition-all duration-500`}>
                        {value}
                    </span>
                    <div className="flex space-x-1">
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`}></div>
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
                        <div className={`w-1 h-1 ${colors.dot} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedVisitorCounterSettingsPage;

import React, { useState, useEffect, useRef } from 'react';
import { getHero, updateHero } from '../../api/apiService';
import { toast } from 'react-toastify';
import {
    FiMonitor, FiSave, FiUpload, FiImage, FiEye, FiEdit3, FiRefreshCw,
    FiCheckCircle, FiAlertCircle, FiX, FiTrash2, FiZap, FiHeart,
    FiShield, FiSettings, FiPlus, FiArrowLeft, FiCamera, FiTarget,
    FiAlertTriangle, FiInfo, FiCheck, FiClock, FiStar, FiLink,
    FiType, FiFileText, FiGlobe, FiExternalLink, FiMaximize2,
    FiMinimize2, FiGrid, FiLayers, FiTag, FiBarChart
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminHeroPage = () => {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const [hero, setHero] = useState({ title: '', subtitle: '', linkText: '', linkUrl: '', titleFont: 'sans-serif' });
    const [image, setImage] = useState(null);
    const [mobileImage, setMobileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [mobileImagePreview, setMobileImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [mobileDragActive, setMobileDragActive] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [viewMode, setViewMode] = useState('form'); // 'form' or 'preview'

    useEffect(() => {
        const fetchHero = async () => {
            try {
                setLoading(true);
                const response = await getHero();
                setHero(response.data);
                if (response.data.imageUrl) {
                    setImagePreview(response.data.imageUrl);
                }
                if (response.data.mobileImageUrl) {
                    setMobileImagePreview(response.data.mobileImageUrl);
                }
            } catch (err) {
                setError(t('heroSettings.messages.loadFailed'));
                toast.error(t('heroSettings.messages.loadFailed'));
            } finally {
                setLoading(false);
            }
        };
        fetchHero();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (!isSubmitting) {
                    handleSubmit(e);
                }
            }
            // Ctrl/Cmd + P to toggle preview (only if not focused on input)
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                setShowPreview(!showPreview);
            }
            // Escape to clear errors
            if (e.key === 'Escape') {
                setError('');
                setSuccess('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSubmitting, showPreview]);

    // Warn user about unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHero(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (file) => {
        if (file) {
            setImage(file);
            setIsDirty(true);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageChange(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleImageChange(file);
            } else {
                toast.error(t('heroSettings.messages.validation.imageRequired'));
            }
        }
    }


    const handleMobileImageChange = (file) => {
        if (file) {
            setMobileImage(file);
            setIsDirty(true);
            const reader = new FileReader();
            reader.onload = (e) => setMobileImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMobileDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setMobileDragActive(true);
        } else if (e.type === 'dragleave') {
            setMobileDragActive(false);
        }
    };

    const handleMobileDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMobileDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) handleMobileImageChange(file);
            else toast.error(t('heroSettings.messages.validation.imageRequired'));
        }
    };

    const removeMobileImage = () => {
        setMobileImage(null);
        setMobileImagePreview('');
        setHero(prev => ({ ...prev, mobileImageUrl: null }));
        setIsDirty(true);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview('');
        setHero(prev => ({ ...prev, imageUrl: null }));
        setIsDirty(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!hero.title.trim()) {
            newErrors.title = t('heroSettings.messages.validation.titleRequired');
        } else if (hero.title.trim().length < 3) {
            newErrors.title = t('heroSettings.messages.validation.titleMinLength');
        }

        if (!hero.subtitle.trim()) {
            newErrors.subtitle = t('heroSettings.messages.validation.subtitleRequired');
        } else if (hero.subtitle.trim().length < 5) {
            newErrors.subtitle = t('heroSettings.messages.validation.subtitleMinLength');
        }

        if (!hero.linkText.trim()) {
            newErrors.linkText = t('heroSettings.messages.validation.linkTextRequired');
        }

        if (!hero.linkUrl.trim()) {
            newErrors.linkUrl = t('heroSettings.messages.validation.linkUrlRequired');
        } else if (!hero.linkUrl.startsWith('/') && !hero.linkUrl.startsWith('http')) {
            newErrors.linkUrl = t('heroSettings.messages.validation.linkUrlFormat');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('heroSettings.messages.validation.fixErrors'));
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('hero', new Blob([JSON.stringify(hero)], { type: 'application/json' }));

        if (image) {
            formData.append('image', image);
        }
        if (mobileImage) {
            formData.append('mobileImage', mobileImage);
        }

        setError('');
        setSuccess('');

        try {
            await updateHero(formData);

            // Force refresh hero data from server to get new image URLs
            const refreshedHero = await getHero();
            setHero(refreshedHero.data);

            // Update previews with new URLs (with cache-busting to force browser to fetch new images)
            if (refreshedHero.data.imageUrl) {
                setImagePreview(`${refreshedHero.data.imageUrl}?v=${Date.now()}`);
            }
            if (refreshedHero.data.mobileImageUrl) {
                setMobileImagePreview(`${refreshedHero.data.mobileImageUrl}?v=${Date.now()}`);
            }

            // Clear file inputs to prevent accidental re-upload
            setImage(null);
            setMobileImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setSuccess(t('heroSettings.messages.success'));
            toast.success(t('heroSettings.messages.success'));
            setIsDirty(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('heroSettings.messages.validation.saveFailed');
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="animate-pulse space-y-6">
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                                <div className="h-40 bg-gray-200 rounded-lg"></div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="animate-pulse space-y-4">
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                                <div className="h-8 bg-gray-200 rounded-lg"></div>
                                <div className="h-6 bg-gray-200 rounded-lg"></div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Enhanced Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FiMonitor className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-3">
                                <span>{t('heroSettings.pageTitle')}</span>
                                <FiZap className="w-8 h-8 text-yellow-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center space-x-2">
                                <FiHeart className="w-4 h-4 text-pink-500" />
                                <span>{t('heroSettings.pageSubtitle')}</span>
                            </p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+S</kbd>
                                    <span className="ml-2">{t('heroSettings.shortcuts.save')}</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+P</kbd>
                                    <span className="ml-2">{t('heroSettings.shortcuts.preview')}</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Esc</kbd>
                                    <span className="ml-2">{t('heroSettings.shortcuts.clear')}</span>
                                </span>
                                {isDirty && (
                                    <span className="flex items-center text-orange-600">
                                        <FiAlertTriangle className="w-4 h-4 mr-1" />
                                        <span>{t('heroSettings.shortcuts.unsaved')}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center space-x-2 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-purple-300 transition-all duration-300 group"
                        >
                            <FiEye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span>{showPreview ? t('heroSettings.shortcuts.hidePreview') : t('heroSettings.shortcuts.showPreview')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
                        <div className="flex items-center">
                            <FiAlertTriangle className="mr-2 animate-bounce" />
                            <span className="font-semibold">Error:</span>
                            <span className="ml-2">{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <FiCheckCircle className="mr-2" />
                            <span className="font-semibold">{t('brandSettings.success.saved')}:</span>
                            <span className="ml-2">{success}</span>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <FiEdit3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {t('heroSettings.title')}
                                    </h2>
                                    <p className="text-gray-600">
                                        {t('heroSettings.subtitle')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Title Field */}
                            <div>
                                <label htmlFor="title" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FiType className="w-5 h-5 text-pink-500" />
                                    <span>{t('heroSettings.form.title')}</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={hero.title}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-pink-300'
                                        }`}
                                    placeholder={t('heroSettings.form.titlePlaceholder')}
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FiAlertCircle className="w-4 h-4 mr-1" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Title Font Field */}
                            <div>
                                <label htmlFor="titleFont" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FiType className="w-5 h-5 text-gray-500" />
                                    <span>{t('heroSettings.form.titleFont')}</span>
                                </label>
                                <select
                                    name="titleFont"
                                    id="titleFont"
                                    value={hero.titleFont || 'sans-serif'}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:border-gray-300"
                                >
                                    <option value="sans-serif">{t('brandSettings.fontOptions.default')}</option>
                                    <option value="'Dancing Script', cursive">{t('brandSettings.fontOptions.dancingScript')}</option>
                                    <option value="'Playfair Display', serif">{t('brandSettings.fontOptions.playfairDisplay')}</option>
                                    <option value="'Great Vibes', cursive">{t('brandSettings.fontOptions.greatVibes')}</option>
                                    <option value="'Cinzel', serif">{t('brandSettings.fontOptions.cinzel')}</option>
                                    <option value="'Montserrat', sans-serif">{t('brandSettings.fontOptions.montserrat')}</option>
                                </select>
                            </div>

                            {/* Subtitle Field */}
                            <div>
                                <label htmlFor="subtitle" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FiFileText className="w-5 h-5 text-blue-500" />
                                    <span>{t('heroSettings.form.subtitle')}</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="subtitle"
                                    id="subtitle"
                                    value={hero.subtitle}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.subtitle ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    placeholder={t('heroSettings.form.subtitlePlaceholder')}
                                />
                                {errors.subtitle && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FiAlertCircle className="w-4 h-4 mr-1" />
                                        {errors.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Link Text Field */}
                            <div>
                                <label htmlFor="linkText" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FiTag className="w-5 h-5 text-green-500" />
                                    <span>{t('heroSettings.form.linkText')}</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="linkText"
                                    id="linkText"
                                    value={hero.linkText}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.linkText ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                        }`}
                                    placeholder={t('heroSettings.form.linkTextPlaceholder')}
                                />
                                {errors.linkText && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FiAlertCircle className="w-4 h-4 mr-1" />
                                        {errors.linkText}
                                    </p>
                                )}
                            </div>

                            {/* Link URL Field */}
                            <div>
                                <label htmlFor="linkUrl" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FiLink className="w-5 h-5 text-purple-500" />
                                    <span>{t('heroSettings.form.linkUrl')}</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="linkUrl"
                                    id="linkUrl"
                                    value={hero.linkUrl}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.linkUrl ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                    placeholder={t('heroSettings.form.linkUrlPlaceholder')}
                                />
                                {errors.linkUrl && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FiAlertCircle className="w-4 h-4 mr-1" />
                                        {errors.linkUrl}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Desktop Image Upload */}
                                <div>
                                    <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                        <FiMonitor className="w-5 h-5 text-indigo-500" />
                                        <span>{t('heroSettings.form.desktopBackground')}</span>
                                    </label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${dragActive
                                            ? 'border-pink-400 bg-pink-50'
                                            : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileInputChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Desktop preview" className="mx-auto max-h-32 rounded-lg shadow-lg" />
                                                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"><FiX className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <FiUpload className="w-8 h-8 text-pink-500 mx-auto" />
                                                <p className="text-sm font-medium text-gray-900">{t('heroSettings.form.dropDesktop')}</p>
                                                <p className="text-xs text-gray-500">{t('heroSettings.form.desktopRec')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Image Upload */}
                                <div>
                                    <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                        <FiTarget className="w-5 h-5 text-purple-500" />
                                        <span>{t('heroSettings.form.mobileBackground')}</span>
                                    </label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${mobileDragActive
                                            ? 'border-purple-400 bg-purple-50'
                                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                            }`}
                                        onDragEnter={handleMobileDrag}
                                        onDragLeave={handleMobileDrag}
                                        onDragOver={handleMobileDrag}
                                        onDrop={handleMobileDrop}
                                    >
                                        <input
                                            type="file"
                                            onChange={(e) => handleMobileImageChange(e.target.files[0])}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {mobileImagePreview ? (
                                            <div className="relative">
                                                <img src={mobileImagePreview} alt="Mobile preview" className="mx-auto max-h-32 rounded-lg shadow-lg" />
                                                <button type="button" onClick={removeMobileImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"><FiX className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <FiUpload className="w-8 h-8 text-purple-500 mx-auto" />
                                                <p className="text-sm font-medium text-gray-900">{t('heroSettings.form.dropMobile')}</p>
                                                <p className="text-xs text-gray-500">{t('heroSettings.form.mobileRec')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiRefreshCw className="w-5 h-5 animate-spin" />
                                            <span>{t('heroSettings.form.updating')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="w-5 h-5" />
                                            <span>{t('heroSettings.form.updateButton')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Preview Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiEye className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {t('heroSettings.preview.title')}
                                    </h2>
                                    <p className="text-gray-600">
                                        {t('heroSettings.preview.subtitle')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Preview */}
                        <div className="p-8">
                            <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl overflow-hidden min-h-80 flex items-center justify-center">
                                {/* Background Image */}
                                {imagePreview && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                        style={{ backgroundImage: `url(${imagePreview})` }}
                                    >
                                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative z-10 text-center px-8 py-12">
                                    <h1
                                        className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg"
                                        style={{ fontFamily: hero.titleFont || 'sans-serif' }}
                                    >
                                        {hero.title || 'Your Hero Title'}
                                    </h1>
                                    <p className="text-lg md:text-xl text-white mb-8 drop-shadow-lg max-w-2xl mx-auto">
                                        {hero.subtitle || 'Your hero subtitle will appear here'}
                                    </p>
                                    <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                                        {hero.linkText || 'Your Button Text'}
                                    </button>
                                </div>

                                {/* Preview Overlay */}
                                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                                    {t('heroSettings.preview.livePreviewBadge')}
                                </div>
                            </div>

                            {/* Preview Info */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <FiInfo className="w-4 h-4 mr-2 text-blue-500" />
                                    {t('heroSettings.preview.infoTitle')}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>{t('heroSettings.preview.titleLength')}:</span>
                                        <span>{hero.title.length} {t('heroSettings.preview.chars')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('heroSettings.preview.subtitleLength')}:</span>
                                        <span>{hero.subtitle.length} {t('heroSettings.preview.chars')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('heroSettings.preview.hasImage')}:</span>
                                        <span>{imagePreview ? t('heroSettings.preview.yes') : t('heroSettings.preview.no')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('heroSettings.preview.buttonUrl')}:</span>
                                        <span className="truncate max-w-32">{hero.linkUrl || t('heroSettings.preview.notSet')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHeroPage;
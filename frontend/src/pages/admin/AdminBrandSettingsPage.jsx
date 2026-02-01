import React, { useState, useEffect } from 'react';
import { getSettings, uploadLogo, saveSettings } from '../../api/settingsService';
import { toast } from 'react-toastify';
import { FiImage, FiUpload, FiCheckCircle } from 'react-icons/fi';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminBrandSettingsPage = () => {
    const { settings: globalSettings, updateSettingsState } = useSiteSettings();
    const { t } = useLanguage();

    // Logo State
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(globalSettings?.site_logo_url || '');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Text State
    // Text State
    const [siteTitle, setSiteTitle] = useState('');
    const [siteSubtitle, setSiteSubtitle] = useState('');
    const [siteTitleFont, setSiteTitleFont] = useState('sans-serif');
    const [isSavingDetails, setIsSavingDetails] = useState(false);

    const fontOptions = [
        { value: 'sans-serif', label: t('brandSettings.fontOptions.default') },
        { value: "'Dancing Script', cursive", label: t('brandSettings.fontOptions.dancingScript') },
        { value: "'Playfair Display', serif", label: t('brandSettings.fontOptions.playfairDisplay') },
        { value: "'Great Vibes', cursive", label: t('brandSettings.fontOptions.greatVibes') },
        { value: "'Cinzel', serif", label: t('brandSettings.fontOptions.cinzel') },
        { value: "'Montserrat', sans-serif", label: t('brandSettings.fontOptions.montserrat') },
    ];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.site_logo_url) {
                    setLogoPreview(settings.site_logo_url);
                }
                setSiteTitle(settings.site_title || '');
                setSiteSubtitle(settings.site_subtitle || '');
                setSiteTitleFont(settings.site_title_font || 'sans-serif');
            } catch (err) {
                toast.error(t('brandSettings.errors.loadSettings'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Effect to update logo preview if context changes (e.g. first load)
    useEffect(() => {
        if (globalSettings?.site_logo_url && !logoPreview) {
            setLogoPreview(globalSettings.site_logo_url);
        }
    }, [globalSettings]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveDetails = async () => {
        setIsSavingDetails(true);
        try {
            const settingsToSave = {
                site_title: siteTitle,
                site_subtitle: siteSubtitle,
                site_title_font: siteTitleFont
            };
            await saveSettings(settingsToSave);
            updateSettingsState(settingsToSave);
            toast.success(t('brandSettings.success.detailsSaved'));
        } catch (err) {
            toast.error(t('brandSettings.errors.saveDetails'));
            console.error(err);
        } finally {
            setIsSavingDetails(false);
        }
    };

    const handleUploadLogo = async () => {
        if (!logoFile) return;
        setIsUploading(true);
        try {
            const response = await uploadLogo(logoFile);
            const newUrl = response.url;
            toast.success(t('brandSettings.success.logoUploaded'));

            // Update Context to reflect change in Navbar immediately
            updateSettingsState({ site_logo_url: newUrl });
            setLogoFile(null); // Reset file input
        } catch (err) {
            toast.error(t('brandSettings.errors.uploadLogo'));
            console.error(err);
        } finally {
            setIsUploading(false);
        }
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
                    <h1 className="text-3xl font-bold text-gray-800">{t('brandSettings.title')}</h1>
                    <p className="text-gray-600 mt-2">{t('brandSettings.subtitle')}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FiImage className="mr-3 text-pink-600" />
                        {t('brandSettings.logoConfiguration')}
                    </h2>

                    <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                        <div className="mb-6 relative group">
                            {logoPreview ? (
                                <div className="relative">
                                    <img
                                        src={logoPreview}
                                        alt="Site Logo"
                                        className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                                    />
                                </div>

                            ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl text-white text-3xl font-bold">
                                    BC
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                <label htmlFor="logo-upload" className="cursor-pointer">
                                    <FiUpload className="w-5 h-5 text-gray-600" />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4 w-full max-w-xs">
                            <label
                                htmlFor="logo-upload"
                                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-700 font-medium shadow-sm"
                            >
                                {logoFile ? logoFile.name : t('brandSettings.selectNewLogo')}
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoChange}
                                />
                            </label>

                            {logoFile && (
                                <button
                                    onClick={handleUploadLogo}
                                    disabled={isUploading}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold shadow-md hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            {t('brandSettings.uploading')}
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle />
                                            {t('brandSettings.saveLogo')}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        <p className="mt-6 text-sm text-gray-500">
                            {t('brandSettings.recommendedSize')}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FiImage className="mr-3 text-pink-600" />
                        {t('brandSettings.brandDetails')}
                    </h2>
                    <div className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('brandSettings.siteTitle')}
                            </label>
                            <input
                                type="text"
                                value={siteTitle}
                                onChange={(e) => setSiteTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="BeautyCosmetics"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('brandSettings.siteSubtitle')}
                            </label>
                            <input
                                type="text"
                                value={siteSubtitle}
                                onChange={(e) => setSiteSubtitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="متجر التجميل / Magasin de Beauté"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('brandSettings.titleFont')}
                            </label>
                            <select
                                value={siteTitleFont}
                                onChange={(e) => setSiteTitleFont(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                {fontOptions.map((font) => (
                                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                        {font.label}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                <p className="text-sm text-gray-500 mb-1">{t('brandSettings.preview')}</p>
                                <h3 className="text-2xl" style={{ fontFamily: siteTitleFont }}>
                                    {siteTitle || 'BeautyCosmetics'}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveDetails}
                            disabled={isSavingDetails}
                            className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold shadow-md hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                            {isSavingDetails ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    {t('brandSettings.saving')}
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle />
                                    {t('brandSettings.saveDetails')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBrandSettingsPage;

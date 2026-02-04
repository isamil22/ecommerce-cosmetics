import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomPack, getCustomPackById, updateCustomPack, getPackableProducts } from '../../api/apiService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import {
    FiPackage,
    FiEdit3,
    FiSave,
    FiSearch,
    FiFilter,
    FiCheck,
    FiX,
    FiPlus,
    FiMinus,
    FiDollarSign,
    FiPercent,
    FiEye,
    FiArrowLeft,
    FiSettings,
    FiAlertCircle,
    FiCheckCircle,
    FiInfo,
    FiGrid,
    FiList,
    FiRefreshCw,
    FiUpload,
    FiImage,
    FiTag,
    FiUsers,
    FiShoppingCart,
    FiStar,
    FiTrendingUp,
    FiShield,
    FiZap
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminCustomPackForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        minItems: '',
        maxItems: '',
        pricingType: 'FIXED',
        fixedPrice: '',
        discountRate: '',
        allowedProductIds: [],
        image: null,
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [packableProducts, setPackableProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showPreview, setShowPreview] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Always fetch packable products
                const productsResponse = await getPackableProducts();
                setPackableProducts(productsResponse.data);

                // If editing, fetch pack data
                if (isEditing) {
                    const packResponse = await getCustomPackById(id);
                    const packData = packResponse.data;
                    setFormData(packData);
                    setSelectedProducts(packData.allowedProductIds || []);
                }
            } catch (error) {
                toast.error('Failed to fetch data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                imageUrl: URL.createObjectURL(file)
            }));
            setIsDirty(true);
        }
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    newErrors.name = 'Pack name is required';
                } else if (value.trim().length < 3) {
                    newErrors.name = 'Pack name must be at least 3 characters';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'minItems':
                if (!value || parseInt(value) < 1) {
                    newErrors.minItems = 'Minimum items must be at least 1';
                } else {
                    delete newErrors.minItems;
                }
                break;
            case 'maxItems':
                if (!value || parseInt(value) < parseInt(formData.minItems || 1)) {
                    newErrors.maxItems = 'Maximum items must be greater than minimum items';
                } else {
                    delete newErrors.maxItems;
                }
                break;
            case 'fixedPrice':
                if (formData.pricingType === 'FIXED' && (!value || parseFloat(value) <= 0)) {
                    newErrors.fixedPrice = 'Fixed price must be greater than 0';
                } else {
                    delete newErrors.fixedPrice;
                }
                break;
            case 'discountRate':
                if (formData.pricingType === 'DYNAMIC' && (!value || parseFloat(value) <= 0 || parseFloat(value) >= 1)) {
                    newErrors.discountRate = 'Discount rate must be between 0 and 1 (e.g., 0.20 for 20%)';
                } else {
                    delete newErrors.discountRate;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProductToggle = (productId) => {
        setSelectedProducts(prev => {
            const newSelected = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];

            setFormData(prevForm => ({ ...prevForm, allowedProductIds: newSelected }));
            setIsDirty(true);
            return newSelected;
        });
    };

    const filteredProducts = packableProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculatePackValue = () => {
        if (selectedProducts.length === 0) return 0;
        return selectedProducts.reduce((total, productId) => {
            const product = packableProducts.find(p => p.id === productId);
            return total + (product ? parseFloat(product.price) : 0);
        }, 0);
    };

    const calculateDiscount = () => {
        if (formData.pricingType === 'FIXED') {
            const totalValue = calculatePackValue();
            const fixedPrice = parseFloat(formData.fixedPrice || 0);
            return totalValue > 0 ? ((totalValue - fixedPrice) / totalValue * 100).toFixed(1) : 0;
        } else {
            return (parseFloat(formData.discountRate || 0) * 100).toFixed(1);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Pack name is required';
        }

        if (!formData.minItems || parseInt(formData.minItems) < 1) {
            newErrors.minItems = 'Minimum items must be at least 1';
        }

        if (!formData.maxItems || parseInt(formData.maxItems) < parseInt(formData.minItems || 1)) {
            newErrors.maxItems = 'Maximum items must be greater than minimum items';
        }

        if (formData.pricingType === 'FIXED' && (!formData.fixedPrice || parseFloat(formData.fixedPrice) <= 0)) {
            newErrors.fixedPrice = 'Fixed price must be greater than 0';
        }

        if (formData.pricingType === 'DYNAMIC' && (!formData.discountRate || parseFloat(formData.discountRate) <= 0 || parseFloat(formData.discountRate) >= 1)) {
            newErrors.discountRate = 'Discount rate must be between 0 and 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('minItems', formData.minItems);
            formDataToSend.append('maxItems', formData.maxItems);
            formDataToSend.append('pricingType', formData.pricingType);

            if (formData.pricingType === 'FIXED') {
                formDataToSend.append('fixedPrice', formData.fixedPrice);
            } else {
                formDataToSend.append('discountRate', formData.discountRate);
            }

            // Append allowed product IDs
            selectedProducts.forEach(id => {
                formDataToSend.append('allowedProductIds', id);
            });

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            if (isEditing) {
                await updateCustomPack(id, formDataToSend);
                toast.success(t('customPacks.form.success.updated'));
            } else {
                await createCustomPack(formDataToSend);
                toast.success(t('customPacks.form.success.created'));
            }
            navigate('/admin/custom-packs');
        } catch (error) {
            toast.error('Failed to save custom pack.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Navigation Bar */}
            <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/admin/custom-packs')}
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors group"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">{t('customPacks.manageTitle')}</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center"
                        >
                            <FiEye className="w-4 h-4 mr-2" />
                            <span>{t('customPacks.form.quickActions')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 pb-10 pt-8 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <span className="text-gray-400">Custom Packs</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-pink-600">{isEditing ? t('customPacks.form.editTitle') : t('customPacks.form.createTitle')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiPackage className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                    <FiCheckCircle className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                                    <span>{isEditing ? t('customPacks.form.editTitle') : t('customPacks.form.createTitle')}</span>
                                    <FiZap className="w-8 h-8 text-pink-500 animate-pulse" />
                                </h1>
                                <p className="text-gray-600 mt-1 text-lg">
                                    {isEditing ? t('customPacks.form.editSubtitle') : t('customPacks.form.createSubtitle')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {isDirty && (
                                <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                                    <FiSave className="w-4 h-4" />
                                    <span className="text-sm font-medium">Unsaved changes</span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                            >
                                <FiEye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                <span className="font-medium">Preview</span>
                            </button>
                        </div>
                    </div>
                    </div>
                </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <FiPackage className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{t('customPacks.form.basicInfo')}</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('customPacks.form.packName')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-100 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                                                }`}
                                            placeholder={t('customPacks.form.packNamePlaceholder')}
                                        />
                                        {errors.name && (
                                            <div className="flex items-center space-x-2 mt-2 text-red-600">
                                                <FiAlertCircle className="w-4 h-4" />
                                                <span className="text-sm">{errors.name}</span>
                                            </div>
                                        )}
                                    </div>


                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('customPacks.form.packImage')}
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-pink-500 transition-colors duration-200">
                                            <div className="space-y-1 text-center">
                                                {formData.imageUrl ? (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={formData.imageUrl}
                                                            alt="Pack preview"
                                                            className="h-48 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, image: null, imageUrl: '' }))}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <FiX className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                            <FiImage className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex text-sm text-gray-600 justify-center">
                                                            <label
                                                                htmlFor="image-upload"
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                                                            >
                                                                <span>{t('customPacks.form.uploadFile')}</span>
                                                                <input
                                                                    id="image-upload"
                                                                    name="image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="sr-only"
                                                                    onChange={handleImageChange}
                                                                />
                                                            </label>
                                                            <p className="pl-1">{t('customPacks.form.dragDrop')}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {t('customPacks.form.imageConstraints')}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('customPacks.form.description')} <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                                            placeholder={t('customPacks.form.descriptionPlaceholder')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pack Configuration Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                                        <FiSettings className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{t('customPacks.form.configuration')}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="minItems" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('customPacks.form.minItems')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="minItems"
                                                id="minItems"
                                                value={formData.minItems}
                                                onChange={handleChange}
                                                required
                                                min="1"
                                                className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-100 ${errors.minItems ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                                                    }`}
                                                placeholder="1"
                                            />
                                            <FiMinus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                        {errors.minItems && (
                                            <div className="flex items-center space-x-2 mt-2 text-red-600">
                                                <FiAlertCircle className="w-4 h-4" />
                                                <span className="text-sm">{errors.minItems}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="maxItems" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('customPacks.form.maxItems')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="maxItems"
                                                id="maxItems"
                                                value={formData.maxItems}
                                                onChange={handleChange}
                                                required
                                                min="1"
                                                className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-100 ${errors.maxItems ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                                                    }`}
                                                placeholder="10"
                                            />
                                            <FiPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                        {errors.maxItems && (
                                            <div className="flex items-center space-x-2 mt-2 text-red-600">
                                                <FiAlertCircle className="w-4 h-4" />
                                                <span className="text-sm">{errors.maxItems}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Configuration Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <FiDollarSign className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{t('customPacks.form.pricingConfig')}</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="pricingType" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('customPacks.form.pricingType')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${formData.pricingType === 'FIXED'
                                                ? 'border-pink-500 bg-pink-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="pricingType"
                                                    value="FIXED"
                                                    checked={formData.pricingType === 'FIXED'}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center space-x-3">
                                                    <FiDollarSign className="w-5 h-5 text-pink-600" />
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{t('customPacks.form.fixedPrice')}</div>
                                                        <div className="text-sm text-gray-600">{t('customPacks.form.fixedPriceDesc')}</div>
                                                    </div>
                                                </div>
                                            </label>

                                            <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${formData.pricingType === 'DYNAMIC'
                                                ? 'border-pink-500 bg-pink-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="pricingType"
                                                    value="DYNAMIC"
                                                    checked={formData.pricingType === 'DYNAMIC'}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center space-x-3">
                                                    <FiPercent className="w-5 h-5 text-pink-600" />
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{t('customPacks.form.dynamicDiscount')}</div>
                                                        <div className="text-sm text-gray-600">{t('customPacks.form.dynamicDiscountDesc')}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {formData.pricingType === 'FIXED' ? (
                                        <div>
                                            <label htmlFor="fixedPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                                                {t('customPacks.form.fixedPrice')} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="fixedPrice"
                                                    id="fixedPrice"
                                                    value={formData.fixedPrice}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-100 ${errors.fixedPrice ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                                                        }`}
                                                    placeholder="0.00"
                                                />
                                                <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            {errors.fixedPrice && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-600">
                                                    <FiAlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{errors.fixedPrice}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <label htmlFor="discountRate" className="block text-sm font-semibold text-gray-700 mb-2">
                                                {t('customPacks.form.discountRate')} (%) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="discountRate"
                                                    id="discountRate"
                                                    value={formData.discountRate}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    max="1"
                                                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-100 ${errors.discountRate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                                                        }`}
                                                    placeholder="0.20 (for 20% discount)"
                                                />
                                                <FiPercent className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">Enter as decimal (0.20 = 20% discount)</p>
                                            {errors.discountRate && (
                                                <div className="flex items-center space-x-2 mt-2 text-red-600">
                                                    <FiAlertCircle className="w-4 h-4" />
                                                    <span className="text-sm">{errors.discountRate}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Product Selection Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                            <FiShoppingCart className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800">{t('customPacks.form.productSelection')}</h2>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                                ? 'bg-pink-100 text-pink-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <FiGrid className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                                                ? 'bg-pink-100 text-pink-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <FiList className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-600 mb-4">
                                        Select products for this pack (leave empty to allow all packable products)
                                    </p>

                                    {/* Search Bar */}
                                    <div className="relative">
                                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('customPacks.form.searchPlaceholder')}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Product Grid/List */}
                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                                    {filteredProducts.length > 0 ? (
                                        <div className={`grid gap-4 ${viewMode === 'grid'
                                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                            : 'grid-cols-1'
                                            }`}>
                                            {filteredProducts.map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => handleProductToggle(product.id)}
                                                    className={`border-2 p-4 rounded-xl cursor-pointer transition-all duration-200 group ${selectedProducts.includes(product.id)
                                                        ? 'border-pink-500 bg-pink-50 shadow-lg transform scale-105'
                                                        : 'border-gray-200 hover:border-pink-300 hover:shadow-md hover:bg-white'
                                                        }`}
                                                >
                                                    <div className={`flex items-center space-x-4 ${viewMode === 'list' ? 'flex-row' : 'flex-col text-center'
                                                        }`}>
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedProducts.includes(product.id)}
                                                                onChange={() => handleProductToggle(product.id)}
                                                                className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                                            />
                                                            {selectedProducts.includes(product.id) && (
                                                                <FiCheck className="absolute -top-1 -right-1 w-3 h-3 text-pink-600 bg-white rounded-full" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1">
                                                            {product.images && product.images.length > 0 && (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className={`object-cover rounded-lg mb-3 ${viewMode === 'list'
                                                                        ? 'w-16 h-16'
                                                                        : 'w-20 h-20 mx-auto'
                                                                        }`}
                                                                />
                                                            )}
                                                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors duration-200">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-lg font-bold text-green-600">
                                                                ${product.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                {searchTerm ? 'No products found matching your search' : 'No packable products found'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Selection Summary */}
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{t('customPacks.form.selected')}: <strong>{selectedProducts.length}</strong></span>
                                    </div>

                                    {selectedProducts.length > 0 && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <FiDollarSign className="w-4 h-4 text-green-500" />
                                            <span>{t('customPacks.form.totalValue')}: <strong>${calculatePackValue().toFixed(2)}</strong></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || Object.keys(errors).length > 0}
                                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiRefreshCw className="w-5 h-5 animate-spin" />
                                            <span>{isEditing ? t('customPacks.form.updating') : t('customPacks.form.creating')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                            <span>{isEditing ? t('customPacks.form.update') : t('customPacks.form.create')}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar - Preview & Stats */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Pack Preview */}
                            {showPreview && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <FiEye className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-gray-800">Pack Preview</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <FiPackage className="w-10 h-10 text-white" />
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-lg">{formData.name || 'Pack Name'}</h4>
                                            <p className="text-gray-600 text-sm">{formData.description || 'Pack description...'}</p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Items Range:</span>
                                                <span className="font-semibold">{formData.minItems || 1} - {formData.maxItems || 10}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Pricing:</span>
                                                <span className="font-semibold">
                                                    {formData.pricingType === 'FIXED'
                                                        ? `$${formData.fixedPrice || '0.00'}`
                                                        : `${(parseFloat(formData.discountRate || 0) * 100).toFixed(1)}% off`
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Selected Products:</span>
                                                <span className="font-semibold">{selectedProducts.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pack Statistics */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <FiTrendingUp className="w-5 h-5 text-green-600" />
                                    <h3 className="text-lg font-bold text-gray-800">{t('customPacks.form.statistics')}</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <FiShoppingCart className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-gray-600">{t('customPacks.form.totalProducts')}</span>
                                        </div>
                                        <span className="font-bold text-gray-800">{packableProducts.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <FiCheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-600">{t('customPacks.form.selected')}</span>
                                        </div>
                                        <span className="font-bold text-gray-800">{selectedProducts.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <FiDollarSign className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-600">{t('customPacks.form.totalValue')}</span>
                                        </div>
                                        <span className="font-bold text-gray-800">${calculatePackValue().toFixed(2)}</span>
                                    </div>

                                    {selectedProducts.length > 0 && formData.pricingType && (
                                        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <FiPercent className="w-4 h-4 text-pink-600" />
                                                <span className="text-sm text-gray-600">{t('customPacks.form.savings')}</span>
                                            </div>
                                            <span className="font-bold text-pink-600">{calculateDiscount()}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <FiZap className="w-5 h-5 text-yellow-600" />
                                    <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProducts(packableProducts.map(p => p.id))}
                                        className="w-full flex items-center space-x-2 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
                                    >
                                        <FiCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                                        <span className="text-sm font-medium text-blue-800">Select All Products</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedProducts([])}
                                        className="w-full flex items-center space-x-2 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                                    >
                                        <FiX className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform duration-200" />
                                        <span className="text-sm font-medium text-gray-800">Clear Selection</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="w-full flex items-center space-x-2 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 group"
                                    >
                                        <FiRefreshCw className="w-4 h-4 text-purple-600 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="text-sm font-medium text-purple-800">Clear Search</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomPackForm;
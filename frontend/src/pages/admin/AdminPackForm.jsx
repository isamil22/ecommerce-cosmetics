// frontend/src/pages/admin/AdminPackForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPack, getAllProducts, getAllPacks } from '../../api/apiService';
import Loader from '../../components/Loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import {
    FiPackage,
    FiImage,
    FiPlus,
    FiX,
    FiCheck,
    FiAlertTriangle,
    FiSearch,
    FiFilter,
    FiSave,
    FiEye,
    FiUpload,
    FiTrash2,
    FiChevronDown
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminPackForm = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [allPacks, setAllPacks] = useState([]);
    const [packData, setPackData] = useState({
        name: '',
        description: '',
        price: '',
        items: [{ defaultProductId: '', variationProductIds: [] }],
        recommendedProductIds: [],
        recommendedPackIds: [],
        hideCommentForm: false,
        showPurchaseNotifications: true,
        showCountdownTimer: true,
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [isDirty, setIsDirty] = useState(false);
    const [autoSaveTimer, setAutoSaveTimer] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('AdminPackForm: Starting to fetch data...');
                const [productsResponse, packsResponse] = await Promise.all([
                    getAllProducts(),
                    getAllPacks()
                ]);

                console.log('AdminPackForm: API responses received:', {
                    productsResponse,
                    packsResponse
                });

                // Add defensive checks for API responses
                const productsList = productsResponse?.data?.content || productsResponse?.data || [];
                const packsList = packsResponse?.data || [];

                console.log('AdminPackForm: Processed data:', {
                    productsList,
                    packsList
                });

                // Ensure we have arrays
                if (!Array.isArray(productsList)) {
                    console.warn('Products response is not an array:', productsList);
                    setProducts([]);
                } else {
                    setProducts(productsList);
                }

                if (!Array.isArray(packsList)) {
                    console.warn('Packs response is not an array:', packsList);
                    setAllPacks([]);
                } else {
                    setAllPacks(packsList);
                }

                console.log('AdminPackForm: Data fetch completed successfully');
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                toast.error('Failed to fetch data. Please try again later.');
                console.error('Error fetching data:', err);
                // Set empty arrays as fallback
                setProducts([]);
                setAllPacks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    // Auto-save functionality
    useEffect(() => {
        if (isDirty) {
            const timer = setTimeout(() => {
                localStorage.setItem('packFormDraft', JSON.stringify(packData));
                toast.info('Form auto-saved', { autoClose: 1000 });
            }, 2000);
            setAutoSaveTimer(timer);
        }
        return () => {
            if (autoSaveTimer) clearTimeout(autoSaveTimer);
        };
    }, [packData, isDirty]);

    // Load draft on component mount
    useEffect(() => {
        const draft = localStorage.getItem('packFormDraft');
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                setPackData(parsedDraft);
                setIsDirty(true);
            } catch (err) {
                console.error('Failed to parse draft:', err);
            }
        }
    }, []);

    // Validation functions
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
            case 'price':
                if (!value || parseFloat(value) <= 0) {
                    newErrors.price = 'Valid price is required';
                } else {
                    delete newErrors.price;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPackData({ ...packData, [name]: value });
        setIsDirty(true);
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setIsDirty(true);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
                setIsDirty(true);
            } else {
                toast.error('Please drop a valid image file');
            }
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsDirty(true);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...packData.items];
        newItems[index][field] = value;
        setPackData({ ...packData, items: newItems });
        setIsDirty(true);
    };

    const addItem = () => {
        setPackData({
            ...packData,
            items: [...packData.items, { defaultProductId: '', variationProductIds: [] }],
        });
        setIsDirty(true);
    };

    const removeItem = (index) => {
        if (packData.items.length > 1) {
            const newItems = packData.items.filter((_, i) => i !== index);
            setPackData({ ...packData, items: newItems });
            setIsDirty(true);
        } else {
            toast.warning('At least one pack item is required');
        }
    };

    const clearDraft = () => {
        localStorage.removeItem('packFormDraft');
        setIsDirty(false);
        toast.success(t('packForm.success.draftCleared'));
    };

    const handleProductRecommendationToggle = (productId) => {
        const currentIds = Array.isArray(packData.recommendedProductIds) ? packData.recommendedProductIds : [];
        const newRecommendations = currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId];
        setPackData({ ...packData, recommendedProductIds: newRecommendations });
        setIsDirty(true);
    };

    const handlePackRecommendationToggle = (packId) => {
        const currentIds = Array.isArray(packData.recommendedPackIds) ? packData.recommendedPackIds : [];
        const newRecommendations = currentIds.includes(packId)
            ? currentIds.filter(id => id !== packId)
            : [...currentIds, packId];
        setPackData({ ...packData, recommendedPackIds: newRecommendations });
        setIsDirty(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!packData.name.trim()) {
            newErrors.name = t('packForm.validation.nameRequired');
        }

        if (!packData.price || parseFloat(packData.price) <= 0) {
            newErrors.price = t('packForm.validation.priceRequired');
        }

        for (let i = 0; i < packData.items.length; i++) {
            if (!packData.items[i].defaultProductId) {
                newErrors[`item_${i}`] = t('packForm.validation.itemDefaultRequired');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting');
            return;
        }

        const formData = new FormData();
        const description = packData.description;
        formData.append('pack', new Blob([JSON.stringify({
            ...packData,
            description,
            recommendedProductIds: packData.recommendedProductIds,
            recommendedPackIds: packData.recommendedPackIds
        })], { type: 'application/json' }));

        if (image) {
            formData.append('image', image);
        }

        setLoading(true);
        try {
            await createPack(formData);
            localStorage.removeItem('packFormDraft'); // Clear draft on success
            toast.success(t('packForm.success.created'));
            navigate('/admin/packs');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create pack. Please check the form fields.';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, name: t('packForm.steps.basicInfo'), icon: FiPackage },
        { id: 2, name: t('packForm.steps.packItems'), icon: FiPlus },
        { id: 3, name: t('packForm.steps.displaySettings'), icon: FiEye },
        { id: 4, name: t('packForm.steps.recommendations'), icon: FiFilter },
        { id: 5, name: t('packForm.steps.review'), icon: FiEye }
    ];

    // Custom Product Select Component with Images
    const ProductSelect = ({ value, onChange, placeholder, isMultiple = false, size = "normal", itemIndex = null }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const dropdownRef = useRef(null);

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen]);

        const filteredProducts = (Array.isArray(products) ? products : []).filter(product =>
            product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const selectedProducts = isMultiple
            ? (Array.isArray(products) ? products : []).filter(p => value && Array.isArray(value) && value.includes(p.id))
            : (Array.isArray(products) ? products : []).find(p => p.id === value);

        const handleSelect = (product) => {
            if (isMultiple) {
                const currentValue = Array.isArray(value) ? value : [];
                const newValue = currentValue.includes(product.id)
                    ? currentValue.filter(id => id !== product.id)
                    : [...currentValue, product.id];
                onChange(newValue);
            } else {
                onChange(product.id);
                setIsOpen(false);
            }
        };

        const getProductImage = (product) => {
            return product.images && product.images.length > 0
                ? product.images[0]
                : 'https://placehold.co/60x60/E91E63/FFFFFF?text=No+Image';
        };

        return (
            <div className="relative" ref={dropdownRef}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`cursor-pointer border rounded-lg bg-white hover:border-pink-400 transition-colors ${itemIndex !== null && errors[`item_${itemIndex}`] ? 'border-red-500' : 'border-gray-200'
                        } ${size === "small" ? 'px-3 py-2' : 'px-4 py-3'}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {isMultiple ? (
                                <div className="flex items-center space-x-2">
                                    {selectedProducts && selectedProducts.length > 0 ? (
                                        <>
                                            <div className="flex items-center space-x-1">
                                                {selectedProducts.slice(0, 2).map(product => (
                                                    <img
                                                        key={product.id}
                                                        src={getProductImage(product)}
                                                        alt={product.name}
                                                        className="w-6 h-6 rounded object-cover"
                                                    />
                                                ))}
                                                {selectedProducts.length > 2 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{selectedProducts.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                {selectedProducts.length} selected
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">{placeholder}</span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    {selectedProducts ? (
                                        <>
                                            <img
                                                src={getProductImage(selectedProducts)}
                                                alt={selectedProducts.name}
                                                className="w-8 h-8 rounded object-cover"
                                            />
                                            <span className="text-gray-700 truncate">
                                                {selectedProducts.name}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">{placeholder}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSelect(product)}
                                        className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${isMultiple && value && value.includes(product.id)
                                            ? 'bg-pink-50 border-l-4 border-pink-500'
                                            : ''
                                            }`}
                                    >
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ${product.price}
                                            </p>
                                        </div>
                                        {isMultiple && value && value.includes(product.id) && (
                                            <FiCheck className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No products found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Debug logging
    console.log('AdminPackForm render state:', {
        loading,
        products: products?.length || 0,
        allPacks: allPacks?.length || 0,
        error,
        packData
    });

    if (loading) {
        console.log('AdminPackForm: Showing loader...');
        return <Loader />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header with Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <FiPackage className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{t('packForm.createTitle')}</h2>
                            <p className="text-gray-600">{t('packForm.createSubtitle')}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isDirty && (
                            <span className="flex items-center text-sm text-orange-600">
                                <FiSave className="w-4 h-4 mr-1" />
                                {t('packForm.unsavedChanges')}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={clearDraft}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            {t('packForm.clearDraft')}
                        </button>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : isActive
                                        ? 'bg-pink-500 border-pink-500 text-white'
                                        : 'border-gray-300 text-gray-400'
                                    }`}>
                                    {isCompleted ? <FiCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-pink-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                    }`}>
                                    {step.name}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <FiAlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FiPackage className="w-5 h-5 text-pink-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pack Name */}
                        <div className="lg:col-span-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('packForm.basicInfo.name')} *
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={packData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                placeholder={t('packForm.basicInfo.namePlaceholder')}
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertTriangle className="w-4 h-4 mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('packForm.basicInfo.price')} *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    id="price"
                                    value={packData.price}
                                    onChange={handleInputChange}
                                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${errors.price ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertTriangle className="w-4 h-4 mr-1" />
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('packForm.basicInfo.image')}
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-pink-400'
                                    }`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {imagePreview ? (
                                    <div className="space-y-3">
                                        <img
                                            src={imagePreview}
                                            alt="Pack preview"
                                            className="mx-auto h-32 w-auto rounded-lg border p-1 bg-white"
                                        />
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1 text-sm bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                                            >
                                                <FiUpload className="w-4 h-4 inline mr-1" />
                                                Change
                                            </button>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4 inline mr-1" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <FiImage className="w-12 h-12 text-gray-400 mx-auto" />
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-pink-600 hover:text-pink-700 font-medium"
                                            >
                                                Click to upload
                                            </button>
                                            <p className="text-gray-500 text-sm">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hide Comment Form Toggle */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div>
                                    <label htmlFor="hideCommentForm" className="block text-sm font-semibold text-gray-700 mb-1">
                                        {t('packForm.basicInfo.hideComments')}
                                    </label>
                                    <p className="text-sm text-gray-600">
                                        {t('packForm.basicInfo.hideCommentsDesc')}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="hideCommentForm"
                                        name="hideCommentForm"
                                        checked={packData.hideCommentForm}
                                        onChange={(e) => {
                                            setPackData({ ...packData, hideCommentForm: e.target.checked });
                                            setIsDirty(true);
                                        }}
                                        className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Description */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FiEye className="w-5 h-5 text-pink-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{t('packForm.description.title')}</h3>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('packForm.description.label')}
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={packData.description || ''}
                            onChange={(value) => setPackData({ ...packData, description: value })}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    [{ 'align': [] }],
                                    ['link', 'image'],
                                    ['clean']
                                ]
                            }}
                            style={{ height: '250px', marginBottom: '50px' }}
                        />
                    </div>
                </div>

                {/* Step 3: Pack Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiPlus className="w-5 h-5 text-pink-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">{t('packForm.items.title')}</h3>
                        </div>
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            <FiPlus className="w-4 h-4 mr-2" />
                            {t('packForm.items.addItem')}
                        </button>
                    </div>

                    {/* Enhanced Product Selection Info */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                            <FiPackage className="w-5 h-5 text-blue-500 mr-2" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-800">{t('packForm.items.enhancedSelection')}</h4>
                                <p className="text-xs text-blue-600 mt-1">
                                    {t('packForm.items.enhancedDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Pack Items List */}
                    <div className="space-y-4">
                        {packData.items.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-md font-semibold text-gray-800">{t('packForm.items.itemTitle', { index: index + 1 })}</h4>
                                    {packData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Default Product */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('packForm.items.defaultProduct')} *
                                        </label>
                                        <ProductSelect
                                            value={item.defaultProductId}
                                            onChange={(value) => handleItemChange(index, 'defaultProductId', value)}
                                            placeholder={t('packForm.items.defaultPlaceholder')}
                                            isMultiple={false}
                                            size="normal"
                                            itemIndex={index}
                                        />
                                        {errors[`item_${index}`] && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                                <FiAlertTriangle className="w-4 h-4 mr-1" />
                                                {errors[`item_${index}`]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Variation Products */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t('packForm.items.variations')}
                                        </label>
                                        <ProductSelect
                                            value={item.variationProductIds || []}
                                            onChange={(value) => handleItemChange(index, 'variationProductIds', value)}
                                            placeholder={t('packForm.items.variationsPlaceholder')}
                                            isMultiple={true}
                                            size="normal"
                                            itemIndex={index}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Click to select multiple products</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 3: Display Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <FiEye className="w-5 h-5 text-pink-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{t('packForm.settings.title')}</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Purchase Notifications Toggle */}
                        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition bg-gray-50">
                            <input
                                type="checkbox"
                                checked={packData.showPurchaseNotifications || false}
                                onChange={(e) => {
                                    setPackData({ ...packData, showPurchaseNotifications: e.target.checked });
                                    setIsDirty(true);
                                }}
                                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                            />
                            <span className="ml-3 flex-1">
                                <span className="block font-semibold text-gray-800">🛍️ {t('packForm.settings.purchaseNotif')}</span>
                                <span className="text-sm text-gray-600">{t('packForm.settings.purchaseNotifDesc')}</span>
                            </span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${packData.showPurchaseNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {packData.showPurchaseNotifications ? t('packForm.settings.enabled') : t('packForm.settings.disabled')}
                            </span>
                        </label>

                        {/* Countdown Timer Toggle */}
                        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition bg-gray-50">
                            <input
                                type="checkbox"
                                checked={packData.showCountdownTimer || false}
                                onChange={(e) => {
                                    setPackData({ ...packData, showCountdownTimer: e.target.checked });
                                    setIsDirty(true);
                                }}
                                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                            />
                            <span className="ml-3 flex-1">
                                <span className="block font-semibold text-gray-800">⏱️ {t('packForm.settings.countdown')}</span>
                                <span className="text-sm text-gray-600">{t('packForm.settings.countdownDesc')}</span>
                            </span>
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${packData.showCountdownTimer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {packData.showCountdownTimer ? t('packForm.settings.enabled') : t('packForm.settings.disabled')}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Step 4: Recommendations Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-6">
                        <FiFilter className="w-5 h-5 text-pink-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{t('packForm.recommendations.title')}</h3>
                    </div>

                    {/* Info Box */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                            <FiPackage className="w-5 h-5 text-blue-500 mr-2" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-800">{t('packForm.recommendations.systemTitle')}</h4>
                                <p className="text-xs text-blue-600 mt-1">
                                    {t('packForm.recommendations.systemDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Recommendations */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4">
                                {t('packForm.recommendations.products')} ({Array.isArray(packData.recommendedProductIds) ? packData.recommendedProductIds.length : 0})
                            </h4>
                            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                                {(Array.isArray(products) ? products : []).length > 0 ? (
                                    (Array.isArray(products) ? products : []).map(product => (
                                        <label key={product.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Array.isArray(packData.recommendedProductIds) && packData.recommendedProductIds.includes(product.id)}
                                                onChange={() => handleProductRecommendationToggle(product.id)}
                                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                            />
                                            <img
                                                src={product.images?.[0] || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Image'}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-md mx-3"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-600">${product.price?.toFixed(2)}</p>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        {t('packForm.recommendations.noProducts')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pack Recommendations */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4">
                                {t('packForm.recommendations.packs')} ({Array.isArray(packData.recommendedPackIds) ? packData.recommendedPackIds.length : 0})
                            </h4>
                            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                                {(Array.isArray(allPacks) ? allPacks : []).length > 0 ? (
                                    (Array.isArray(allPacks) ? allPacks : []).map(pack => (
                                        <label key={pack.id} className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Array.isArray(packData.recommendedPackIds) && packData.recommendedPackIds.includes(pack.id)}
                                                onChange={() => handlePackRecommendationToggle(pack.id)}
                                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                            />
                                            <img
                                                src={pack.imageUrl || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Image'}
                                                alt={pack.name}
                                                className="w-12 h-12 object-cover rounded-md mx-3"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">{pack.name}</p>
                                                <p className="text-xs text-gray-600">${pack.price?.toFixed(2)}</p>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        {t('packForm.recommendations.noPacks')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Selection Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">{t('packForm.recommendations.summary')}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-gray-600">
                                    <strong>{t('packForm.recommendations.selectedProducts')}:</strong> {Array.isArray(packData.recommendedProductIds) ? packData.recommendedProductIds.length : 0} selected
                                </p>
                                {Array.isArray(packData.recommendedProductIds) && packData.recommendedProductIds.length > 0 && (
                                    <p className="text-gray-500 mt-1">
                                        {(Array.isArray(products) ? products : []).filter(p => packData.recommendedProductIds.includes(p.id)).map(p => p.name).join(', ')}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-gray-600">
                                    <strong>{t('packForm.recommendations.selectedPacks')}:</strong> {Array.isArray(packData.recommendedPackIds) ? packData.recommendedPackIds.length : 0} selected
                                </p>
                                {Array.isArray(packData.recommendedPackIds) && packData.recommendedPackIds.length > 0 && (
                                    <p className="text-gray-500 mt-1">
                                        {(Array.isArray(allPacks) ? allPacks : []).filter(p => packData.recommendedPackIds.includes(p.id)).map(p => p.name).join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{t('packForm.review.title')}</h3>
                            <p className="text-gray-600">{t('packForm.review.subtitle')}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/packs')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {t('packForm.review.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        {t('packForm.review.creating')}
                                    </>
                                ) : (
                                    <>
                                        <FiPackage className="w-5 h-5 mr-2" />
                                        {t('packForm.review.create')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminPackForm;
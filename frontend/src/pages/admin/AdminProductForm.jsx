import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById, uploadDescriptionImage, getAllCategories, getAllProducts, updateFrequentlyBoughtTogether } from '../../api/apiService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
    FiSave, FiX, FiUpload, FiImage, FiPackage, FiDollarSign,
    FiStar, FiTrendingUp, FiArrowLeft, FiEye, FiPlus, FiTrash2
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminProductForm = () => {
    const { t } = useLanguage();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        brand: '',
        categoryId: '',
        type: 'BOTH',
        bestseller: false,
        newArrival: false,
        isPackable: false,
        hasVariants: false,
        showPurchaseNotifications: true,
        showCountdownTimer: true,
        variantTypes: [],
        variants: []
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [variantImages, setVariantImages] = useState({});
    const [variantImagePreviews, setVariantImagePreviews] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [selectedFbt, setSelectedFbt] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await getAllCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setError(t('productForm.errors.categoriesFailed'));
            }
        };

        const fetchAllProductsForSelector = async () => {
            try {
                const response = await getAllProducts({ page: 0, size: 1000 });
                setAllProducts(response.data.content.map(p => ({ value: p.id, label: p.name })));
            } catch (error) {
                console.error("Failed to fetch products for selector", error);
            }
        };

        fetchCategories();
        fetchAllProductsForSelector();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const { data } = await getProductById(id);
                    setProduct({
                        ...data,
                        isPackable: data.isPackable || false,
                        hasVariants: data.hasVariants || false,
                        variantTypes: data.variantTypes ? data.variantTypes.map(vt => ({
                            ...vt,
                            options: Array.isArray(vt.options) ? vt.options.map(opt =>
                                typeof opt === 'string' ? { value: opt, colorCode: '', imageUrl: '' } : opt
                            ) : []
                        })) : [],
                        variants: data.variants || []
                    });
                    setExistingImages(data.images || []);
                    // setImagePreviews(data.images || []); // Deprecated in favor of separate existingImages

                    // Pre-populate the "Frequently Bought Together" selector
                    const frequentlyBought = data.frequentlyBoughtTogether || [];
                    setSelectedFbt(frequentlyBought.map(p => ({ value: p.id, label: p.name })));

                    if (data.variants) {
                        const previews = {};
                        data.variants.forEach((variant, index) => {
                            if (variant.imageUrl) {
                                previews[index] = variant.imageUrl;
                            }
                        });
                        setVariantImagePreviews(previews);
                    }
                } catch (err) {
                    setError(err.response?.data?.message || t('productForm.errors.loadFailed'));
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        if (product.hasVariants && product.variantTypes.length > 0 && product.variantTypes.every(vt => vt.name && vt.options)) {
            const generateCombinations = (types) => {
                if (types.length === 0) return [{}];
                const firstType = types[0];
                const restOfTypes = types.slice(1);
                const options = firstType.options;
                const combinations = generateCombinations(restOfTypes);
                const newCombinations = [];
                options.forEach(optionObj => {
                    const optionValue = optionObj.value;
                    combinations.forEach(combination => {
                        newCombinations.push({ ...combination, [firstType.name]: optionValue });
                    });
                });
                return newCombinations;
            };

            const combinations = generateCombinations(product.variantTypes);
            const newVariants = combinations.map(variantMap => {
                const existingVariant = product.variants.find(v => JSON.stringify(v.variantMap) === JSON.stringify(variantMap));
                return {
                    variantMap,
                    price: existingVariant?.price || product.price,
                    stock: existingVariant?.stock || 0,
                    imageUrl: existingVariant?.imageUrl || ''
                };
            });
            setProduct(prev => ({ ...prev, variants: newVariants }));
        } else if (product.hasVariants && product.variantTypes.length === 0) {
            setProduct(prev => ({ ...prev, variants: [] }));
        }
    }, [product.variantTypes, product.hasVariants, product.price]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prev) => {
            const newProduct = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'hasVariants' && !checked) {
                newProduct.variantTypes = [];
                newProduct.variants = [];
            }
            return newProduct;
        });
    };


    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...newPreviews]);

        // Flatten 'images' state is still needed if handleSubmit uses it?
        // Let's modify handleSubmit to use 'newImages' instead of 'images'.
        // Or keep 'images' synced with 'newImages' for backward compat within this file for now if simple.
        // But better to just use 'newImages' explicitly.
        // I will update handleSubmit later.
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // We will handle existing images display separately but NOT removal for now as backend doesn't support easy deletion yet without replacing all.
    // Wait, backend *was* replacing all. Now it appends.
    // If we want to delete an existing image, we need an endpoint or logic.
    // But user mainly asked to "add multiple image but i cant remove image" likely referring to the ones they JUST added (preview).
    // The "delete and replace" complaint was about the backend replacing everything. 

    // So current priority: robustly handle the NEWLY added images (preview & remove).

    const handleVariantImageChange = (variantIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            setVariantImages(prev => ({ ...prev, [variantIndex]: file }));
            setVariantImagePreviews(prev => ({ ...prev, [variantIndex]: URL.createObjectURL(file) }));
        }
    };

    const removeVariantImage = (variantIndex) => {
        setVariantImages(prev => {
            const updated = { ...prev };
            delete updated[variantIndex];
            return updated;
        });
        setVariantImagePreviews(prev => {
            const updated = { ...prev };
            delete updated[variantIndex];
            return updated;
        });
        const updatedVariants = [...product.variants];
        updatedVariants[variantIndex].imageUrl = '';
        setProduct({ ...product, variants: updatedVariants });
    };



    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleVariantTypeChange = (index, field, value) => {
        const updatedTypes = product.variantTypes.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setProduct(prev => ({ ...prev, variantTypes: updatedTypes }));
    };

    const addVariantType = () => setProduct(prev => ({ ...prev, variantTypes: [...prev.variantTypes, { name: '', options: [] }] }));
    const removeVariantType = (index) => setProduct(prev => ({ ...prev, variantTypes: prev.variantTypes.filter((_, i) => i !== index) }));

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...product.variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setProduct(prev => ({ ...prev, variants: updatedVariants }));
    };

    const handleVariantMapChange = (index, name, value) => {
        const updatedVariants = [...product.variants];
        updatedVariants[index].variantMap = { ...updatedVariants[index].variantMap, [name]: value };
        setProduct(prev => ({ ...prev, variants: updatedVariants }));
    };


    const removeVariant = (index) => setProduct(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));

    const handleAddOption = (typeIndex) => {
        const updatedTypes = [...product.variantTypes];
        updatedTypes[typeIndex].options.push({ value: '', colorCode: '#000000', imageUrl: '' });
        setProduct({ ...product, variantTypes: updatedTypes });
    };

    const handleOptionChange = (typeIndex, optionIndex, field, value) => {
        const updatedTypes = [...product.variantTypes];
        updatedTypes[typeIndex].options[optionIndex][field] = value;
        setProduct({ ...product, variantTypes: updatedTypes });
    };

    const handleRemoveOption = (typeIndex, optionIndex) => {
        const updatedTypes = [...product.variantTypes];
        updatedTypes[typeIndex].options = updatedTypes[typeIndex].options.filter((_, i) => i !== optionIndex);
        setProduct({ ...product, variantTypes: updatedTypes });
    };

    const handleOptionImageUpload = (typeIndex, optionIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedTypes = [...product.variantTypes];
            updatedTypes[typeIndex].options[optionIndex].imageFile = file;
            updatedTypes[typeIndex].options[optionIndex].imagePreview = URL.createObjectURL(file);
            setProduct({ ...product, variantTypes: updatedTypes });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!product.name.trim()) {
            setError(t('productForm.validation.nameRequired'));
            setLoading(false);
            return;
        }
        if (!product.price || parseFloat(product.price) <= 0) {
            setError(t('productForm.validation.priceRequired'));
            setLoading(false);
            return;
        }
        if (!product.categoryId) {
            setError(t('productForm.validation.categoryRequired'));
            setLoading(false);
            return;
        }

        try {
            const description = product.description;

            const formData = new FormData();

            const variantImageUrls = {};
            for (const [index, file] of Object.entries(variantImages)) {
                if (file) {
                    try {
                        const variantImageFormData = new FormData();
                        variantImageFormData.append('image', file);
                        const response = await uploadDescriptionImage(variantImageFormData);
                        variantImageUrls[index] = response.data.url;
                    } catch (uploadError) {
                        console.error(`Failed to upload variant image ${index}:`, uploadError);
                        // Continue without this image
                    }
                }
            }

            // Validate variant data
            if (product.hasVariants) {
                const invalidVariants = product.variants.filter(variant =>
                    !variant.price || isNaN(parseFloat(variant.price)) || parseFloat(variant.price) < 0
                );
                if (invalidVariants.length > 0) {
                    setError(t('productForm.validation.variantPricesRequired'));
                    setLoading(false);
                    return;
                }
            }

            const productDataToSend = {
                ...product,
                description,
                images: existingImages, // send the kept existing images
                variantTypes: product.hasVariants ? await Promise.all(product.variantTypes.map(async vt => ({
                    ...vt,
                    options: await Promise.all(vt.options.map(async opt => {
                        let imageUrl = opt.imageUrl;
                        if (opt.imageFile) {
                            try {
                                const fd = new FormData();
                                fd.append('image', opt.imageFile);
                                const res = await uploadDescriptionImage(fd);
                                imageUrl = res.data.url;
                            } catch (err) {
                                console.error("Failed to upload option image", err);
                            }
                        }
                        return {
                            value: opt.value,
                            colorCode: opt.colorCode,
                            imageUrl: imageUrl
                        };
                    }))
                }))) : [],
                variants: product.hasVariants ? product.variants.map((variant, index) => ({
                    ...variant,
                    price: parseFloat(variant.price),
                    stock: parseInt(variant.stock, 10) || 0,
                    imageUrl: variantImageUrls[index] || variant.imageUrl || ''
                })) : []
            };

            formData.append('product', JSON.stringify(productDataToSend));
            newImages.forEach(imageFile => formData.append('images', imageFile));

            const savedProduct = isEditing ? await updateProduct(id, formData) : await createProduct(formData);

            const productIdToUpdate = id || savedProduct.data.id;
            const selectedFbtIds = selectedFbt.map(option => option.value);

            // Update frequently bought together (don't fail if this fails)
            try {
                await updateFrequentlyBoughtTogether(productIdToUpdate, selectedFbtIds);
            } catch (fbtError) {
                console.error('Failed to update frequently bought together:', fbtError);
                // Don't fail the entire operation for this
            }

            toast.success(isEditing ? t('productForm.success.updated') : t('productForm.success.created'));
            navigate('/admin/products');

        } catch (error) {
            const errorMessage = error.response?.data?.message || t('productForm.errors.saveFailed');
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    if (loading && id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader />
                    <p className="text-gray-600 mt-4">{t('productForm.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                {isEditing ? t('productForm.title.edit') : t('productForm.title.create')}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditing ? t('productForm.subtitle.edit') : t('productForm.subtitle.create')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {t('productForm.actions.saving')}
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4 mr-2" />
                                    {isEditing ? t('productForm.actions.update') : t('productForm.actions.create')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                <p className="text-red-500 text-center bg-red-100 p-3 rounded-md">{error}</p>
                            </div>
                        )}

                        {/* Basic Information Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiPackage className="w-6 h-6 text-blue-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">{t('productForm.basicInfo.title')}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('productForm.basicInfo.productName')} *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={product.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder={t('productForm.basicInfo.productNamePlaceholder')}
                                    />
                                </div>

                                {/* Brand */}
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('productForm.basicInfo.brand')} *
                                    </label>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        value={product.brand}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder={t('productForm.basicInfo.brandPlaceholder')}
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('productForm.basicInfo.price')} *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="price"
                                            name="price"
                                            value={product.price}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                            placeholder={t('productForm.basicInfo.pricePlaceholder')}
                                        />
                                    </div>
                                </div>

                                {/* Stock Quantity */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('productForm.basicInfo.stockQuantity')} *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder={t('productForm.basicInfo.stockPlaceholder')}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('productForm.basicInfo.category')} *
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={product.categoryId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">{t('productForm.basicInfo.categoryPlaceholder')}</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Type */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('productForm.basicInfo.type')}
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={product.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="MEN">{t('productForm.basicInfo.typeMen')}</option>
                                        <option value="WOMEN">{t('productForm.basicInfo.typeWomen')}</option>
                                        <option value="BOTH">{t('productForm.basicInfo.typeBoth')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="bestseller"
                                        name="bestseller"
                                        checked={product.bestseller}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-900">
                                        {t('productForm.basicInfo.bestseller')}
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="newArrival"
                                        name="newArrival"
                                        checked={product.newArrival}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <label htmlFor="newArrival" className="ml-2 block text-sm text-gray-900">
                                        {t('productForm.basicInfo.newArrival')}
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="hasVariants"
                                        name="hasVariants"
                                        checked={product.hasVariants}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <label htmlFor="hasVariants" className="ml-2 block text-sm text-gray-900">
                                        {t('productForm.basicInfo.hasVariants')}
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isPackable"
                                        name="isPackable"
                                        checked={product.isPackable}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <label htmlFor="isPackable" className="ml-2 block text-sm text-gray-900">
                                        {t('productForm.basicInfo.isPackable')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiImage className="w-6 h-6 text-purple-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">{t('productForm.description.title')}</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('productForm.description.label')}
                                </label>
                                <ReactQuill
                                    theme="snow"
                                    value={product.description || ''}
                                    onChange={(value) => setProduct({ ...product, description: value })}
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
                                    style={{ height: '400px', marginBottom: '50px' }}
                                />
                            </div>
                        </div>

                        {/* Images Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiUpload className="w-6 h-6 text-green-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">{t('productForm.images.title')}</h2>
                            </div>

                            <div>
                                <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('productForm.images.upload')}
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                />

                                <div className="mt-4 space-y-4">
                                    {/* Existing Images */}
                                    {existingImages.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">{t('productForm.images.existingImages')}</p>
                                            <div className="flex flex-wrap gap-4">
                                                {existingImages.map((preview, index) => (
                                                    <div key={`existing-${index}`} className="relative group">
                                                        <img src={preview} alt={`Existing ${index + 1}`} className="w-24 h-24 object-cover rounded-md border" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Remove Image"
                                                        >
                                                            <FiX className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Images */}
                                    {newImagePreviews.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">{t('productForm.images.newImages')}</p>
                                            <div className="flex flex-wrap gap-4">
                                                {newImagePreviews.map((preview, index) => (
                                                    <div key={`new-${index}`} className="relative group">
                                                        <img src={preview} alt={`New ${index + 1}`} className="w-24 h-24 object-cover rounded-md border ring-2 ring-green-500" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                                            title="Remove Image"
                                                        >
                                                            <FiX className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Variant Management */}
                        {product.hasVariants && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <FiPackage className="w-6 h-6 text-blue-500 mr-3" />
                                        <h2 className="text-2xl font-bold text-gray-900">{t('productForm.variantTypes.title')}</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addVariantType}
                                        className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                    >
                                        <FiPlus className="w-5 h-5 mr-2" />
                                        {t('productForm.variantTypes.addVariantTypeBtn')}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {product.variantTypes.map((vt, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6 relative group transition-all hover:shadow-md">
                                            <button
                                                type="button"
                                                onClick={() => removeVariantType(index)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title={t('productForm.variantTypes.remove')}
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                {/* Variant Type Name */}
                                                <div className="md:col-span-4">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        {t('productForm.variantTypes.typeName')} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder={t('productForm.variantTypes.typeNamePlaceholder')}
                                                        value={vt.name}
                                                        onChange={(e) => handleVariantTypeChange(index, 'name', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        required
                                                    />
                                                </div>

                                                {/* Options */}
                                                <div className="md:col-span-8">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        {t('productForm.variantTypes.options')}
                                                    </label>

                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {vt.options.map((opt, optIndex) => (
                                                            <div key={optIndex} className="flex items-center bg-white border border-gray-200 rounded-lg pl-3 pr-1 py-1 shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    value={opt.value}
                                                                    onChange={(e) => handleOptionChange(index, optIndex, 'value', e.target.value)}
                                                                    className="w-24 text-sm border-none focus:ring-0 p-0 text-gray-700 font-medium"
                                                                    placeholder={t('productForm.variantTypes.optionValue')}
                                                                />

                                                                {/* Optional Color Picker */}
                                                                <input
                                                                    type="color"
                                                                    value={opt.colorCode || '#000000'}
                                                                    onChange={(e) => handleOptionChange(index, optIndex, 'colorCode', e.target.value)}
                                                                    className="w-6 h-6 border-none rounded cursor-pointer ml-2"
                                                                    title={t('productForm.variantTypes.color')}
                                                                />

                                                                {/* Optional Image Upload */}
                                                                <label className="cursor-pointer ml-2 p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500">
                                                                    <FiImage className="w-4 h-4" />
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="hidden"
                                                                        onChange={(e) => handleOptionImageUpload(index, optIndex, e)}
                                                                    />
                                                                </label>

                                                                {/* Helper to show image preview tooltip or small indicator could go here */}
                                                                {(opt.imagePreview || opt.imageUrl) && (
                                                                    <div className="w-2 h-2 rounded-full bg-green-500 ml-1" title="Image Set"></div>
                                                                )}

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveOption(index, optIndex)}
                                                                    className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                                                                >
                                                                    <FiX className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddOption(index)}
                                                            className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                        >
                                                            <FiPlus className="w-4 h-4 mr-1" />
                                                            {t('productForm.variantTypes.addOptionBtn')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {product.variantTypes.length === 0 && (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 mb-4">Add a variant type (like 'Size' or 'Color') to get started.</p>
                                            <button
                                                type="button"
                                                onClick={addVariantType}
                                                className="inline-flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                                            >
                                                <FiPlus className="w-5 h-5 mr-2" />
                                                {t('productForm.variantTypes.addVariantTypeBtn')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Product Variants */}
                        {product.hasVariants && product.variants.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiPackage className="w-6 h-6 text-purple-500 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">{t('productForm.variants.title')}</h2>
                                </div>

                                {product.variants.map((variant, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg mb-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {product.variantTypes.map(vt => (
                                                <div key={vt.name}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{vt.name}</label>
                                                    <select
                                                        value={variant.variantMap[vt.name] || ''}
                                                        onChange={(e) => handleVariantMapChange(index, vt.name, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                                        required
                                                    >
                                                        <option value="">Select {vt.name}</option>
                                                        {(vt.options || []).map((opt, i) => (
                                                            <option key={i} value={opt.value}>{opt.value}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('productForm.variants.price')} *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                                    required
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('productForm.variants.stock')} *</label>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                                    required
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('productForm.variants.variantImage')}</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleVariantImageChange(index, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                                />
                                            </div>
                                        </div>
                                        {variantImagePreviews[index] && (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={variantImagePreviews[index]}
                                                    alt={`Variant ${index + 1} preview`}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariantImage(index)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                                                >
                                                    {t('productForm.variants.removeImage')}
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                {t('productForm.variants.removeVariant')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Display Settings */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiEye className="w-6 h-6 text-pink-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">{t('productForm.displaySettings.title')}</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Purchase Notifications Toggle */}
                                <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={product.showPurchaseNotifications || false}
                                        onChange={(e) => {
                                            setProduct({ ...product, showPurchaseNotifications: e.target.checked });
                                        }}
                                        className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                                    />
                                    <span className="ml-3 flex-1">
                                        <span className="block font-semibold text-gray-800">{t('productForm.displaySettings.purchaseNotifications.title')}</span>
                                        <span className="text-sm text-gray-600">{t('productForm.displaySettings.purchaseNotifications.description')}</span>
                                    </span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${product.showPurchaseNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {product.showPurchaseNotifications ? t('productForm.displaySettings.purchaseNotifications.enabled') : t('productForm.displaySettings.purchaseNotifications.disabled')}
                                    </span>
                                </label>

                                {/* Countdown Timer Toggle */}
                                <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={product.showCountdownTimer || false}
                                        onChange={(e) => {
                                            setProduct({ ...product, showCountdownTimer: e.target.checked });
                                        }}
                                        className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                                    />
                                    <span className="ml-3 flex-1">
                                        <span className="block font-semibold text-gray-800">{t('productForm.displaySettings.countdownTimer.title')}</span>
                                        <span className="text-sm text-gray-600">{t('productForm.displaySettings.countdownTimer.description')}</span>
                                    </span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${product.showCountdownTimer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {product.showCountdownTimer ? t('productForm.displaySettings.countdownTimer.enabled') : t('productForm.displaySettings.countdownTimer.disabled')}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Frequently Bought Together */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiStar className="w-6 h-6 text-yellow-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">{t('productForm.frequentlyBought.title')}</h2>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('productForm.frequentlyBought.label')}
                                </label>
                                <Select
                                    isMulti
                                    name="frequentlyBought"
                                    options={allProducts.filter(p => p.value !== Number(id))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={selectedFbt}
                                    onChange={setSelectedFbt}
                                    placeholder={t('productForm.frequentlyBought.placeholder')}
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        control: (base) => ({ ...base, borderColor: '#e5e7eb', borderRadius: '0.5rem', paddingTop: '2px', paddingBottom: '2px' }),
                                        menu: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        {t('productForm.actions.savingProduct')}
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-5 h-5 mr-2" />
                                        {isEditing ? t('productForm.actions.update') : t('productForm.actions.create')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProductForm;
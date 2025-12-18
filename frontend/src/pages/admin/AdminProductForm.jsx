import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById, uploadDescriptionImage, getAllCategories, getAllProducts, updateFrequentlyBoughtTogether } from '../../api/apiService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
    FiSave, FiX, FiUpload, FiImage, FiPackage, FiDollarSign,
    FiStar, FiTrendingUp, FiArrowLeft, FiEye
} from 'react-icons/fi';

const AdminProductForm = () => {
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
    const editorRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await getAllCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setError("Failed to load product categories. Please try again.");
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
                            options: Array.isArray(vt.options) ? vt.options.join(', ') : vt.options
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
                    setError(err.response?.data?.message || err.message);
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
                const options = firstType.options.split(',').map(o => o.trim()).filter(Boolean);
                const combinations = generateCombinations(restOfTypes);
                const newCombinations = [];
                options.forEach(option => {
                    combinations.forEach(combination => {
                        newCombinations.push({ ...combination, [firstType.name]: option });
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

    const addVariantType = () => setProduct(prev => ({ ...prev, variantTypes: [...prev.variantTypes, { name: '', options: '' }] }));
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!product.name.trim()) {
            setError('Product name is required.');
            setLoading(false);
            return;
        }
        if (!product.price || parseFloat(product.price) <= 0) {
            setError('Valid price is required.');
            setLoading(false);
            return;
        }
        if (!product.categoryId) {
            setError('Category is required.');
            setLoading(false);
            return;
        }

        try {
            const description = editorRef.current ? editorRef.current.getContent() : product.description;

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
                    setError('All variants must have valid prices.');
                    setLoading(false);
                    return;
                }
            }

            const productDataToSend = {
                ...product,
                description,
                images: existingImages, // send the kept existing images
                variantTypes: product.hasVariants ? product.variantTypes.map(vt => ({
                    ...vt,
                    options: vt.options.split(',').map(o => o.trim()).filter(Boolean)
                })) : [],
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

            toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
            navigate('/admin/products');

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to save product.';
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
                    <p className="text-gray-600 mt-4">Loading product...</p>
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
                                {isEditing ? 'Edit Product' : 'Create New Product'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditing ? 'Update your product information' : 'Add a new product to your catalog'}
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
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Update Product' : 'Create Product'}
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
                                <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={product.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                {/* Brand */}
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Brand *
                                    </label>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        value={product.brand}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="Enter brand name"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price ($) *
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
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Stock Quantity */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={product.categoryId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">-- Select a Category --</option>
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
                                        Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={product.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="MEN">Men</option>
                                        <option value="WOMEN">Women</option>
                                        <option value="BOTH">Both</option>
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
                                        Bestseller
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
                                        New Arrival
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
                                        Has Variants
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
                                        Available for Custom Packs
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiImage className="w-6 h-6 text-purple-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">Product Description</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <Editor
                                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    initialValue={product.description}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                                        toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                        images_upload_handler: async (blobInfo) => {
                                            const formData = new FormData();
                                            formData.append('image', blobInfo.blob(), blobInfo.filename());
                                            const response = await uploadDescriptionImage(formData);
                                            return response.data.url;
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Images Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiUpload className="w-6 h-6 text-green-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
                            </div>

                            <div>
                                <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Upload Images
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
                                            <p className="text-sm font-medium text-gray-700 mb-2">Existing Images:</p>
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
                                            <p className="text-sm font-medium text-gray-700 mb-2">New Images to Append:</p>
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
                                <div className="flex items-center mb-6">
                                    <FiPackage className="w-6 h-6 text-blue-500 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Variant Types</h2>
                                </div>

                                {product.variantTypes.map((vt, index) => (
                                    <div key={index} className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Type Name *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Size, Color"
                                                value={vt.name}
                                                onChange={(e) => handleVariantTypeChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Options (comma-separated) *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., S, M, L"
                                                value={vt.options}
                                                onChange={(e) => handleVariantTypeChange(index, 'options', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariantType(index)}
                                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addVariantType}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Add Variant Type
                                </button>
                            </div>
                        )}

                        {/* Product Variants */}
                        {product.hasVariants && product.variants.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiPackage className="w-6 h-6 text-purple-500 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Product Variants</h2>
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
                                                        {(vt.options.split(',') || []).map(opt => (
                                                            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Variant Image</label>
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
                                                    Remove Image
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                Remove Variant
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
                                <h2 className="text-2xl font-bold text-gray-900">Display Settings</h2>
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
                                        <span className="block font-semibold text-gray-800">🛍️ Show Purchase Notifications</span>
                                        <span className="text-sm text-gray-600">Display notifications when customers buy this product</span>
                                    </span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${product.showPurchaseNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {product.showPurchaseNotifications ? 'Enabled' : 'Disabled'}
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
                                        <span className="block font-semibold text-gray-800">⏱️ Show Countdown Timer</span>
                                        <span className="text-sm text-gray-600">Display flash sale countdown timer for urgency</span>
                                    </span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${product.showCountdownTimer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {product.showCountdownTimer ? 'Enabled' : 'Disabled'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Frequently Bought Together */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <FiStar className="w-6 h-6 text-yellow-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">Frequently Bought Together</h2>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select products that are frequently bought together with this product
                                </label>
                                <Select
                                    isMulti
                                    name="frequentlyBought"
                                    options={allProducts.filter(p => p.value !== Number(id))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={selectedFbt}
                                    onChange={setSelectedFbt}
                                    placeholder="Search and select products..."
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProductForm;
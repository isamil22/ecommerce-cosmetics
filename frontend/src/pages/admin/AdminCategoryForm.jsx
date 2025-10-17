import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createCategory, updateCategory, getAllCategories } from '../../api/apiService';
import { toast } from 'react-toastify';
import { 
    FiArrowLeft, FiSave, FiUpload, FiImage, FiGrid, FiTag, FiFileText,
    FiCheckCircle, FiAlertCircle, FiX, FiEye, FiTrash2, FiRefreshCw,
    FiZap, FiHeart, FiShield, FiSettings, FiPlus, FiEdit3, FiCamera,
    FiAlertTriangle, FiInfo, FiCheck, FiClock, FiStar, FiTarget
} from 'react-icons/fi';

const AdminCategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [category, setCategory] = useState({ name: '', description: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                try {
                    setLoading(true);
                    const response = await getAllCategories();
                    const categoryToEdit = response.data.find(cat => cat.id.toString() === id);
                    if (categoryToEdit) {
                        setCategory(categoryToEdit);
                        if (categoryToEdit.imageUrl) {
                            setImagePreview(categoryToEdit.imageUrl);
                        }
                    } else {
                        setError('Category not found.');
                        toast.error('Category not found.');
                    }
                } catch (err) {
                    setError('Failed to load category data.');
                    toast.error('Failed to load category data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        }
    }, [id]);

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
            // Escape to go back
            if (e.key === 'Escape') {
                navigate('/admin/categories');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSubmitting, navigate]);

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
        setCategory(prev => ({ ...prev, [name]: value }));
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
                toast.error('Please select a valid image file.');
            }
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview('');
        setIsDirty(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!category.name.trim()) {
            newErrors.name = 'Category name is required';
        } else if (category.name.trim().length < 2) {
            newErrors.name = 'Category name must be at least 2 characters';
        }
        
        if (category.description && category.description.trim().length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting.');
            return;
        }
        
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));
        
        if (image) {
            formData.append('image', image);
        }

        setError('');
        setSuccess('');

        try {
            if (isEditing) {
                await updateCategory(id, formData);
                setSuccess('Category updated successfully!');
                toast.success('Category updated successfully!');
            } else {
                await createCategory(formData);
                setSuccess('Category created successfully!');
                toast.success('Category created successfully!');
            }
            setIsDirty(false);
            setTimeout(() => navigate('/admin/categories'), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Operation failed. Please try again.';
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
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-12 bg-gray-200 rounded-lg"></div>
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                            <div className="h-40 bg-gray-200 rounded-lg"></div>
                            <div className="h-12 bg-gray-200 rounded-lg"></div>
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
                        <Link 
                            to="/admin/categories"
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            <span>Back to Categories</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                {isEditing ? (
                                    <FiEdit3 className="w-8 h-8 text-white animate-pulse" />
                                ) : (
                                    <FiPlus className="w-8 h-8 text-white animate-pulse" />
                                )}
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-3">
                                <span>{isEditing ? 'Edit Category' : 'Create Category'}</span>
                                <FiZap className="w-8 h-8 text-yellow-500 animate-pulse" />
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center space-x-2">
                                <FiHeart className="w-4 h-4 text-pink-500" />
                                <span>{isEditing ? 'Update your category information' : 'Add a new category to organize your products'}</span>
                            </p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+S</kbd>
                                    <span className="ml-2">Save</span>
                                </span>
                                <span className="flex items-center">
                                    <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Esc</kbd>
                                    <span className="ml-2">Back</span>
                                </span>
                                {isDirty && (
                                    <span className="flex items-center text-orange-600">
                                        <FiAlertTriangle className="w-4 h-4 mr-1" />
                                        <span>Unsaved changes</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
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
                            <span className="font-semibold">Success:</span>
                            <span className="ml-2">{success}</span>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <FiGrid className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Category Details' : 'Category Information'}
                                </h2>
                                <p className="text-gray-600">
                                    {isEditing ? 'Update your category information and settings' : 'Fill in the details to create a new category'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Basic Info */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                        <FiTag className="w-5 h-5 text-purple-500" />
                                        <span>Category Name</span>
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        value={category.name} 
                                        onChange={handleChange} 
                                        required 
                                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                        placeholder="Enter category name (e.g., Electronics, Fashion, Books)"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <FiAlertCircle className="w-4 h-4 mr-1" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                        <FiFileText className="w-5 h-5 text-blue-500" />
                                        <span>Description</span>
                                        <span className="text-sm text-gray-500">(Optional)</span>
                                    </label>
                                    <textarea 
                                        name="description" 
                                        id="description" 
                                        value={category.description} 
                                        onChange={handleChange} 
                                        rows="6"
                                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                                            errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        placeholder="Describe this category (optional)"
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center">
                                            <FiAlertCircle className="w-4 h-4 mr-1" />
                                            {errors.description}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        {category.description.length}/500 characters
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Image Upload */}
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                                        <FiCamera className="w-5 h-5 text-green-500" />
                                        <span>Category Image</span>
                                        <span className="text-sm text-gray-500">(Optional)</span>
                                    </label>
                                    
                                    {/* Image Upload Area */}
                                    <div 
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                                            dragActive 
                                                ? 'border-purple-400 bg-purple-50' 
                                                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="image"
                                            id="image"
                                            onChange={handleFileInputChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Category preview" 
                                                    className="mx-auto max-h-48 rounded-lg shadow-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                                                    <FiUpload className="w-8 h-8 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        Drop your image here
                                                    </p>
                                                    <p className="text-gray-500">
                                                        or click to browse
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300"
                                                >
                                                    Choose File
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <p className="mt-2 text-sm text-gray-500">
                                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <Link
                                to="/admin/categories"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                <span>Cancel</span>
                            </Link>
                            
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/categories')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiRefreshCw className="w-5 h-5 animate-spin" />
                                            <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="w-5 h-5" />
                                            <span>{isEditing ? 'Update Category' : 'Create Category'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoryForm;
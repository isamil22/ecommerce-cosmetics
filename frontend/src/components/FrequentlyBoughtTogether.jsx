// frontend/src/components/FrequentlyBoughtTogether.jsx
import React, { useState, useEffect } from 'react';
import { getFrequentlyBoughtTogether, addToCart as apiAddToCart } from '../api/apiService';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiShoppingCart,
    FiCheck,
    FiPlus,
    FiHeart,
    FiEye,
    FiStar,
    FiTag,
    FiZap
} from 'react-icons/fi';

const FrequentlyBoughtTogether = ({ product, fetchCartCount, isAuthenticated }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (product && product.id) {
            setLoading(true);
            getFrequentlyBoughtTogether(product.id)
                .then(response => {
                    const productsData = response.data || [];
                    setRelatedProducts(productsData);
                    // Initialize with all products selected by default
                    const initialSelected = [product.id, ...productsData.map(p => p.id)];
                    setSelectedProducts(initialSelected);
                })
                .catch(error => {
                    console.error('Error loading frequently bought together:', error);
                    // Set empty array on error to prevent crashes
                    setRelatedProducts([]);
                    setSelectedProducts([product.id]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [product]);

    const handleCheckboxChange = (productId) => {
        setSelectedProducts(prev => {
            const isCurrentlySelected = prev.includes(productId);
            const newSelection = isCurrentlySelected
                ? prev.filter(id => id !== productId)
                : [...prev, productId];

            return newSelection;
        });
    };

    const handleAddAllToCart = async () => {

        const allProducts = [product, ...relatedProducts];
        const productsToAdd = allProducts.filter(p => selectedProducts.includes(p.id));

        if (productsToAdd.length === 0) {
            toast.warn('الرجاء اختيار منتج واحد على الأقل / Veuillez sélectionner au moins un produit');
            return;
        }

        try {
            if (isAuthenticated) {
                // For authenticated users, call the backend API
                await Promise.all(productsToAdd.map(p => apiAddToCart(p.id, 1)));
            } else {
                // For GUEST users, update local storage
                let cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };

                productsToAdd.forEach(p => {
                    const existingItemIndex = cart.items.findIndex(item => item.productId === p.id);
                    if (existingItemIndex > -1) {
                        cart.items[existingItemIndex].quantity += 1;
                    } else {
                        // Create a new cart item object with the correct structure
                        const productData = {
                            productId: p.id,
                            productName: p.name,
                            price: p.price,
                            images: p.images || [], // Ensure images array exists
                            quantity: 1
                        };
                        cart.items.push(productData);
                    }
                });

                localStorage.setItem('cart', JSON.stringify(cart));
            }

            toast.success(`تم إضافة ${productsToAdd.length} منتجات للسلة! / ${productsToAdd.length} produits ajoutés au panier !`);
            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (error) {
            console.error("Failed to add items to cart", error);
            toast.error('فشل إضافة المنتجات للسلة / Échec de l\'ajout au panier');
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50 max-w-5xl mx-auto">
                <div className="animate-pulse">
                    <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-0 sm:mr-4"></div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-64 sm:w-80 mb-2 mx-auto sm:mx-0"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64 mx-auto sm:mx-0"></div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                        <div className="w-full sm:w-32 h-32 sm:h-40 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                        <div className="w-full sm:w-32 h-32 sm:h-40 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (relatedProducts.length === 0) {
        return (
            <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                        <FiShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            غالباً ما يتم شراؤها معاً / Souvent achetés ensemble
                        </h2>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">منتجات يشتريها العملاء عادةً معاً / Produits souvent achetés ensemble par les clients</p>
                    </div>
                </div>

                <div className="text-center py-8 sm:py-12 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/50">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <FiShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">لا توجد منتجات مقترحة بعد / Pas encore de produits suggérés</h3>
                    <p className="text-gray-600 text-base sm:text-lg mb-4">ستظهر المنتجات المقترحة هنا عند توفرها / Les produits suggérés apparaîtront ici</p>
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-200 max-w-md mx-auto">
                        <p className="text-xs sm:text-sm text-blue-700">
                            <FiTag className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                            تتطلب هذه الميزة تكوين علاقات المنتجات في لوحة تلمسؤول / Cette fonctionnalité nécessite une configuration dans le panneau d'administration.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const allDisplayProducts = [product, ...relatedProducts];
    const selectedProductsData = allDisplayProducts.filter(p => selectedProducts.includes(p.id));
    const totalPrice = selectedProductsData.reduce((total, p) => total + (p.price || 0), 0);
    const savings = allDisplayProducts.reduce((total, p) => total + (p.price || 0), 0) - totalPrice;

    return (
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/50 max-w-5xl mx-auto">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                    <FiShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        غالباً ما يتم شراؤها معاً / Souvent achetés ensemble
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">منتجات يشتريها العملاء عادةً معاً / Produits souvent achetés ensemble par les clients</p>
                </div>
            </div>

            {/* Enhanced Instruction */}
            <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 sm:px-4 py-2 rounded-full border border-yellow-200">
                    <FiZap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-800">انقر على أي منتج لتحديده / Cliquez sur un produit pour le sélectionner</span>
                </div>
            </div>

            {/* Enhanced Product Cards */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                {allDisplayProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                        <div
                            className={`group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl w-full sm:w-auto sm:min-w-[200px] lg:min-w-[220px] ${selectedProducts.includes(p.id)
                                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl ring-4 ring-blue-100'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                                }`}
                            onClick={(e) => {
                                // Don't handle click if it's on checkbox or view details link
                                if (!e.target.closest('.checkbox-container') && !e.target.closest('a')) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCheckboxChange(p.id);
                                }
                            }}
                            title="انقر لتحديد المنتج / Cliquez pour sélectionner"
                            style={{ userSelect: 'none', position: 'relative', zIndex: 10 }}
                        >
                            {/* Enhanced Checkbox */}
                            <div className="checkbox-container absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                                <div
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-center ${selectedProducts.includes(p.id)
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-500 text-white shadow-lg transform scale-110'
                                            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCheckboxChange(p.id);
                                    }}
                                >
                                    {selectedProducts.includes(p.id) && (
                                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </div>
                            </div>

                            {/* Product Badge */}
                            {p.id === product.id && (
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        المنتج الرئيسي / Produit Principal
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Product Image */}
                            <div className="flex justify-center mb-3 sm:mb-4">
                                <div className="relative">
                                    <img
                                        src={p.images && p.images[0] ? p.images[0] : '/placeholder-product.jpg'}
                                        alt={p.name}
                                        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover rounded-lg sm:rounded-xl shadow-lg border border-gray-200 group-hover:shadow-xl transition-all duration-300"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.jpg';
                                        }}
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>

                            {/* Enhanced Product Info */}
                            <div className="text-center">
                                <h3 className={`font-bold text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 ${selectedProducts.includes(p.id)
                                        ? 'text-gray-800'
                                        : 'text-gray-600'
                                    }`}>
                                    {p.name}
                                </h3>

                                {/* Price Display */}
                                <div className="mb-3 sm:mb-4">
                                    <span className={`text-xl sm:text-2xl font-black ${selectedProducts.includes(p.id)
                                            ? 'text-blue-600'
                                            : 'text-gray-500'
                                        }`}>
                                        ${(p.price || 0).toFixed(2)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 justify-center">
                                    <button
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/products/${p.id}`);
                                        }}
                                    >
                                        <FiEye className="w-3 h-3" />
                                        <span className="hidden sm:inline">عرض التفاصيل / Voir Détails</span>
                                        <span className="sm:hidden">عرض / Voir</span>
                                    </button>
                                </div>
                            </div>

                            {/* Selection Indicator */}
                            {selectedProducts.includes(p.id) && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                            )}
                        </div>

                        {/* Enhanced Plus Icon */}
                        {index < allDisplayProducts.length - 1 && (
                            <div className="flex items-center justify-center my-2 sm:my-0">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                                    <FiPlus className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Enhanced Footer with Total and CTA */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
                        <div className="text-center sm:text-left">
                            <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">الإجمالي / Total :</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
                                {savings > 0 && (
                                    <span className="text-xs sm:text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">
                                        وفر ${savings.toFixed(2)} / Économisez
                                    </span>
                                )}
                            </div>
                        </div>

                        {selectedProducts.length > 0 && (
                            <div className="text-center sm:text-left">
                                <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">المنتجات المحددة / Articles sélectionnés :</p>
                                <p className="text-base sm:text-lg font-bold text-gray-800">{selectedProducts.length} منتجات / articles</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <button
                            onClick={handleAddAllToCart}
                            disabled={selectedProducts.length === 0}
                            className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform w-full lg:w-auto ${selectedProducts.length > 0
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="hidden sm:inline">أضف المحدد للسلة / Ajouter la sélection</span>
                            <span className="sm:hidden">أضف / Ajouter</span>
                            {selectedProducts.length > 0 && (
                                <span className="bg-white/20 px-2 py-1 rounded-full text-xs sm:text-sm">
                                    {selectedProducts.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
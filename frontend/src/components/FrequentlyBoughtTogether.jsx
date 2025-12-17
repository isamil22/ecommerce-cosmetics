// frontend/src/components/FrequentlyBoughtTogether.jsx
import React, { useState, useEffect } from 'react';
import { getFrequentlyBoughtTogether, addToCart as apiAddToCart } from '../api/apiService';
import { formatPrice } from '../utils/currency';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    FiShoppingCart,
    FiCheck,
    FiPlus,
    FiEye,
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
            <div className="glass-panel-pro rounded-3xl p-8 lg:p-12 shadow-xl animate-pulse">
                <div className="flex flex-col sm:flex-row items-center mb-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 sm:mb-0 sm:mr-6"></div>
                    <div className="flex-1 space-y-3 w-full">
                        <div className="h-8 bg-gray-200 rounded-full w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                    </div>
                </div>
                <div className="flex justify-center gap-8">
                    <div className="w-40 h-56 bg-gray-200 rounded-2xl"></div>
                    <div className="w-40 h-56 bg-gray-200 rounded-2xl hidden sm:block"></div>
                </div>
            </div>
        );
    }

    if (relatedProducts.length === 0) {
        return null; // Hide completely if no related products
    }

    const allDisplayProducts = [product, ...relatedProducts];
    const selectedProductsData = allDisplayProducts.filter(p => selectedProducts.includes(p.id));
    const totalPrice = selectedProductsData.reduce((total, p) => total + (p.price || 0), 0);
    const savings = allDisplayProducts.reduce((total, p) => total + (p.price || 0), 0) - totalPrice;

    return (
        <div className="glass-panel-pro rounded-3xl p-5 lg:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

            {/* Enhanced Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left mb-8 lg:mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shadow-lg transform -rotate-6">
                    <FiShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        Frequently Bought Together
                    </h2>
                    <p className="text-gray-500 font-medium">Customers often buy these products together for better results</p>
                </div>
            </div>

            {/* Enhanced Product Cards */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
                {allDisplayProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                        {/* Connecting Line (Mobile: hidden, Desktop: visible) */}
                        {index > 0 && (
                            <div className="hidden sm:flex items-center justify-center">
                                <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 z-20">
                                    <FiPlus className="w-5 h-5" />
                                </div>
                            </div>
                        )}

                        {/* Plus Icon for Mobile */}
                        {index > 0 && (
                            <div className="sm:hidden flex items-center justify-center my-2">
                                <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400">
                                    <FiPlus className="w-4 h-4" />
                                </div>
                            </div>
                        )}

                        <div
                            className={`group relative bg-white rounded-2xl p-4 transition-all duration-300 cursor-pointer w-full sm:w-56 hover:-translate-y-2 ${selectedProducts.includes(p.id)
                                ? 'shadow-[0_10px_30px_-10px_rgba(37,99,235,0.2)] ring-2 ring-blue-500/20'
                                : 'shadow-sm hover:shadow-md border border-gray-100 opacity-60 hover:opacity-100'
                                }`}
                            onClick={(e) => {
                                if (!e.target.closest('.checkbox-container') && !e.target.closest('a')) {
                                    handleCheckboxChange(p.id);
                                }
                            }}
                        >
                            {/* Checkbox */}
                            <div className="absolute top-3 left-3 z-30">
                                <div
                                    className={`w-6 h-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg cursor-pointer ${selectedProducts.includes(p.id)
                                        ? 'bg-blue-600 text-white transform scale-110'
                                        : 'bg-white border text-gray-300 hover:border-blue-300'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(p.id);
                                    }}
                                >
                                    {selectedProducts.includes(p.id) && <FiCheck className="w-4 h-4" />}
                                </div>
                            </div>

                            {/* Image Area */}
                            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50">
                                <img
                                    src={p.images && p.images[0] ? p.images[0] : '/placeholder-product.jpg'}
                                    alt={p.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {p.id === product.id && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                        THIS ITEM
                                    </div>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="text-center">
                                <h3 className={`font-bold text-sm mb-2 line-clamp-2 min-h-[2.5em] transition-colors ${selectedProducts.includes(p.id) ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {p.name}
                                </h3>
                                <div className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {formatPrice(p.price || 0)}
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
                                <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/products/${p.id}`);
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* Total & Action Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
                <div className="flex items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-1">Bundle Total</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900">{formatPrice(totalPrice)}</span>
                            {savings > 0 && (
                                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                                    Save {formatPrice(savings)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAddAllToCart}
                    disabled={selectedProducts.length === 0}
                    className={`relative overflow-hidden group px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 transform hover:-translate-y-1 ${selectedProducts.length > 0
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl hover:shadow-[0_10px_25px_rgba(236,72,153,0.4)]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        <FiShoppingCart className={`w-6 h-6 ${selectedProducts.length > 0 ? 'animate-bounce-custom' : ''}`} />
                        Add {selectedProducts.length} Items to Cart
                    </span>
                    {selectedProducts.length > 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] animate-shine"></div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
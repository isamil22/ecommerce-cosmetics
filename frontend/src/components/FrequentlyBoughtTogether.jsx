// frontend/src/components/FrequentlyBoughtTogether.jsx
import React, { useState, useEffect } from 'react';
import { getFrequentlyBoughtTogether, addToCart as apiAddToCart } from '../api/apiService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const FrequentlyBoughtTogether = ({ product, fetchCartCount, isAuthenticated }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

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
            toast.warn('Please select at least one item.');
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

            toast.success(`${productsToAdd.length} item(s) added to cart!`);
            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (error) {
            console.error("Failed to add items to cart", error);
            toast.error('Failed to add items to cart.');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded"></div>
                        <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (relatedProducts.length === 0) {
        // For testing purposes, let's show a fallback message
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Frequently Bought Together</h2>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No related products found for this item.</p>
                    <p className="text-sm text-gray-400 mt-2">Related products will appear here when available.</p>
                    <div className="mt-4 text-xs text-gray-300">
                        <p>This feature requires products to have frequently bought together relationships configured in the admin panel.</p>
                    </div>
                </div>
            </div>
        );
    }

    const allDisplayProducts = [product, ...relatedProducts];
    const selectedProductsData = allDisplayProducts.filter(p => selectedProducts.includes(p.id));
    const totalPrice = selectedProductsData.reduce((total, p) => total + (p.price || 0), 0);


    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Frequently Bought Together</h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
                💡 Click anywhere on any product card to toggle selection
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
                {allDisplayProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                        <div 
                            className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg ${
                                selectedProducts.includes(p.id) 
                                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                            }`}
                            onClick={(e) => {
                                // Only handle click if it's not on the checkbox area
                                if (!e.target.closest('.flex.items-center.mr-3')) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCheckboxChange(p.id);
                                }
                            }}
                            title="Click anywhere on this card to toggle selection"
                            style={{ userSelect: 'none', position: 'relative', zIndex: 10, minWidth: '140px' }}
                        >
                            <div className="flex items-center mr-3">
                                <div
                                    className={`h-6 w-6 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                        selectedProducts.includes(p.id)
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCheckboxChange(p.id);
                                    }}
                                    style={{ 
                                        pointerEvents: 'auto',
                                        zIndex: 20,
                                        position: 'relative'
                                    }}
                                >
                                    {selectedProducts.includes(p.id) && (
                                        <svg 
                                            className="w-4 h-4" 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                        >
                                            <path 
                                                fillRule="evenodd" 
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                                clipRule="evenodd" 
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <img 
                                    src={p.images && p.images[0] ? p.images[0] : '/placeholder-product.jpg'} 
                                    alt={p.name} 
                                    className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.jpg';
                                    }}
                                />
                                <span className={`text-sm mt-2 text-center max-w-[100px] truncate ${
                                    selectedProducts.includes(p.id) 
                                        ? 'text-gray-700' 
                                        : 'text-gray-500'
                                }`}>
                                    {p.name}
                                    {p.id === product.id && (
                                        <span className="block text-xs text-blue-600 font-medium">(Main Product)</span>
                                    )}
                                </span>
                                <Link 
                                    to={`/product/${p.id}`}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    View Details
                                </Link>
                                <span className={`text-sm font-semibold ${
                                    selectedProducts.includes(p.id) 
                                        ? 'text-gray-900' 
                                        : 'text-gray-500'
                                }`}>${(p.price || 0).toFixed(2)}</span>
                            </div>
                        </div>
                        {index < allDisplayProducts.length - 1 && (
                            <span className="text-2xl text-gray-400 font-bold">+</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Total Price:</span>
                    <span className="text-xl font-bold text-pink-600">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleAddAllToCart}
                        disabled={selectedProducts.length === 0}
                        className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        Add Selected to Cart ({selectedProducts.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
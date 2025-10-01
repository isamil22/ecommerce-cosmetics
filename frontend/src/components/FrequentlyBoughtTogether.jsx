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
            console.log('Fetching frequently bought together for product:', product.id, product.name);
            setLoading(true);
            getFrequentlyBoughtTogether(product.id)
                .then(response => {
                    console.log('API Response:', response);
                    const productsData = response.data || [];
                    console.log('Products data:', productsData);
                    console.log('Product ID:', product.id);
                    setRelatedProducts(productsData);
                    // Initialize with all products selected by default
                    const initialSelected = [product.id, ...productsData.map(p => p.id)];
                    console.log('Initial selected products:', initialSelected);
                    setSelectedProducts(initialSelected);
                })
                .catch(error => {
                    console.error('Failed to fetch frequently bought together products:', error);
                    console.error('Error details:', error.response?.data || error.message);
                    
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
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleAddAllToCart = async () => {
        console.log('Add to cart button clicked!');
        alert('Button clicked! Check console for details.');
        console.log('Selected products:', selectedProducts);
        console.log('Product:', product);
        console.log('Related products:', relatedProducts);
        
        const allProducts = [product, ...relatedProducts];
        const productsToAdd = allProducts.filter(p => selectedProducts.includes(p.id));

        console.log('Products to add:', productsToAdd);

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

    console.log('Component render - loading:', loading, 'relatedProducts:', relatedProducts, 'product:', product);

    if (loading) {
        console.log('Rendering loading state');
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
        console.log('No related products found, showing fallback message');
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

    console.log('Button state - selectedProducts.length:', selectedProducts.length);
    console.log('Button disabled:', selectedProducts.length === 0);

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Frequently Bought Together</h2>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
                {allDisplayProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`product-${p.id}`}
                                checked={selectedProducts.includes(p.id)}
                                onChange={() => handleCheckboxChange(p.id)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-3"
                            />
                            <div className="flex flex-col items-center cursor-pointer">
                                <Link to={`/products/${p.id}`} className="block">
                                    <img 
                                        src={p.images && p.images[0] ? p.images[0] : '/placeholder-product.jpg'} 
                                        alt={p.name} 
                                        className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.jpg';
                                        }}
                                    />
                                </Link>
                                <span className="text-sm mt-2 text-gray-700 text-center max-w-[100px] truncate">{p.name}</span>
                                <span className="text-sm font-semibold text-gray-900">${(p.price || 0).toFixed(2)}</span>
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
                        onClick={() => alert('Test button works!')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        Test Button
                    </button>
                    <button
                        onClick={handleAddAllToCart}
                        disabled={false}
                        className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:cursor-not-allowed cursor-pointer relative z-20"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                    >
                        Add Selected to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
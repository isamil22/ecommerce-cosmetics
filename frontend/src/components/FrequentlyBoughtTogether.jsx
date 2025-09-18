// frontend/src/components/FrequentlyBoughtTogether.jsx
import React, { useState, useEffect } from 'react';
import { getFrequentlyBoughtTogether, addToCart as apiAddToCart } from '../api/apiService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Note the new 'isAuthenticated' prop here
const FrequentlyBoughtTogether = ({ product, fetchCartCount, isAuthenticated }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (product) {
            getFrequentlyBoughtTogether(product.id)
                .then(response => {
                    const productsData = response.data;
                    setRelatedProducts(productsData);
                    setSelectedProducts([product.id, ...productsData.map(p => p.id)]);
                })
                .catch(error => console.error('Failed to fetch frequently bought together products:', error));
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
        const allProducts = [product, ...relatedProducts];
        const productsToAdd = allProducts.filter(p => selectedProducts.includes(p.id));

        if (productsToAdd.length === 0) {
            toast.warn('Please select at least one item.');
            return;
        }

        try {
            // --- THIS IS THE CORRECTED LOGIC ---
            if (isAuthenticated) {
                // For authenticated users, call the backend API
                await Promise.all(productsToAdd.map(p => apiAddToCart(p.id, 1)));
            } else {
                // For GUEST users, update local storage
                let cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };

                productsToAdd.forEach(p => {
                    const existingItem = cart.items.find(item => item.id === p.id);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        // Ensure all necessary product details are added to the cart
                        const productData = {
                            ...p,
                            images: p.images || [], // Ensure images array exists
                            quantity: 1
                        };
                        cart.items.push(productData);
                    }
                });

                localStorage.setItem('cart', JSON.stringify(cart));
            }

            toast.success('Selected items added to cart!');
            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (error) {
            console.error("Failed to add items to cart", error);
            toast.error('Failed to add items to cart.');
        }
    };

    if (relatedProducts.length === 0) {
        return null;
    }

    const allDisplayProducts = [product, ...relatedProducts];
    const totalPrice = allDisplayProducts
        .filter(p => selectedProducts.includes(p.id))
        .reduce((total, p) => total + p.price, 0);

    return (
        <div className="mt-12 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Bought Together</h2>
            <div className="flex flex-wrap items-center gap-4">
                {allDisplayProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`product-${p.id}`}
                                checked={selectedProducts.includes(p.id)}
                                onChange={() => handleCheckboxChange(p.id)}
                                className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                            />
                            <label htmlFor={`product-${p.id}`} className="ml-3 flex flex-col items-center cursor-pointer">
                                <Link to={`/products/${p.id}`}>
                                    <img src={p.images && p.images[0]} alt={p.name} className="w-24 h-24 object-cover rounded-md shadow-sm border border-gray-200" />
                                </Link>
                                <span className="text-sm mt-2 text-gray-700">{p.name}</span>
                                <span className="text-sm font-semibold text-gray-900">${p.price.toFixed(2)}</span>
                            </label>
                        </div>
                        {index < allDisplayProducts.length - 1 && <span className="text-2xl text-gray-400">+</span>}
                    </React.Fragment>
                ))}
            </div>
            <div className="mt-6 text-right">
                <p className="text-xl font-bold text-gray-800">Total Price: <span className="text-pink-600">${totalPrice.toFixed(2)}</span></p>
                <button
                    onClick={handleAddAllToCart}
                    className="mt-2 bg-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors"
                >
                    Add Selected to Cart
                </button>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
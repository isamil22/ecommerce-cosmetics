// isamil22/ecommerce-basic/ecommerce-basic-7d0cae8be7d6e68651cd7c2fe9fb897e9162ff5e/frontend/src/components/FrequentlyBoughtTogether.jsx
import React, { useState, useEffect } from 'react';
import { getFrequentlyBoughtTogether, addToCart } from '../api/apiService';
import { toast } from 'react-toastify';

const FrequentlyBoughtTogether = ({ product, fetchCartCount }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (product) {
            getFrequentlyBoughtTogether(product.id)
                .then(response => {
                    setRelatedProducts(response.data);
                    setSelectedProducts([product.id, ...response.data.map(p => p.id)]);
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
        try {
            await Promise.all(selectedProducts.map(id => addToCart(id, 1)));
            toast.success('Selected items added to cart!');
            fetchCartCount();
        } catch (error) {
            toast.error('Failed to add items to cart.');
        }
    };

    if (relatedProducts.length === 0) {
        return null;
    }

    const allProducts = [product, ...relatedProducts];
    const totalPrice = allProducts
        .filter(p => selectedProducts.includes(p.id))
        .reduce((total, p) => total + p.price, 0);

    return (
        <div className="mt-12 p-6 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Frequently Bought Together</h2>
            <div className="flex items-center space-x-4">
                {allProducts.map((p, index) => (
                    <React.Fragment key={p.id}>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`product-${p.id}`}
                                checked={selectedProducts.includes(p.id)}
                                onChange={() => handleCheckboxChange(p.id)}
                                className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <label htmlFor={`product-${p.id}`} className="ml-2 flex flex-col items-center">
                                <img src={p.images[0]} alt={p.name} className="w-24 h-24 object-cover rounded-md" />
                                <span className="text-sm mt-2">{p.name}</span>
                                <span className="text-sm font-semibold">${p.price.toFixed(2)}</span>
                            </label>
                        </div>
                        {index < allProducts.length - 1 && <span className="text-2xl">+</span>}
                    </React.Fragment>
                ))}
            </div>
            <div className="mt-6 text-right">
                <p className="text-xl font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
                <button
                    onClick={handleAddAllToCart}
                    className="mt-2 bg-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700"
                >
                    Add Selected to Cart
                </button>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
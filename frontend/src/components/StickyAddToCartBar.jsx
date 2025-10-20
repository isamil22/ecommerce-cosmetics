// frontend/src/components/StickyAddToCartBar.jsx
import React from 'react';

const StickyAddToCartBar = ({ isVisible, product, displayPrice, handleAddToCart }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-50 transition-transform transform translate-y-0">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => {
                                    // Fallback to emoji if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <span 
                            className="text-lg"
                            style={{ display: product.images && product.images.length > 0 ? 'none' : 'block' }}
                        >
                            📦
                        </span>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">{product.name}</h4>
                        <p className="text-pink-600 font-semibold">${displayPrice}</p>
                    </div>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="bg-pink-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-pink-700 transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default StickyAddToCartBar;
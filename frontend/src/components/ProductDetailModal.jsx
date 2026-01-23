import React, { useState } from 'react';
import { formatPrice } from '../utils/currency';

const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    const images = (product.images && product.images.length > 0)
        ? product.images
        : ['/placeholder-image.svg'];

    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Main Image */}
                <div className="relative h-64 bg-gray-50 flex items-center justify-center">
                    <img
                        src={activeImage}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-opacity duration-300"
                        onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                    />
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto justify-center bg-gray-50 border-t border-gray-100">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(img)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img
                                        ? 'border-pink-500 ring-2 ring-pink-100 opacity-100'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                />
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-pink-600 font-black text-2xl">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className="text-gray-400 line-through text-sm">{formatPrice(product.oldPrice)}</span>
                        )}
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-6 max-h-40 overflow-y-auto">
                        {product.description ? (
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                            <p>لا يوجد وصف متاح لهذا المنتج. / Aucune description disponible pour ce produit.</p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        إغلاق / Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;

import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const PackRecommendations = ({ pack }) => {
    if (!pack) return null;

    const hasRecommendations = 
        (pack.recommendedProducts && pack.recommendedProducts.length > 0) ||
        (pack.recommendedPacks && pack.recommendedPacks.length > 0) ||
        (pack.recommendedCustomPacks && pack.recommendedCustomPacks.length > 0);

    if (!hasRecommendations) return null;

    return (
        <div className="mt-12 space-y-8">
            {/* Recommended Products */}
            {pack.recommendedProducts && pack.recommendedProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Recommended Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pack.recommendedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Recommended Packs */}
            {pack.recommendedPacks && pack.recommendedPacks.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        You Might Also Like
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pack.recommendedPacks.map(recommendedPack => (
                            <div key={recommendedPack.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <Link to={`/packs/${recommendedPack.id}`}>
                                    <img
                                        src={recommendedPack.imageUrl || 'https://placehold.co/300x200/f3f4f6/9ca3af?text=No+Image'}
                                        alt={recommendedPack.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {recommendedPack.name}
                                        </h3>
                                        <p className="text-pink-600 font-bold text-xl">
                                            ${recommendedPack.price?.toFixed(2)}
                                        </p>
                                        {recommendedPack.description && (
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                                {recommendedPack.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recommended Custom Packs */}
            {pack.recommendedCustomPacks && pack.recommendedCustomPacks.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Create Your Own Pack
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pack.recommendedCustomPacks.map(customPack => (
                            <div key={customPack.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-purple-200">
                                <Link to={`/custom-packs/${customPack.id}`}>
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-lg">CP</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {customPack.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {customPack.minItems}-{customPack.maxItems} items
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <p className="text-purple-600 font-bold text-xl">
                                                {customPack.pricingType === 'FIXED' 
                                                    ? `$${customPack.fixedPrice?.toFixed(2)}` 
                                                    : `${(customPack.discountRate * 100).toFixed(0)}% off`
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {customPack.pricingType === 'FIXED' ? 'Fixed Price' : 'Dynamic Discount'}
                                            </p>
                                        </div>

                                        {customPack.description && (
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {customPack.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                            </p>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-purple-200">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                Customizable Pack
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default PackRecommendations;

import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const PackRecommendations = ({ pack }) => {
    if (!pack) return null;

    const hasRecommendations = 
        (pack.recommendedProducts && pack.recommendedProducts.length > 0) ||
        (pack.recommendedPacks && pack.recommendedPacks.length > 0);

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
        </div>
    );
};

export default PackRecommendations;

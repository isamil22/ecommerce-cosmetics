import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const PackQuickView = ({ pack, isOpen, onClose }) => {
    if (!isOpen || !pack) return null;

    const imageUrl = pack.imageUrl || 'https://placehold.co/600x400/fde4f2/E91E63?text=Premium+Pack';

    // Calculate savings
    const totalItemPrice = pack.items?.reduce((total, item) => {
        return total + (item.defaultProduct?.price || 0);
    }, 0) || 0;

    const savings = totalItemPrice > pack.price ? totalItemPrice - pack.price : 0;
    const savingsPercent = savings > 0 ? Math.round((savings / totalItemPrice) * 100) : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                <div className="relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 aspect-square md:aspect-auto">
                            <img
                                src={imageUrl}
                                alt={pack.name}
                                className="w-full h-full object-cover rounded-t-xl md:rounded-l-2xl md:rounded-t-none"
                            />

                            {/* Value Badge */}
                            {savingsPercent > 0 && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    -{savingsPercent}%
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{pack.name}</h2>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {pack.description?.replace(/<[^>]*>/g, '') || 'Découvrez ce pack de produits de beauté premium.'}
                                </p>

                                {/* Pack Items */}
                                {pack.items && pack.items.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            Articles dans ce pack ({pack.items.length}):
                                        </h3>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {pack.items.map(item => (
                                                item && item.defaultProduct ? (
                                                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">📦</span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {item.defaultProduct.name}
                                                        </span>
                                                        {item.defaultProduct.price && (
                                                            <span className="text-xs text-gray-500 ml-auto">
                                                                {formatPrice(item.defaultProduct.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price Section */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 sm:gap-4 mb-2 flex-wrap">
                                        <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                            {formatPrice(pack.price || 0)}
                                        </span>
                                        {totalItemPrice > pack.price && (
                                            <span className="text-lg sm:text-xl text-gray-400 line-through">
                                                {formatPrice(totalItemPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {savings > 0 && (
                                        <p className="text-green-600 font-semibold">
                                            💰 Économisez {formatPrice(savings)} (-{savingsPercent}%)
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Link
                                    to={`/packs/${pack.id}`}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 transform hover:from-pink-600 hover:to-purple-700 hover:scale-105 text-center"
                                    onClick={onClose}
                                >
                                    Voir Dossier Complet
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackQuickView;

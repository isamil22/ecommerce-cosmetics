import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

const PackCard = ({ pack, onQuickView }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate total value if possible (sum of item prices if available) or use pack price
    // Since we don't have individual item prices easily here without more data, we focus on pack presentation.

    // Get images from items if pack has no specific image
    const displayImage = pack.imageUrl ||
        (pack.items && pack.items.length > 0 && pack.items[0].defaultProduct?.images && pack.items[0].defaultProduct.images[0]) ||
        'https://placehold.co/600x400?text=Beauty+Pack';

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={displayImage}
                    alt={pack.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Floating Action Button */}
                <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-3 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <button
                        onClick={() => onQuickView(pack)}
                        className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        title="نظرة سريعة / Aperçu Rapide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <Link
                        to={`/packs/${pack.id}`}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
                        title="عرض التفاصيل / Voir Détails"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {pack.totalSavings > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                            وفر {formatPrice(pack.totalSavings)} / Économisez
                        </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-gray-100 icon-flip">
                        {pack.items ? pack.items.length : 0} عناصر / Articles
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow relative z-10 bg-white">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
                        {pack.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 h-10">
                        {pack.description || 'اكتشف المزيج المثالي من المنتجات المختارة خصيصًا لك. / Découvrez la combinaison parfaite de produits sélectionnés rien que pour vous.'}
                    </p>
                </div>

                {/* Items Preview */}
                <div className="mb-6 flex-grow">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">محتويات الحزمة / Articles dans ce pack :</p>
                    <div className="flex flex-wrap gap-2">
                        {pack.items && pack.items.slice(0, 3).map((item, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium border border-pink-100"
                            >
                                {item.defaultProduct ? item.defaultProduct.name : 'منتج / Produit'}
                            </span>
                        ))}
                        {pack.items && pack.items.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                                +{pack.items.length - 3} المزيد / de plus
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="block text-xs text-gray-400">السعر الإجمالي / Prix Total</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            {formatPrice(pack.price || 0)}
                        </span>
                    </div>

                    <Link
                        to={`/packs/${pack.id}`}
                        className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2 ml-4"
                    >
                        عرض التفاصيل / Voir Détails
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PackCard;

import React from 'react';

const PackVisualizer = ({ pack, selections }) => {
    // Collect all selected products
    const selectedProducts = [];

    if (pack && pack.items) {
        pack.items.forEach(item => {
            const selectedId = selections[item.id];
            if (selectedId) {
                // Find the product (either default or one of variations)
                const allProducts = [item.defaultProduct, ...(item.variationProducts || [])];
                const product = allProducts.find(p => p && p.id === selectedId);
                if (product) {
                    selectedProducts.push(product);
                }
            } else if (item.defaultProduct) {
                // Fallback to default if nothing selected yet (should verify logic matches parent)
                selectedProducts.push(item.defaultProduct);
            }
        });
    }

    if (selectedProducts.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-lg">
                <img
                    src={pack?.imageUrl || '/placeholder-image.svg'}
                    alt={pack?.name}
                    className="max-w-full max-h-[300px] object-contain"
                />
            </div>
        );
    }

    // Dynamic Grid Logic for varying item counts
    let gridClassName = "grid-cols-2";
    let imageSizeClass = "max-h-[150px] sm:max-h-[200px]";

    if (selectedProducts.length === 1) {
        gridClassName = "grid-cols-1";
        imageSizeClass = "max-h-[250px] sm:max-h-[350px]";
    } else if (selectedProducts.length === 2) {
        gridClassName = "grid-cols-2";
        imageSizeClass = "max-h-[180px] sm:max-h-[220px]";
    } else if (selectedProducts.length === 3) {
        gridClassName = "grid-cols-2 sm:grid-cols-3"; // 2 on mobile, 3 on desktop
    } else if (selectedProducts.length === 4) {
        gridClassName = "grid-cols-2";
    } else if (selectedProducts.length >= 5 && selectedProducts.length <= 6) {
        gridClassName = "grid-cols-2 sm:grid-cols-3"; // 3 cols on desktop is nice for 6
        imageSizeClass = "max-h-[120px] sm:max-h-[160px]";
    } else if (selectedProducts.length >= 7) {
        gridClassName = "grid-cols-3 sm:grid-cols-4";
        imageSizeClass = "max-h-[100px] sm:max-h-[140px]";
    }

    return (
        <div className="w-full h-full min-h-[300px] bg-white rounded-xl overflow-hidden p-4">
            <div className={`grid ${gridClassName} gap-4 h-full content-center justify-center`}>
                {selectedProducts.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className={`relative group flex items-center justify-center p-2 transition-all duration-500 animate-fadeIn`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl transform rotate-3 scale-90 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img
                            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.svg'}
                            alt={product.name}
                            className={`relative z-10 max-w-full ${imageSizeClass} object-contain drop-shadow-md hover:scale-110 transition-transform duration-300`}
                        />
                        {/* Optional: Show quantity or badge if needed */}
                    </div>
                ))}
            </div>

            {/* Composition Plus Sign Overlay for visual flair (optional) */}
            {selectedProducts.length > 1 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                    <span className="text-9xl font-bold text-gray-900">+</span>
                </div>
            )}
        </div>
    );
};

export default PackVisualizer;

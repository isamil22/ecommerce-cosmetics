// Enhanced Pack Detail Page for Better User Experience - Moroccan Users
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPackById, addToCart as apiAddToCart } from '../api/apiService';
import Loader from '../components/Loader';
import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter.jsx';
import { toast } from 'react-toastify';
import CommentForm from '../components/CommentForm';
import PackRecommendations from '../components/PackRecommendations';
import EnhancedCountdown from '../components/EnhancedCountdown';
import PurchaseNotifications from '../components/PurchaseNotifications';
import StickyAddToCart from '../components/StickyAddToCart';
import './PackDetailPage.css';

const ProductOption = ({ product, packItemId, selectedProductId, onSelectionChange, isDefault }) => {
    const imageUrl = (product.images && product.images.length > 0)
        ? product.images[0]
        : '/placeholder-image.svg';

    const isSelected = selectedProductId === product.id;

    // Compact container classes for mobile
    const containerClasses = `
        relative flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform
        ${isSelected
            ? 'bg-pink-50 border-pink-500 ring-2 sm:ring-4 ring-pink-200 shadow-md'
            : 'border-gray-200 hover:bg-gray-50 hover:border-pink-300'
        }
    `;

    return (
        <label
            className={containerClasses}
            role="button"
            tabIndex={0}
            aria-label={`${isSelected ? 'Selected' : 'Select'} ${product.name} for ${(product.price || 0).toFixed(2)} dollars`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectionChange(packItemId, product.id);
                }
            }}
        >
            {/* Selection Indicator - Smaller on mobile */}
            {isSelected && (
                <div className="absolute -top-2 -left-2 bg-pink-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-base animate-bounce-custom z-10">
                    ✓
                </div>
            )}

            {/* Smaller Image on Mobile */}
            <div className="image-zoom-container mr-3 sm:mr-4 flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-100"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.svg';
                    }}
                />
            </div>

            <div className="flex-grow min-w-0">
                <div className="flex items-center mb-1 sm:mb-2 flex-wrap gap-1">
                    <span className="text-gray-800 font-bold text-sm sm:text-lg truncate block max-w-full">
                        {product.name || 'Unnamed Product'}
                    </span>
                    {isDefault && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                            ✅ افتراضي
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-pink-600 font-bold text-base sm:text-xl">
                        ${(product.price || 0).toFixed(2)}
                    </span>
                    <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-semibold whitespace-nowrap ${isSelected
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isSelected ? '✓ مختار' : 'اختيار'}
                    </div>
                </div>
            </div>

            <input
                type="radio"
                name={`pack-item-${packItemId}`}
                value={product.id}
                checked={isSelected}
                onChange={() => onSelectionChange(packItemId, product.id)}
                className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600 focus:ring-pink-500 border-gray-300 ml-3 shrink-0"
                aria-hidden="true"
            />
        </label>
    );
};

const PackItemSelector = ({ item, selectedProductId, onSelectionChange }) => (
    <div className="border border-gray-200 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow relative">
        {/* Section Header - More Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg mb-4 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 border-b border-gray-100">
            <h4 className="font-bold text-base sm:text-xl text-gray-800 flex items-center">
                <span className="bg-pink-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm mr-2 sm:mr-3 shrink-0">
                    📦
                </span>
                <span className="text-pink-600 font-extrabold truncate">
                    {item.defaultProduct ? item.defaultProduct.name : 'منتج / Product'}
                </span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-9">
                اختر المنتج الذي تريده لهذا القسم
            </p>
        </div>

        {item.defaultProduct && (
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold mr-2 border border-green-100">
                        ✅ مُضمن / Included
                    </span>
                </div>
                <ProductOption
                    product={item.defaultProduct}
                    packItemId={item.id}
                    selectedProductId={selectedProductId}
                    onSelectionChange={onSelectionChange}
                    isDefault={true}
                />
            </div>
        )}

        {item.variationProducts && item.variationProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <div className="flex items-center mb-3">
                    <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold mr-2 border border-yellow-100">
                        🔄 بدائل / Options
                    </span>
                </div>
                <h5 className="font-bold text-sm sm:text-lg text-gray-700 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    أو استبدل بـ:
                </h5>
                <div className="space-y-3">
                    {item.variationProducts.map(product => (
                        <ProductOption
                            key={product.id}
                            product={product}
                            packItemId={item.id}
                            selectedProductId={selectedProductId}
                            onSelectionChange={onSelectionChange}
                            isDefault={false}
                        />
                    ))}
                </div>
            </div>
        )}

        {(!item.variationProducts || item.variationProducts.length === 0) && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700 text-xs flex items-center">
                    <span className="mr-2">ℹ️</span>
                    لا بدائل متاحة / No alternatives
                </p>
            </div>
        )}
    </div>
);

const PackDetailPage = ({ isAuthenticated, fetchCartCount }) => {
    const { id } = useParams();
    const [pack, setPack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selections, setSelections] = useState({});
    const [initialSelections, setInitialSelections] = useState({});
    const [composedImageUrl, setComposedImageUrl] = useState(null);
    const [initialPackImageUrl, setInitialPackImageUrl] = useState('');
    // Enhanced UX state variables
    const [showWelcome, setShowWelcome] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    const fetchPack = async () => {
        try {
            const response = await getPackById(id);
            const packData = response.data;
            setPack(packData);
            setComposedImageUrl(packData.imageUrl);
            setInitialPackImageUrl(packData.imageUrl);

            // --- FACEBOOK PIXEL: VIEWCONTENT EVENT ---
            if (window.fbq) {
                window.fbq('track', 'ViewContent', {
                    content_ids: [packData.id],
                    content_name: packData.name,
                    content_type: 'product_group',
                    value: packData.price,
                    currency: 'USD'
                });
            }
            // -----------------------------------------

            const initial = {};
            if (packData && packData.items) {
                packData.items.forEach(item => {
                    if (item && item.defaultProduct) {
                        initial[item.id] = item.defaultProduct.id;
                    }
                });
            }
            setSelections(initial);
            setInitialSelections(initial);
        } catch (err) {
            setError('Failed to fetch pack details. It might not exist.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Interactive tutorial for pack understanding
    const startInteractiveTutorial = () => {
        const steps = [
            { element: 'pack-image', message: 'هذه صورة الحزمة', duration: 4000 },
            { element: 'customization', message: 'هنا يمكنك تخصيص الحزمة', duration: 4000 },
            { element: 'product-options', message: 'اختر المنتجات التي تريدها', duration: 4000 },
            { element: 'add-to-cart', message: 'اضغط هنا لإضافة للسلة', duration: 4000 }
        ];

        let currentStepIndex = 0;

        const showNextStep = () => {
            if (currentStepIndex < steps.length) {
                setHighlightedElement(steps[currentStepIndex].element);
                const timeoutId = setTimeout(() => {
                    currentStepIndex++;
                    if (currentStepIndex < steps.length) {
                        showNextStep();
                    } else {
                        setDemoMode(false);
                        setHighlightedElement(null);
                    }
                }, steps[currentStepIndex].duration);
                window.currentTutorialTimeout = timeoutId;
            }
        };

        if (window.currentTutorialTimeout) {
            clearTimeout(window.currentTutorialTimeout);
        }

        showNextStep();
    };

    useEffect(() => {
        return () => {
            if (window.currentTutorialTimeout) {
                clearTimeout(window.currentTutorialTimeout);
                window.currentTutorialTimeout = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!pack || Object.keys(selections).length === 0) return;
        const isDefaultSelection = JSON.stringify(selections) === JSON.stringify(initialSelections);

        if (isDefaultSelection && initialPackImageUrl) {
            setComposedImageUrl(initialPackImageUrl);
            return;
        }

        const composeImage = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const imageUrls = pack.items.map(item => {
                const selectedProductId = selections[item.id];
                const allProducts = [item.defaultProduct, ...item.variationProducts];
                const selectedProduct = allProducts.find(p => p && p.id === selectedProductId);
                return selectedProduct?.images?.[0] || null;
            }).filter(Boolean);

            if (imageUrls.length === 0) {
                setComposedImageUrl(initialPackImageUrl);
                return;
            };

            try {
                const images = await Promise.all(imageUrls.map(url => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.onload = () => resolve(img);
                        img.onerror = (err) => reject(new Error(`Failed to load image: ${url}`));
                        img.src = url;
                    });
                }));

                let totalWidth = 0;
                let maxHeight = 0;
                images.forEach(img => {
                    totalWidth += img.width;
                    if (img.height > maxHeight) {
                        maxHeight = img.height;
                    }
                });

                canvas.width = totalWidth;
                canvas.height = maxHeight;

                let currentX = 0;
                images.forEach(img => {
                    ctx.drawImage(img, currentX, 0);
                    currentX += img.width;
                });

                setComposedImageUrl(canvas.toDataURL('image/png'));
            } catch (err) {
                console.error("Image composition failed:", err);
                setComposedImageUrl(initialPackImageUrl);
            }
        };

        composeImage();

    }, [selections, pack, initialPackImageUrl, initialSelections]);

    useEffect(() => {
        fetchPack();
    }, [id]);

    const handleSelectionChange = (packItemId, selectedProductId) => {
        setSelections(prev => ({ ...prev, [packItemId]: selectedProductId }));
    };

    const handleReset = () => {
        setSelections(initialSelections);
        setComposedImageUrl(initialPackImageUrl);
        setMessage('Selections have been reset to their default options.');
        setError('');
    };

    const handleAddToCart = async () => {
        setMessage('');
        setError('');
        try {
            if (isAuthenticated) {
                const promises = Object.values(selections).map(productId => apiAddToCart(productId, 1));
                await Promise.all(promises);
            } else {
                let cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
                const allProductsInPack = pack?.items?.flatMap(item => [item.defaultProduct, ...(item.variationProducts || [])]) || [];

                for (const packItemId in selections) {
                    const selectedProductId = selections[packItemId];
                    const productToAdd = allProductsInPack.find(p => p && p.id === selectedProductId);

                    if (productToAdd) {
                        const existingItemIndex = cart.items.findIndex(item => item.productId === productToAdd.id);

                        if (existingItemIndex > -1) {
                            cart.items[existingItemIndex].quantity += 1;
                        } else {
                            cart.items.push({
                                productId: productToAdd.id,
                                productName: productToAdd.name,
                                price: productToAdd.price,
                                quantity: 1,
                                images: productToAdd.images || [],
                            });
                        }
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
            }

            if (window.fbq) {
                window.fbq('track', 'AddToCart', {
                    content_ids: Object.values(selections),
                    content_name: pack.name,
                    content_type: 'product_group',
                    value: pack.price,
                    currency: 'USD'
                });
            }

            toast.success('🎉 تم إضافة الحزمة للسلة! / Added to cart!');
            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (err) {
            console.error("Error during add to cart:", err);
            setError('فشل في إضافة المنتجات للسلة');
            toast.error('فشل في إضافة المنتجات للسلة');
        }
    };

    const handleCommentAdded = () => {
        fetchPack();
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 max-w-7xl">
            {/* Welcome Overlay - Responsive */}
            {showWelcome && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full text-center shadow-2xl max-h-[90vh] overflow-y-auto animate-zoom-in">
                        <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-slow">📦</div>
                        <h2 className="text-xl sm:text-3xl font-bold mb-4 text-gray-800">
                            مرحباً بك في حزمة التوفير!
                            <br />
                            <span className="text-pink-600 block mt-2 text-lg sm:text-2xl">Value Pack Offers!</span>
                        </h2>

                        <div className="bg-yellow-50 border border-yellow-300 p-3 sm:p-4 rounded-xl mb-6">
                            <p className="text-yellow-800 font-bold text-sm sm:text-lg">
                                💡 خذ منتجات أكثر .. وادفع أقل!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="text-2xl mb-1">👀</div>
                                <p className="text-blue-800 font-bold text-sm">1. تصفح</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="text-2xl mb-1">👆</div>
                                <p className="text-green-800 font-bold text-sm">2. اختر</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <div className="text-2xl mb-1">🛒</div>
                                <p className="text-purple-800 font-bold text-sm">3. وفر</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setShowWelcome(false);
                                    setDemoMode(true);
                                    startInteractiveTutorial();
                                }}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-lg"
                            >
                                🎬 كيف أطلب الحزمة؟
                            </button>

                            <button
                                onClick={() => setShowWelcome(false)}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all font-semibold text-sm sm:text-base border border-gray-200"
                            >
                                فهمت! سأبدأ الآن
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Demo Mode Overlay */}
            {demoMode && highlightedElement && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-40 pointer-events-none">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg animate-bounce">
                        👀 انظر هنا!
                    </div>
                </div>
            )}

            {/* Countdown Timer */}
            {pack?.showCountdownTimer && (
                <EnhancedCountdown
                    packName={pack.name}
                    fallbackEndTime={new Date().getTime() + (24 * 60 * 60 * 1000)}
                    onExpire={() => toast.info('انتهى العرض')}
                />
            )}

            {/* Header Section */}
            <div className="mb-4 sm:mb-8 text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-4 tracking-tight">
                    📦 {pack ? pack.name : 'Loading Pack...'}
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-3xl">
                    اصنع حزمتك الخاصة بالسعر الذي يناسبك
                </p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-semibold shadow-sm"
                    >
                        <span>❓ مساعدة</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowWelcome(true);
                            setShowHelp(false);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 text-sm font-semibold shadow-sm"
                    >
                        <span>🎬 شرح</span>
                    </button>
                </div>
            </div>

            {/* Help Panel */}
            {showHelp && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg text-sm sm:text-base animate-fadeIn">
                    <h3 className="font-bold mb-2 text-blue-800">💡 طريقة الطلب:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-blue-900">
                        <li>اختر المنتجات من القائمة في الأسفل</li>
                        <li>شاهد السعر يتحدث تلقائياً</li>
                        <li>أضف الحزمة كاملة للسلة بضغطة واحدة</li>
                    </ol>
                </div>
            )}

            {/* Feedback Messages */}
            {(error || message) && (
                <div className={`p-4 mb-6 rounded-lg border-l-4 ${error ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
                    <p className="font-semibold">{error || message}</p>
                </div>
            )}

            {!pack && !loading && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-400">Pack not found</p>
                </div>
            )}

            {pack && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
                        {/* Left Side: Pack Image & Summary */}
                        <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24">
                            {/* Pack Image Card */}
                            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${highlightedElement === 'pack-image' ? 'ring-4 ring-yellow-400' : ''}`}>
                                <div className="bg-gray-50 p-2 sm:p-4 flex items-center justify-center min-h-[250px] sm:min-h-[350px]">
                                    <img
                                        key={composedImageUrl}
                                        src={composedImageUrl || 'https://placehold.co/1200x600/fde4f2/E91E63?text=Pack'}
                                        alt={pack.name}
                                        className="w-full h-auto object-contain max-h-[400px] rounded-lg shadow-sm"
                                        onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                    />
                                </div>

                                <div className="p-4 sm:p-6 bg-white">
                                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">السعر الإجمالي للصفقة</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl sm:text-5xl font-black tracking-tight">${(pack.price || 0).toFixed(2)}</p>
                                                {pack.originalPrice > pack.price && (
                                                    <span className="text-lg text-pink-200 line-through">${pack.originalPrice}</span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm mt-2 font-medium bg-white/20 inline-block px-2 py-1 rounded">✨ توفير مميز</p>
                                        </div>
                                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    </div>

                                    <div className="mt-4">
                                        <EnhancedVisitorCounter />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Options */}
                        <div className={`transition-all duration-300 ${highlightedElement === 'customization' ? 'ring-2 ring-yellow-400 rounded-2xl p-2' : ''}`}>
                            <div className="bg-indigo-600 text-white p-4 sm:p-6 rounded-2xl mb-6 shadow-md">
                                <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                                    <span className="mr-2 text-2xl">🎨</span>
                                    ابدأ التخصيص
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    لديك {pack.items?.length || 0} خيارات لتحديدها
                                </p>
                            </div>

                            <div className={`space-y-4 sm:space-y-6 mb-8 ${highlightedElement === 'product-options' ? 'ring-2 ring-yellow-400 rounded-xl p-2' : ''}`}>
                                {pack.items && pack.items.map((item, index) => (
                                    <div key={item.id} className="enhanced-pack-item">
                                        <PackItemSelector
                                            item={item}
                                            selectedProductId={selections[item.id]}
                                            onSelectionChange={handleSelectionChange}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Sticky Mobile Checkout */}
                            <div className={`sticky bottom-2 z-30 transition-all duration-300 ${highlightedElement === 'add-to-cart' ? 'ring-4 ring-yellow-400 rounded-xl' : ''}`}>
                                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-3 sm:p-6 shadow-2xl">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 text-base sm:text-xl shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span className="animate-pulse">✨</span>
                                        إضافة الحزمة للسلة
                                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">${(pack.price || 0).toFixed(0)}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                            <span className="mr-2">📝</span>
                            تفاصيل الحزمة
                        </h3>
                        <div
                            className="text-gray-600 leading-relaxed text-sm sm:text-base prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: pack.description }}
                        />
                    </div>

                    {/* Simple Reviews Section */}
                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">💬 آراء العملاء</h2>
                        {pack.comments && pack.comments.length > 0 ? (
                            <div className="grid gap-4">
                                {pack.comments.map(comment => (
                                    <div key={comment.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div className="font-bold text-gray-800 ml-auto">{comment.userFullName}</div>
                                            <div className="text-yellow-400 text-sm">{'★'.repeat(comment.score)}</div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                                لا توجد تعليقات حتى الآن
                            </div>
                        )}
                        {!pack.hideCommentForm && (
                            <div className="mt-6">
                                <CommentForm />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PackDetailPage;
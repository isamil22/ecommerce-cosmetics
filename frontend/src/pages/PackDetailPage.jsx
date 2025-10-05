// Enhanced Pack Detail Page for Better User Experience - Moroccan Users
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPackById, addToCart as apiAddToCart } from '../api/apiService';
import Loader from '../components/Loader';
import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter.jsx';
import CountdownBar from '../components/CountdownBar';
import { toast } from 'react-toastify';
import CommentForm from '../components/CommentForm';
import PackRecommendations from '../components/PackRecommendations';
import EnhancedCountdown from '../components/EnhancedCountdown';
import LiveVisitorCounter from '../components/LiveVisitorCounter';
import PurchaseNotifications from '../components/PurchaseNotifications';
import StickyAddToCart from '../components/StickyAddToCart';
import './PackDetailPage.css';

const ProductOption = ({ product, packItemId, selectedProductId, onSelectionChange, isDefault }) => {
    const imageUrl = (product.images && product.images.length > 0)
        ? product.images[0]
        : '/placeholder-image.svg';

    const isSelected = selectedProductId === product.id;

    const containerClasses = `
        relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-102
        ${isSelected 
            ? 'bg-pink-50 border-pink-500 ring-4 ring-pink-200 shadow-lg' 
            : 'border-gray-300 hover:bg-gray-50 hover:border-pink-300 hover:shadow-md'
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
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-2 -left-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold animate-bounce-custom">
                    ✓
                </div>
            )}
            
            <div className="image-zoom-container mr-4">
                <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-lg" 
                    onError={(e) => {
                        e.target.src = '/placeholder-image.svg';
                    }}
                />
            </div>
            
            <div className="flex-grow">
                <div className="flex items-center mb-2">
                    <span className="text-gray-800 font-bold text-lg">{product.name || 'Unnamed Product'}</span>
                    {isDefault && (
                        <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ✅ افتراضي / Default
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-pink-600 font-bold text-xl">${(product.price || 0).toFixed(2)}</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isSelected 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                        {isSelected ? '✓ مختار / Selected' : 'اضغط للاختيار / Click to Select'}
                    </div>
                </div>
            </div>
            
            <input
                type="radio"
                name={`pack-item-${packItemId}`}
                value={product.id}
                checked={isSelected}
                onChange={() => onSelectionChange(packItemId, product.id)}
                className="h-6 w-6 text-pink-600 focus:ring-pink-500 border-gray-300 ml-4"
                aria-hidden="true"
            />
        </label>
    );
};

const PackItemSelector = ({ item, selectedProductId, onSelectionChange }) => (
    <div className="border-2 border-gray-200 p-6 rounded-xl mb-6 bg-white shadow-xl overflow-hidden relative">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg mb-6 -mx-6 -mt-6 mb-6">
            <h4 className="font-bold text-xl text-gray-800 flex items-center">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                    📦
                </span>
                <span className="text-pink-600 font-extrabold">
                    {item.defaultProduct ? item.defaultProduct.name : 'منتج / Product'}
                </span>
            </h4>
            <p className="text-sm text-gray-600 mt-2">
                اختر المنتج الذي تريده لهذا القسم / Choose the product you want for this section
            </p>
        </div>

        {item.defaultProduct && (
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                        ✅ مُضمن افتراضياً / Included by default
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
            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
                <div className="flex items-center mb-4">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                        🔄 بدائل متاحة / Available Alternatives
                    </span>
                </div>
                <h5 className="font-bold text-lg text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    أو استبدل بخيار آخر / Or swap with another option:
                </h5>
                <div className="space-y-4">
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

        {/* No alternatives message */}
        {(!item.variationProducts || item.variationProducts.length === 0) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm flex items-center">
                    <span className="mr-2">ℹ️</span>
                    هذا المنتج ليس له بدائل متاحة / This product has no available alternatives
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

    // Interactive tutorial for pack understanding - FIXED memory leak
    const startInteractiveTutorial = () => {
        const steps = [
            { element: 'pack-image', message: 'هذه صورة الحزمة / This is the pack image', duration: 4000 },
            { element: 'customization', message: 'هنا يمكنك تخصيص الحزمة / Here you can customize the pack', duration: 4000 },
            { element: 'product-options', message: 'اختر المنتجات التي تريدها / Choose the products you want', duration: 4000 },
            { element: 'add-to-cart', message: 'اضغط هنا لإضافة للسلة / Click here to add to cart', duration: 4000 }
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
                
                // Store timeout ID for cleanup
                window.currentTutorialTimeout = timeoutId;
            }
        };
        
        // Clear any existing timeout
        if (window.currentTutorialTimeout) {
            clearTimeout(window.currentTutorialTimeout);
        }
        
        showNextStep();
    };

    // Cleanup effect for tutorial
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
                // --- REVISED GUEST LOGIC ---
                let cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };

                // Safely get all possible products in the pack
                const allProductsInPack = pack?.items?.flatMap(item => [item.defaultProduct, ...(item.variationProducts || [])]) || [];

                for (const packItemId in selections) {
                    const selectedProductId = selections[packItemId];
                    // Find the full product object for the selected ID
                    const productToAdd = allProductsInPack.find(p => p && p.id === selectedProductId);

                    if (productToAdd) {
                        const existingItemIndex = cart.items.findIndex(item => item.productId === productToAdd.id);

                        if (existingItemIndex > -1) {
                            // Increment quantity if item already exists
                            cart.items[existingItemIndex].quantity += 1;
                        } else {
                            // Add new item to cart
                            cart.items.push({
                                productId: productToAdd.id,
                                productName: productToAdd.name,
                                price: productToAdd.price,
                                quantity: 1,
                                images: productToAdd.images || [], // Ensure images is an array
                            });
                        }
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
            }

            // --- FACEBOOK PIXEL: ADD TO CART EVENT ---
            if (window.fbq) {
                window.fbq('track', 'AddToCart', {
                    content_ids: Object.values(selections),
                    content_name: pack.name,
                    content_type: 'product_group',
                    value: pack.price,
                    currency: 'USD'
                });
            }
            // -----------------------------------------

            toast.success('🎉 تم إضافة الحزمة للسلة! / All selected pack items have been added to your cart!');
            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (err) {
            console.error("Error during add to cart:", err);
            setError('فشل في إضافة المنتجات للسلة / Failed to add items to cart. Please try again.');
            toast.error('فشل في إضافة المنتجات للسلة / Failed to add items to cart.');
        }
    };

    const handleCommentAdded = () => {
        fetchPack();
    };

    if (loading) return <Loader />;

    const steps = [
        { number: 1, title: "فهم الحزمة", titleEn: "Understand Pack", description: "تعرف على محتويات الحزمة", descriptionEn: "Learn about pack contents" },
        { number: 2, title: "تخصيص الحزمة", titleEn: "Customize Pack", description: "اختر المنتجات التي تريدها", descriptionEn: "Choose your preferred products" },
        { number: 3, title: "إضافة للسلة", titleEn: "Add to Cart", description: "أضف الحزمة لسلة التسوق", descriptionEn: "Add pack to shopping cart" }
    ];

    const getStepStatus = (stepNumber) => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'active';
        return 'upcoming';
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Welcome Overlay for First-Time Users */}
            {showWelcome && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full mx-4 text-center shadow-2xl max-h-screen overflow-y-auto animate-pulse-custom">
                        <div className="text-8xl mb-6 animate-bounce-custom">📦</div>
                        <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-gray-800">
                            مرحباً! هذه حزمة منتجات 🎁<br/>
                            <span className="text-pink-600">Welcome! This is a Product Pack!</span>
                        </h2>
                        
                        <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg mb-6">
                            <p className="text-yellow-800 font-bold text-lg">
                                💡 ما هي الحزمة؟ / What is a Pack?<br/>
                                <span className="text-base font-normal">
                                    مجموعة منتجات بسعر مخفض! / A group of products at a discounted price!
                                </span>
                            </p>
                        </div>

                        <div className="space-y-4 text-base sm:text-lg">
                            <p className="text-gray-700 font-bold text-xl">
                                🎯 ما ستفعله هنا بسهولة:<br/>
                                🎯 What you'll do here easily:
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                                    <div className="text-3xl mb-2">👀</div>
                                    <p className="text-blue-800 font-semibold">
                                        1. انظر<br/>
                                        Look
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        شاهد المنتجات<br/>
                                        See the products
                                    </p>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                                    <div className="text-3xl mb-2">👆</div>
                                    <p className="text-green-800 font-semibold">
                                        2. اختر<br/>
                                        Choose
                                    </p>
                                    <p className="text-sm text-green-600 mt-1">
                                        اضغط على ما تريد<br/>
                                        Click what you want
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                                    <div className="text-3xl mb-2">🛒</div>
                                    <p className="text-purple-800 font-semibold">
                                        3. اشتري<br/>
                                        Buy
                                    </p>
                                    <p className="text-sm text-purple-600 mt-1">
                                        بسعر مخفض!<br/>
                                        At discount price!
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-pink-100 border-2 border-pink-300 p-4 rounded-lg">
                                <p className="text-pink-800 font-bold">
                                    ✨ سهل جداً! لا تحتاج خبرة في التسوق الإلكتروني<br/>
                                    ✨ Very easy! No online shopping experience needed
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <button
                                onClick={() => {
                                    setShowWelcome(false);
                                    setDemoMode(true);
                                    startInteractiveTutorial();
                                }}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 rounded-xl text-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 animate-pulse-custom shadow-lg"
                                aria-label="Start interactive tutorial to learn how to use the pack page"
                            >
                                🎬 أرني كيف أستخدم الصفحة!<br/>
                                <span className="text-lg">Show me how to use the page!</span>
                            </button>
                            
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-3 px-6 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 font-semibold"
                                aria-label="Skip tutorial and start using the pack page"
                            >
                                فهمت! دعني أبدأ بنفسي<br/>
                                <span className="text-sm">I got it! Let me start myself</span>
                            </button>
                            
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-500">
                                    💡 نصيحة: اختر "أرني كيف" إذا كانت هذه أول مرة<br/>
                                    💡 Tip: Choose "Show me how" if this is your first time
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Demo Mode Overlay */}
            {demoMode && highlightedElement && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-40 pointer-events-none">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg animate-bounce-custom">
                        👀 انظر هنا! / Look here!
                    </div>
                </div>
            )}

            <CountdownBar />
            
            {/* Enhanced Countdown Timer */}
            {pack && (
                <EnhancedCountdown 
                    endTime={new Date().getTime() + (24 * 60 * 60 * 1000)} // 24 hours from now
                    packName={pack.name}
                    onExpire={() => {
                        toast.info('🕐 انتهت فترة العرض الخاص / Special offer period ended');
                    }}
                />
            )}
            
            {/* Header with Help Buttons */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-800">
                        📦 {pack ? pack.name : 'Loading Pack...'}
                    </h1>
                    <div className="bg-blue-50 p-3 rounded-lg mt-3">
                        <p className="text-sm sm:text-base text-blue-800 font-semibold">
                            💡 اختر المنتجات واحصل على خصم! / Choose products and get a discount!
                        </p>
                    </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2 justify-center lg:justify-start">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <span>🤔</span>
                        <span>مساعدة / Help</span>
                    </button>
                    <button
                        onClick={() => setShowWelcome(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                    >
                        <span>🎬</span>
                        <span>شرح مرة أخرى / Show again</span>
                    </button>
                </div>
            </div>

            {/* Help Panel */}
            {showHelp && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-lg">
                    <h3 className="text-lg font-bold mb-3 text-blue-800">كيفية استخدام الحزمة / How to Use the Pack</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>1.</strong> انظر إلى صورة الحزمة ومحتوياتها / Look at the pack image and contents</p>
                        <p><strong>2.</strong> اختر المنتجات التي تريدها من كل قسم / Choose products you want from each section</p>
                        <p><strong>3.</strong> ستتغير الصورة تلقائياً حسب اختيارك / The image will change automatically based on your choice</p>
                        <p><strong>4.</strong> اضغط "إضافة للسلة" عندما تنتهي / Click "Add to Cart" when finished</p>
                        <p><strong>5.</strong> يمكنك إعادة التعيين في أي وقت / You can reset anytime</p>
                    </div>
                </div>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                            <div className={`flex flex-col items-center ${index > 0 ? 'ml-4' : ''}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                                    getStepStatus(step.number) === 'completed' ? 'bg-green-500' :
                                    getStepStatus(step.number) === 'active' ? 'bg-pink-500 animate-pulse-custom' :
                                    'bg-gray-300'
                                }`}>
                                    {getStepStatus(step.number) === 'completed' ? '✓' : step.number}
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-sm font-semibold">{step.titleEn}</p>
                                    <p className="text-xs text-gray-600">{step.descriptionEn}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-16 h-1 ${getStepStatus(step.number + 1) !== 'upcoming' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
                    <p className="text-red-700 font-semibold">❌ {error}</p>
                </div>
            )}
            {message && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg">
                    <p className="text-green-700 font-semibold">✅ {message}</p>
                </div>
            )}

            {!pack && !loading && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-xl text-gray-500 mb-2">لم يتم العثور على الحزمة</p>
                    <p className="text-lg text-gray-400">Pack not found</p>
                </div>
            )}

            {pack && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Side: Pack Info & Image */}
                        <div className="space-y-6">
                            <div className={`bg-white p-6 rounded-lg shadow-xl ${highlightedElement === 'pack-image' ? 'ring-4 ring-yellow-400 animate-pulse-custom' : ''}`}>
                                <div className="image-zoom-container mb-6">
                                    <img
                                        key={composedImageUrl}
                                        src={composedImageUrl || 'https://placehold.co/1200x600/fde4f2/E91E63?text=Our+Pack'}
                                        alt={pack.name}
                                        className="w-full h-auto object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.svg';
                                        }}
                                    />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">{pack.name}</h1>
                                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg mb-4">
                                    <p className="text-2xl sm:text-3xl text-pink-600 font-bold text-center">
                                        💰 ${(pack.price || 0).toFixed(2)}
                                    </p>
                                    <p className="text-center text-sm text-gray-600 mt-1">
                                        سعر مخفض! / Discounted Price!
                                    </p>
                                </div>
                                
                                {/* Enhanced Visitor Counter */}
                                <EnhancedVisitorCounter />
                                
                                {/* Live Visitor Counter */}
                                <LiveVisitorCounter packId={id} />
                                
                                <div
                                    className="text-gray-600 leading-relaxed prose prose-gray max-w-none mt-4"
                                    dangerouslySetInnerHTML={{ __html: pack.description }}
                                />
                            </div>
                        </div>

                        {/* Right Side: Customization Options */}
                        <div className={`${highlightedElement === 'customization' ? 'ring-4 ring-yellow-400 rounded-lg p-4' : ''}`}>
                            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
                                    🔧 تخصيص الحزمة / Customize Your Pack
                                </h2>
                                <p className="text-sm text-gray-600">
                                    اختر المنتجات التي تريدها من كل قسم / Choose products you want from each section
                                </p>
                            </div>
                            
                            <div className={`space-y-4 ${highlightedElement === 'product-options' ? 'ring-4 ring-yellow-400 rounded-lg p-4' : ''}`}>
                                {pack.items && pack.items.map((item, index) => (
                                    <div key={item.id} className="enhanced-pack-item">
                                        <div className="flex items-center mb-3">
                                            <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                                                {index + 1}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                القسم {index + 1} / Section {index + 1}
                                            </h3>
                                        </div>
                                        <PackItemSelector
                                            item={item}
                                            selectedProductId={selections[item.id]}
                                            onSelectionChange={handleSelectionChange}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className={`mt-8 space-y-4 ${highlightedElement === 'add-to-cart' ? 'ring-4 ring-yellow-400 rounded-lg p-4' : ''}`}>
                                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                                    <h3 className="text-lg font-bold text-center mb-4 text-gray-800">
                                        🛒 إضافة للسلة / Add to Cart
                                    </h3>
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-pink-700 transition duration-300 text-lg animate-pulse-custom"
                                        aria-label="Add customized pack to shopping cart"
                                    >
                                        🛒 إضافة الحزمة للسلة / Add Pack to Cart
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="w-full mt-4 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
                                        aria-label="Reset pack customization to default options"
                                    >
                                        🔄 إعادة تعيين / Reset to Defaults
                                    </button>
                                    <p className="text-center text-sm text-gray-500 mt-3">
                                        💡 يمكنك تغيير اختيارك في أي وقت / You can change your selection anytime
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-12">
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
                                💬 التعليقات / Comments
                            </h2>
                            <p className="text-sm text-gray-600">
                                شارك تجربتك مع الحزمة / Share your experience with the pack
                            </p>
                        </div>
                        
                        {pack.comments && pack.comments.length > 0 ? (
                            <div className="space-y-4 mb-8">
                                {pack.comments.map(comment => (
                                    <div key={comment.id} className="bg-white p-6 border-2 border-gray-200 rounded-xl shadow-lg">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                                <span className="text-pink-600 font-bold">👤</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{comment.userFullName}</p>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-400 text-lg">{'★'.repeat(comment.score)}{'☆'.repeat(5 - comment.score)}</span>
                                                    <span className="text-sm text-gray-500 ml-2">({comment.score}/5)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                                        {comment.images && comment.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {comment.images.map((img, index) => (
                                                    <div key={index} className="image-zoom-container">
                                                        <img 
                                                            src={img} 
                                                            alt={`Comment image ${index + 1}`} 
                                                            className="w-24 h-24 object-cover rounded-md border-2 border-gray-200" 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                                <div className="text-4xl mb-3">💭</div>
                                <p className="text-gray-500 mb-2">لا توجد تعليقات بعد</p>
                                <p className="text-gray-400">No comments yet</p>
                            </div>
                        )}
                        
                        {!pack.hideCommentForm && (
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-bold mb-3 text-blue-800">
                                    ✍️ اترك تعليقك / Leave Your Comment
                                </h3>
                                <CommentForm packId={id} onCommentAdded={handleCommentAdded} />
                            </div>
                        )}
                    </div>

                    {/* Recommendations Section */}
                    <div className="mt-12">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
                                ⭐ منتجات مقترحة / Recommended Products
                            </h2>
                            <p className="text-sm text-gray-600">
                                منتجات أخرى قد تعجبك / Other products you might like
                            </p>
                        </div>
                        <PackRecommendations pack={pack} />
                    </div>
                </>
            )}
            
            {/* Purchase Notifications */}
            <PurchaseNotifications 
                packName={pack?.name} 
                productImage={pack?.images && pack.images.length > 0 ? pack.images[0] : null}
            />
            
            {/* Sticky Add to Cart */}
            <StickyAddToCart 
                pack={pack}
                onAddToCart={handleAddToCart}
                isVisible={!!pack}
                selectedCount={pack?.items ? Object.keys(selections).length : 0}
                totalItems={pack?.items?.length || 0}
            />
        </div>
    );

};

export default PackDetailPage;
// Enhanced Custom Pack Creation Page for Better User Experience
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomPackById, getAllowedProductsForCustomPack, addToCart } from '../api/apiService';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './CustomPackCreationPage.css';

const CustomPackCreationPage = () => {
    const { id } = useParams();
    const [packInfo, setPackInfo] = useState(null);
    const [allowedProducts, setAllowedProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [showHelp, setShowHelp] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [demoMode, setDemoMode] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packResponse, productsResponse] = await Promise.all([
                    getCustomPackById(id),
                    getAllowedProductsForCustomPack(id)
                ]);
                setPackInfo(packResponse.data);
                setAllowedProducts(productsResponse.data);
            } catch (error) {
                toast.error('Failed to load pack details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!packInfo) return;

        if (packInfo.pricingType === 'FIXED') {
            setTotalPrice(packInfo.fixedPrice);
        } else {
            const subtotal = selectedProducts.reduce((total, product) => total + product.price, 0);
            const discount = subtotal * (packInfo.discountRate || 0);
            setTotalPrice(subtotal - discount);
        }
    }, [selectedProducts, packInfo]);

    // Auto-start demo after page loads - FIXED dependency issue
    useEffect(() => {
        if (packInfo && allowedProducts.length > 0 && showWelcome) {
            const timer = setTimeout(() => {
                setDemoMode(true);
                // Don't auto-start tutorial, let user choose
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [packInfo, allowedProducts, showWelcome]);

    const startInteractiveTutorial = () => {
        const steps = [
            { element: 'products', message: 'هذه هي المنتجات المتاحة / These are available products', duration: 4000 },
            { element: 'product-card', message: 'اضغط على أي منتج لاختياره / Click any product to select it', duration: 4000 },
            { element: 'counter', message: 'هنا ترى كم منتج اخترت / Here you see how many products you selected', duration: 4000 },
            { element: 'checkout', message: 'اضغط هنا للشراء / Click here to buy', duration: 4000 }
        ];
        
        let currentStepIndex = 0;
        let timeoutId;
        
        const showNextStep = () => {
            if (currentStepIndex < steps.length) {
                setHighlightedElement(steps[currentStepIndex].element);
                timeoutId = setTimeout(() => {
                    currentStepIndex++;
                    if (currentStepIndex < steps.length) {
                        showNextStep();
                    } else {
                        setDemoMode(false);
                        setHighlightedElement(null);
                    }
                }, steps[currentStepIndex].duration);
            }
        };
        
        // Clear any existing timeout before starting
        if (timeoutId) clearTimeout(timeoutId);
        showNextStep();
        
        // Return cleanup function
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    };

    const handleProductSelect = (product) => {
        // Validate product and packInfo exist
        if (!product || !packInfo) {
            console.error('Product or packInfo is missing:', { product, packInfo });
            return;
        }

        setSelectedProducts(prevSelected => {
            if (prevSelected.find(p => p.id === product.id)) {
                return prevSelected.filter(p => p.id !== product.id);
            }
            if (prevSelected.length < packInfo.maxItems) {
                return [...prevSelected, product];
            }
            toast.warn(`يمكنك اختيار ${packInfo.maxItems} منتجات كحد أقصى / You can select a maximum of ${packInfo.maxItems} items.`);
            return prevSelected;
        });
    };

    const handleAddToCart = async () => {
        if (selectedProducts.length < packInfo.minItems) {
            toast.error(`يجب اختيار ${packInfo.minItems} منتجات على الأقل / You must select at least ${packInfo.minItems} items.`);
            return;
        }

        try {
            // Add each selected product to cart
            for (const product of selectedProducts) {
                if (product && product.id) {
                    await addToCart(product.id, 1);
                } else {
                    console.error('Invalid product:', product);
                }
            }
            toast.success('🎉 تم إضافة الحزمة المخصصة للسلة! / Custom pack added to cart!');
            
            // Optional: Reset selection after successful add to cart
            // setSelectedProducts([]);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('فشل في إضافة المنتجات للسلة / Failed to add items to cart.');
        }
    };

    if (loading) return <Loader />;
    if (!packInfo) return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-xl text-gray-500 mb-2">لم يتم العثور على الحزمة</p>
            <p className="text-lg text-gray-400">Pack not found</p>
        </div>
    );

    const steps = [
        { number: 1, title: "فهم المنتجات", titleEn: "Understand Products", description: "تعرف على المنتجات المتاحة", descriptionEn: "Learn about available products" },
        { number: 2, title: "اختر المنتجات", titleEn: "Select Products", description: "اختر المنتجات التي تريدها", descriptionEn: "Choose the products you want" },
        { number: 3, title: "مراجعة وشراء", titleEn: "Review & Buy", description: "راجع اختيارك واشتري", descriptionEn: "Review your selection and purchase" }
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full mx-4 text-center shadow-2xl max-h-screen overflow-y-auto">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">
                            مرحباً! / Welcome!
                        </h2>
                        <div className="space-y-4 text-lg">
                            <p className="text-gray-700">
                                <strong>🎯 ما ستفعله هنا:</strong><br/>
                                <strong>🎯 What you'll do here:</strong>
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-800">
                                    ✨ ستختار منتجات تريدها<br/>
                                    ✨ You will choose products you want
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-green-800">
                                    🛒 ستضعها في السلة<br/>
                                    🛒 You will put them in your cart
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-purple-800">
                                    💳 ستشتريها بسعر مخفض!<br/>
                                    💳 You will buy them at a discount!
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => {
                                    setShowWelcome(false);
                                    setDemoMode(true);
                                    startInteractiveTutorial();
                                }}
                                className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg text-xl font-bold hover:bg-pink-700 transition-colors"
                            >
                                🎬 أرني كيف! / Show me how!
                            </button>
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                أفهم، دعني أبدأ / I understand, let me start
                            </button>
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

            {/* Header with Help Button */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-800">
                        🎁 {packInfo.name}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-2">{packInfo.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg mt-3">
                        <p className="text-sm sm:text-base text-blue-800 font-semibold">
                            💡 اختر {packInfo.minItems}-{packInfo.maxItems} منتجات واحصل على خصم! / 
                            Choose {packInfo.minItems}-{packInfo.maxItems} products and get a discount!
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
                        onClick={() => {
                            setShowWelcome(true);
                        }}
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
                    <h3 className="text-lg font-bold mb-3 text-blue-800">كيفية إنشاء حزمة مخصصة / How to Create a Custom Pack</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>1.</strong> انظر إلى المنتجات أدناه / Look at the products below</p>
                        <p><strong>2.</strong> اضغط على المنتج لاختياره (سيصبح لونه وردي) / Click on a product to select it (it will turn pink)</p>
                        <p><strong>3.</strong> يجب اختيار {packInfo.minItems} منتجات على الأقل / You must select at least {packInfo.minItems} products</p>
                        <p><strong>4.</strong> يمكنك اختيار حتى {packInfo.maxItems} منتجات / You can select up to {packInfo.maxItems} products</p>
                        <p><strong>5.</strong> السعر سيتغير تلقائياً / The price will change automatically</p>
                        <p><strong>6.</strong> اضغط "إضافة للسلة" عندما تنتهي / Click "Add to Cart" when finished</p>
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

            {/* Selection Counter */}
            <div className={`bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg mb-8 text-center ${highlightedElement === 'counter' ? 'ring-4 ring-yellow-400 animate-pulse-custom' : ''}`}>
                <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-pink-600">{selectedProducts.length}</p>
                        <p className="text-sm text-gray-600">منتجات مختارة / Selected</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{packInfo.minItems}</p>
                        <p className="text-sm text-gray-600">الحد الأدنى / Minimum</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{packInfo.maxItems}</p>
                        <p className="text-sm text-gray-600">الحد الأقصى / Maximum</p>
                    </div>
                </div>
                
                {selectedProducts.length < packInfo.minItems && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                        <p className="text-yellow-800 font-semibold">
                            ⚠️ يجب اختيار {packInfo.minItems - selectedProducts.length} منتجات إضافية / 
                            You need {packInfo.minItems - selectedProducts.length} more products
                        </p>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${highlightedElement === 'products' ? 'ring-4 ring-yellow-400 rounded-lg p-4' : ''}`}>
                {allowedProducts.map(product => {
                    const isSelected = selectedProducts.find(p => p.id === product.id);
                    return (
                        <div
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleProductSelect(product);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${isSelected ? 'Deselect' : 'Select'} ${product.name} - $${product.price.toFixed(2)}`}
                            aria-pressed={isSelected}
                            className={`relative border-3 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                                isSelected 
                                    ? 'border-pink-500 shadow-2xl bg-pink-50 ring-4 ring-pink-200' 
                                    : 'border-gray-300 hover:border-pink-300 hover:shadow-lg bg-white'
                            } ${highlightedElement === 'product-card' ? 'ring-4 ring-yellow-400 animate-pulse-custom' : ''}`}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold animate-bounce-custom">
                                    ✓
                                </div>
                            )}

                            {/* Product Image */}
                            <div className="image-zoom-container mb-4">
                                <img 
                                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.svg'} 
                                    alt={product.name} 
                                    className="w-full h-48 object-cover rounded-lg" 
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.svg';
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg text-gray-800 leading-tight">{product.name}</h3>
                                <p className="text-2xl font-bold text-pink-600">${product.price.toFixed(2)}</p>
                                
                                {/* Click Instruction */}
                                <div className={`text-center p-2 rounded-lg transition-all duration-200 ${
                                    isSelected 
                                        ? 'bg-pink-100 text-pink-700' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    <p className="text-sm font-semibold">
                                        {isSelected ? '✓ مختار / Selected' : 'اضغط للاختيار / Click to Select'}
                                    </p>
                                </div>

                                {/* Product Details Link */}
                                <Link 
                                    to={`/products/${product.id}`} 
                                    onClick={(e) => e.stopPropagation()} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block text-center text-blue-600 hover:text-blue-800 text-sm underline mt-2"
                                >
                                    عرض التفاصيل / View Details
                                </Link>
                            </div>

                            {/* Hover Effect */}
                            {hoveredProduct === product.id && !isSelected && (
                                <div className="absolute inset-0 bg-pink-500 bg-opacity-10 rounded-xl flex items-center justify-center">
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                                        <p className="text-pink-600 font-bold">اضغط للاختيار / Click to Select</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {allowedProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-xl text-gray-500 mb-2">لا توجد منتجات متاحة لهذه الحزمة</p>
                    <p className="text-lg text-gray-400">No products available for this custom pack</p>
                </div>
            )}

            {/* Total and Checkout */}
            <div className={`mt-12 bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg ${highlightedElement === 'checkout' ? 'ring-4 ring-yellow-400 animate-pulse-custom' : ''}`}>
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-gray-800">
                        المجموع / Total: <span className="text-pink-600">${totalPrice.toFixed(2)}</span>
                    </h2>
                    
                    {selectedProducts.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">المنتجات المختارة / Selected Products:</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {selectedProducts.map(product => (
                                    <span key={product.id} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                                        {product.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={selectedProducts.length < packInfo.minItems}
                        aria-label={selectedProducts.length >= packInfo.minItems 
                            ? `Add ${selectedProducts.length} selected products to cart` 
                            : `Select ${packInfo.minItems - selectedProducts.length} more products to continue`
                        }
                        className={`text-xl font-bold py-4 px-12 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300 ${
                            selectedProducts.length >= packInfo.minItems
                                ? 'bg-pink-600 text-white hover:bg-pink-700 transform hover:scale-105 animate-pulse-custom'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {selectedProducts.length >= packInfo.minItems 
                            ? '🛒 إضافة للسلة / Add to Cart' 
                            : `اختر ${packInfo.minItems - selectedProducts.length} منتجات إضافية / Select ${packInfo.minItems - selectedProducts.length} more products`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomPackCreationPage;
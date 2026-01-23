// Enhanced Pack Detail Page for Better User Experience - Moroccan Users
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getPackById, addToCart } from '../api/apiService';
import Loader from '../components/Loader';
import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter.jsx';
import { toast } from 'react-toastify';
import CommentForm from '../components/CommentForm';
import PackRecommendations from '../components/PackRecommendations';
import EnhancedCountdown from '../components/EnhancedCountdown';
import PurchaseNotifications from '../components/PurchaseNotifications';
import StickyAddToCart from '../components/StickyAddToCart';
import './PackDetailPage.css';
import { formatPrice } from '../utils/currency';
import PackVisualizer from '../components/PackVisualizer';
import ProductDetailModal from '../components/ProductDetailModal';

const StickyPackHeader = ({ pack, selections, onScrollTop }) => {
    // Collect all selected products
    const selectedProducts = [];

    if (pack && pack.items && selections) {
        pack.items.forEach(item => {
            const selectedId = selections[item.id];
            if (selectedId) {
                const allProducts = [item.defaultProduct, ...(item.variationProducts || [])];
                const product = allProducts.find(p => p && p.id === selectedId);
                if (product) {
                    selectedProducts.push(product);
                }
            } else if (item.defaultProduct) {
                selectedProducts.push(item.defaultProduct);
            }
        });
    }

    // Determine grid layout based on number of products
    let gridCols = 'grid-cols-2';
    if (selectedProducts.length === 1) gridCols = 'grid-cols-1';
    else if (selectedProducts.length >= 3) gridCols = 'grid-cols-3';

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 transform transition-all duration-300 animate-slide-down py-2 px-3 flex items-center justify-between sm:hidden">
            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={onScrollTop}>
                {/* Mini Product Grid */}
                <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                    <div className={`grid ${gridCols} gap-0.5 h-full p-1`}>
                        {selectedProducts.slice(0, 4).map((product, index) => (
                            <div key={`${product.id}-${index}`} className="flex items-center justify-center">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                />
                            </div>
                        ))}
                    </div>
                    {selectedProducts.length > 4 && (
                        <div className="absolute bottom-0 right-0 bg-pink-500 text-white text-[8px] font-bold px-1 rounded-tl">
                            +{selectedProducts.length - 4}
                        </div>
                    )}
                </div>

                {/* Price Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 font-medium leading-tight mb-0.5">سعر الحزمة / Total</p>
                    <p className="text-pink-600 font-black text-lg leading-none tracking-tight">{formatPrice(pack.price)}</p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={onScrollTop}
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors shadow-sm active:scale-95 flex-shrink-0"
                aria-label="Scroll to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

const ProductOption = ({ product, packItemId, selectedProductId, onSelectionChange, isDefault, onViewDetails }) => {
    const imageUrl = (product.images && product.images.length > 0)
        ? product.images[0]
        : '/placeholder-image.svg';

    const isSelected = selectedProductId === product.id;

    // Compact container classes for mobile
    const containerClasses = `
        relative flex items-center p-2 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform
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
            aria-label={`${isSelected ? 'Sélectionné' : 'Sélectionner'} ${product.name} pour ${formatPrice(product.price)}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectionChange(packItemId, product.id);
                }
            }}
        >
            {/* View Details Button - Enhanced Eye Icon */}
            <div
                onClick={(e) => {
                    e.stopPropagation(); // Prevent selection when clicking eye
                    onViewDetails(product);
                }}
                className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white text-gray-400 hover:text-blue-600 rounded-full shadow-sm hover:shadow-md transition-all z-20 cursor-pointer"
                title="عرض التفاصيل / Voir les détails"
            >
                <FaEye size={16} />
            </div>

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
                <div className="flex items-center mb-1 sm:mb-2 flex-wrap gap-1 pr-8">
                    {/* pr-8 to avoid overlap with eye icon */}
                    <span className="text-gray-800 font-bold text-xs md:text-lg truncate block max-w-full">
                        {product.name || 'Produit sans nom'}
                    </span>
                    {isDefault && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                            ✅ افتراضي / Par défaut
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">

                    <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-semibold whitespace-nowrap ${isSelected
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isSelected ? '✓ مختار / Sélectionné' : 'اختيار / Choisir'}
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
            />
        </label>
    );
};

const PackItemSelector = ({ item, selectedProductId, onSelectionChange, onViewDetails }) => (
    <div className="border border-gray-200 p-3 md:p-6 rounded-xl mb-3 md:mb-6 bg-white shadow-sm hover:shadow-md transition-shadow relative">
        {/* Section Header - More Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 md:p-4 rounded-lg mb-4 -mx-3 -mt-3 md:-mx-6 md:-mt-6 border-b border-gray-100">
            <h4 className="font-bold text-sm md:text-xl text-gray-800 flex items-center">
                <span className="bg-pink-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm mr-2 sm:mr-3 shrink-0">
                    📦
                </span>
                <span className="text-pink-600 font-extrabold truncate">
                    {item.defaultProduct ? item.defaultProduct.name : 'منتج / Produit'}
                </span>
            </h4>
            <p className="text-[10px] md:text-sm text-gray-500 mt-1 ml-9">
                اختر المنتج الذي تريده لهذا القسم / Choisissez le produit pour cette section
            </p>
        </div>

        {item.defaultProduct && (
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold mr-2 border border-green-100">
                        ✅ مُضمن / Inclus
                    </span>
                </div>
                <ProductOption
                    product={item.defaultProduct}
                    packItemId={item.id}
                    selectedProductId={selectedProductId}
                    onSelectionChange={onSelectionChange}
                    onViewDetails={onViewDetails}
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
                    أو استبدل بـ / Ou remplacez par :
                </h5>
                <div className="space-y-3">
                    {item.variationProducts.map(product => (
                        <ProductOption
                            key={product.id}
                            product={product}
                            packItemId={item.id}
                            selectedProductId={selectedProductId}
                            onSelectionChange={onSelectionChange}
                            onViewDetails={onViewDetails}
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
                    لا بدائل متاحة / Pas d'alternatives
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
    const [showWelcome, setShowWelcome] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState(null);
    // Sticky header state
    const [showStickyHeader, setShowStickyHeader] = useState(false);

    // State for Product Detail Modal
    const [viewProduct, setViewProduct] = useState(null);

    const handleViewDetails = (product) => {
        setViewProduct(product);
    };

    const handleCloseDetails = () => {
        setViewProduct(null);
    };

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
                    currency: 'MAD'
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
            setError('فشل في تحميل تفاصيل الحزمة. قد تكون غير موجودة. / Échec du chargement des détails du pack.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Interactive tutorial for pack understanding
    const startInteractiveTutorial = () => {
        const steps = [
            { element: 'pack-image', message: 'هذه صورة الحزمة / Voici l\'image du pack', duration: 4000 },
            { element: 'customization', message: 'هنا يمكنك تخصيص الحزمة / Ici vous pouvez personnaliser le pack', duration: 4000 },
            { element: 'product-options', message: 'اختر المنتجات التي تريدها / Choisissez les produits que vous voulez', duration: 4000 },
            { element: 'add-to-cart', message: 'اضغط هنا لإضافة للسلة / Cliquez ici pour ajouter au panier', duration: 4000 }
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

    // Scroll listener for sticky header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 350) {
                setShowStickyHeader(true);
            } else {
                setShowStickyHeader(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchPack();
    }, [id]);

    // Simplified logic: Updates the selections state
    const handleSelectionChange = (packItemId, selectedProductId) => {
        setSelections(prev => ({ ...prev, [packItemId]: selectedProductId }));
    };

    const handleReset = () => {
        setSelections(initialSelections);
        setComposedImageUrl(initialPackImageUrl);
        setMessage('تم إعادة تعيين الاختيارات إلى الوضع الافتراضي. / Les sélections ont été réinitialisées.');
        setError('');
    };

    const handleAddToCart = async () => {
        setMessage('');
        setError('');
        try {
            // Check if all items are selected
            const allItemsSelected = pack?.items?.every(item => selections[item.id]);
            if (!allItemsSelected) {
                toast.warn('المرجو اختيار جميع المنتجات / Veuillez sélectionner tous les produits');
                return;
            }

            // Create a JSON string of selected products (name + image)
            const selectedProductsData = pack?.items?.map(item => {
                const selectedId = selections[item.id];
                const product = [item.defaultProduct, ...(item.variationProducts || [])]
                    .find(p => p && p.id === selectedId);
                if (!product) return null;

                const imageUrl = (product.images && product.images.length > 0)
                    ? product.images[0]
                    : '/placeholder-image.svg';

                return { name: product.name, image: imageUrl };
            }).filter(Boolean);

            // Store as JSON string for frontend parsing, or fallback string for legacy/backend view
            const variantNamePayload = JSON.stringify(selectedProductsData);

            // Create the composite pack item
            const packItem = {
                productName: pack.name,
                price: pack.price, // Uses the fixed pack price
                imageUrl: composedImageUrl, // Uses the dynamic visualizer image
                variantName: variantNamePayload, // Stores contents as the "variant"
                quantity: 1
            };

            // Add the single pack item to cart
            await addToCart(packItem, 1);

            if (window.fbq) {
                window.fbq('track', 'AddToCart', {
                    content_name: pack.name,
                    content_type: 'product',
                    value: pack.price,
                    currency: 'MAD'
                });
            }

            toast.success('🎉 تم إضافة الحزمة للسلة! / Ajouté au panier !');
            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (err) {
            console.error("Error during add to cart:", err);
            setError('فشل في إضافة المنتجات للسلة / Échec de l\'ajout au panier');
            toast.error('فشل في إضافة المنتجات للسلة / Échec de l\'ajout au panier');
        }
    };

    const handleCommentAdded = () => {
        fetchPack();
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 max-w-7xl">
            {/* Sticky Mobile Preview Header */}
            {showStickyHeader && pack && (
                <StickyPackHeader
                    pack={pack}
                    selections={selections}
                    onScrollTop={scrollToTop}
                />
            )}

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={viewProduct}
                onClose={handleCloseDetails}
            />

            {/* Welcome Overlay - Responsive */}
            {showWelcome && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full text-center shadow-2xl max-h-[90vh] overflow-y-auto animate-zoom-in">
                        <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-slow">📦</div>
                        <h2 className="text-xl sm:text-3xl font-bold mb-4 text-gray-800">
                            مرحباً بك في حزمة التوفير! / Bienvenue dans le Pack Éco !
                            <br />
                            <span className="text-pink-600 block mt-2 text-lg sm:text-2xl">Offres de Packs Économiques !</span>
                        </h2>

                        <div className="bg-yellow-50 border border-yellow-300 p-3 sm:p-4 rounded-xl mb-6">
                            <p className="text-yellow-800 font-bold text-sm sm:text-lg">
                                💡 خذ منتجات أكثر .. وادفع أقل! / Prenez plus.. payez moins !
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="text-2xl mb-1">👀</div>
                                <p className="text-blue-800 font-bold text-sm">1. تصفح / Explorez</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="text-2xl mb-1">👆</div>
                                <p className="text-green-800 font-bold text-sm">2. اختر / Choisissez</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <div className="text-2xl mb-1">🛒</div>
                                <p className="text-purple-800 font-bold text-sm">3. وفر / Économisez</p>
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
                                🎬 كيف أطلب الحزمة؟ / Comment commander ?
                            </button>

                            <button
                                onClick={() => setShowWelcome(false)}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all font-semibold text-sm sm:text-base border border-gray-200"
                            >
                                فهمت! سأبدأ الآن / J'ai compris ! Commencer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Demo Mode Overlay */}
            {demoMode && highlightedElement && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-40 pointer-events-none">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg animate-bounce">
                        👀 انظر هنا! / Regardez ici !
                    </div>
                </div>
            )}

            {/* Countdown Timer */}
            {pack?.showCountdownTimer && (
                <EnhancedCountdown
                    packName={pack.name}
                    fallbackEndTime={new Date().getTime() + (24 * 60 * 60 * 1000)}
                    onExpire={() => toast.info('انتهى العرض / L\'offre est terminée')}
                />
            )}

            {/* Header Section */}
            <div className="mb-3 md:mb-8 text-center sm:text-left">
                <h1 className="text-xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-4 tracking-tight">
                    📦 {pack ? pack.name : '...جارٍ تحميل الحزمة / Chargement du pack...'}
                </h1>
                <p className="text-xs md:text-lg text-gray-600 mb-3 md:mb-6 max-w-3xl">
                    اصنع حزمتك الخاصة بالسعر الذي يناسبك / Créez votre propre pack au prix qui vous convient
                </p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-semibold shadow-sm"
                    >
                        <span>❓ مساعدة / Aide</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowWelcome(true);
                            setShowHelp(false);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 text-sm font-semibold shadow-sm"
                    >
                        <span>🎬 شرح / Tutoriel</span>
                    </button>
                </div>
            </div>

            {/* Help Panel */}
            {showHelp && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg text-sm sm:text-base animate-fadeIn">
                    <h3 className="font-bold mb-2 text-blue-800">💡 طريقة الطلب : / Comment commander :</h3>
                    <ol className="list-decimal list-inside space-y-1 text-blue-900">
                        <li>اختر المنتجات من القائمة في الأسفل / Choisissez les produits dans la liste ci-dessous</li>
                        <li>شاهد السعر يتحدث تلقائياً / Le prix se met à jour automatiquement</li>
                        <li>أضف الحزمة كاملة للسلة بضغطة واحدة / Ajoutez le pack au panier en un clic</li>
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
                    <p className="text-xl text-gray-400">الحزمة غير موجودة / Pack non trouvé</p>
                </div>
            )}

            {pack && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
                        {/* Left Side: Pack Image & Summary */}
                        <div className="space-y-3 md:space-y-6 lg:sticky lg:top-24 self-start">
                            {/* Pack Image Card */}
                            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${highlightedElement === 'pack-image' ? 'ring-4 ring-yellow-400' : ''}`}>
                                <div className="bg-gray-50 p-1 md:p-2 flex items-center justify-center min-h-[200px] md:min-h-[350px] rounded-xl overflow-hidden">
                                    <PackVisualizer pack={pack} selections={selections} />
                                </div>

                                <div className="p-4 sm:p-6 bg-white">
                                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 md:p-6 rounded-xl shadow-lg relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-[10px] md:text-sm font-medium opacity-90 mb-1">السعر الإجمالي للصفقة / Prix Total du Pack</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-2xl md:text-5xl font-black tracking-tight">{formatPrice(pack.price)}</p>
                                                {pack.originalPrice > pack.price && (
                                                    <span className="text-lg text-pink-200 line-through">{formatPrice(pack.originalPrice)}</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] md:text-sm mt-2 font-medium bg-white/20 inline-block px-2 py-1 rounded">✨ توفير مميز / Économie Spéciale</p>
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
                            <div className="bg-indigo-600 text-white p-3 md:p-6 rounded-2xl mb-6 shadow-md flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <h2 className="text-lg md:text-2xl font-bold flex items-center">
                                        <span className="mr-2 text-2xl">🎨</span>
                                        ابدأ التخصيص / Commencez la personnalisation
                                    </h2>
                                    <p className="text-indigo-100 text-sm mt-1">
                                        لديك {pack.items?.length || 0} خيارات لتحديدها / Vous avez {pack.items?.length || 0} options à choisir
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border border-white/10"
                                >
                                    <span className="text-lg">↺</span>
                                    <span>إعادة تعيين / Réinitialiser</span>
                                </button>
                            </div>

                            <div className={`space-y-3 md:space-y-6 mb-8 ${highlightedElement === 'product-options' ? 'ring-2 ring-yellow-400 rounded-xl p-2' : ''}`}>
                                {pack.items && pack.items.map((item, index) => (
                                    <div key={item.id} className="enhanced-pack-item">
                                        <PackItemSelector
                                            item={item}
                                            selectedProductId={selections[item.id]}
                                            onSelectionChange={handleSelectionChange}
                                            onViewDetails={handleViewDetails}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Sticky Mobile Checkout */}
                            <div className={`sticky bottom-2 z-30 transition-all duration-300 ${highlightedElement === 'add-to-cart' ? 'ring-4 ring-yellow-400 rounded-xl' : ''}`}>
                                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-2 md:p-6 shadow-2xl">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2 md:py-4 px-6 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 text-sm md:text-xl shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span className="animate-pulse">✨</span>
                                        إضافة الحزمة للسلة / Ajouter au Panier
                                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{formatPrice(pack.price)}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-xl p-3 md:p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                            <span className="mr-2">📝</span>
                            تفاصيل الحزمة / Détails du Pack
                        </h3>
                        <div
                            className="text-gray-600 leading-relaxed text-sm sm:text-base prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: pack.description }}
                        />
                    </div>

                    {/* Clean Luxury Reviews Section */}
                    <div className="mt-16 sm:mt-24">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl lg:rounded-[2rem] p-4 md:p-12 border border-white/60 shadow-xl">
                            <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-4 md:mb-10 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full shadow-lg"></span>
                                💬 آراء العملاء / Avis Clients ({pack.comments?.length || 0})
                            </h2>

                            {pack.comments && pack.comments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
                                    {pack.comments.map((comment, index) => (
                                        <div
                                            key={comment.id || index}
                                            className="glass-panel-pro p-6 lg:p-8 rounded-3xl relative overflow-hidden group hover:shadow-xl transition-all duration-500 animate-slide-up"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            {/* Decoration Gradient */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-150"></div>

                                            <div className="flex items-start justify-between mb-6 relative">
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-inner flex items-center justify-center text-lg font-bold text-gray-600">
                                                        {comment.userFullName ? comment.userFullName[0].toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                            {comment.userFullName || "Customer"}
                                                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                                                <span>✓</span> Verified
                                                            </span>
                                                        </div>
                                                        <div className="flex text-yellow-400 text-sm mt-0.5">
                                                            {'★'.repeat(comment.score)}
                                                            <span className="text-gray-200">{'★'.repeat(5 - comment.score)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
                                                    Recent
                                                </div>
                                            </div>

                                            <div className="relative z-10">
                                                <p className="text-gray-600 leading-relaxed font-medium text-lg italic">
                                                    "{comment.content}"
                                                </p>
                                                {/* Render Comment Images */}
                                                {comment.images && comment.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {comment.images.map((img, imgIdx) => (
                                                            <div key={imgIdx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-100 group/img cursor-pointer transition-all hover:scale-105">
                                                                <img
                                                                    src={img}
                                                                    alt={`Review attachment ${imgIdx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                    onClick={() => window.open(img, '_blank')}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Like/Helpful Actions (Mock) */}
                                            <div className="mt-6 flex items-center gap-4 pt-6 border-t border-gray-100/50">
                                                <button className="text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1 group/btn">
                                                    <span className="group-hover/btn:scale-125 transition-transform">❤️</span> مفيد / Utile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="text-6xl mb-4 grayscale opacity-50">💬</div>
                                    <p className="text-xl font-medium">لا توجد تعليقات حتى الآن / Aucun avis pour le moment</p>
                                    <p className="text-sm mt-2">كن أول من يقيم هذه الحزمة! / Soyez le premier à évaluer ce pack !</p>
                                </div>
                            )}
                            {!pack.hideCommentForm && (
                                <div className="mt-6">
                                    <CommentForm />
                                </div>
                            )}

                            {/* Recommendations Section */}
                            <PackRecommendations pack={pack} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PackDetailPage;
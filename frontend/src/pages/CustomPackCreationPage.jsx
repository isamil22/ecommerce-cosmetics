// Enhanced Custom Pack Creation Page for Better User Experience
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomPackById, getAllowedProductsForCustomPack, addToCart } from '../api/apiService';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './CustomPackCreationPage.css';
import { formatPrice } from '../utils/currency';

// Simple Icons Components (Inline for portability or import from lucide-react if available)
const Icons = {
    Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
    Help: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Restart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    Cart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Info: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

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

        // Update step based on progress
        if (selectedProducts.length === 0) setCurrentStep(1);
        else if (selectedProducts.length < packInfo.minItems) setCurrentStep(2);
        else setCurrentStep(3);

    }, [selectedProducts, packInfo]);

    // Auto-start demo after page loads
    useEffect(() => {
        if (packInfo && allowedProducts.length > 0 && showWelcome) {
            const timer = setTimeout(() => {
                // Determine if we should show tutorial based on user preferences or first time
                // For now, keep it manual via the welcome screen
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [packInfo, allowedProducts, showWelcome]);

    const startInteractiveTutorial = () => {
        const steps = [
            { element: 'products', message: 'هذه هي المنتجات المتاحة / Voici les produits disponibles', duration: 3000 },
            { element: 'product-int', message: 'اضغط على أي منتج لاختياره / Cliquez sur un produit pour le sélectionner', duration: 3000 },
            { element: 'counter', message: 'تابع عدد المنتجات هنا / Suivez le nombre de produits ici', duration: 3000 },
            { element: 'checkout', message: 'عندما تنتهي، اضغط هنا للشراء / Cliquez ici pour acheter une fois terminé', duration: 3000 }
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
        if (!product || !packInfo) return;

        setSelectedProducts(prevSelected => {
            if (prevSelected.find(p => p.id === product.id)) {
                return prevSelected.filter(p => p.id !== product.id);
            }
            if (prevSelected.length < packInfo.maxItems) {
                return [...prevSelected, product];
            }
            toast.warn(`يمكنك اختيار ${packInfo.maxItems} منتجات كحد أقصى / Max ${packInfo.maxItems} articles autorisés.`);
            return prevSelected;
        });
    };

    const handleAddToCart = async () => {
        if (selectedProducts.length < packInfo.minItems) {
            toast.error(`يجب اختيار ${packInfo.minItems} منتجات على الأقل / Sélectionnez au moins ${packInfo.minItems} articles.`);
            return;
        }

        try {
            for (const product of selectedProducts) {
                if (product && product.id) {
                    await addToCart(product.id, 1);
                }
            }
            toast.success('🎉 تم إضافة الحزمة المخصصة للسلة! / Pack personnalisé ajouté au panier !');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('فشل في إضافة المنتجات للسلة / Échec de l\'ajout au panier.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader />
        </div>
    );

    if (!packInfo) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
            <div>
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-2xl font-bold text-gray-800">لم يتم العثور على الحزمة / Pack introuvable</h2>
                <p className="text-gray-500">Pack not found</p>
                <Link to="/custom-packs" className="mt-4 inline-block text-purple-600 hover:underline">
                    العودة للباقات المخصصة / Retour aux Packs
                </Link>
            </div>
        </div>
    );

    const steps = [
        { number: 1, title: "Start", label: "البداية / Début" },
        { number: 2, title: "Select", label: "الاختيار / Sélection" },
        { number: 3, title: "Review", label: "المراجعة / Revue" }
    ];

    const isMinMet = selectedProducts.length >= packInfo.minItems;
    const isMaxMet = selectedProducts.length >= packInfo.maxItems;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 pb-20">
            {/* Welcome Overlay for First-Time Users */}
            {showWelcome && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl scale-100 transform transition-all">
                        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-4xl">🎨</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">
                            اصنع باقتك الخاصة / Créez Votre Pack
                        </h2>
                        <h3 className="text-lg text-purple-600 font-medium mb-6">
                            منشئ الباقات المخصص / Créateur de Pack Personnalisé
                        </h3>

                        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-2xl mb-8">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-600 rounded-full p-1.5"><Icons.Check /></span>
                                <span className="text-gray-700 text-sm">اختر المنتجات / Sélectionnez des produits</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-purple-100 text-purple-600 rounded-full p-1.5"><Icons.Check /></span>
                                <span className="text-gray-700 text-sm">وفر المال / Économisez de l'argent</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-green-100 text-green-600 rounded-full p-1.5"><Icons.Check /></span>
                                <span className="text-gray-700 text-sm">دفع سريع / Paiement rapide</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => {
                                    setShowWelcome(false);
                                    setDemoMode(true);
                                    startInteractiveTutorial();
                                }}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold hover:shadow-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02]"
                            >
                                أرني كيف / Montrez-moi comment
                            </button>
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                ابدأ الآن / Commencer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Demo Mode Overlay */}
            {demoMode && highlightedElement && (
                <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none transition-opacity duration-500">
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur text-purple-800 px-6 py-3 rounded-full font-bold shadow-xl border border-purple-200 animate-bounce">
                        اتبع الإرشادات / Suivez les points forts
                    </div>
                </div>
            )}

            {/* sticky Header / Summary Bar */}
            <div className={`sticky top-0 z-30 transition-all duration-300 ${highlightedElement === 'counter' ? 'ring-4 ring-yellow-400 z-50' : ''}`}>
                <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Pack Info */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Link to="/custom-packs" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </Link>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-800">{packInfo.name}</h1>
                                    <p className="text-xs text-purple-600 font-medium">{selectedProducts.length} محدد من {packInfo.maxItems} كحد أقصى / {selectedProducts.length} sélectionné sur {packInfo.maxItems} max</p>
                                </div>
                            </div>

                            {/* Center Progress Bar (Desktop) */}
                            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                                        style={{ width: `${Math.min((selectedProducts.length / packInfo.maxItems) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                                    {selectedProducts.length} / {packInfo.maxItems}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between w-full md:w-auto gap-3">
                                <div className="text-right mr-2 md:mr-0">
                                    <span className="block text-xs text-gray-500">السعر الإجمالي / Prix Total</span>
                                    <span className="block text-lg font-bold text-purple-700">{formatPrice(totalPrice)}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowHelp(!showHelp)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Help"
                                    >
                                        <Icons.Help />
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!isMinMet}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md flex items-center gap-2 ${isMinMet
                                            ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 hover:shadow-lg transform hover:-translate-y-0.5'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            } ${highlightedElement === 'checkout' ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
                                    >
                                        <span>إضافة للسلة / Ajouter au Panier</span>
                                        <Icons.Cart />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Progress Bar */}
                        <div className="md:hidden mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((selectedProducts.length / packInfo.maxItems) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Contextual Warning/Success Message */}
                <div className="bg-purple-50 border-b border-purple-100 py-2 px-4 text-center">
                    {!isMinMet ? (
                        <p className="text-sm text-purple-800 font-medium">
                            اختر <span className="font-bold">{packInfo.minItems - selectedProducts.length}</span> منتجات إضافية لإكمال باقتك / Sélectionnez <span className="font-bold">{packInfo.minItems - selectedProducts.length}</span> autres articles pour compléter votre pack
                        </p>
                    ) : (
                        <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-1">
                            <Icons.Check /> تم استيفاء الشروط! يمكنك إضافة {Math.max(0, packInfo.maxItems - selectedProducts.length)} المزيد / Conditions remplies ! Vous pouvez ajouter {Math.max(0, packInfo.maxItems - selectedProducts.length)} de plus.
                        </p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Help Panel */}
                {showHelp && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 animate-fade-in shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Icons.Info />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">كيف يعمل / Comment ça marche</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>اختر ما بين {packInfo.minItems} و {packInfo.maxItems} منتجات. / Choisissez entre {packInfo.minItems} et {packInfo.maxItems} articles.</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>يتم تحديث السعر تلقائياً مع الخصم. / Le prix se met à jour automatiquement avec votre remise.</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>انقر على المنتجات لتحديدها. / Cliquez sur les produits pour sélectionner.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 ${highlightedElement === 'products' ? 'ring-4 ring-yellow-400 p-4 rounded-xl bg-yellow-50/50' : ''}`}>
                    {allowedProducts.map((product, index) => {
                        const isSelected = selectedProducts.find(p => p.id === product.id);
                        const isHovered = hoveredProduct === product.id;

                        return (
                            <div
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${isSelected
                                    ? 'border-purple-500 shadow-md ring-1 ring-purple-500'
                                    : 'border-transparent hover:border-gray-200 hover:shadow-xl shadow-sm'
                                    } ${highlightedElement === 'product-int' && index === 0 ? 'ring-4 ring-yellow-400 z-50 animate-pulse' : ''}`}
                            >
                                {/* Selection Badge */}
                                <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                                    ? 'bg-purple-600 text-white scale-100'
                                    : 'bg-white/80 text-transparent border border-gray-200 scale-90 group-hover:scale-100'
                                    }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>

                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images?.[0] || '/placeholder-image.svg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                    />
                                    {/* Overlay on Hover */}
                                    <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 min-h-[2.5em]">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                                        {isSelected && <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">محدد / Sélectionné</span>}
                                    </div>

                                    <Link
                                        to={`/products/${product.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        target="_blank"
                                        className="block mt-3 text-xs text-gray-400 hover:text-purple-600 font-medium transition-colors"
                                    >
                                        عرض التفاصيل / Voir Détails
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Initial Empty State / Loading more refined */}
            {allowedProducts.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-4xl grayscale opacity-50">🛍️</div>
                    <h2 className="text-xl font-bold text-gray-600">لا توجد منتجات متاحة / Aucun produit disponible</h2>
                    <p className="text-gray-400 max-w-md mx-auto mt-2">هذه الباقة لا تحتوي على أي منتجات بعد. يرجى التحقق لاحقاً. / Ce pack n'a pas encore de produits assignés. Veuillez vérifier plus tard.</p>
                </div>
            )}
        </div>
    );
};

export default CustomPackCreationPage;
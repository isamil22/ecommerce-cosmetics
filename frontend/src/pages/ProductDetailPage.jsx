import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getCart, getSettings } from '../api/apiService';
import Loader from '../components/Loader';
import CommentForm from '../components/CommentForm';
import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter.jsx';
import TrustBadges from '../components/TrustBadges';
import SocialShare from '../components/SocialShare';
import ReviewSummary from '../components/ReviewSummary';
import Breadcrumbs from '../components/Breadcrumbs';
import EnhancedCountdown from '../components/EnhancedCountdown';
import StickyAddToCart from '../components/StickyAddToCart';
import Accordion from '../components/Accordion'; // Ensure this component exists or use simple inline logic
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
import ShippingReturns from '../components/ShippingReturns';
import { toast } from 'react-toastify';
import { trackEvent } from '../utils/facebookPixel';
import ReactGA from 'react-ga4';

import { formatPrice } from '../utils/currency';
import './PackDetailPage.css';

const ProductDetailPage = ({ fetchCartCount, isAuthenticated }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const addToCartRef = useRef(null);

    // Data State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settings, setSettings] = useState(null);

    // UI State
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            window.scrollTo(0, 0);
            try {
                const [productRes, settingsRes] = await Promise.all([
                    getProductById(id),
                    getSettings()
                ]);

                if (!productRes.data) throw new Error("Product not found");

                const prod = productRes.data;
                setProduct(prod);
                setSettings(settingsRes.data);

                // Initialize Options
                if (prod.hasVariants && prod.variantTypes?.length > 0) {
                    const initial = {};
                    prod.variantTypes.forEach(vt => {
                        if (vt?.options?.length > 0) {
                            // Backend now sends options as objects or strings? VariantTypeDto has List<VariantOptionDto>.
                            // So it is objects.
                            initial[vt.name] = (typeof vt.options[0] === 'object' ? vt.options[0].value : vt.options[0]);
                        }
                    });
                    setSelectedOptions(initial);
                }

                // Initialize Image
                if (prod.images?.length > 0) {
                    setSelectedImage(prod.images[0]);
                }

                // Analytics
                trackEvent('ViewContent', {
                    content_name: prod.name,
                    content_ids: [prod.id],
                    content_type: 'product',
                    value: prod.price,
                    currency: 'USD'
                });

            } catch (err) {
                console.error("Error fetching product:", err);
                setError('Product not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Sticky Bar Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsStickyBarVisible(!entry.isIntersecting),
            { threshold: 0 }
        );
        if (addToCartRef.current) observer.observe(addToCartRef.current);
        return () => observer.disconnect();
    }, [loading]);


    // Variant Logic
    const activeVariant = useMemo(() => {
        if (!product?.hasVariants || !product?.variants) return null;
        return product.variants.find(v =>
            v.variantMap && Object.entries(selectedOptions).every(([key, val]) => {
                const vVal = v.variantMap[key];
                return vVal === val || (typeof vVal === 'string' && vVal.trim() === val.trim());
            })
        );
    }, [product, selectedOptions]);

    // Update Image on Variant Change
    useEffect(() => {
        if (activeVariant?.imageUrl) {
            setSelectedImage(activeVariant.imageUrl);
        }
    }, [activeVariant]);

    const handleOptionSelect = (type, value) => {
        setSelectedOptions(prev => ({ ...prev, [type]: value }));
    };

    // Derived Display Values
    const currentPrice = activeVariant ? (activeVariant.price || product.price) : product?.price;
    const oldPrice = activeVariant ? (activeVariant.oldPrice || product?.oldPrice) : product?.oldPrice;
    const currentStock = activeVariant ? (activeVariant.stock || 0) : (product?.quantity || 0);
    const isOutOfStock = currentStock <= 0;

    // Handlers
    const handleAddToCart = async () => {
        const priceToTrack = currentPrice;

        if (isAuthenticated) {
            try {
                await addToCart(id, quantity, activeVariant?.id);
                toast.success('Product added to cart');
                fetchCartCount();
            } catch (err) {
                console.error(err);
                toast.error('Failed to add to cart');
            }
        } else {
            // Guest Cart
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            const existing = guestCart.items.findIndex(i => i.productId === product.id);

            if (existing > -1) {
                guestCart.items[existing].quantity += quantity;
                // Auto-fix missing images for existing items
                guestCart.items[existing].imageUrl = selectedImage || (product.images && product.images[0]);
                guestCart.items[existing].variantName = activeVariant ? activeVariant.name : null;
            }
            else guestCart.items.push({
                productId: product.id,
                productName: product.name,
                price: priceToTrack,
                quantity,
                imageUrl: (() => {
                    const img = selectedImage || (product.images && product.images[0]);
                    console.log('Adding to Guest Cart - Image:', img);
                    return img;
                })(),
                variantName: activeVariant ? activeVariant.name : null
            });

            localStorage.setItem('cart', JSON.stringify(guestCart));
            toast.success('Product added to cart');
            fetchCartCount();
        }

        trackEvent('AddToCart', {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: priceToTrack,
            currency: 'USD'
        });
    };

    const handleOrderNow = async () => {
        await handleAddToCart();
        trackEvent('InitiateCheckout', {
            content_ids: [product.id],
            value: currentPrice * quantity,
            currency: 'USD'
        });
        navigate('/order');
    };

    // Helper for Accordion-like Details
    const [activeTab, setActiveTab] = useState('desc');

    if (loading) return <Loader />;
    if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Product not found'}</div>;

    const averageRating = product.comments?.length
        ? product.comments.reduce((acc, c) => acc + c.score, 0) / product.comments.length
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 font-sans text-gray-900 pb-20 overflow-x-hidden">
            {/* Breadcrumbs - Transparent on Gradient */}
            {/* Breadcrumbs - Integrated into Page Flow */}
            <div className="container mx-auto px-4 py-4 lg:py-6">
                <div className="glass-pill inline-block px-6 py-2 backdrop-blur-xl bg-white/40 border border-white/40 shadow-sm rounded-full">
                    <Breadcrumbs categoryId={product.categoryId} categoryName={product.categoryName} productName={product.name} />
                </div>
            </div>

            <div className="container mx-auto px-2 py-3 lg:py-10 max-w-7xl animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-12">

                    {/* LEFT COLUMN: Gallery (lg:span-7) */}
                    <div className="lg:col-span-7 space-y-4 lg:space-y-6">
                        {/* Countdown Moved Above Image as requested */}
                        {product.showCountdownTimer && (
                            <div className="relative z-10 transform transition-all hover:scale-[1.01]">
                                <EnhancedCountdown
                                    fallbackEndTime={new Date().getTime() + 86400000}
                                    packName={product.name}
                                    onExpire={() => { }}
                                />
                            </div>
                        )}

                        {/* Main Image - Glass Effect Container */}
                        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden glass-panel-pro shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[600px] group transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] animate-float">
                            {/* Premium Badge */}
                            <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
                                <span className="glass-panel-dark backdrop-blur-md text-white text-[10px] lg:text-xs font-bold px-3 py-1.5 lg:px-4 lg:py-2 rounded-full tracking-widest uppercase shadow-lg border border-white/10">
                                    جودة ممتازة / Qualité Premium
                                </span>
                            </div>

                            {selectedImage?.includes('youtube.com') ? (
                                <iframe
                                    src={selectedImage}
                                    className="w-full h-full object-cover rounded-2xl"
                                    allowFullScreen
                                    title="Product Video"
                                />
                            ) : (
                                <div
                                    className="w-full h-full overflow-hidden cursor-zoom-in relative"
                                    onClick={() => setIsLightboxOpen(true)}
                                    // Mouse move logic kept simple/removed for mobile optimization if heavily JS dependent, focusing on css structure here. Keeping structure.
                                    onMouseMove={(e) => {
                                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - left) / width) * 100;
                                        const y = ((e.clientY - top) / height) * 100;
                                        e.currentTarget.style.setProperty('--x', `${x}%`);
                                        e.currentTarget.style.setProperty('--y', `${y}%`);
                                    }}
                                    style={{
                                        '--x': '50%',
                                        '--y': '50%'
                                    }}
                                >
                                    <img
                                        src={selectedImage || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply p-2 lg:p-6 transition-transform duration-200 ease-out lg:hover:scale-[1.6] origin-[var(--x)_var(--y)]"
                                    />
                                </div>
                            )}

                            {/* Lightbox Modal */}
                            {isLightboxOpen && (
                                <div
                                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-10 animate-fade-in"
                                    onClick={() => setIsLightboxOpen(false)}
                                >
                                    <button
                                        onClick={() => setIsLightboxOpen(false)}
                                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                                    >
                                        <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>

                                    <div
                                        className="relative w-full max-w-7xl h-full flex items-center justify-center overflow-hidden cursor-zoom-in"
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseMove={(e) => {
                                            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                            const x = ((e.clientX - left) / width) * 100;
                                            const y = ((e.clientY - top) / height) * 100;
                                            e.currentTarget.style.setProperty('--x', `${x}%`);
                                            e.currentTarget.style.setProperty('--y', `${y}%`);
                                        }}
                                        style={{ '--x': '50%', '--y': '50%' }}
                                    >
                                        <img
                                            src={selectedImage || '/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out hover:scale-[2] origin-[var(--x)_var(--y)]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails - Horizontal Scroll on Mobile, Grid on Desktop */}
                        <div className="flex overflow-x-auto pb-4 gap-3 lg:gap-4 hide-scrollbar">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === img
                                        ? 'border-purple-600 ring-2 ring-purple-100 shadow-lg scale-105'
                                        : 'border-white bg-white/50 hover:border-purple-300'
                                        }`}
                                >
                                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Details (lg:span-5) */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="lg:sticky lg:top-24 space-y-4 lg:space-y-6">

                            {/* Header Card */}
                            <div className="glass-panel-pro rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-xl space-y-3 lg:space-y-6 transform transition-all hover:scale-[1.01] duration-500" style={{ animationDelay: '0.1s' }}>
                                <h1 className="text-xl md:text-3xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    {product.name}
                                </h1>

                                <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 sm:gap-0">
                                    <div className="flex items-baseline gap-2 lg:gap-3">
                                        <span className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent animate-shine">
                                            {formatPrice(currentPrice)}
                                        </span>
                                        {oldPrice > currentPrice && (
                                            <span className="text-lg lg:text-xl text-gray-400 line-through">{formatPrice(oldPrice)}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 self-start sm:self-auto">
                                        <span className="text-yellow-500 text-lg">★</span>
                                        <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                                        <span className="text-gray-500 text-sm">({product.comments?.length || 0})</span>
                                    </div>
                                </div>

                                <EnhancedVisitorCounter />
                            </div>



                            {/* Variants - PRO TILES */}
                            {product.hasVariants && product.variantTypes?.length > 0 && (
                                <div className="glass-panel-pro rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-xl space-y-3 lg:space-y-6" style={{ animationDelay: '0.2s' }}>
                                    {product.variantTypes.map(vt => (
                                        <div key={vt.name}>
                                            <div className="flex justify-between items-center mb-3 lg:mb-4">
                                                <h3 className="text-xs lg:text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                    اختر {vt.name} / Choix {vt.name}
                                                </h3>
                                                <span className="text-xs lg:text-sm text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                                                    {selectedOptions[vt.name]}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 lg:gap-3">
                                                {vt.options.map((optObj, optIdx) => {
                                                    // Handle both object (new) and string (legacy/fallback) formats
                                                    const optValue = typeof optObj === 'object' ? optObj.value : optObj;
                                                    const colorCode = typeof optObj === 'object' ? optObj.colorCode : null;
                                                    const imageUrl = typeof optObj === 'object' ? optObj.imageUrl : null;

                                                    const isSelected = selectedOptions[vt.name] === optValue;

                                                    // Render Image Swatch
                                                    if (imageUrl) {
                                                        return (
                                                            <button
                                                                key={optValue}
                                                                onClick={() => handleOptionSelect(vt.name, optValue)}
                                                                className={`
                                                                    relative w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden transition-all duration-300 border-2
                                                                    ${isSelected ? 'border-purple-600 ring-2 ring-purple-200 transform scale-110 shadow-lg' : 'border-gray-200 opacity-80 hover:opacity-100 hover:scale-105'}
                                                                `}
                                                                title={optValue}
                                                            >
                                                                <img src={imageUrl} alt={optValue} className="w-full h-full object-cover" />
                                                                {isSelected && <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                </div>}
                                                            </button>
                                                        );
                                                    }

                                                    // Render Color Swatch
                                                    if (colorCode) {
                                                        return (
                                                            <button
                                                                key={optValue}
                                                                onClick={() => handleOptionSelect(vt.name, optValue)}
                                                                className={`
                                                                    relative w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 border-2 shadow-sm
                                                                    ${isSelected ? 'border-purple-600 ring-2 ring-purple-200 transform scale-110' : 'border-gray-200 hover:scale-105'}
                                                                `}
                                                                style={{ backgroundColor: colorCode }}
                                                                title={optValue}
                                                            >
                                                                {isSelected && (
                                                                    <div className="flex items-center justify-center h-full">
                                                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    }

                                                    // Default Text Button
                                                    return (
                                                        <button
                                                            key={optValue}
                                                            onClick={() => handleOptionSelect(vt.name, optValue)}
                                                            className={`
                                                                relative px-4 py-2 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-bold transition-all duration-300 border-2
                                                                ${isSelected
                                                                    ? 'border-purple-500 bg-white/80 text-purple-900 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] transform -translate-y-1'
                                                                    : 'border-transparent bg-white/40 text-gray-600 hover:border-purple-200 hover:bg-white/60 hover:shadow-md'
                                                                }
                                                            `}
                                                        >
                                                            {optValue}
                                                            {isSelected && (
                                                                <span className="absolute -top-1.5 -right-1.5 lg:-top-2 lg:-right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white flex items-center justify-center shadow-lg transform scale-100 transition-transform animate-bounce-custom">
                                                                    <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Area */}
                            <div className="glass-panel-pro rounded-2xl lg:rounded-3xl p-3 lg:p-8 shadow-2xl space-y-3 lg:space-y-6 transform transition-all hover:scale-[1.02] duration-500 border border-white/60" ref={addToCartRef} style={{ animationDelay: '0.3s' }}>
                                {/* Stock Logic */}
                                {!isOutOfStock ? (
                                    <div className="flex items-center text-green-700 font-bold text-xs lg:text-sm gap-2 bg-green-50 w-fit px-3 py-1 rounded-full">
                                        <span className="relative flex h-2 lg:h-2.5 w-2 lg:w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                                        </span>
                                        متوفر وجاهز للشحن / En Stock & Prêt à expédier
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-bold text-sm flex items-center gap-2 bg-red-50 w-fit px-3 py-1 rounded-full">
                                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                        غير متوفر / Rupture de Stock
                                    </div>
                                )}

                                {/* Quantity & Add */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <div className="flex items-center glass-pill p-1 h-10 lg:h-14 w-full sm:w-40">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-full flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-red-400 transition-all font-bold text-lg active:scale-95"
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                            className="flex-1 w-full text-center font-black text-lg lg:text-xl text-gray-800 border-none bg-transparent focus:ring-0 p-0"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-full flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-green-400 transition-all font-bold text-xl active:scale-95"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Order Now - Prominent Gradient */}
                                <button
                                    onClick={handleOrderNow}
                                    disabled={isOutOfStock}
                                    className="relative w-full overflow-hidden group h-10 lg:h-16 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-[0_15px_30px_rgba(236,72,153,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-shine opacity-30 group-hover:opacity-50"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 group-hover:from-pink-500 group-hover:to-purple-500 transition-all"></div>
                                    <div className="relative flex items-center justify-center gap-2 text-white font-black text-sm lg:text-xl tracking-wide">
                                        <span>اطلب الآن / COMMANDER</span>
                                        <svg className="w-4 h-4 lg:w-6 lg:h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className="w-full h-12 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            <div className="pt-2 opacity-80">
                                <TrustBadges />
                            </div>


                        </div>
                    </div>
                </div>

                {/* Content Sections Below - Stacked (User Request) */}
                <div className="mt-6 lg:mt-24 max-w-5xl mx-auto space-y-6 lg:space-y-12">

                    {/* Description Section */}
                    <div className="glass-panel-pro rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-12 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-lg lg:text-4xl font-black text-gray-900 mb-4 lg:mb-10 flex items-center gap-4">
                            <span className="w-1.5 h-6 lg:h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full shadow-lg"></span>
                            الوصف / Description
                        </h2>
                        <div
                            className="prose prose-base md:prose-lg lg:prose-xl prose-purple max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl lg:rounded-[2rem] p-4 lg:p-12 border border-white/60 shadow-xl">
                        <h2 className="text-lg lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-6 lg:h-8 bg-purple-500 rounded-full"></span>
                            مراجعات / Avis ({product.comments?.length || 0})
                        </h2>
                        <div className="space-y-8">
                            <ReviewSummary comments={product.comments} />

                            {/* Enhanced Review List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-8 lg:mt-12">
                                {product.comments?.length > 0 ? product.comments.map((comment, index) => (
                                    <div
                                        key={comment.id || index}
                                        className="glass-panel-pro p-5 lg:p-8 rounded-2xl lg:rounded-3xl relative overflow-hidden group hover:shadow-xl transition-all duration-500 animate-slide-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Decoration Gradient */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-150"></div>

                                        <div className="flex items-start justify-between mb-4 lg:mb-6 relative">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-inner flex items-center justify-center text-base lg:text-lg font-bold text-gray-600">
                                                    {comment.createdByAdmin
                                                        ? (comment.customName ? comment.customName[0].toUpperCase() : 'A')
                                                        : (comment.userEmail ? comment.userEmail[0].toUpperCase() : 'U')
                                                    }
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm lg:text-lg flex items-center gap-2">
                                                        {comment.createdByAdmin
                                                            ? (comment.customName || "Happy Customer")
                                                            : (comment.userEmail?.split('@')[0] || "Customer")
                                                        }
                                                        <span className="bg-green-100 text-green-700 text-[9px] lg:text-[10px] font-black px-1.5 py-0.5 lg:px-2 lg:py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                                            <span>✓</span> <span className="hidden sm:inline">موثق / Vérifié</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex text-yellow-400 text-xs lg:text-sm mt-0.5">
                                                        {'★'.repeat(comment.score)}
                                                        <span className="text-gray-200">{'★'.repeat(5 - comment.score)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] lg:text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 lg:px-3 lg:py-1 rounded-full">
                                                حديث / Récent
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <p className="text-gray-600 leading-relaxed font-medium text-sm lg:text-lg italic">
                                                "{comment.content}"
                                            </p>
                                            {/* Render Comment Images */}
                                            {comment.images && comment.images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {comment.images.map((img, imgIdx) => (
                                                        <div key={imgIdx} className="relative w-16 h-16 lg:w-24 lg:h-24 rounded-lg lg:rounded-xl overflow-hidden shadow-sm border border-gray-100 group/img cursor-pointer transition-all hover:scale-105">
                                                            <img
                                                                src={img}
                                                                alt={`Review attachment ${imgIdx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onClick={() => setSelectedImage(img)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Like/Helpful Actions (Mock) */}
                                        <div className="mt-4 lg:mt-6 flex items-center gap-4 pt-4 lg:pt-6 border-t border-gray-100/50">
                                            <button className="text-xs lg:text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1 group/btn">
                                                <span className="group-hover/btn:scale-125 transition-transform">❤️</span> مفيد / Utile
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="text-6xl mb-4">💬</div>
                                        <p className="text-gray-500 text-xl font-bold">لا توجد مراجعات بعد. كن أول من يراجع! / Pas encore d'avis. Soyez le premier à donner votre avis !</p>
                                    </div>
                                )}
                            </div>
                            {settings?.reviewFormEnabled === 'true' && (
                                <CommentForm productId={id} onCommentAdded={fetchCartCount} />
                            )}
                        </div>
                    </div>

                    {/* Shipping and Returns */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl lg:rounded-[2rem] p-6 lg:p-12 border border-white/60 shadow-xl">
                        <ShippingReturns />
                    </div>

                    {/* Frequently Bought Together */}
                    <div className="mt-12">
                        <FrequentlyBoughtTogether
                            product={product}
                            fetchCartCount={fetchCartCount}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>
            </div>

            <StickyAddToCart
                pack={product}
                activeImage={selectedImage}
                onAddToCart={handleAddToCart}
                isVisible={isStickyBarVisible && !isOutOfStock}
            />


        </div>
    );
};

export default ProductDetailPage;
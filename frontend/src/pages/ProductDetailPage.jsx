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
                            initial[vt.name] = vt.options[0];
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

            if (existing > -1) guestCart.items[existing].quantity += quantity;
            else guestCart.items.push({
                productId: product.id,
                productName: product.name,
                price: priceToTrack,
                quantity
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 font-sans text-gray-900 pb-20">
            {/* Breadcrumbs - Transparent on Gradient */}
            <div className="border-b border-gray-200/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3">
                    <Breadcrumbs categoryId={product.categoryId} categoryName={product.categoryName} productName={product.name} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* LEFT COLUMN: Gallery (lg:span-7) */}
                    <div className="lg:col-span-7 space-y-6">
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
                        <div className="relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl aspect-[4/3] lg:aspect-auto lg:h-[600px] group transition-all duration-300 hover:shadow-2xl">
                            {/* Premium Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-black/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase shadow-lg">
                                    Premium Quality
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
                                <img
                                    src={selectedImage || '/placeholder-product.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply p-6 transition-transform duration-700 group-hover:scale-110"
                                />
                            )}
                        </div>

                        {/* Thumbnails - Horizontal Scroll on Mobile, Grid on Desktop */}
                        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === img
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
                        <div className="sticky top-24 space-y-8">

                            {/* Header Card */}
                            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/60 shadow-lg space-y-6">
                                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                                            ${currentPrice}
                                        </span>
                                        {oldPrice > currentPrice && (
                                            <span className="text-xl text-gray-400 line-through">${oldPrice}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                                        <span className="text-yellow-500 text-lg">★</span>
                                        <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                                        <span className="text-gray-500 text-sm">({product.comments?.length || 0})</span>
                                    </div>
                                </div>

                                <EnhancedVisitorCounter />
                            </div>



                            {/* Variants - PRO TILES */}
                            {product.hasVariants && product.variantTypes?.length > 0 && (
                                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/60 shadow-lg space-y-6">
                                    {product.variantTypes.map(vt => (
                                        <div key={vt.name}>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                    Select {vt.name}
                                                </h3>
                                                <span className="text-sm text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                                                    {selectedOptions[vt.name]}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {vt.options.map(opt => {
                                                    const isSelected = selectedOptions[vt.name] === opt;
                                                    return (
                                                        <button
                                                            key={opt}
                                                            onClick={() => handleOptionSelect(vt.name, opt)}
                                                            className={`
                                                                relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border
                                                                ${isSelected
                                                                    ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md ring-1 ring-purple-500'
                                                                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                                                }
                                                            `}
                                                        >
                                                            {opt}
                                                            {isSelected && (
                                                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
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
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/60 shadow-xl space-y-6 transform transition-all hover:scale-[1.01]" ref={addToCartRef}>
                                {/* Stock Logic */}
                                {!isOutOfStock ? (
                                    <div className="flex items-center text-green-700 font-bold text-sm gap-2 bg-green-50 w-fit px-3 py-1 rounded-full">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                        </span>
                                        In Stock & Ready to Ship
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-bold text-sm flex items-center gap-2 bg-red-50 w-fit px-3 py-1 rounded-full">
                                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                        Out of Stock
                                    </div>
                                )}

                                {/* Quantity & Add */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl h-14 w-36 overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                            className="flex-1 w-full text-center font-bold text-lg text-gray-900 border-none bg-transparent focus:ring-0 p-0"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Order Now - Prominent Gradient */}
                                <button
                                    onClick={handleOrderNow}
                                    disabled={isOutOfStock}
                                    className="relative w-full overflow-hidden group h-16 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 group-hover:from-black group-hover:to-gray-800 transition-all"></div>
                                    <div className="relative flex items-center justify-center gap-3 text-white font-bold text-xl">
                                        <span>ORDER NOW</span>
                                        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
                <div className="mt-20 lg:mt-32 max-w-5xl mx-auto space-y-12">

                    {/* Description Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 lg:p-12 border border-white/60 shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-purple-500 rounded-full"></span>
                            Description
                        </h2>
                        <div
                            className="prose prose-lg prose-purple max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 lg:p-12 border border-white/60 shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-purple-500 rounded-full"></span>
                            Reviews ({product.comments?.length || 0})
                        </h2>
                        <div className="space-y-8">
                            <ReviewSummary comments={product.comments} />
                            <div className="space-y-6">
                                {product.comments?.length > 0 ? product.comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900">{comment.userFullName || 'Customer'}</h4>
                                            <span className="text-yellow-500">{'★'.repeat(comment.score)}</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-500">No reviews yet.</div>
                                )}
                            </div>
                            {settings?.reviewFormEnabled === 'true' && (
                                <CommentForm productId={id} onCommentAdded={fetchCartCount} />
                            )}
                        </div>
                    </div>

                    {/* Shipping and Returns */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 lg:p-12 border border-white/60 shadow-xl">
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
// PASTE THIS CODE INTO: frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getBestsellers, getCart } from '../api/apiService';
import Loader from '../components/Loader';
import CommentForm from '../components/CommentForm';
import ProductSlider from '../components/ProductSlider';
import VisitorCounter from '../components/VisitorCounter.jsx';
import EnhancedVisitorCounter from '../components/EnhancedVisitorCounter.jsx';
import CountdownBar from '../components/CountdownBar';
import TrustBadges from '../components/TrustBadges';
import SocialShare from '../components/SocialShare';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
import ReviewSummary from '../components/ReviewSummary';
import Breadcrumbs from '../components/Breadcrumbs';
import PurchasePopup from '../components/PurchasePopup';
import EnhancedCountdown from '../components/EnhancedCountdown';
import LiveVisitorCounter from '../components/LiveVisitorCounter';
import PurchaseNotifications from '../components/PurchaseNotifications';
import StickyAddToCart from '../components/StickyAddToCart';
import Accordion from '../components/Accordion';
import { toast } from 'react-toastify';
import './PackDetailPage.css'; // Import CSS for animations

const ProductDetailPage = ({ fetchCartCount, isAuthenticated }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [bestsellers, setBestsellers] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
    const addToCartRef = useRef(null);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (addToCartRef.current) {
                const { bottom } = addToCartRef.current.getBoundingClientRect();
                setIsStickyBarVisible(bottom < 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchProductAndCart = async () => {
        setLoading(true);
        window.scrollTo(0, 0);
        try {
            const [productResponse, bestsellersResponse] = await Promise.all([
                getProductById(id),
                getBestsellers()
            ]);

            const productData = productResponse.data;
            setProduct(productData);

            if (productData.hasVariants && productData.variantTypes && productData.variantTypes.length > 0) {
                const initialOptions = {};
                productData.variantTypes.forEach(vt => {
                    if (vt && vt.name && vt.options && vt.options.length > 0) {
                        initialOptions[vt.name] = vt.options[0];
                    }
                });
                setSelectedOptions(initialOptions);
            }

            if (productData.images && productData.images.length > 0) {
                setSelectedImage(productData.images[0]);
            }
            setBestsellers(bestsellersResponse.data);

            if (isAuthenticated) {
                const cartResponse = await getCart();
                setCart(cartResponse.data);
            }
        } catch (err) {
            console.error("Failed to fetch product details:", err);
            setError('Product not found or an error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductAndCart();
    }, [id, isAuthenticated]);


    const activeVariant = useMemo(() => {
        if (!product || !product.hasVariants || !product.variants) return null;
        try {
            return product.variants.find(v =>
                v && v.variantMap && 
                Object.entries(selectedOptions).every(([key, value]) => 
                    v.variantMap && v.variantMap[key] === value
                )
            );
        } catch (error) {
            console.error('Error finding active variant:', error);
            return null;
        }
    }, [product, selectedOptions]);

    useEffect(() => {
        if (activeVariant && activeVariant.imageUrl) {
            setSelectedImage(activeVariant.imageUrl);
        } else if (product && product.images && product.images.length > 0) {
            setSelectedImage(product.images[0]);
        }
    }, [activeVariant, product]);

    const handleCommentAdded = () => {
        fetchProductAndCart();
    };

    const handleAddToCart = async () => {
        if (isAuthenticated) {
            try {
                const variantId = activeVariant ? activeVariant.id : null;
                await addToCart(id, quantity, variantId);
                toast.success('Product added to cart!');
                fetchCartCount();
                const response = await getCart();
                setCart(response.data);
            } catch (error) {
                console.error('Failed to add to cart:', error);
                toast.error('Failed to add product to cart.');
            }
        } else {
            // Guest cart logic
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            const existingItemIndex = guestCart.items.findIndex(item => item.productId === product.id);

            if (existingItemIndex > -1) {
                guestCart.items[existingItemIndex].quantity += quantity;
            } else {
                guestCart.items.push({
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    quantity: quantity,
                });
            }
            localStorage.setItem('cart', JSON.stringify(guestCart));
            toast.success('Product added to cart!');
            fetchCartCount();
        }
    };

    const handleOrderNow = async () => {
        await handleAddToCart(); // Add to cart first
        navigate('/order');   // Then navigate to order page
    };

    const handleOptionSelect = (typeName, optionValue) => {
        setSelectedOptions(prev => ({ ...prev, [typeName]: optionValue }));
    };

    const calculateAverageRating = () => {
        if (!product || !product.comments || product.comments.length === 0) return 0;
        const total = product.comments.reduce((acc, comment) => acc + comment.score, 0);
        return total / product.comments.length;
    };

    const averageRating = calculateAverageRating();

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="text-yellow-400">&#9733;</span>)}
                {halfStar && <span className="text-yellow-400">&#9734;</span>}
                {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">&#9733;</span>)}
                <span className="ml-2 text-sm text-gray-600">({product.comments ? product.comments.length : 0} reviews)</span>
            </div>
        );
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
    if (!product) return <div className="text-center mt-8">Product not found</div>;
    
    // Add null checks for required product properties
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
        product.images = ['/placeholder-product.jpg'];
    }

    // Add null checks for prices and stock
    const displayPrice = activeVariant ? 
        (activeVariant.price || 0) : 
        (product.price || 0);
    const oldPrice = activeVariant ? 
        (activeVariant.oldPrice || 0) : 
        (product.oldPrice || 0);
    const displayStock = activeVariant ? 
        (activeVariant.stock || 0) : 
        (product.quantity || 0);
    
    // Stock status
    const isOutOfStock = displayStock <= 0;

    const accordionItems = [
        {
            title: 'Description',
            content: (
                <>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">Why Choose Us?</h4>
                        <ul className="space-y-3 list-none p-0">
                            <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><strong>Authentic Products:</strong> Guaranteed 100% authentic.</li>
                            <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><strong>Fast Shipping:</strong> Orders in Casablanca delivered in 3-5 days.</li>
                            <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><strong>Easy Returns:</strong> 30-day money-back guarantee.</li>
                        </ul>
                    </div>
                </>
            )
        },
        {
            title: `Reviews (${product.comments ? product.comments.length : 0})`,
            content: (
                <div>
                            {product.comments && product.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {product.comments.map(comment => comment && (
                                <div key={comment.id} className="p-4 border rounded-lg">
                                    <p className="font-semibold">{comment.userFullName || 'Anonymous'}</p>
                                    <p className="text-yellow-400">{'★'.repeat(comment.score || 0)}{'☆'.repeat(5 - (comment.score || 0))}</p>
                                    <p className="text-gray-600 mt-2">{comment.content || ''}</p>
                                    {comment.images && comment.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {comment.images.map((img, index) => img && (
                                                <img key={index} src={img} alt={`Comment image ${index + 1}`} className="w-24 h-24 object-cover rounded-md border" />
                                            )).filter(Boolean)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                    <CommentForm productId={id} onCommentAdded={handleCommentAdded} />
                </div>
            )
        },
        {
            title: 'Shipping & Returns',
            content: (
                <div>
                    <p>We offer fast shipping to your location. Most orders are processed within 1-2 business days and delivered within 3-5 business days in major cities like Casablanca and Rabat.</p>
                    <p className="mt-2">We also offer a <strong>30-day money-back guarantee</strong>. If you're not satisfied, you can return it for a full refund.</p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
            {/* Hero Section with Enhanced Background */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100 opacity-60"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full -translate-y-48 translate-x-48 opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200 to-pink-200 rounded-full translate-y-40 -translate-x-40 opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <div className="relative z-10 container-xl section-spacing">
                    <Breadcrumbs categoryId={product.categoryId} categoryName={product.categoryName} productName={product.name} />
                    <CountdownBar />
                    
                    {/* Enhanced Countdown Timer */}
                    <EnhancedCountdown 
                        endTime={new Date().getTime() + (24 * 60 * 60 * 1000)} // 24 hours from now
                        packName={product.name}
                        onExpire={() => {
                            toast.info('🕐 انتهت فترة العرض الخاص / Special offer period ended');
                        }}
                    />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 content-spacing-lg">
                {/* Enhanced Image Gallery */}
                <div className="space-y-6">
                    {/* Main Product Image with Enhanced Styling */}
                    <div className="relative group">
                        {/* Premium Badge */}
                        <div className="absolute top-4 left-4 z-20">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm animate-pulse">
                                ⭐ Premium Quality
                            </div>
                        </div>
                        
                        {/* Quick Actions Overlay */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all duration-200 transform hover:scale-110">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-200 transform hover:scale-110">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            </button>
                        </div>

                        {/* Main Image Container */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-4 max-w-2xl mx-auto">
                            {selectedImage && selectedImage.includes('youtube.com/embed') ? (
                                <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden">
                                    <iframe src={selectedImage} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Product Video" className="w-full h-full" style={{ minHeight: '500px' }}></iframe>
                                </div>
                            ) : (
                                <div className="image-zoom-container rounded-xl">
                                    <img 
                                        src={selectedImage} 
                                        alt="Selected product view" 
                                        className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105" 
                                        style={{ maxHeight: '600px' }} 
                                    />
                                </div>
                            )}
                            
                            {/* Image Loading Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Enhanced Thumbnail Gallery */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">🖼️</span>
                            <span>معرض الصور / Image Gallery</span>
                        </h3>
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {product.images && product.images.map((img, index) =>
                                img && img.includes('youtube.com/embed') ? (
                                    <div 
                                        key={index} 
                                        onClick={() => setSelectedImage(img)} 
                                        className={`flex-shrink-0 w-24 h-24 rounded-xl cursor-pointer border-3 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-300 transform hover:scale-110 ${
                                            selectedImage === img 
                                                ? 'border-pink-500 ring-4 ring-pink-200 shadow-lg' 
                                                : 'border-gray-300 hover:border-pink-300'
                                        }`}
                                    >
                                        <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ) : (
                                    <img 
                                        key={index} 
                                        src={img} 
                                        alt={`Thumbnail ${index + 1}`} 
                                        className={`flex-shrink-0 w-24 h-24 object-cover rounded-xl cursor-pointer border-3 transition-all duration-300 transform hover:scale-110 ${
                                            selectedImage === img 
                                                ? 'border-pink-500 ring-4 ring-pink-200 shadow-lg' 
                                                : 'border-gray-300 hover:border-pink-300'
                                        }`} 
                                        onClick={() => setSelectedImage(img)} 
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>

                    {/* Optimized Product Details - Priority Layout */}
                <div className="space-y-5 max-w-2xl mx-auto lg:max-w-none">
                    {/* HIGH PRIORITY: Product Header - Most Important */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
                        {/* Product Title - Highest Priority */}
                        <div className="mb-5">
                            <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 leading-tight">
                                {product.name}
                            </h1>
                            
                            {/* Price Display - High Priority */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl lg:text-4xl font-black text-pink-600">${displayPrice}</span>
                                    {oldPrice > displayPrice && (
                                        <div className="flex flex-col">
                                            <span className="text-lg text-gray-400 line-through">${oldPrice}</span>
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                Save ${(oldPrice - displayPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Size/Unit Info - Medium Priority */}
                            {product.size && product.unit && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Price per {product.unit}:</span> ${(displayPrice / product.size).toFixed(2)}
                                    </p>
                                </div>
                            )}
                            
                            {/* Enhanced Visitor Counter */}
                            <div className="mt-4">
                                <EnhancedVisitorCounter />
                            </div>
                        </div>

                        {/* MEDIUM PRIORITY: Rating and Reviews - Condensed */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {renderStars(averageRating)}
                                        <span className="text-lg font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                                    </div>
                                    <div className="h-5 w-px bg-gray-300"></div>
                                    <span className="text-sm text-gray-600">
                                        ({product.comments?.length || 0} reviews)
                                    </span>
                                </div>
                                <div className="text-right">
                                    <ReviewSummary comments={product.comments} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LOW PRIORITY: Activity Information Panel - Social Proof */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 compact-info-panel">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-700 truncate">مشاهد الآن / Viewing</span>
                                <span className="font-bold text-purple-600">16</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700 truncate">مشاهدة / Viewed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-gray-700 truncate">أضاف اليوم / Added today</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700 truncate">نشاط مديت / Activity</span>
                            </div>
                        </div>
                    </div>

                    {/* HIGH PRIORITY: Product Options Selection */}
                    {product.hasVariants && (
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-200 compact-card">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-xl">🎨</span>
                                <span>اختر الخيارات / Select Options</span>
                            </h3>
                            {product.variantTypes && product.variantTypes.map(vt => vt && (
                                <div key={vt.name} className="mb-4">
                                    <h4 className="text-sm font-semibold mb-3 text-gray-700 capitalize">{vt.name || 'Option'}</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {vt.options && vt.options.map(option => option && (
                                            <button 
                                                key={option} 
                                                onClick={() => handleOptionSelect(vt.name, option)} 
                                                className={`px-4 py-2.5 border-2 rounded-lg font-semibold transition-all duration-200 text-sm min-w-[60px] ${
                                                    selectedOptions[vt.name] === option 
                                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-500 shadow-md transform scale-105' 
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50 hover:shadow-sm'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {/* HIGHEST PRIORITY: Purchase Section */}
                    <div ref={addToCartRef} className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl shadow-xl border border-pink-200 compact-section">
                        {/* Stock Status - Critical Information */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${displayStock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    <p className={`font-bold text-base ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {displayStock > 0 ? `${displayStock} متوفر / in stock` : 'غير متوفر / Out of Stock'}
                                    </p>
                                </div>
                                {displayStock > 0 && displayStock <= 10 && (
                                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold text-xs animate-pulse">
                                        🔥 {displayStock} left!
                                    </div>
                                )}
                            </div>
                            
                            {/* Stock Progress Bar - Only show if low stock */}
                            {!isOutOfStock && displayStock <= 20 && displayStock > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Stock Level</span>
                                        <span className="font-semibold">{displayStock} left</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((displayStock / 20) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Optimized Quantity Selector */}
                        <div className="mb-5">
                            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                                الكمية / Quantity
                            </label>
                            <div className="flex items-center gap-2 max-w-[140px]">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <input 
                                    id="quantity" 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))} 
                                    className="w-16 h-9 text-center text-base font-bold border-2 border-gray-300 rounded-md focus:border-pink-500 focus:outline-none" 
                                    min="1" 
                                />
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* HIGHEST PRIORITY: Action Buttons */}
                        <div className="space-y-2.5">
                            {/* Primary CTA - Order Now */}
                            <button 
                                onClick={handleOrderNow} 
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3.5 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]" 
                                disabled={displayStock <= 0}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-base">اطلب الآن / Order Now</span>
                            </button>
                            
                            {/* Secondary CTA - Add to Cart */}
                            <button 
                                onClick={handleAddToCart} 
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg" 
                                disabled={displayStock <= 0}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-base">
                                    {displayStock > 0 ? 'أضف للسلة / Add to Cart' : 'غير متوفر / Out of Stock'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* MEDIUM PRIORITY: Trust Badges and Social Share */}
                    <div className="space-y-4">
                        <div className="compact-card">
                            <TrustBadges />
                        </div>
                        <div className="compact-card">
                            <SocialShare productUrl={window.location.href} productName={product.name} />
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* MEDIUM PRIORITY: Description Section */}
            <div className="container-xl section-spacing-lg">
                <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-white/50 max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                        <span className="text-3xl">📋</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            وصف المنتج / Product Description
                        </h2>
                        <p className="text-gray-600 mt-2">تفاصيل شاملة عن المنتج / Comprehensive product details</p>
                    </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                    
                    {/* Enhanced Why Choose Us Section */}
                    <div className="mt-12 pt-8 border-t-2 border-gradient-to-r from-blue-200 to-purple-200">
                        <h4 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <span className="text-3xl">🌟</span>
                            <span>لماذا تختارنا؟ / Why Choose Us?</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">
                                        ✓
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold text-green-700 mb-2">منتجات أصلية / Authentic Products</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">مضمونة 100% أصلية مع شهادات الجودة / Guaranteed 100% authentic with quality certificates</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">
                                        🚚
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold text-blue-700 mb-2">شحن سريع / Fast Shipping</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">الدار البيضاء 3-5 أيام مع تتبع مباشر / Casablanca 3-5 days with live tracking</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                                        ↩️
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold text-purple-700 mb-2">إرجاع سهل / Easy Returns</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">ضمان 30 يوم مع إرجاع مجاني / 30-day guarantee with free returns</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* LOW PRIORITY: Reviews Section */}
            <div className="container-xl section-spacing-lg">
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-yellow-200/50 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">⭐</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                آراء العملاء / Customer Reviews
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {product.comments ? product.comments.length : 0} مراجعة من عملائنا / Reviews from our customers
                            </p>
                        </div>
                    </div>
                    
                    {product.comments && product.comments.length > 0 && (
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-200">
                            <div className="text-4xl font-black text-green-600 mb-2">{product.comments.length}</div>
                            <div className="text-sm font-semibold text-gray-600">مراجعة / Reviews</div>
                            <div className="flex items-center justify-center mt-2">
                                {renderStars(averageRating)}
                                <span className="text-lg font-bold text-yellow-600 ml-2">
                                    {averageRating.toFixed(1)}/5
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {product.comments && product.comments.length > 0 ? (
                    <div className="space-y-6 mb-8">
                        {product.comments && product.comments.slice(0, 3).map(comment => comment && (
                            <div key={comment.id} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                            {(comment.userFullName && comment.userFullName[0]) || 'A'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-lg">{comment.userFullName || 'Anonymous'}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center">
                                                    <span className="text-yellow-400 text-xl">{'★'.repeat(comment.score || 0)}{'☆'.repeat(5 - (comment.score || 0))}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600">تقييم {comment.score}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">✓ مؤكد / Verified</span>
                                        <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-semibold">⭐ ممتاز / Excellent</span>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-lg mb-4">{comment.content}</p>
                                {comment.images && comment.images.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {comment.images.map((img, index) => img && (
                                            <img 
                                                key={index} 
                                                src={img} 
                                                alt={`Review image ${index + 1}`} 
                                                className="w-24 h-24 object-cover rounded-xl border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 cursor-pointer transform hover:scale-105" 
                                            />
                                        )).filter(Boolean)}
                                    </div>
                                )}
                            </div>
                        ))}
                        {product.comments.length > 3 && (
                            <div className="text-center">
                                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    عرض جميع المراجعات ({product.comments.length}) / View All Reviews
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-6xl">💭</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">لا توجد مراجعات بعد / No reviews yet</h3>
                        <p className="text-gray-600 text-lg mb-6">كن أول من يكتب مراجعة! / Be the first to write a review!</p>
                        <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
                    </div>
                )}

                {/* Enhanced Comment Form */}
                <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-yellow-300">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <span className="text-xl">✍️</span>
                        </div>
                        <span>اكتب مراجعتك / Write Your Review</span>
                    </h3>
                    <CommentForm productId={id} onCommentAdded={handleCommentAdded} />
                </div>
                </div>
            </div>

            {/* LOW PRIORITY: Shipping & Returns Section */}
            <div className="container-xl section-spacing-lg">
                <div className="bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-green-200/50 max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                        <span className="text-3xl">🚚</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            الشحن والإرجاع / Shipping & Returns
                        </h2>
                        <p className="text-gray-600 mt-2">معلومات شاملة عن الشحن والإرجاع / Comprehensive shipping and return information</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                            <h4 className="text-xl font-bold text-green-700">معلومات الشحن / Shipping Info</h4>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                                نحن نقدم شحن سريع إلى موقعك. معظم الطلبات تتم معالجتها خلال 1-2 يوم عمل وتسليمها خلال 3-5 أيام عمل في المدن الكبرى مثل الدار البيضاء والرباط.
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                We offer fast shipping to your location. Most orders are processed within 1-2 business days and delivered within 3-5 business days in major cities like Casablanca and Rabat.
                            </p>
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-green-600">🚀</span>
                                    <span className="font-semibold text-green-700">شحن مجاني للطلبات فوق $50</span>
                                </div>
                                <p className="text-sm text-green-600">Free shipping on orders over $50</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">↩️</span>
                            </div>
                            <h4 className="text-xl font-bold text-blue-700">سياسة الإرجاع / Return Policy</h4>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                                نحن نقدم أيضاً <strong className="text-blue-700">ضمان استرداد الأموال لمدة 30 يوماً</strong>. إذا لم تكن راضياً، يمكنك إرجاعه لاسترداد كامل.
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                We also offer a <strong className="text-blue-700">30-day money-back guarantee</strong>. If you're not satisfied, you can return it for a full refund.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-600">💯</span>
                                    <span className="font-semibold text-blue-700">ضمان الجودة 100%</span>
                                </div>
                                <p className="text-sm text-blue-600">100% Quality Guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* MEDIUM PRIORITY: Frequently Bought Together */}
            <div className="container-xl section-spacing-lg">
                <FrequentlyBoughtTogether product={product} fetchCartCount={fetchCartCount} isAuthenticated={isAuthenticated} />
            </div>
            
            {/* LOW PRIORITY: Product Recommendations */}
            <div className="container-xl section-spacing-lg">
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-purple-200/50 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        قد يعجبك أيضاً / You Might Also Like
                    </h2>
                    <p className="text-gray-600">منتجات مختارة خصيصاً لك / Products specially selected for you</p>
                </div>
                <ProductSlider title="" products={bestsellers} />
                </div>
            </div>
            
            {/* Enhanced Purchase Notifications */}
            <div className="container-xl section-spacing">
                <PurchaseNotifications packName={product.name} />
            </div>
            
            {/* Enhanced Sticky Add to Cart - replaces StickyAddToCartBar */}
            <StickyAddToCart 
                pack={product}
                onAddToCart={handleAddToCart}
                isVisible={isStickyBarVisible}
                selectedCount={1}
                totalItems={1}
            />
            
            {/* Enhanced Purchase Popup */}
            {product.images && product.images.length > 0 && <PurchasePopup productName={product.name} productImage={product.images[0]} />}
            
            {/* Professional Footer CTA Section */}
            <div className="container-xl section-spacing-xl">
                <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden max-w-6xl mx-auto">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full -translate-x-48 -translate-y-48"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-400 to-pink-400 rounded-full translate-x-40 translate-y-40"></div>
                </div>
                
                <div className="relative z-10 text-center">
                    <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        جاهز للطلب؟ / Ready to Order?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        انضم إلى آلاف العملاء الراضين واكتشف منتجات التجميل المتميزة / Join thousands of satisfied customers and discover premium beauty products
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={handleOrderNow}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-lg">اطلب الآن / Order Now</span>
                        </button>
                        <button 
                            onClick={handleAddToCart}
                            className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-lg">أضف للسلة / Add to Cart</span>
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ProductDetailPage;
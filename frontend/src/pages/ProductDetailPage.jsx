// PASTE THIS CODE INTO: frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getBestsellers, getCart } from '../api/apiService';
import Loader from '../components/Loader';
import CommentForm from '../components/CommentForm';
import ProductSlider from '../components/ProductSlider';
import VisitorCounter from '../components/VisitorCounter.jsx';
import CountdownBar from '../components/CountdownBar';
import TrustBadges from '../components/TrustBadges';
import SocialShare from '../components/SocialShare';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';
import ReviewSummary from '../components/ReviewSummary';
import Breadcrumbs from '../components/Breadcrumbs';
import PurchasePopup from '../components/PurchasePopup';
import OrderUrgencyTimer from '../components/OrderUrgencyTimer';
import ShippingThresholdIndicator from '../components/ShippingThresholdIndicator';
import EnhancedCountdown from '../components/EnhancedCountdown';
import LiveVisitorCounter from '../components/LiveVisitorCounter';
import PurchaseNotifications from '../components/PurchaseNotifications';
import StickyAddToCart from '../components/StickyAddToCart';
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

            if (productData.hasVariants && productData.variantTypes.length > 0) {
                const initialOptions = {};
                productData.variantTypes.forEach(vt => {
                    initialOptions[vt.name] = vt.options[0];
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
                <span className="ml-2 text-sm text-gray-600">({product.comments.length} reviews)</span>
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
                            {product.comments.map(comment => (
                                <div key={comment.id} className="p-4 border rounded-lg">
                                    <p className="font-semibold">{comment.userFullName}</p>
                                    <p className="text-yellow-400">{'★'.repeat(comment.score)}{'☆'.repeat(5 - comment.score)}</p>
                                    <p className="text-gray-600 mt-2">{comment.content}</p>
                                    {comment.images && comment.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {comment.images.map((img, index) => (
                                                <img key={index} src={img} alt={`Comment image ${index + 1}`} className="w-24 h-24 object-cover rounded-md border" />
                                            ))}
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
        <div className="container mx-auto p-4 pt-10">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="mb-4">
                        {selectedImage && selectedImage.includes('youtube.com/embed') ? (
                            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                                <iframe src={selectedImage} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Product Video" className="w-full h-full" style={{ minHeight: '400px' }}></iframe>
                            </div>
                        ) : (
                            <div className="image-zoom-container">
                                <img src={selectedImage} alt="Selected product view" className="w-full h-auto object-cover" style={{ maxHeight: '500px' }} />
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-2 overflow-x-auto">
                        {product.images && product.images.map((img, index) =>
                            img.includes('youtube.com/embed') ? (
                                <div key={index} onClick={() => setSelectedImage(img)} className={`w-20 h-20 rounded-md cursor-pointer border-2 flex items-center justify-center bg-gray-200 ${selectedImage === img ? 'border-pink-500 ring-2 ring-pink-300' : 'border-transparent'}`}>
                                    <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                </div>
                            ) : (
                                <img key={index} src={img} alt={`Thumbnail ${index + 1}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-pink-500' : 'border-transparent'}`} onClick={() => setSelectedImage(img)} />
                            )
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-2">
                        <p className="text-2xl text-pink-600 font-semibold">${displayPrice}</p>
                        {oldPrice > displayPrice && <p className="text-xl text-gray-400 line-through">${oldPrice}</p>}
                    </div>
                    {product.size && product.unit && (<p className="text-sm text-gray-500 mb-4">(${(displayPrice / product.size).toFixed(2)} / {product.unit})</p>)}
                    <div className="mb-4">{renderStars(averageRating)}</div>
                    <ReviewSummary comments={product.comments} />
                    <VisitorCounter />
                    
                    {/* Live Visitor Counter */}
                    <LiveVisitorCounter packId={id} />
                    
                    {product.hasVariants && product.variantTypes.map(vt => (
                        <div key={vt.name} className="my-4">
                            <h3 className="text-lg font-semibold mb-2">{vt.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {vt.options.map(option => (
                                    <button key={option} onClick={() => handleOptionSelect(vt.name, option)} className={`px-4 py-2 border rounded-md text-sm ${selectedOptions[vt.name] === option ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700'}`}>{option}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {isAuthenticated && cart && <ShippingThresholdIndicator currentTotal={cart.totalPrice} />}
                    <OrderUrgencyTimer />
                    <div ref={addToCartRef} className="bg-gray-50 p-4 rounded-lg mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className={`font-semibold ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{displayStock > 0 ? `${displayStock} in stock` : 'Out of Stock'}</p>
                            {displayStock > 0 && displayStock <= 10 && (<div className="text-red-600 font-bold text-sm animate-pulse-custom my-2">🔥 Hurry, only {displayStock} left!</div>)}
                            <div className="flex items-center">
                                <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-700">Qty:</label>
                                <input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))} className="w-20 p-2 border rounded-md text-center" min="1" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleOrderNow} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-transform transform hover:scale-105" disabled={displayStock <= 0}>Order Now</button>
                            <button onClick={handleAddToCart} className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition-colors" disabled={displayStock <= 0}>{displayStock > 0 ? 'Add to Cart' : 'Out of Stock'}</button>
                        </div>
                    </div>
                    <TrustBadges />
                    <SocialShare productUrl={window.location.href} productName={product.name} />
                </div>
            </div>

            {/* Enhanced Description Section - Always Visible */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">📋</span>
                    <h2 className="text-2xl font-bold text-gray-800">وصف المنتج / Product Description</h2>
                </div>
                <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">🌟 لماذا تختارنا؟ / Why Choose Us?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                <span className="text-green-500 text-xl mr-3">✓</span>
                                <div>
                                    <strong className="text-green-700">منتجات أصلية / Authentic Products</strong>
                                    <p className="text-sm text-gray-600 mt-1">مضمونة 100% أصلية / Guaranteed 100% authentic</p>
                                </div>
                            </div>
                            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                <span className="text-blue-500 text-xl mr-3">🚚</span>
                                <div>
                                    <strong className="text-blue-700">شحن سريع / Fast Shipping</strong>
                                    <p className="text-sm text-gray-600 mt-1">الدار البيضاء 3-5 أيام / Casablanca 3-5 days</p>
                                </div>
                            </div>
                            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                <span className="text-purple-500 text-xl mr-3">↩️</span>
                                <div>
                                    <strong className="text-purple-700">إرجاع سهل / Easy Returns</strong>
                                    <p className="text-sm text-gray-600 mt-1">ضمان 30 يوم / 30-day guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Reviews Section - Prominent Display */}
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <span className="text-3xl mr-3">⭐</span>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                آراء العملاء / Customer Reviews ({product.comments ? product.comments.length : 0})
                            </h2>
                            {product.comments && product.comments.length > 0 && (
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center mr-4">
                                        {renderStars(averageRating)}
                                    </div>
                                    <span className="text-lg font-semibold text-yellow-600">
                                        {averageRating.toFixed(1)} من 5 / out of 5
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {product.comments && product.comments.length > 0 && (
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-2xl font-bold text-green-600">{product.comments.length}</div>
                            <div className="text-sm text-gray-600">مراجعة / Reviews</div>
                        </div>
                    )}
                </div>

                {product.comments && product.comments.length > 0 ? (
                    <div className="space-y-4 mb-6">
                        {product.comments.slice(0, 3).map(comment => (
                            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {comment.userFullName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{comment.userFullName}</p>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 text-lg">{'★'.repeat(comment.score)}{'☆'.repeat(5 - comment.score)}</span>
                                                <span className="text-sm text-gray-500 ml-2">تقييم {comment.score}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✓ مؤكد / Verified</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                {comment.images && comment.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {comment.images.map((img, index) => (
                                            <img key={index} src={img} alt={`Review image ${index + 1}`} className="w-20 h-20 object-cover rounded-md border-2 border-yellow-200 hover:border-yellow-400 transition-colors cursor-pointer" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {product.comments.length > 3 && (
                            <div className="text-center">
                                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    عرض جميع المراجعات ({product.comments.length}) / View All Reviews
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg">
                        <span className="text-6xl mb-4 block">💭</span>
                        <p className="text-gray-600 text-lg mb-4">لا توجد مراجعات بعد / No reviews yet</p>
                        <p className="text-sm text-gray-500">كن أول من يكتب مراجعة! / Be the first to write a review!</p>
                    </div>
                )}

                {/* Comment Form */}
                <div className="mt-6 bg-white rounded-lg p-4 border-2 border-dashed border-yellow-300">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <span className="text-2xl mr-2">✍️</span>
                        اكتب مراجعتك / Write Your Review
                    </h3>
                    <CommentForm productId={id} onCommentAdded={handleCommentAdded} />
                </div>
            </div>

            {/* Shipping & Returns - Compact but Visible */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🚚</span>
                    <h2 className="text-2xl font-bold text-gray-800">الشحن والإرجاع / Shipping & Returns</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center">
                            <span className="text-xl mr-2">📦</span>
                            معلومات الشحن / Shipping Info
                        </h4>
                        <p className="text-gray-600">نحن نقدم شحن سريع إلى موقعك. معظم الطلبات تتم معالجتها خلال 1-2 يوم عمل وتسليمها خلال 3-5 أيام عمل في المدن الكبرى مثل الدار البيضاء والرباط.</p>
                        <p className="text-sm text-gray-500 mt-2">We offer fast shipping to your location. Most orders are processed within 1-2 business days and delivered within 3-5 business days in major cities like Casablanca and Rabat.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                            <span className="text-xl mr-2">↩️</span>
                            سياسة الإرجاع / Return Policy
                        </h4>
                        <p className="text-gray-600">نحن نقدم أيضاً <strong>ضمان استرداد الأموال لمدة 30 يوماً</strong>. إذا لم تكن راضياً، يمكنك إرجاعه لاسترداد كامل.</p>
                        <p className="text-sm text-gray-500 mt-2">We also offer a <strong>30-day money-back guarantee</strong>. If you're not satisfied, you can return it for a full refund.</p>
                    </div>
                </div>
            </div>

            <FrequentlyBoughtTogether product={product} fetchCartCount={fetchCartCount} isAuthenticated={isAuthenticated} />
            
            <div className="mt-16 border-t border-gray-200">
                <ProductSlider title="You Might Also Like" products={bestsellers} />
            </div>
            
            {/* Enhanced Purchase Notifications */}
            <PurchaseNotifications packName={product.name} />
            
            {/* Enhanced Sticky Add to Cart - replaces StickyAddToCartBar */}
            <StickyAddToCart 
                pack={product}
                onAddToCart={handleAddToCart}
                isVisible={isStickyBarVisible}
                selectedCount={1}
                totalItems={1}
            />
            {product.images.length > 0 && <PurchasePopup productName={product.name} productImage={product.images[0]} />}
        </div>
    );
};

export default ProductDetailPage;
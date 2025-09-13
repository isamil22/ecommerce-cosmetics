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
import StickyAddToCartBar from '../components/StickyAddToCartBar';
import PurchasePopup from '../components/PurchasePopup';
import OrderUrgencyTimer from '../components/OrderUrgencyTimer';
import Accordion from '../components/Accordion';
import ShippingThresholdIndicator from '../components/ShippingThresholdIndicator'; // <-- NEW

const ProductDetailPage = ({ fetchCartCount, isAuthenticated }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [bestsellers, setBestsellers] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
    const addToCartRef = useRef(null);
    const [cart, setCart] = useState(null); // <-- NEW

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
        if (!product || !product.hasVariants) return null;
        return product.variants.find(v =>
            Object.entries(selectedOptions).every(([key, value]) => v.variantMap[key] === value)
        );
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
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        try {
            const variantId = activeVariant ? activeVariant.id : null;
            await addToCart(id, quantity, variantId);
            setMessage('Product added to cart!');
            fetchCartCount();
            const response = await getCart(); // Re-fetch cart
            setCart(response.data);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setMessage('Failed to add product to cart.');
        }
    };

    const handleOrderNow = async () => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        try {
            const variantId = activeVariant ? activeVariant.id : null;
            await addToCart(id, quantity, variantId);
            fetchCartCount();
            navigate('/order');
        } catch (error) {
            console.error('Failed to add to cart and proceed to order:', error);
            setMessage('Failed to proceed to order.');
        }
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
    if (!product) return null;

    const displayPrice = activeVariant ? activeVariant.price : product.price;
    const oldPrice = activeVariant ? activeVariant.oldPrice : product.oldPrice;
    const displayStock = activeVariant ? activeVariant.stock : product.quantity;

    return (
        <div className="container mx-auto p-4 pt-10">
            <Breadcrumbs categoryId={product.categoryId} categoryName={product.categoryName} productName={product.name} />
            <CountdownBar />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    {/* ... (Video-enabled image gallery code remains the same) ... */}
                </div>
                {/* Product Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                    {/* START: PRICE ANCHORING UPDATE */}
                    <div className="flex items-center gap-4 mb-2">
                        <p className="text-2xl text-pink-600 font-semibold">${displayPrice}</p>
                        { oldPrice > displayPrice &&
                            <p className="text-xl text-gray-400 line-through">${oldPrice}</p>
                        }
                    </div>
                    {/* END: PRICE ANCHORING UPDATE */}

                    {product.size && product.unit && (<p className="text-sm text-gray-500 mb-4">(${(displayPrice / product.size).toFixed(2)} / {product.unit})</p>)}
                    <div className="mb-4">{renderStars(averageRating)}</div>
                    <ReviewSummary comments={product.comments} />
                    <VisitorCounter />
                    {product.hasVariants && product.variantTypes.map(vt => (
                        <div key={vt.name} className="my-4">
                            <h3 className="text-lg font-semibold mb-2">{vt.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {vt.options.map(option => (
                                    <button key={option} onClick={() => handleOptionSelect(vt.name, option)} className={`px-4 py-2 border rounded-md text-sm ${selectedOptions[vt.name] === option ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700'}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* START: NEW SHIPPING INDICATOR */}
                    {isAuthenticated && cart && <ShippingThresholdIndicator currentTotal={cart.totalPrice} />}
                    {/* END: NEW SHIPPING INDICATOR */}

                    <OrderUrgencyTimer />
                    <div ref={addToCartRef} className="bg-gray-50 p-4 rounded-lg mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className={`font-semibold ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {displayStock > 0 ? `${displayStock} in stock` : 'Out of Stock'}
                            </p>
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
                    {message && <p className="text-green-500 mt-3">{message}</p>}
                    <TrustBadges />
                    <SocialShare productUrl={window.location.href} productName={product.name} />
                </div>
            </div>
            <div className="mt-12">
                {/* ... (Accordion component remains the same) ... */}
            </div>
            <FrequentlyBoughtTogether product={product} fetchCartCount={fetchCartCount} />
            <div className="mt-16 border-t border-gray-200">
                <ProductSlider title="You Might Also Like" products={bestsellers} />
            </div>
            <StickyAddToCartBar isVisible={isStickyBarVisible} product={product} displayPrice={displayPrice} handleAddToCart={handleAddToCart} />
            <PurchasePopup productName={product.name} productImage={product.images[0]} />
        </div>
    );
};

export default ProductDetailPage;
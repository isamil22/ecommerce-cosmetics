// frontend/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getBestsellers } from '../api/apiService';
import Loader from '../components/Loader';
import CommentForm from '../components/CommentForm';
import ProductSlider from '../components/ProductSlider';
import VisitorCounter from '../components/VisitorCounter.jsx';
import CountdownBar from '../components/CountdownBar';
import TrustBadges from '../components/TrustBadges';
import SocialShare from '../components/SocialShare';
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether';

const ProductDetailPage = ({ fetchCartCount, isAuthenticated }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [bestsellers, setBestsellers] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();

    const fetchProduct = () => {
        setLoading(true);
        window.scrollTo(0, 0);
        Promise.all([
            getProductById(id),
            getBestsellers()
        ])
            .then(([productResponse, bestsellersResponse]) => {
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
            })
            .catch(err => {
                console.error("Failed to fetch product details:", err);
                setError('Product not found or an error occurred.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

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
        fetchProduct();
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
        setSelectedOptions(prev => ({
            ...prev,
            [typeName]: optionValue
        }));
    };

    const calculateAverageRating = () => {
        if (!product || !product.comments || product.comments.length === 0) {
            return 0;
        }
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
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="text-yellow-400">&#9733;</span>
                ))}
                {halfStar && <span className="text-yellow-400">&#9734;</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="text-gray-300">&#9733;</span>
                ))}
                <span className="ml-2 text-sm text-gray-600">({product.comments.length} reviews)</span>
            </div>
        );
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
    if (!product) return null;

    const displayPrice = activeVariant ? activeVariant.price : product.price;
    const displayStock = activeVariant ? activeVariant.stock : product.quantity;

    return (
        <div className="container mx-auto p-4 pt-10">
            <CountdownBar />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="mb-4 image-zoom-container">
                        <img
                            src={selectedImage}
                            alt="Selected product view"
                            className="w-full h-auto object-cover"
                            style={{ maxHeight: '500px' }}
                        />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-pink-500' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl text-pink-600 font-semibold mb-2">${displayPrice}</p>
                    <div className="mb-4">
                        {renderStars(averageRating)}
                    </div>
                    <VisitorCounter />

                    {product.hasVariants && product.variantTypes.map(vt => (
                        <div key={vt.name} className="my-4">
                            <h3 className="text-lg font-semibold mb-2">{vt.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {vt.options.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(vt.name, option)}
                                        className={`px-4 py-2 border rounded-md text-sm ${selectedOptions[vt.name] === option ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className={`font-semibold ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {displayStock > 0 ? `${displayStock} in stock` : 'Out of Stock'}
                            </p>
                            <div className="flex items-center">
                                <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-700">Qty:</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                                    className="w-20 p-2 border rounded-md text-center"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleOrderNow}
                                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-transform transform hover:scale-105"
                                disabled={displayStock <= 0}
                            >
                                Order Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                                disabled={displayStock <= 0}
                            >
                                {displayStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                    {message && <p className="text-green-500 mt-3">{message}</p>}

                    <TrustBadges />
                    <SocialShare
                        productUrl={window.location.href}
                        productName={product.name}
                    />
                </div>
            </div>

            <div className="mt-12">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`${
                                activeTab === 'description'
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`${
                                activeTab === 'reviews'
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Reviews ({product.comments ? product.comments.length : 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`${
                                activeTab === 'shipping'
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Shipping & Returns
                        </button>
                    </nav>
                </div>
                <div className="mt-8">
                    {activeTab === 'description' && (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                    )}
                    {activeTab === 'reviews' && (
                        <div>
                            {product.comments && product.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {product.comments.map(comment => (
                                        <div key={comment.id} className="p-4 border rounded-lg">
                                            <p className="font-semibold">{comment.userFullName}</p>
                                            <p className="text-yellow-400">{'★'.repeat(comment.score)}{'☆'.repeat(5 - comment.score)}</p>
                                            <p className="text-gray-600 mt-2">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                            <CommentForm productId={id} onCommentAdded={handleCommentAdded} />
                        </div>
                    )}
                    {activeTab === 'shipping' && (
                        <div className="prose max-w-none">
                            <h3>Shipping Information</h3>
                            <p>We offer fast shipping to your location. Most orders are processed within 1-2 business days and delivered within 3-5 business days in major cities like Casablanca and Rabat.</p>
                            <h3>Return Policy</h3>
                            <p>We offer a 30-day return policy on all our products. If you're not satisfied, you can return it for a full refund. Please see our FAQ page for more details.</p>
                        </div>
                    )}
                </div>
            </div>

            <FrequentlyBoughtTogether product={product} fetchCartCount={fetchCartCount} />

            <div className="mt-16 border-t border-gray-200">
                <ProductSlider title="You Might Also Like" products={bestsellers} />
            </div>

        </div>
    );
};

export default ProductDetailPage;
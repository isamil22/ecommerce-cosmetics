import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder, validateCoupon, createGuestOrder } from '../api/apiService';
import { toast } from 'react-toastify';
import FeedbackForm from '../components/FeedbackForm';

const OrderPage = () => {
    const [cart, setCart] = useState(null);
    const [formData, setFormData] = useState({ clientFullName: '', city: '', address: '', phoneNumber: '', email: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const moroccanCities = [
        "Agadir", "Al Hoceima", "Assilah", "Azemmour", "Beni Mellal", "Boujdour",
        "Casablanca", "Chefchaouen", "Dakhla", "El Jadida", "Erfoud", "Essaouira",
        "Fes", "Guelmim", "Ifrane", "Kenitra", "Khemisset", "Khouribga",
        "Ksar El Kebir", "Laayoune", "Larache", "Marrakech", "Meknes",
        "Mohammedia", "Nador", "Ouarzazate", "Oujda", "Rabat", "Safi", "Salé",
        "Settat", "Sidi Ifni", "Smara", "Tan-Tan", "Tangier", "Tarfaya",
        "Taroudant", "Taza", "Tetouan", "Tiznit"
    ];

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            if (isAuthenticated) {
                try {
                    const response = await getCart();
                    setCart(response.data);
                } catch (err) {
                    setError('Failed to fetch cart. Please login and try again.');
                    toast.error('Failed to fetch cart. Please login and try again.');
                }
            } else {
                const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
                setCart(guestCart);
            }
            setLoading(false);
        };
        fetchCart();
    }, [isAuthenticated]);

    useEffect(() => {
        // Generate order ID on client side to avoid hydration mismatches
        setOrderId(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.warn('Please enter a coupon code.');
            return;
        }
        setApplyingCoupon(true);
        try {
            const response = await validateCoupon(couponCode.trim());
            setDiscount(response.data.discountValue);
            setAppliedCoupon(response.data.code);
            toast.success(`🎉 Coupon "${response.data.code}" applied successfully! You saved $${response.data.discountValue.toFixed(2)}!`);
        } catch (err) {
            setDiscount(0);
            setAppliedCoupon(null);
            toast.error('❌ Invalid or expired coupon code.');
        }
        setApplyingCoupon(false);
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const subtotal = calculateSubtotal();
    const total = (subtotal - discount) > 0 ? (subtotal - discount) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (!formData.clientFullName || !formData.city || !formData.address || !formData.phoneNumber || (!isAuthenticated && !formData.email)) {
            setError('All delivery details fields are required.');
            setSubmitting(false);
            return;
        }

        try {
            let orderResponse;
            if (isAuthenticated) {
                orderResponse = await createOrder({ ...formData, couponCode: appliedCoupon });
            } else {
                orderResponse = await createGuestOrder({ ...formData, cartItems: cart.items, couponCode: appliedCoupon });
                localStorage.removeItem('cart');
            }
            
            // Set the actual order ID from the response
            if (orderResponse && orderResponse.data && orderResponse.data.id) {
                setOrderId(orderResponse.data.id.toString());
            }

            // --- FACEBOOK PIXEL: PURCHASE EVENT ---
            if (window.fbq && cart) {
                window.fbq('track', 'Purchase', {
                    value: total,
                    currency: 'USD',
                    content_ids: cart.items.map(item => item.productId),
                    content_type: 'product'
                });
            }
            // ------------------------------------

            setSuccess('Order placed successfully! Redirecting to success page...');
            toast.success('🎉 Order placed successfully! Thank you for your purchase!');
            
            // Redirect to order success page with order ID and order data
            const orderIdValue = orderResponse?.data?.id?.toString() || orderId;
            setTimeout(() => {
                navigate(`/order-success?orderId=${orderIdValue}`, {
                    state: { 
                        orderId: orderIdValue,
                        order: orderResponse?.data // Pass full order data
                    }
                });
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to place order.';
            setError(errorMessage);
            toast.error(`❌ ${errorMessage}`);
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your order details...</p>
                </div>
            </div>
        );
    }

    if (error && !success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
                    <div className="flex items-center mb-6">
                        <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-red-800 font-bold text-xl">Order Error</h3>
                    </div>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!cart) {
        return <div className="text-center py-20">Loading your order details...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                        <span className="text-5xl">🛍️</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                        تأكيد طلبك / Confirm Your Order
                    </h1>
                    <p className="text-gray-600 text-lg">
                        راجع منتجاتك وأكمل عملية الشراء / Review your items and complete your purchase
                    </p>
                </div>

            {success ? (
                    /* Success State */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                تم إرسال طلبك بنجاح! / Order Placed Successfully!
                            </h2>
                            <p className="text-gray-600 mb-8">{success}</p>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-8">
                                <p className="text-blue-800 text-sm">
                                    <span className="font-semibold">رقم الطلب / Order ID:</span> #{orderId}
                                </p>
                            </div>
                    <FeedbackForm orderId={orderId} isAuthenticated={isAuthenticated} />
                        </div>
                </div>
            ) : (
                <>
                    {cart.items.length === 0 ? (
                            /* Empty Cart */
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="text-8xl mb-6">🛒</div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                        سلة التسوق فارغة / Your cart is empty
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        أضف منتجات إلى سلة التسوق قبل إرسال الطلب / Add items to your cart before placing an order
                                    </p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        متابعة التسوق / Continue Shopping
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Order Summary */}
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center">
                                            <span className="text-3xl mr-3">📋</span>
                                            ملخص الطلب / Order Summary
                                        </h2>
                                        <p className="text-pink-100 mt-1">
                                            {cart.items.length} {cart.items.length === 1 ? 'منتج / item' : 'منتجات / items'} في طلبك
                                        </p>
                                    </div>
                                    
                                    <div className="p-6">
                                        {/* Items List */}
                                        <div className="space-y-4 mb-6">
                                            {cart.items.map((item, index) => (
                                                <div key={item.id || item.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                                            {item.imageUrl ? (
                                                                <img
                                                                    src={item.imageUrl}
                                                                    alt={item.productName}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/placeholder-image.jpg';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Product Info */}
                                                    <div className="flex-grow">
                                                        <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                                                        <p className="text-sm text-gray-600">الكمية / Qty: {item.quantity}</p>
                                                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} لكل قطعة / each</p>
                                                    </div>
                                                    
                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                    </div>
                                ))}
                                        </div>

                                        {/* Coupon Section */}
                                        <div className="border-t border-gray-200 pt-6 mb-6">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <span className="text-2xl mr-2">🎟️</span>
                                                هل لديك كود خصم؟ / Have a coupon code?
                                            </h3>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="أدخل كود الخصم / Enter coupon code"
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={applyingCoupon || !couponCode.trim()}
                                                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                                                >
                                                    {applyingCoupon ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                            جاري التطبيق... / Applying...
                                                        </div>
                                                    ) : (
                                                        'تطبيق / Apply'
                                                    )}
                                                </button>
                                            </div>
                                            {appliedCoupon && (
                                                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-green-800 font-semibold">
                                                            تم تطبيق الكود "{appliedCoupon}"! وفرت ${discount.toFixed(2)}! / Coupon applied! You saved ${discount.toFixed(2)}!
                                                        </span>
                                    </div>
                                </div>
                                            )}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-gray-600">
                                                <span>المجموع الفرعي / Subtotal</span>
                                                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                            </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                                    <span>خصم / Discount ({appliedCoupon})</span>
                                                    <span className="font-medium">-${discount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xl font-semibold text-gray-900">الإجمالي / Total</span>
                                                    <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">${total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Information Form */}
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center">
                                            <span className="text-3xl mr-3">🚚</span>
                                            تفاصيل التسليم / Delivery Details
                                        </h2>
                                        <p className="text-blue-100 mt-1">إلى أين نرسل طلبك؟ / Where should we deliver your order?</p>
                            </div>

                                    <div className="p-6">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                    {!isAuthenticated && (
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                        البريد الإلكتروني / Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        required
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                        placeholder="your@email.com"
                                                    />
                                        </div>
                                    )}
                                            
                                            <div>
                                                <label htmlFor="clientFullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    الاسم الكامل / Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="clientFullName"
                                                    id="clientFullName"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                    placeholder="الاسم الكامل / Your Full Name"
                                                />
                                    </div>
                                            
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    المدينة / City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    list="cities"
                                                    name="city"
                                                    id="city"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                    placeholder="اختر أو اكتب مدينتك / Select or type your city"
                                                />
                                        <datalist id="cities">
                                            {moroccanCities.map(city => <option key={city} value={city} />)}
                                        </datalist>
                                    </div>
                                            
                                            <div>
                                                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    عنوان الشحن / Shipping Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                    placeholder="123 Main St, Anytown"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    رقم الهاتف / Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                    placeholder="123-456-7890"
                                                />
                                            </div>

                                            {/* Trust Badges */}
                                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 space-y-3 border border-gray-200">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <span className="text-2xl mr-2">🔒</span>
                                                    دفع آمن / Secure Checkout
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span className="text-green-500 mr-2">🔐</span>
                                                        دفع مشفر SSL / SSL encrypted checkout
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span className="text-blue-500 mr-2">💳</span>
                                                        الدفع عند الاستلام / Cash on delivery payment
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span className="text-purple-500 mr-2">↩️</span>
                                                        إرجاع مجاني خلال 30 يوم / Free returns within 30 days
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                                        جاري إرسال الطلب... / Placing Order...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xl mr-2">🛍️</span>
                                                        <span>إرسال الطلب (الدفع عند الاستلام) / Place Order (Cash on Delivery)</span>
                                                    </div>
                                                )}
                                            </button>
                                </form>
                                    </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
};

export default OrderPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCart, createOrder, createDirectOrder, validateCoupon, createGuestOrder, removeCartItem } from '../api/apiService';
import { toast } from 'react-toastify';
import FeedbackForm from '../components/FeedbackForm';
import { formatPrice } from '../utils/currency';
import { FiX, FiTrash2 } from 'react-icons/fi';

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
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('token');

    // Check for direct purchase from landing page
    const directPurchase = location.state?.directPurchase;

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [removingItemId, setRemovingItemId] = useState(null);

    // Delete Confirmation Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

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

            // Priority: Direct Purchase (Landing Page Flow)
            if (directPurchase) {
                setCart({ items: [directPurchase] });
                setLoading(false);
                return;
            }

            if (isAuthenticated) {
                try {
                    const response = await getCart();
                    setCart(response.data);
                } catch (err) {
                    setError('فشل في جلب السلة. يرجى تسجيل الدخول والمحاولة مرة أخرى. / Échec de la récupération du panier. Veuillez vous connecter et réessayer.');
                    toast.error('فشل في جلب السلة. يرجى تسجيل الدخول والمحاولة مرة أخرى. / Échec de la récupération du panier. Veuillez vous connecter et réessayer.');
                }
            } else {
                const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
                setCart(guestCart);
            }
            setLoading(false);
        };
        fetchCart();
    }, [isAuthenticated, directPurchase]);

    useEffect(() => {
        // Generate order ID on client side to avoid hydration mismatches
        setOrderId(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.warn('يرجى إدخال كود الخصم. / Veuillez entrer un code promo.');
            return;
        }
        setApplyingCoupon(true);
        try {
            const response = await validateCoupon(couponCode.trim());
            const coupon = response.data;
            const currentSubtotal = calculateSubtotal();

            // Check Minimum Purchase Amount
            if (coupon.minPurchaseAmount && currentSubtotal < parseFloat(coupon.minPurchaseAmount)) {
                toast.warn(`⚠️ هذا الكوبون يتطلب مشتريات بقيمة ${formatPrice(coupon.minPurchaseAmount)} على الأقل. / Ce coupon nécessite un achat minimum de ${formatPrice(coupon.minPurchaseAmount)}.`);
                setApplyingCoupon(false);
                return;
            }

            // --- Product & Category Scope Validation ---
            const validItems = cart.items.filter(item => {
                const matchProduct = !coupon.applicableProductIds || coupon.applicableProductIds.length === 0 || coupon.applicableProductIds.includes(item.productId);

                // Category Validation (Wait for backend deployment to populate categoryId)
                const itemCatId = item.categoryId ? Number(item.categoryId) : null;
                const matchCategory = !coupon.applicableCategoryIds || coupon.applicableCategoryIds.length === 0 || (itemCatId && coupon.applicableCategoryIds.includes(itemCatId));

                // If category ID is missing but coupon requires it, we might block or skip. 
                // Assuming backend update populates categoryId.

                return matchProduct && matchCategory;
            });

            if (validItems.length === 0) {
                toast.warn('⚠️ هذا الكوبون غير صالح للمنتجات الموجودة في سلتك. / Ce coupon n\'est pas valable pour les articles de votre panier.');
                setApplyingCoupon(false);
                return;
            }
            // ------------------------------------------

            let calculatedDiscount = 0;
            if (coupon.discountType === 'PERCENTAGE') {
                // Calculate percentage discount strictly on VALID items
                const validSubtotal = validItems.reduce((total, item) => total + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);
                calculatedDiscount = (validSubtotal * coupon.discountValue) / 100;
            } else if (coupon.discountType === 'FIXED_AMOUNT') {
                calculatedDiscount = coupon.discountValue;
            } else if (coupon.discountType === 'FREE_SHIPPING') {
                calculatedDiscount = 0;
                toast.info('تم تطبيق شحن مجاني! / Livraison gratuite appliquée !');
            }

            setDiscount(calculatedDiscount);
            setAppliedCoupon(coupon.code);
            toast.success(`🎉 Coupon "${coupon.code}" applied successfully! You saved ${formatPrice(calculatedDiscount)}!`);
        } catch (err) {
            console.error(err);
            // Extract error message from backend if available
            const errorMsg = err.response?.data?.message || err.message;
            if (errorMsg === "Coupon has expired") {
                toast.error('❌ الكوبون منتهي الصلاحية. / Coupon expiré.');
            } else if (errorMsg === "Coupon has reached its usage limit") {
                toast.error('❌ تم تجاوز حد استخدام الكوبون. / Limite d\'utilisation atteinte.');
            } else {
                toast.error(`❌ ${errorMsg || 'كود خصم غير صالح أو منتهي الصلاحية. / Code promo invalide ou expiré.'}`);
            }

            setDiscount(0);
            setAppliedCoupon(null);
        }
        setApplyingCoupon(false);
    };

    const subtotal = calculateSubtotal();
    const total = (subtotal - discount) > 0 ? (subtotal - discount) : 0;

    // Handle Delete Confirmation
    const handleConfirmDelete = async () => {
        if (!deleteModal.item) return;

        const item = deleteModal.item;

        setDeleteModal({ ...deleteModal, isOpen: false });

        try {
            setRemovingItemId(item.id || item.productId);

            // Use the centralized apiService function which handles both Auth and Guest modes correctly
            // It also handles API_BASE_URL correctly via axios instance
            await removeCartItem(item.id || item.productId, item.productVariantId);

            // Refetch cart to ensure state sync
            if (isAuthenticated) {
                const updatedCart = await getCart();
                setCart(updatedCart.data);
            } else {
                // For guest, getCart returns from localStorage which removeCartItem updated
                const updatedCart = await getCart();
                setCart(updatedCart.data);
            }

            // Re-validate coupon on cart change is complex because we just deleted an item.
            // Safest: Remove coupon to force re-validation by user.
            if (appliedCoupon) {
                setDiscount(0);
                setAppliedCoupon(null);
                setCouponCode('');
                toast.info('تم إزالة الكوبون بسبب تعديل السلة. / Coupon retiré suite à la modification du panier.');
            }

            toast.success('✓ تم حذف المنتج بنجاح / Produit supprimé avec succès');

            if ((isAuthenticated) || (!isAuthenticated)) {
                if (cart && cart.items.length <= 1) {
                    // Navigate if empty
                }
            }

        } catch (err) {
            console.error(err);
            toast.error(`❌ فشل حذف المنتج / Échec (${item.id ? 'ID:' + item.id : 'NoID'})`);
        } finally {
            setRemovingItemId(null);
            setDeleteModal({ isOpen: false, item: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (!formData.clientFullName || !formData.city || !formData.address || !formData.phoneNumber || (!isAuthenticated && !formData.email)) {
            setError('جميع حقول تفاصيل التسليم مطلوبة. / Tous les champs de détails de livraison sont obligatoires.');
            setSubmitting(false);
            return;
        }

        try {
            let orderResponse;

            // Handle Direct Orders (Landing Pages)
            if (directPurchase) {
                if (isAuthenticated) {
                    orderResponse = await createDirectOrder({
                        ...formData,
                        cartItems: [directPurchase],
                        couponCode: appliedCoupon
                    });
                } else {
                    const sanitizedItem = { ...directPurchase, id: null, category: null };
                    orderResponse = await createGuestOrder({
                        ...formData,
                        cartItems: [sanitizedItem],
                        couponCode: appliedCoupon
                    });
                }
            }
            // Handle Standard Orders (Cart)
            else if (isAuthenticated) {
                orderResponse = await createOrder({ ...formData, couponCode: appliedCoupon });
            } else {
                // Determine items to send
                const itemsToSend = cart.items.map(item => ({
                    ...item,
                    id: null, // Clear ID for guest orders to avoid type mismatch (Long vs String)
                    category: null // Avoid nested object issues if any
                }));
                orderResponse = await createGuestOrder({ ...formData, cartItems: itemsToSend, couponCode: appliedCoupon });
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
            toast.success('🎉 تم إرسال الطلب بنجاح! شكراً لشرائك! / Commande passée avec succès ! Merci pour votre achat !');

            setTimeout(() => {
                navigate(`/order-success?orderId=${orderResponse?.data?.id?.toString() || orderId}`, {
                    state: {
                        orderId: orderResponse?.data?.id?.toString() || orderId,
                        order: orderResponse?.data // Pass full order data
                    }
                });
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'فشل في إرسال الطلب. / Échec de l\'envoi de la commande.';
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 px-2">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-block mb-2">
                        <span className="text-3xl">🛍️</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
                        تأكيد طلبك / Confirmez commande
                    </h1>
                    <p className="text-gray-500 text-sm">
                        أكمل عملية الشراء / Finalisez votre achat
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
                                تم إرسال طلبك بنجاح! / Commande passée avec succès !
                            </h2>
                            <p className="text-gray-600 mb-8">{success}</p>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-8">
                                <p className="text-blue-800 text-sm">
                                    <span className="font-semibold">رقم الطلب / Numéro de commande :</span> #{orderId}
                                </p>
                            </div>
                            <FeedbackForm orderId={orderId} isAuthenticated={isAuthenticated} />
                        </div>
                    </div>
                ) : (
                    <>
                        {cart.items.length === 0 ? (
                            /* Empty Cart */
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🛒</div>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                                        سلة التسوق فارغة / Votre panier est vide
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                        أضف منتجات إلى سلة التسوق قبل إرسال الطلب / Ajoutez des articles à votre panier avant de passer commande
                                    </p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-2 px-6 text-sm sm:text-base rounded-full hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        متابعة التسوق / Continuer vos achats
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Order Summary */}
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3">
                                        <h2 className="text-lg font-bold text-white flex items-center">
                                            <span className="text-xl mr-2">📋</span>
                                            ملخص / Résumé
                                        </h2>
                                        <p className="text-pink-100 text-xs mt-0.5">
                                            {cart.items.length} {cart.items.length === 1 ? 'منتج' : 'منتجات'} / produits
                                        </p>
                                    </div>

                                    <div className="p-3">
                                        {/* Items List */}
                                        <div className="space-y-2 mb-4">
                                            {cart.items.map((item, index) => (
                                                <div key={item.id || item.productId} className="relative flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
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
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="font-bold text-sm text-gray-900 truncate">{item.productName}</h3>

                                                        {/* Dynamic Pack Contents Display */}
                                                        {(() => {
                                                            if (!item.variantName) return null;
                                                            try {
                                                                const parsed = JSON.parse(item.variantName);
                                                                if (Array.isArray(parsed)) {
                                                                    return (
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {parsed.map((p, idx) => (
                                                                                <div key={idx} className="relative group">
                                                                                    <img
                                                                                        src={p.image}
                                                                                        alt={p.name}
                                                                                        className="w-6 h-6 object-cover rounded border border-gray-200"
                                                                                        onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    );
                                                                }
                                                            } catch (e) {
                                                                return (
                                                                    <p className="text-xs text-pink-600 font-medium truncate">
                                                                        {item.variantName}
                                                                    </p>
                                                                );
                                                            }
                                                            return <p className="text-xs text-pink-600 font-medium truncate">{item.variantName}</p>;
                                                        })()}

                                                        <div className="flex justify-between items-center mt-1">
                                                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                                                            <p className="font-bold text-sm text-gray-900">{formatPrice(parseFloat(item.price || 0) * (item.quantity || 1))}</p>
                                                        </div>
                                                    </div>

                                                    {/* Remove Button - Updated to open modal */}
                                                    <button
                                                        onClick={() => setDeleteModal({ isOpen: true, item })}
                                                        disabled={removingItemId === (item.id || index)}
                                                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-all disabled:opacity-30"
                                                        title="حذف / Supprimer"
                                                    >
                                                        {(removingItemId === item.id) || (removingItemId === index) ? (
                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <FiX className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Coupon Section */}
                                        <div className="border-t border-gray-200 pt-6 mb-6">
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <span className="text-2xl mr-2">🎟️</span>
                                                هل لديك كود خصم؟ / Avez-vous un code promo ?
                                            </h3>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="أدخل كود الخصم / Entrez le code promo"
                                                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={applyingCoupon || !couponCode.trim()}
                                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                                                >
                                                    {applyingCoupon ? (
                                                        <div className="flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                            جاري التطبيق... / Application...
                                                        </div>
                                                    ) : (
                                                        'تطبيق / Appliquer'
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
                                                            تم تطبيق الكود "{appliedCoupon}"! وفرت {formatPrice(discount)}! / Code promo appliqué ! Vous avez économisé {formatPrice(discount)} !
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-gray-600">
                                                <span>المجموع الفرعي / Sous-total</span>
                                                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>خصم / Remise ({appliedCoupon})</span>
                                                    <span className="font-medium">-{formatPrice(discount)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xl font-semibold text-gray-900">الإجمالي / Total</span>
                                                    <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Information Form */}
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    {/* ... (Keeping Form Content Same) ... */}
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                                        <h2 className="text-lg font-bold text-white flex items-center">
                                            <span className="text-xl mr-2">🚚</span>
                                            معلومات التوصيل / Livraison
                                        </h2>
                                    </div>

                                    <div className="p-4">
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            {!isAuthenticated && (
                                                <div>
                                                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1">
                                                        البريد الإلكتروني / Email <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        required
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label htmlFor="clientFullName" className="block text-xs font-bold text-gray-700 mb-1">
                                                    الاسم الكامل / Nom complet <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="clientFullName"
                                                    id="clientFullName"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                                    placeholder="الاسم الكامل / Nom complet"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="city" className="block text-xs font-bold text-gray-700 mb-1">
                                                    المدينة / Ville <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    list="cities"
                                                    name="city"
                                                    id="city"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                                    placeholder="المدينة / Ville"
                                                />
                                                <datalist id="cities">
                                                    {moroccanCities.map(city => <option key={city} value={city} />)}
                                                </datalist>
                                            </div>

                                            <div>
                                                <label htmlFor="address" className="block text-xs font-bold text-gray-700 mb-1">
                                                    عنوان الشحن / Adresse <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                                    placeholder="العنوان / Adresse"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-700 mb-1">
                                                    رقم الهاتف / Téléphone <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                                                    placeholder="06..."
                                                />
                                            </div>

                                            {/* Trust Badges */}
                                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 space-y-2 border border-gray-200">
                                                <h4 className="font-bold text-xs text-gray-900 flex items-center">
                                                    <span className="text-lg mr-1">🔒</span>
                                                    دفع آمن / Paiement sécurisé
                                                </h4>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                                    <span>🔐 SSL</span>
                                                    <span>💳 الدفع عند الاستلام</span>
                                                    <span>↩️ إرجاع مجاني</span>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base sticky bottom-2 z-10"
                                            >
                                                {submitting ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                        جاري إرسال الطلب...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <span>إرسال الطلب (الدفع عند الاستلام) / Commander</span>
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

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 opacity-100 animate-scaleUp">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiTrash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                                حذف المنتج / Supprimer le produit
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                هل أنت متأكد من حذف هذا المنتج من السلة؟ <br />
                                Êtes-vous sûr de vouloir supprimer ce produit ?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, item: null })}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition duration-200"
                                >
                                    إلغاء / Annuler
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-red-500/30 transition duration-200"
                                >
                                    حذف / Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
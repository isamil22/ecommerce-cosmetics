import React, { useState, useEffect } from 'react';
import { getCart, removeCartItem, updateCartItemQuantity } from '../api/apiService';
import { Link, useNavigate } from 'react-router-dom';
import ReactGA from "react-ga4";
import { formatPrice } from '../utils/currency';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const fetchCart = async () => {
        // Only set loading on initial fetch or full refresh
        if (!cart) setLoading(true);
        if (isAuthenticated) {
            try {
                const response = await getCart();
                setCart(response.data);
            } catch (err) {
                console.error("Fetch cart error:", err);
                // Don't error out completely on minor fetch issues if we have data
                if (!cart) setError('Failed to fetch cart. Please try again later.');
            }
        } else {
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            setCart(guestCart);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleRemove = (itemId) => {
        setItemToDelete(itemId);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setUpdatingItem(itemToDelete);
        try {
            await removeCartItem(itemToDelete);
            await fetchCart();
            showNotification('تم إزالة المنتج من السلة / Article supprimé du panier', 'success');
        } catch (err) {
            console.error("Remove item error:", err);
            setError('فشل في إزالة المنتج من السلة / Échec de la suppression de l\'article du panier');
            showNotification('فشل في إزالة المنتج / Échec de la suppression de l\'article', 'error');
        }
        setUpdatingItem(null);
        setItemToDelete(null);
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItem(itemId);

        // Optimistic update
        const previousCart = { ...cart };
        const updatedCart = {
            ...cart,
            items: cart.items.map(item =>
                (item.id === itemId || item.productId === itemId) ? { ...item, quantity: newQuantity } : item
            )
        };
        setCart(updatedCart);

        try {
            await updateCartItemQuantity(itemId, newQuantity);
            // We can optionally refetch here to ensure data consistency
            // but optimistic update makes it feel faster.
            if (isAuthenticated) {
                // Background refresh to sync prices/totals if needed
                getCart().then(res => setCart(res.data)).catch(e => console.error(e));
            }
        } catch (err) {
            console.error("Failed to update quantity:", err);
            // Revert on error
            setCart(previousCart);

            // Extract error message
            let errorMsg = 'فشل في تحديث الكمية / Échec de la mise à jour de la quantité';
            if (err.response && err.response.data && err.response.data.message) {
                errorMsg = err.response.data.message;
            }

            showNotification(errorMsg, 'error');
        }

        setTimeout(() => setUpdatingItem(null), 300);
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    const handleProceedToCheckout = () => {
        const totalAmount = calculateTotal();

        // --- FACEBOOK PIXEL: INITIATE CHECKOUT EVENT ---
        if (window.fbq) {
            window.fbq('track', 'InitiateCheckout');
        }
        // ---------------------------------------------

        // Track that the user has started the checkout process in Google Analytics
        ReactGA.event({
            category: 'Ecommerce',
            action: 'begin_checkout',
            label: `User checkout with ${cart.items.length} items`
        });

        // Track the successful purchase and its value in Google Analytics
        // NOTE: In a real app, this 'purchase' event should be on the "Thank You" page after payment is confirmed.
        // For this project structure, we fire it when they proceed to the final order page.
        ReactGA.event({
            category: 'Ecommerce',
            action: 'purchase',
            label: `Successful Purchase`,
            value: totalAmount
        });

        // Navigate to the order page
        navigate('/order');
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-red-800 font-semibold text-lg">Error</h3>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!cart) {
        return <div className="text-center py-20">Loading cart...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 font-sans text-gray-900 pb-20 overflow-x-hidden">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-4 right-4 left-4 lg:right-4 lg:left-auto z-50 px-4 py-3 rounded-xl shadow-2xl transform transition-all duration-300 ${notification.type === 'success' ? 'bg-green-500/90 backdrop-blur-md' : 'bg-red-500/90 backdrop-blur-md'} text-white animate-fade-in-down`}>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-bold">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="container mx-auto max-w-5xl px-2 lg:px-4 py-4 lg:py-8">
                {/* Header */}
                <div className="mb-4 lg:mb-8 text-center lg:text-right animate-fade-in-down">
                    <h1 className="text-2xl lg:text-4xl font-black text-gray-900 mb-1 flex items-center justify-center lg:justify-end gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            سلة التسوق
                        </span>
                        <span className="text-gray-300 font-light">/</span>
                        <span className="text-gray-800">Panier</span>
                    </h1>
                    <p className="text-xs lg:text-sm text-gray-500 font-medium">
                        {cart.items.length > 0 ? `${cart.items.length} منتج / articles` : 'فارغ / Vide'}
                    </p>
                </div>

                {cart.items.length === 0 ? (
                    <div className="glass-panel-pro rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-center animate-fade-in-up">
                        <div className="bg-gray-50 w-20 h-20 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                            <svg className="w-10 h-10 lg:w-16 lg:h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-800 mb-2">سلة التسوق فارغة</h2>
                        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 px-6 lg:px-8 rounded-xl hover:bg-gray-800 transition duration-300 shadow-lg text-sm lg:text-base">
                            <span>ابدأ التسوق / Commencer</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-3 lg:space-y-4">
                            {cart.items.map((item, index) => (
                                <div key={item.id || item.productId || index} className={`glass-panel-pro rounded-xl lg:rounded-2xl p-3 lg:p-6 transition-all duration-300 hover:shadow-lg ${updatingItem === (item.id || item.productId) ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex gap-3 lg:gap-6">
                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-sm border border-gray-100">
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
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50"><span className="text-xs text-gray-300">No Img</span></div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h3 className="text-sm lg:text-lg font-bold text-gray-900 truncate leading-tight">{item.productName}</h3>
                                                    {/* Variants */}
                                                    {item.variantName && (
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            {(() => {
                                                                try {
                                                                    const parsed = JSON.parse(item.variantName);
                                                                    if (Array.isArray(parsed)) return <span className="text-pink-600">{parsed.length} items pack</span>;
                                                                    return parsed;
                                                                } catch { return item.variantName; }
                                                            })()}
                                                        </div>
                                                    )}
                                                    <div className="text-xs font-semibold text-purple-600">{formatPrice(item.price)}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id || item.productId)}
                                                    className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Remove"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center bg-gray-50/50 rounded-lg border border-gray-200/60 p-0.5 h-8 lg:h-10">
                                                    <button onClick={() => handleQuantityChange(item.id || item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-red-500 transition font-bold text-lg disabled:opacity-30"> - </button>
                                                    <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id || item.productId, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-green-500 transition font-bold text-lg"> + </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm lg:text-lg font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="text-center pt-2">
                                <Link to="/" className="text-xs lg:text-sm text-gray-500 hover:text-pink-600 font-medium transition underline decoration-gray-300 hover:decoration-pink-600">
                                    متابعة التسوق / Continuer vos achats
                                </Link>
                            </div>
                        </div>

                        {/* Summary Sticky */}
                        <div className="lg:col-span-4 mt-2 lg:mt-0">
                            <div className="glass-panel-pro rounded-2xl lg:rounded-3xl p-5 lg:p-8 sticky top-4 shadow-xl">
                                <h2 className="text-sm lg:text-xl font-black text-gray-900 mb-4 flex items-center justify-between">
                                    <span>ملخص / Résumé</span>
                                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-xs lg:text-sm text-gray-600">
                                        <span>Total products</span>
                                        <span className="font-bold text-gray-900">{formatPrice(calculateSubtotal())}</span>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm lg:text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-lg lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{formatPrice(calculateTotal())}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="relative w-full overflow-hidden group h-12 lg:h-14 rounded-xl shadow-xl hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 group-hover:from-pink-500 group-hover:to-purple-500 transition-all"></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-shine opacity-30"></div>
                                    <div className="relative flex items-center justify-center gap-2 text-white font-black text-sm lg:text-lg tracking-wide">
                                        <span>إتمام الطلب / COMMANDER</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </button>

                                <div className="mt-4 pt-4 border-t border-gray-100/50 space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-[10px] lg:text-xs text-gray-400 font-medium">
                                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        <span>Paiement 100% Sécurisé</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-[10px] lg:text-xs text-gray-400 font-medium">
                                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        <span>Satisfait ou Remboursé</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Delete Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 animate-bounce-in border border-gray-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">حذف المنتج؟ / Supprimer?</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            هل أنت متأكد أنك تريد إزالة هذا المنتج؟
                            <br />
                            Êtes-vous sûr de vouloir supprimer cet article ?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                            >
                                إلغاء / Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 transition"
                            >
                                حذف / Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
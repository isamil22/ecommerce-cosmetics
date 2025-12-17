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

    const handleRemove = async (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            setUpdatingItem(itemId);
            try {
                await removeCartItem(itemId);
                await fetchCart();
                showNotification('Item removed from cart', 'success');
            } catch (err) {
                console.error("Remove item error:", err);
                setError('Failed to remove item from cart.');
                showNotification('Failed to remove item', 'error');
            }
            setUpdatingItem(null);
        }
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
            showNotification('Failed to update quantity', 'error');
        }

        setTimeout(() => setUpdatingItem(null), 300);
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal > 100 ? 0 : 10; // Free shipping over $100
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white animate-fade-in`}>
                    <div className="flex items-center">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        {cart.items.length > 0 ? `${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'} in your cart` : 'Your cart is empty'}
                    </p>
                </div>

                {cart.items.length === 0 ? (
                    /* Empty Cart State */
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <svg className="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-pink-700 transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                {cart.items.map((item, index) => (
                                    <div
                                        key={item.id || item.productId || index}
                                        className={`p-6 ${index !== cart.items.length - 1 ? 'border-b border-gray-100' : ''} ${updatingItem === (item.id || item.productId) ? 'opacity-50 pointer-events-none' : ''
                                            } transition-opacity duration-300 hover:bg-gray-50`}
                                    >
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
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
                                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.productName}</h3>
                                                        <p className="text-gray-600 text-sm">
                                                            {formatPrice(item.price)} each
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(item.id || item.productId)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        title="Remove item"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id || item.productId, item.quantity - 1)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="px-4 py-1 text-gray-900 font-medium border-l border-r border-gray-300">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id || item.productId, item.quantity + 1)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-gray-900">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-6">
                                <Link
                                    to="/"
                                    className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">{formatPrice(calculateSubtotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {calculateShipping() === 0 ? (
                                                <span className="text-green-600">FREE</span>
                                            ) : (
                                                formatPrice(calculateShipping())
                                            )}
                                        </span>
                                    </div>

                                    {calculateSubtotal() < 100 && calculateSubtotal() > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-semibold">
                                                    Add {formatPrice(100 - calculateSubtotal())} more
                                                </span> for free shipping!
                                            </p>
                                            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${(calculateSubtotal() / 100) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-pink-600">
                                                {formatPrice(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full bg-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-pink-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Proceed to Checkout
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Secure checkout
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Free returns within 30 days
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Multiple payment options
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
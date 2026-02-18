import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderById } from '../api/apiService';
import Loader from '../components/Loader';
import { trackEvent } from '../utils/facebookPixel';
import ReactGA from 'react-ga4';
import { formatPrice } from '../utils/currency';

/**
 * Order Success Page
 * Beautiful success page shown after order is placed
 */
const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderId, setOrderId] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get order ID and order data from URL params or location state
        const params = new URLSearchParams(location.search);
        const idFromUrl = params.get('orderId');
        const idFromState = location.state?.orderId;
        const orderFromState = location.state?.order;

        const orderIdValue = idFromUrl || idFromState;
        if (orderIdValue) {
            setOrderId(orderIdValue);

            // Use order data from state if available, otherwise fetch it
            if (orderFromState) {
                setOrder(orderFromState);
                setLoading(false);
            } else {
                // Try to fetch order details
                loadOrderDetails(orderIdValue);
            }
        } else {
            setLoading(false);
        }
    }, [location]);

    const loadOrderDetails = async (id) => {
        try {
            const response = await getOrderById(id);
            const loadedOrder = response.data;
            setOrder(loadedOrder);

            // Track Purchase Event
            // Ensure we don't track duplicates if the user refreshes (checking if already tracked in this session could be an enhancement, but FB has dedup logic too)
            trackEvent('Purchase', {
                content_ids: loadedOrder.items ? loadedOrder.items.map(item => item.productId) : [],
                content_type: 'product',
                value: loadedOrder.total,
                currency: 'MAD',
                order_id: loadedOrder.id
            });

            // Track purchase (Google Analytics)
            ReactGA.event({
                category: 'Ecommerce',
                action: 'purchase',
                label: 'Order #' + loadedOrder.id,
                value: loadedOrder.total
            });

        } catch (error) {
            console.error('Failed to load order details:', error);
            // Continue without order details
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Loader />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '40px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                padding: '60px 40px',
                textAlign: 'center',
            }}>
                {/* Success Icon */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    animation: 'scaleIn 0.5s ease-out',
                }}>
                    <svg style={{ width: '60px', height: '60px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Success Message */}
                {/* Success Message */}
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '800',
                    color: '#222',
                    marginBottom: '20px',
                }}>
                    🎉 تم إرسال طلبك بنجاح! / Commande passée avec succès !
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    marginBottom: '40px',
                    lineHeight: '1.6',
                }}>
                    شكراً لك على طلبك! / Merci pour votre commande !
                </p>

                {/* Order ID */}
                {orderId && (
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '20px 30px',
                        borderRadius: '12px',
                        marginBottom: '30px',
                        display: 'inline-block',
                    }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>
                            رقم الطلب / Numéro de commande
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                            #{orderId}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                {order && order.orderItems && order.orderItems.length > 0 && (
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '30px',
                        marginBottom: '30px',
                        textAlign: 'left',
                    }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
                            🛍️ المنتجات / Articles
                        </h3>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {order.orderItems.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '15px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <img
                                        src={item.imageUrl || 'https://placehold.co/80x80'}
                                        alt={item.productName}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600', marginBottom: '5px' }}>{item.productName}</p>
                                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                            {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: '#ff69b4' }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Order Details */}
                {order && (
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '30px',
                        marginBottom: '30px',
                        textAlign: 'left',
                    }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
                            📋 تفاصيل الطلب / Détails de la commande
                        </h3>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>الاسم / Nom :</span>
                                <span style={{ fontWeight: '600' }}>{order.clientFullName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>المدينة / Ville :</span>
                                <span style={{ fontWeight: '600' }}>{order.city}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>الحالة / Statut :</span>
                                <span style={{
                                    fontWeight: '600',
                                    color: order.status === 'PREPARING' ? '#ffc107' :
                                        order.status === 'DELIVERING' ? '#007bff' :
                                            order.status === 'DELIVERED' ? '#28a745' : '#dc3545'
                                }}>
                                    {order.status}
                                </span>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '15px 0' }} />

                            {/* Price Breakdown */}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>المجموع الفرعي / Sous-total :</span>
                                <span style={{ fontWeight: '600' }}>
                                    {formatPrice(order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                                </span>
                            </div>

                            {order.discountAmount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                                    <span>خصم / Remise ({order.couponCode}) :</span>
                                    <span style={{ fontWeight: '600' }}>
                                        - {formatPrice(order.discountAmount)}
                                    </span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>الشحن / Livraison :</span>
                                <span style={{ fontWeight: '600' }}>
                                    {order.shippingCost === 0 || order.shippingCost === 0.00 ?
                                        <span style={{ color: '#28a745' }}>مجاني / Gratuit</span> :
                                        formatPrice(order.shippingCost)
                                    }
                                </span>
                            </div>

                            {/* Final Total */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '15px', borderTop: '2px solid #dee2e6' }}>
                                <span style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>المجموع / Total :</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#ff69b4' }}>
                                    {formatPrice(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Steps */}
                <div style={{
                    background: '#fff3cd',
                    border: '2px solid #ffc107',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '30px',
                }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>
                        📞 ماذا بعد؟ / Quelle est la prochaine étape ?
                    </h4>
                    <p style={{ color: '#856404', lineHeight: '1.6', margin: 0 }}>
                        سيقوم فريقنا بالاتصال بك قريباً لتأكيد طلبك. / Notre équipe vous contactera bientôt pour confirmer votre commande.
                    </p>
                </div>

                {/* Reward Section: Show Coupon if available, otherwise show Pending Info */}
                {order && order.nextPurchaseCouponCode ? (
                    /* Coupon Won Display */
                    <div style={{
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        color: 'white',
                        padding: '25px',
                        borderRadius: '16px',
                        marginBottom: '30px',
                        boxShadow: '0 10px 20px rgba(255, 107, 107, 0.3)',
                        animation: 'bounceIn 1s ease'
                    }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🎁</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>
                            مبروك! لقد ربحت كود خصم لطلبك القادم!
                            <br />
                            Félicitations! Vous avez gagné un code promo!
                        </h3>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '2px dashed white',
                            fontSize: '1.8rem',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            margin: '15px 0',
                            cursor: 'pointer'
                        }}
                            onClick={() => {
                                navigator.clipboard.writeText(order.nextPurchaseCouponCode);
                                alert("تم نسخ الكود! / Code copié!");
                            }}>
                            {order.nextPurchaseCouponCode}
                        </div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            استخدم هذا الكود في طلبك القادم للحصول على خصم {order.nextPurchaseCouponPercent ? order.nextPurchaseCouponPercent : '10'}%!
                            <br />
                            Utilisez ce code lors de votre prochaine commande pour obtenir {order.nextPurchaseCouponPercent ? order.nextPurchaseCouponPercent : '10'}% de réduction!
                        </p>
                    </div>
                ) : (
                    /* Pending Reward Info (Since it is COD/Preparing) */
                    <div style={{
                        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                        color: '#333',
                        padding: '25px',
                        borderRadius: '16px',
                        marginBottom: '30px',
                        boxShadow: '0 10px 20px rgba(142, 197, 252, 0.3)',
                        animation: 'bounceIn 1s ease'
                    }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🎁</div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>
                            أكمل استلام طلبك لفتح المكافأة!
                            <br />
                            Complétez votre livraison pour débloquer votre récompense !
                        </h3>
                        <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                            عند استلام طلبك بنجاح، ستصلك مكافأة خاصة عبر البريد الإلكتروني.
                            <br />
                            Une fois votre commande livrée avec succès, vous recevrez une récompense spéciale par email.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '15px 40px',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        العودة للرئيسية / Retour à l'accueil
                    </button>
                    <button
                        onClick={() => navigate('/orders')}
                        style={{
                            background: 'white',
                            color: '#ff69b4',
                            border: '2px solid #ff69b4',
                            padding: '15px 40px',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#ff69b4';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = '#ff69b4';
                        }}
                    >
                        عرض طلباتي / Voir mes commandes
                    </button>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccessPage;


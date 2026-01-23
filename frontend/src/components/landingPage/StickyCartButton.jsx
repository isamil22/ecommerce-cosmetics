import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

/**
 * Sticky Floating Cart Button
 * Displays a fixed cart icon on the right side of the screen
 * Shows cart count badge and navigates to cart on click
 */
const StickyCartButton = ({ cartCount = 0 }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/cart');
    };

    return (
        <button
            onClick={handleClick}
            className="sticky-cart-button"
            aria-label="View Cart"
            style={{
                position: 'fixed',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 9999,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(255, 105, 180, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: 'white',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 105, 180, 0.5), 0 3px 6px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
        >
            <FiShoppingCart size={24} />

            {/* Cart Count Badge */}
            {cartCount > 0 && (
                <span
                    style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#fff',
                        color: '#ff1493',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '2px solid #ff69b4',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}

            <style>
                {`
                    @media (max-width: 768px) {
                        .sticky-cart-button {
                            width: 50px !important;
                            height: 50px !important;
                            right: 12px !important;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .sticky-cart-button {
                            width: 48px !important;
                            height: 48px !important;
                            right: 10px !important;
                        }
                    }
                `}
            </style>
        </button>
    );
};

export default StickyCartButton;

import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../api/apiService';
import { toast } from 'react-toastify';

/**
 * Smart CTA Handler for Landing Pages
 * Handles "Buy Now" and "Add to Cart" buttons with product integration
 */
export const useLandingPageCTA = (productId) => {
    const navigate = useNavigate();

    const handleCTA = async (e, customLink = null) => {
        e.preventDefault();
        
        // If custom link is provided and it's not a hash/anchor, use it
        if (customLink && !customLink.startsWith('#') && customLink !== '#order') {
            window.location.href = customLink;
            return;
        }

        try {
            // If productId exists, redirect to product detail page first
            // User can see product details and add to cart from there
            if (productId) {
                navigate(`/products/${productId}`);
                return;
            }

            // If no productId, navigate to cart page
            navigate('/cart');
        } catch (error) {
            console.error('Error handling CTA:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return handleCTA;
};

/**
 * Direct Order Handler - Goes straight to order page
 * Use this for "Buy Now" buttons that should skip cart
 */
export const useLandingPageDirectOrder = (productId) => {
    const navigate = useNavigate();

    const handleDirectOrder = async (e) => {
        e.preventDefault();
        
        try {
            // If productId exists, add product to cart first
            if (productId) {
                try {
                    await addToCart(productId, 1);
                } catch (error) {
                    console.error('Failed to add product to cart:', error);
                    // Still navigate to order page
                }
            }

            // Navigate directly to order page
            navigate('/order');
        } catch (error) {
            console.error('Error handling direct order:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return handleDirectOrder;
};


import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../api/apiService';
import { toast } from 'react-toastify';

/**
 * Smart CTA Handler for Landing Pages
 * Handles "Buy Now" and "Add to Cart" buttons with product integration
 */
export const useLandingPageCTA = (productId, sectionData = null) => {
    const navigate = useNavigate();

    const handleCTA = async (e, customLink = null) => {
        e.preventDefault();

        // If custom link is provided and it's not a hash/anchor, use it
        if (customLink && !customLink.startsWith('#') && customLink !== '#order') {
            window.location.href = customLink;
            return;
        }

        try {
            // Updated Logic: Prioritize direct order flow if sectionData is provided
            // This allows Landing Page sections (Hero, Final CTA) to go straight to /order
            // even if a productId is associated (using the Real Product ID)

            // Direct Order Flow with Variants
            if (sectionData) {
                // Try to extract price from CTA text or use default
                const ctaText = sectionData.ctaText || '';
                const priceMatch = ctaText.match(/\$?(\d+(\.\d{1,2})?)/);
                const price = priceMatch ? parseFloat(priceMatch[1]) : parseFloat(sectionData.price || 0);

                // Build direct purchase object
                const directPurchase = {
                    productId: productId || null, // Use real ID if available
                    productName: sectionData.headline || sectionData.title || 'Special Offer',
                    price: price,
                    imageUrl: sectionData.backgroundImage || sectionData.image || null,
                    quantity: 1,
                    // Pass the selected variant if available
                    variantName: sectionData.selectedVariant || null
                };

                // Validate variant selection if variants exist
                const hasVariants = sectionData.variants && sectionData.variants.length > 0;
                const hasSelection = !!sectionData.selectedVariant;

                if (hasVariants && !hasSelection) {
                    // Logic to prompt user -> scroll to Product Showcase or Hero Section where variants are
                    const showcaseSection = document.getElementById('product-showcase');
                    const heroSection = document.getElementById('landing-hero');
                    const targetSection = showcaseSection || heroSection;

                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                        toast.info('Please select an option to proceed', {
                            position: "top-center",
                            autoClose: 3000
                        });
                        return;
                    }

                    // Fallback if no section found but variants required
                    toast.warning('Please select a variant option');
                    if (productId) {
                        navigate(`/products/${productId}`);
                        return;
                    }
                }

                // Navigate to Order Page with direct purchase data
                navigate('/order', { state: { directPurchase } });
                return;
            }

            // Fallback: If no sectionData but productId exists, go to product page
            if (productId) {
                navigate(`/products/${productId}`);
                return;
            }

            // Fallback for non-direct flows
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


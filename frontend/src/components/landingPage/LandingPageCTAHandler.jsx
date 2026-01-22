import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../api/apiService';
import { toast } from 'react-toastify';
import { trackEvent } from '../../utils/facebookPixel';
import ReactGA from 'react-ga4';

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

                // Track InitiateCheckout (Facebook Pixel)
                trackEvent('InitiateCheckout', {
                    content_name: directPurchase.productName,
                    content_ids: directPurchase.productId ? [directPurchase.productId] : [],
                    content_type: 'product',
                    value: directPurchase.price,
                    currency: 'USD',
                    num_items: directPurchase.quantity
                });

                // Track begin_checkout (Google Analytics)
                ReactGA.event({
                    category: 'Ecommerce',
                    action: 'begin_checkout',
                    label: 'Direct Order: ' + directPurchase.productName,
                    value: directPurchase.price
                });

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

            // Track InitiateCheckout (Simple Flow)
            if (productId) {
                trackEvent('InitiateCheckout', {
                    content_ids: [productId],
                    content_type: 'product',
                    currency: 'USD'
                });
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


/**
 * Add to Cart Handler - Adds product to cart without redirecting immediately (unless error)
 * Requires fetchCartCount to update the UI
 */
export const useLandingPageAddToCart = (productId, sectionData = null, fetchCartCount = null) => {
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.preventDefault();

        try {
            // Validate variant selection if variants exist
            if (sectionData) {
                const hasVariants = sectionData.variants && sectionData.variants.length > 0;
                const hasSelection = !!sectionData.selectedVariant;

                if (hasVariants && !hasSelection) {
                    // Logic to prompt user -> scroll to Product Showcase or Hero Section where variants are
                    const showcaseSection = document.getElementById('product-showcase');
                    const heroSection = document.getElementById('landing-hero');
                    const targetSection = showcaseSection || heroSection;

                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                        toast.info('Please select an option first', {
                            position: "top-center",
                            autoClose: 3000
                        });
                        return;
                    }

                    toast.warning('Please select a variant option');
                    return;
                }
            }

            // Updated Logic: Check for price override to handle Landing Page variants (e.g. 2_Pack custom price)
            // If sectionData has a price, we use the Virtual Product flow to ensure that price is respected,
            // effectively bypassing the database price lookup.
            const hasPriceOverride = sectionData && sectionData.price !== undefined && sectionData.price !== null && sectionData.price !== '';

            if (productId && !hasPriceOverride) {
                // Standard Add to Cart with ID (Uses DB Price)
                // We pass null for variantId currently as we don't have explicit variant IDs in this flow
                await addToCart(productId, 1, null);

                trackEvent('AddToCart', {
                    content_ids: [productId],
                    content_type: 'product',
                    // value: price, // Ideally we get price here too
                    currency: 'USD'
                });

                // Track add_to_cart (Google Analytics)
                ReactGA.event({
                    category: 'Ecommerce',
                    action: 'add_to_cart',
                    label: 'Product ID: ' + productId
                });

                toast.success('Added to cart!');
            } else if (sectionData) {
                // Virtual Product Flow (No ID, but has data from Landing Page)
                const ctaText = sectionData.ctaText || '';
                const priceMatch = ctaText.match(/\$?(\d+(\.\d{1,2})?)/);
                const price = priceMatch ? parseFloat(priceMatch[1]) : parseFloat(sectionData.price || 0);

                const virtualProduct = {
                    productId: null,
                    productName: sectionData.headline || sectionData.title || 'Special Offer',
                    price: price,
                    imageUrl: sectionData.backgroundImage || sectionData.image || null,
                    variantName: sectionData.selectedVariant || null
                };

                await addToCart(virtualProduct, 1);

                trackEvent('AddToCart', {
                    content_name: virtualProduct.productName,
                    content_type: 'product',
                    value: virtualProduct.price,
                    currency: 'USD'
                });

                // Track add_to_cart (Google Analytics)
                ReactGA.event({
                    category: 'Ecommerce',
                    action: 'add_to_cart',
                    label: virtualProduct.productName,
                    value: virtualProduct.price
                });

                toast.success('Added to cart!');
            } else {
                console.error("No Product ID found for Add to Cart");
                toast.error("Product not found");
                return;
            }

            if (fetchCartCount) {
                fetchCartCount();
            }

        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Could not add to cart');
        }
    };

    return handleAddToCart;
};

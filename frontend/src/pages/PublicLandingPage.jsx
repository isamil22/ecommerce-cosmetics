import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import landingPageService from '../api/landingPageService';
import { SECTION_COMPONENTS } from '../components/landingPage/sections/SectionRegistry';
import Loader from '../components/Loader';
import { getProductById } from '../api/apiService';
import { trackEvent } from '../utils/facebookPixel';
import ReactGA from 'react-ga4';
import StickyCartButton from '../components/landingPage/StickyCartButton';

/**
 * Public Landing Page Viewer
 * Renders published landing pages for customers
 */
const PublicLandingPage = (props) => {
    const { slug } = useParams();
    const [landingPage, setLandingPage] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadLandingPage();
    }, [slug]);

    const loadLandingPage = async () => {
        try {
            setLoading(true);
            const data = await landingPageService.getPublishedLandingPage(slug);
            setLandingPage(data);

            // Fetch product details explicitly to get variants
            let productRes = null;
            if (data.productId) {
                try {
                    productRes = await getProductById(data.productId);
                    setProduct(productRes.data);
                } catch (pErr) {
                    console.error("Failed to fetch product details:", pErr);
                }
            }

            // Update page metadata
            document.title = data.metaTitle || data.title;
            if (data.metaDescription) {
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription) {
                    metaDescription.setAttribute('content', data.metaDescription);
                }
            }

            // Apply custom styles if provided
            if (data.settings?.customCss) {
                const style = document.createElement('style');
                style.textContent = data.settings.customCss;
                document.head.appendChild(style);
            }

            // Apply theme color
            if (data.settings?.themeColor) {
                document.documentElement.style.setProperty('--theme-color', data.settings.themeColor);
            }

            // Track ViewContent
            // We need to determine the price and product details
            let price = 0;
            // Try to find price in sections if not directly on product (fallback)
            // Ideally backend provides this or we get it from product fetch
            if (data.productId && productRes && productRes.data) {
                price = productRes.data.price;
            }

            trackEvent('ViewContent', {
                content_name: data.title,
                content_ids: data.productId ? [data.productId] : [],
                content_type: 'product',
                value: price,
                currency: 'USD' // Assuming USD or get from settings
            });

            // Track view_item (Google Analytics)
            ReactGA.event({
                category: 'Landing Page',
                action: 'view_item',
                label: data.title,
                value: price
            });

            setError(null);
        } catch (err) {
            console.error('Error loading landing page:', err);
            setError(err.response?.data?.message || 'Landing page not found');
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

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '20px',
                textAlign: 'center',
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff69b4' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Landing Page Not Found</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
                <a
                    href="/"
                    style={{
                        backgroundColor: '#ff69b4',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    Go to Homepage
                </a>
            </div>
        );
    }

    if (!landingPage) {
        return null;
    }

    // Apply custom font if provided
    const fontFamily = landingPage.settings?.fontFamily || 'Arial, sans-serif';

    // Extract variants: Prefer explicitly fetched product variants, fallback to extracting from sections
    const globalVariants = product?.variants?.length > 0
        ? product.variants
        : (landingPage.sections?.find(s => s.sectionData?.variants?.length > 0)?.sectionData?.variants || []);

    return (
        <div style={{ fontFamily, minHeight: '50vh' }}>
            {/* Sticky Floating Cart Button */}
            <StickyCartButton />

            {/* Render sections */}
            {landingPage.sections
                ?.filter(section => section.isVisible !== false)
                ?.sort((a, b) => a.sectionOrder - b.sectionOrder)
                ?.map((section) => {
                    const SectionComponent = SECTION_COMPONENTS[section.sectionType];

                    if (!SectionComponent) {
                        // Handle custom HTML sections
                        // SECURITY NOTE: dangerouslySetInnerHTML is intentional here
                        // Only authenticated admins with LANDING_PAGE:CREATE/UPDATE permissions
                        // can add custom HTML. This is a feature, not a vulnerability.
                        if (section.sectionType === 'CUSTOM_HTML' && section.sectionData?.html) {
                            return (
                                <div
                                    key={section.id}
                                    dangerouslySetInnerHTML={{ __html: section.sectionData.html }}
                                />
                            );
                        }

                        console.warn(`No component found for section type: ${section.sectionType}`);
                        return null;
                    }

                    return (
                        <SectionComponent
                            key={section.id}
                            data={section.sectionData}
                            productId={landingPage.productId}
                            availableVariants={globalVariants}
                            fetchCartCount={props.fetchCartCount}
                        />
                    );
                })}

            {/* Custom JavaScript execution (if provided) */}
            {/* SECURITY NOTE: Only admins with proper permissions can add custom JS */}
            {landingPage.settings?.customJs && (
                <script dangerouslySetInnerHTML={{ __html: landingPage.settings.customJs }} />
            )}
        </div>
    );
};

export default PublicLandingPage;


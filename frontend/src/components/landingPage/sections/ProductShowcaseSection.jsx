import React, { useEffect, useState, useRef } from 'react';
import { useLandingPageCTA, useLandingPageAddToCart } from '../LandingPageCTAHandler';

/**
 * Premium Product Showcase Section
 * Beautiful product display with animations and premium styling
 */
const ProductShowcaseSection = ({ data, productId = null, availableVariants = [], fetchCartCount = null }) => {
    const {
        image = '/placeholder-image.jpg',
        title = 'Our Amazing Product',
        description = 'Discover the perfect solution for your needs. This product has been designed with you in mind.',
        features = [],
        imagePosition = 'left',
        backgroundColor = '#fafafa',
        // New premium options
        badge = '',
        price = '',
        originalPrice = '',
        ctaText = '',
        ctaLink = '#order',
        productId: sectionProductId // Extract productId from data if available
    } = data || {};

    console.log('ProductShowcase Debug:', {
        globalProductId: productId,
        sectionProductId,
        activeProductId: sectionProductId === 'NONE' ? null : (sectionProductId || productId)
    });



    // Use section-specific productId if available (override), otherwise fallback to global productId
    // If 'NONE' is selected, strictly set to null (no product)
    const activeProductId = sectionProductId === 'NONE' ? null : (sectionProductId || productId);

    // Variant Logic
    const [selectedVariants, setSelectedVariants] = useState({});
    const variants = (data?.variants && data.variants.length > 0) ? data.variants : availableVariants;

    // Calculate activeImage with priority: Color Variant Image > Other Variant Image > Default Image
    let activeImage = image;

    if (data?.optionVisuals) {
        let colorImage = null;
        let otherImage = null;

        Object.entries(selectedVariants).forEach(([varName, varOption]) => {
            const visualKey = `${varName}:${varOption}`;
            const visual = data.optionVisuals[visualKey];

            if (visual?.image) {
                const isColor = varName.toLowerCase().includes('color') ||
                    varName.toLowerCase().includes('colour') ||
                    varName.toLowerCase().includes('shade');

                if (isColor) {
                    colorImage = visual.image;
                } else {
                    otherImage = visual.image;
                }
            }
        });

        // Color takes precedence (so "Purple" wins over "50ml" if both have images)
        if (colorImage) {
            activeImage = colorImage;
        } else if (otherImage) {
            activeImage = otherImage;
        }
    }

    // Helper to format selected variants string
    const getVariantString = () => {
        if (!variants.length) return null;
        return variants.map(v => `${v.name}: ${selectedVariants[v.name] || 'Not Selected'}`).join(', ');
    };

    // Check if all variants are selected
    const allVariantsSelected = variants.every(v => selectedVariants[v.name]);

    // Toast Notification State
    const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

    const showNotification = (message, type = 'error') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3500);
    };

    const handleCTA = useLandingPageCTA(activeProductId, {
        ...data,
        selectedVariant: getVariantString()
    });

    const handleBuyClick = (e) => {
        e.preventDefault();
        // If no product, just follow link if it's not #order
        if (!activeProductId && ctaLink !== '#order') {
            window.location.href = ctaLink;
            return;
        }

        const missingVariants = variants
            .filter(v => !selectedVariants[v.name])
            .map(v => v.name);

        if (variants.length > 0 && missingVariants.length > 0) {
            showNotification(`Please select: ${missingVariants.join(', ')}`, 'error');
            return;
        }
        handleCTA(e);
    };

    const handleAddToCart = useLandingPageAddToCart(activeProductId, {
        ...data,
        selectedVariant: getVariantString()
    }, fetchCartCount);

    const handleAddToCartClick = (e) => {
        const missingVariants = variants
            .filter(v => !selectedVariants[v.name])
            .map(v => v.name);

        if (variants.length > 0 && missingVariants.length > 0) {
            showNotification(`Please select: ${missingVariants.join(', ')}`, 'error');
            return;
        }
        // Removed explicit productId check to allow virtual products (handled by useLandingPageAddToCart)
        handleAddToCart(e);
    };

    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const contentOrder = imagePosition === 'left' ? 'row' : 'row-reverse';
    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return '/placeholder-image.jpg';
        return url.startsWith('http') ? url : `${window.location.origin}${url}`;
    };

    return (
        <div
            ref={sectionRef}
            id="product-showcase"
            style={{
                background: backgroundColor === '#fafafa'
                    ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                    : backgroundColor,
                padding: '100px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: '10%',
                right: imagePosition === 'left' ? '5%' : 'auto',
                left: imagePosition === 'right' ? '5%' : 'auto',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255,105,180,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: contentOrder,
                gap: '80px',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                {/* Image Side */}
                <div
                    style={{
                        flex: '1 1 450px',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                            ? 'translateX(0)'
                            : `translateX(${imagePosition === 'left' ? '-50px' : '50px'})`,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                    }}
                >
                    {/* Floating Badge */}
                    {badge && (
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            left: imagePosition === 'left' ? '20px' : 'auto',
                            right: imagePosition === 'right' ? '20px' : 'auto',
                            background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            boxShadow: '0 4px 15px rgba(255,105,180,0.4)',
                            zIndex: 10,
                            animation: 'pulse 2s ease-in-out infinite',
                        }}>
                            {badge}
                        </div>
                    )}

                    {/* Image Container with Effects */}
                    <div style={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.12)',
                    }}>
                        {/* Skeleton Loader */}
                        {!imageLoaded && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s infinite',
                            }} />
                        )}

                        <img
                            src={getImageUrl(activeImage)}
                            alt={title}
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                width: '100%',
                                display: 'block',
                                transition: 'transform 0.5s ease',
                                opacity: imageLoaded ? 1 : 0,
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23f0f0f0" width="400" height="400"/><text fill="%23999" font-family="Arial" font-size="20" x="50%" y="50%" text-anchor="middle" dy=".3em">Product Image</text></svg>';
                            }}
                        />
                    </div>
                </div>

                {/* Content Side */}
                <div
                    style={{
                        flex: '1 1 450px',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                            ? 'translateX(0)'
                            : `translateX(${imagePosition === 'left' ? '50px' : '-50px'})`,
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                    }}
                >
                    {/* Title */}
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        color: '#222',
                        lineHeight: '1.2',
                    }}>
                        {title}
                    </h2>

                    {/* Price Display */}
                    {price && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '15px',
                            marginBottom: '1.5rem',
                        }}>
                            <span style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: '#ff69b4',
                            }}>
                                {price}
                            </span>
                            {originalPrice && (
                                <span style={{
                                    fontSize: '1.3rem',
                                    color: '#999',
                                    textDecoration: 'line-through',
                                }}>
                                    {originalPrice}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <p style={{
                        fontSize: '1.15rem',
                        lineHeight: '1.8',
                        color: '#555',
                        marginBottom: '2rem',
                    }}>
                        {description}
                    </p>

                    {/* Features List */}
                    {features && features.length > 0 && (
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: '0 0 2rem 0',
                        }}>
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    style={{
                                        fontSize: '1.1rem',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        color: '#333',
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                                        transition: `all 0.5s ease ${0.3 + index * 0.1}s`,
                                    }}
                                >
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '28px',
                                        height: '28px',
                                        background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        marginRight: '15px',
                                        fontSize: '0.9rem',
                                        flexShrink: 0,
                                        marginTop: '2px',
                                    }}>✓</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Variant Picker */}
                    {variants.length > 0 && (
                        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {variants.map((v, i) => {
                                const isColorVariant = v.name.toLowerCase().includes('color') || v.name.toLowerCase().includes('colour') || v.name.toLowerCase().includes('shade');
                                return (
                                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: '600', minWidth: '60px', color: '#333' }}>{v.name}:</span>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {v.options.filter(opt => opt && opt.trim()).map((option, j) => {
                                                const isSelected = selectedVariants[v.name] === option;
                                                const visualKey = `${v.name}:${option}`;
                                                // Check for visual overrides (color/image)
                                                const visual = (data.optionVisuals || {})[visualKey];

                                                // Color Swatch Style
                                                if (isColorVariant) {
                                                    const swatchColor = visual?.color || (['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange', 'pink'].includes(option.toLowerCase()) ? option.toLowerCase() : '#ccc');

                                                    return (
                                                        <button
                                                            key={j}
                                                            onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: option }))}
                                                            title={option}
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                background: swatchColor,
                                                                border: isSelected ? '2px solid #222' : '2px solid transparent',
                                                                boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #ff69b4' : '0 2px 5px rgba(0,0,0,0.1)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                                            }}
                                                        />
                                                    );
                                                }

                                                // Standard Button Style
                                                return (
                                                    <button
                                                        key={j}
                                                        onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: option }))}
                                                        style={{
                                                            padding: '8px 20px',
                                                            borderRadius: '25px',
                                                            border: `2px solid ${isSelected ? '#ff69b4' : '#ddd'}`,
                                                            background: isSelected ? '#ff69b4' : 'transparent',
                                                            color: isSelected ? 'white' : '#555',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* CTA Button */}
                    {ctaText && (
                        <a
                            href={ctaLink || '#'}
                            onClick={handleBuyClick}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                                color: 'white',
                                padding: '18px 40px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                boxShadow: '0 8px 30px rgba(255,105,180,0.4)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 12px 40px rgba(255,105,180,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 30px rgba(255,105,180,0.4)';
                            }}
                        >
                            {ctaText} <span>→</span>
                        </a>
                    )}

                    {/* Add to Cart Button (Always show, validator handles missing product) */}
                    <button
                        onClick={handleAddToCartClick}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'white',
                            color: '#ff69b4',
                            border: '2px solid #ff69b4',
                            padding: '16px 35px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            marginLeft: '15px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(255,105,180,0.2)',
                            transition: 'all 0.3s ease',
                            opacity: activeProductId ? 1 : 0.7
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#fff0f5';
                            e.target.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Add to Cart <span>+</span>
                    </button>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes slideInDown {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `}</style>

            {/* Premium Toast Notification */}
            {notification.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px 24px',
                    borderRadius: '50px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 9999,
                    animation: 'slideInDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                    border: '1px solid rgba(255,105,180,0.2)',
                    minWidth: '320px',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        background: notification.type === 'error' ? '#ff4d4d' : '#4caf50',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        flexShrink: 0
                    }}>
                        {notification.type === 'error' ? '!' : '✓'}
                    </div>
                    <span style={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default ProductShowcaseSection;

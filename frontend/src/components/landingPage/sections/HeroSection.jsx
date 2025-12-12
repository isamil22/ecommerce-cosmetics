import React, { useEffect, useState } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * Premium Hero Section Component
 * Full-screen hero with animations, gradient overlays, and floating elements
 */
const HeroSection = ({ data, isEditing = false, productId = null, availableVariants = [] }) => {
    const [selectedVariants, setSelectedVariants] = useState({});

    // Parse variants from data (assuming they might come as JSON or array)
    // For demo/mock, we'll assume data.variants is like:
    // [{ name: 'Size', options: ['50ml', '100ml'] }, { name: 'Scent', options: ['Lavender', 'Rose'] }]
    const variants = (data?.variants && data.variants.length > 0) ? data.variants : availableVariants;

    // Helper to format selected variants string "Size: 50ml, Scent: Lavender"
    const getVariantString = () => {
        if (!variants.length) return null;
        return variants.map(v => `${v.name}: ${selectedVariants[v.name] || 'Not Selected'}`).join(', ');
    };

    // Check if all variants are selected
    const allVariantsSelected = variants.every(v => selectedVariants[v.name]);

    const handleCTA = useLandingPageCTA(productId, {
        ...data,
        selectedVariant: getVariantString()
    });

    const {
        headline = 'Amazing Product!',
        subheadline = 'Transform your life today',
        backgroundImage,
        backgroundColor = '#ffeef8',
        ctaText = 'Buy Now - $49.99',
        ctaLink = '#order',
        textColor = '#333',
        // New premium options
        badge = '',
        secondaryCtaText = '',
        secondaryCtaLink = '',
    } = data || {};

    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        });
    };

    const handleBuyClick = (e) => {
        e.preventDefault();
        if (variants.length > 0 && !allVariantsSelected) {
            alert('Please select all options before buying.');
            return;
        }
        handleCTA(e);
    };

    return (
        <div
            id="landing-hero"
            onMouseMove={handleMouseMove}
            style={{
                background: backgroundImage
                    ? `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%), url(${backgroundImage.startsWith('http') ? backgroundImage : window.location.origin + backgroundImage})`
                    : `linear-gradient(135deg, ${backgroundColor} 0%, #fff0f5 50%, #ffffff 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 20px',
                color: backgroundImage ? '#ffffff' : textColor,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Shapes */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite',
                transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(147,112,219,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 10s ease-in-out infinite reverse',
                transform: `translate(${-mousePosition.x * 15}px, ${-mousePosition.y * 15}px)`,
            }} />
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 4s ease-in-out infinite',
            }} />

            {/* Content */}
            <div style={{
                maxWidth: '900px',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                {/* Badge */}
                {badge && (
                    <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                        color: 'white',
                        padding: '8px 24px',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '25px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        boxShadow: '0 4px 15px rgba(255,105,180,0.4)',
                        animation: 'shimmer 2s ease-in-out infinite',
                    }}>
                        {badge}
                    </div>
                )}

                {/* Headline */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em',
                    textShadow: backgroundImage ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
                }}>
                    {headline.split(' ').map((word, i) => (
                        <span
                            key={i}
                            style={{
                                display: 'inline-block',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 * i}s`,
                            }}
                        >
                            {word}&nbsp;
                        </span>
                    ))}
                </h1>

                {/* Subheadline */}
                <p style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    marginBottom: '2.5rem',
                    opacity: 0.9,
                    maxWidth: '700px',
                    margin: '0 auto 2.5rem',
                    lineHeight: '1.6',
                    textShadow: backgroundImage ? '0 1px 10px rgba(0,0,0,0.3)' : 'none',
                }}>
                    {subheadline}
                </p>

                {/* Variant Picker */}
                {variants.length > 0 && (
                    <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                        {variants.map((v, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <span style={{ fontWeight: '600', minWidth: '60px', textAlign: 'left' }}>{v.name}:</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {v.options.map((option, j) => (
                                        <button
                                            key={j}
                                            onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: option }))}
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '25px',
                                                border: `2px solid ${selectedVariants[v.name] === option ? '#ff1493' : (backgroundImage ? 'rgba(255,255,255,0.5)' : '#ddd')}`,
                                                background: selectedVariants[v.name] === option ? '#ff1493' : 'transparent',
                                                color: selectedVariants[v.name] === option ? 'white' : (backgroundImage ? 'white' : textColor),
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    {!isEditing ? (
                        <>
                            <a
                                href={ctaLink || '#'}
                                onClick={handleBuyClick}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                                    color: 'white',
                                    padding: '18px 45px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    boxShadow: '0 8px 30px rgba(255,105,180,0.4), 0 4px 10px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                                    e.target.style.boxShadow = '0 12px 40px rgba(255,105,180,0.5), 0 6px 15px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 8px 30px rgba(255,105,180,0.4), 0 4px 10px rgba(0,0,0,0.1)';
                                }}
                            >
                                <span>{ctaText}</span>
                                <span style={{ fontSize: '1.3rem' }}>→</span>
                            </a>
                            {secondaryCtaText && (
                                <a
                                    href={secondaryCtaLink || '#'}
                                    onClick={secondaryCtaLink && !secondaryCtaLink.startsWith('#') ? undefined : handleCTA}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'transparent',
                                        color: backgroundImage ? 'white' : textColor,
                                        padding: '18px 35px',
                                        borderRadius: '50px',
                                        textDecoration: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        border: `2px solid ${backgroundImage ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)'}`,
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = backgroundImage ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                    }}
                                >
                                    {secondaryCtaText}
                                </a>
                            )}
                        </>
                    ) : (
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                                color: 'white',
                                padding: '18px 45px',
                                borderRadius: '50px',
                                border: 'none',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'not-allowed',
                                boxShadow: '0 8px 30px rgba(255,105,180,0.4)',
                            }}
                        >
                            {ctaText} →
                        </button>
                    )}
                </div>

                {/* Trust Indicators */}
                <div style={{
                    marginTop: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    flexWrap: 'wrap',
                    opacity: 0.8,
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                        <span style={{ color: '#ffd700' }}>★★★★★</span> 4.9/5 Rating
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                        ✓ Free Shipping
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                        🔒 Secure Checkout
                    </span>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'bounce 2s ease-in-out infinite',
            }}>
                <div style={{
                    width: '30px',
                    height: '50px',
                    border: `2px solid ${backgroundImage ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)'}`,
                    borderRadius: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '8px',
                }}>
                    <div style={{
                        width: '4px',
                        height: '10px',
                        backgroundColor: backgroundImage ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                        borderRadius: '2px',
                        animation: 'scroll 2s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(10px); }
                }
                @keyframes scroll {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(8px); opacity: 0.5; }
                }
                @keyframes shimmer {
                    0%, 100% { box-shadow: 0 4px 15px rgba(255,105,180,0.4); }
                    50% { box-shadow: 0 4px 25px rgba(255,105,180,0.6); }
                }
            `}</style>
        </div>
    );
};

export default HeroSection;

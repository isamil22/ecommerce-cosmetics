import React, { useEffect, useState } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * STAR HERO SECTION (WOW EDITION)
 * Designed to be "Pro", "Creative", and "Cleaner" than the standard stack.
 * Features:
 * - Dynamic Star Background
 * - Glassmorphism "Console" layout
 * - Floating Organic Elements
 * - Glowing Typography
 */
const HeroSection = ({ data, isEditing = false, productId = null, availableVariants = [] }) => {
    // Standard logic from previous version
    const [selectedVariants, setSelectedVariants] = useState({});
    const variants = (data?.variants && data.variants.length > 0) ? data.variants : availableVariants;
    const activeProductId = data?.productId === 'NONE' ? null : (data?.productId || productId);

    // Helper to format selected variants string
    const getVariantString = () => {
        if (!variants.length) return null;
        return variants.map(v => `${v.name}: ${selectedVariants[v.name] || 'Not Selected'}`).join(', ');
    };

    const allVariantsSelected = variants.every(v => selectedVariants[v.name]);

    const handleCTA = useLandingPageCTA(activeProductId, {
        ...data,
        selectedVariant: getVariantString()
    });

    const {
        headline = 'Unleash Your Inner Star',
        subheadline = 'Experience the cosmos of beauty with our premium collection.',
        backgroundImage,
        backgroundColor = '#0f0c29', // Fallback deep dark color
        ctaText = 'Shop the Galaxy',
        ctaLink = '#order',
        textColor = '#fff',
        badge = 'NEW ARRIVAL ✨',
        secondaryCtaText = 'View Collection',
        secondaryCtaLink = '#packs',
    } = data || {};

    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) * 0.02;
        const moveY = (clientY - window.innerHeight / 2) * 0.02;
        setMousePosition({ x: moveX, y: moveY });
    };

    const handleBuyClick = (e) => {
        e.preventDefault();
        if (variants.length > 0 && !allVariantsSelected) {
            alert('Please select all options before buying.');
            return;
        }
        handleCTA(e);
    };

    // Generate random stars for the background
    const [stars, setStars] = useState([]);
    useEffect(() => {
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1 + 'px',
            delay: Math.random() * 5 + 's',
            duration: Math.random() * 3 + 2 + 's',
        }));
        setStars(newStars);
    }, []);

    return (
        <div
            id="landing-hero"
            onMouseMove={handleMouseMove}
            className="hero-star-container"
            style={{
                position: 'relative',
                minHeight: '92vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: backgroundImage
                    ? `url(${backgroundImage.startsWith('http') ? backgroundImage : window.location.origin + backgroundImage})`
                    : `radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)`, // Deep cosmic default
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: textColor,
            }}
        >
            {/* --- LAYOUT: Dynamic Background Overlays --- */}

            {/* 1. Dark Overlay for readability if image exists */}
            {backgroundImage && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))',
                    zIndex: 1
                }} />
            )}

            {/* 2. Star Layer (CSS Animated) */}
            <div className="star-layer" style={{ zIndex: 2 }}>
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="animate-twinkle"
                        style={{
                            position: 'absolute',
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            boxShadow: `0 0 ${parseInt(star.size) * 2}px white`,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                        }}
                    />
                ))}
            </div>

            {/* 3. Floating Organic Gradient Blobs (Parallax) */}
            <div style={{
                position: 'absolute',
                top: '20%', left: '10%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
                transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)`,
                zIndex: 2,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%', right: '5%',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
                transform: `translate(${mousePosition.x * 3}px, ${mousePosition.y * 3}px)`,
                zIndex: 2,
                pointerEvents: 'none'
            }} />

            {/* --- LAYOUT: Content --- */}
            <div
                className="container-lg"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    transition: 'transform 0.1s ease-out'
                }}
            >

                {/* Badge Pills - Floating Top */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {badge && (
                        <div className="glass-pill animate-fade-in-down" style={{
                            padding: '8px 24px',
                            borderRadius: '50px',
                            color: '#fff',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            fontSize: '0.85rem',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span style={{ color: '#FFD700' }}>✨</span> {badge}
                        </div>
                    )}
                </div>

                {/* Main Headline - Massive & Glowing */}
                <h1
                    className="animate-fade-in"
                    style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        fontWeight: '800',
                        lineHeight: '1.05',
                        marginBottom: '1.5rem',
                        letterSpacing: '-2px',
                        background: 'linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))'
                    }}
                >
                    {headline.split(' ').map((word, i) => (
                        <span key={i} style={{ display: 'inline-block' }}>{word}&nbsp;</span>
                    ))}
                </h1>

                {/* Subheadline - Clean & Crisp */}
                <p
                    className="animate-slide-up"
                    style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        maxWidth: '700px',
                        margin: '0 auto 3rem',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: '300',
                        animationDelay: '0.2s'
                    }}
                >
                    {subheadline}
                </p>

                {/* Variants (if any) */}
                {variants.length > 0 && (
                    <div className="glass-panel-pro animate-slide-up" style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        gap: '15px',
                        padding: '20px',
                        borderRadius: '20px',
                        marginBottom: '3rem',
                        animationDelay: '0.3s'
                    }}>
                        {variants.map((v, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <span style={{ fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>{v.name}:</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {v.options.map((option, j) => (
                                        <button
                                            key={j}
                                            onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: option }))}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: '12px',
                                                border: `1px solid ${selectedVariants[v.name] === option ? '#ec4899' : 'rgba(255,255,255,0.2)'}`,
                                                background: selectedVariants[v.name] === option ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' : 'rgba(255,255,255,0.05)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                boxShadow: selectedVariants[v.name] === option ? '0 0 15px rgba(236, 72, 153, 0.5)' : 'none'
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

                {/* Actions Row - Broken Grid Layout */}
                <div
                    className="animate-slide-up"
                    style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '4rem',
                        animationDelay: '0.4s'
                    }}
                >
                    {!isEditing ? (
                        <>
                            <a
                                href={ctaLink || '#'}
                                onClick={handleBuyClick}
                                className="animate-cosmic-float"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'linear-gradient(135deg, #FF1493 0%, #9b2cfa 100%)', // Vibrant pink/purple
                                    color: 'white',
                                    padding: '20px 50px',
                                    borderRadius: '100px',
                                    textDecoration: 'none',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    boxShadow: '0 0 30px rgba(255, 20, 147, 0.4), inset 0 0 10px rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 20, 147, 0.6), inset 0 0 20px rgba(255,255,255,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 20, 147, 0.4), inset 0 0 10px rgba(255,255,255,0.2)';
                                }}
                            >
                                <span style={{ zIndex: 2 }}>{ctaText}</span>
                                <span style={{ zIndex: 2 }}>✨</span>
                            </a>

                            {secondaryCtaText && (
                                <a
                                    href={secondaryCtaLink || '#'}
                                    onClick={secondaryCtaLink && !secondaryCtaLink.startsWith('#') ? undefined : handleCTA}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        padding: '20px 40px',
                                        borderRadius: '100px',
                                        textDecoration: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.borderColor = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                    }}
                                >
                                    {secondaryCtaText}
                                </a>
                            )}
                        </>
                    ) : (
                        <button className="btn-primary-cta" style={{ opacity: 0.6, cursor: 'not-allowed' }}>{ctaText}</button>
                    )}
                </div>

                {/* Bottom Console - Trust Indicators (Integrated into a glass bar) */}
                <div
                    className="glass-panel-pro animate-slide-up"
                    style={{
                        display: 'inline-flex',
                        gap: '40px',
                        padding: '15px 40px',
                        borderRadius: '20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        animationDelay: '0.6s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(255,215,0,0.2)', padding: '8px', borderRadius: '50%' }}>🏆</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Quality</div>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Premium Rating</div>
                        </div>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '50%' }}>🚚</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Delivery</div>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Fast & Free</div>
                        </div>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '50%' }}>🛡️</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Secure</div>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Checkout</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Fade Gradient to blend with next section */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100px',
                background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
                zIndex: 5,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default HeroSection;

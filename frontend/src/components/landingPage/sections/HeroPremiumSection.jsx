import React, { useState } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * 3D Immersive Hero Section
 * Features:
 * - Layered design: Background -> Giant Text -> Floating Product
 * - Parallax mouse movement
 * - Premium typography
 */
const HeroPremiumSection = ({ data, isEditing = false, productId = null, availableVariants = [] }) => {
    // Merge local data with global variants if not present locally
    const ctaData = { ...data, variants: data?.variants || availableVariants };
    const handleCTA = useLandingPageCTA(productId, ctaData);

    const {
        titleBack = 'SKIN CARE',
        headline = 'Love your bits...',
        subheadline = '(and your bod)',
        productImage,
        backgroundImage,
        backgroundColor = '#e6e6fa',
        ctaText = 'Shop Now',
        ctaLink = '#shop',
        badge = 'New Arrival',
        textColor = '#333'
    } = data || {};

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        // Only animate not in editing mode to save performance, or keep it subtle
        const { clientX, clientY } = e;
        const moveX = (window.innerWidth / 2 - clientX) / 25;
        const moveY = (window.innerHeight / 2 - clientY) / 25;
        setMousePosition({ x: moveX, y: moveY });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                minHeight: '800px',
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // fontFamily: "'Playfair Display', serif" // Removed to allow global font
            }}
        >
            {/* 1. LAYER ONE: Giant Background Text */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 'clamp(100px, 20vw, 400px)',
                fontWeight: '900',
                color: 'white',
                whiteSpace: 'nowrap',
                lineHeight: '1',
                opacity: '0.6',
                zIndex: 1,
                mixBlendMode: 'overlay', // Blend with background
                pointerEvents: 'none',
                userSelect: 'none'
            }}>
                {titleBack.toUpperCase()}
            </div>

            {/* 2. LAYER TWO: Main Content Container (Grid) */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                maxWidth: '1200px',
                width: '100%',
                padding: '20px',
                gap: '50px',
                alignItems: 'center'
            }}>

                {/* Left Side: Product Image (Floating) */}
                <div style={{
                    order: 2, // Desktop: Right side? Or adjust based on design. Let's do Standard Image Left/Right switch later. For now, Product Center is cool but standard split is safer effectively.
                    // Actually, the example had product overlapping text.
                    display: 'flex',
                    justifyContent: 'center',
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    transition: 'transform 0.1s ease-out'
                }}>
                    {productImage ? (
                        <img
                            src={productImage}
                            alt="Premium Product"
                            style={{
                                maxHeight: '600px',
                                width: 'auto',
                                filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))',
                                animation: 'float 6s ease-in-out infinite'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '400px',
                            height: '500px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            border: '2px dashed #fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}>
                            Upload Transparent Product Image
                        </div>
                    )}
                </div>

                {/* Right Side: Text & Details */}
                <div style={{ order: 1, textAlign: 'left' }}>
                    {badge && (
                        <span style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            border: `1px solid ${textColor}`,
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '20px',
                            color: textColor
                        }}>
                            {badge}
                        </span>
                    )}

                    <h1 style={{
                        fontSize: 'clamp(3rem, 5vw, 5rem)',
                        lineHeight: '1.2',
                        margin: '0 0 10px 0',
                        color: textColor,
                        fontWeight: '700', // Making it bolder for better readability
                    }}>
                        {headline}
                    </h1>

                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: '400',
                        fontStyle: 'normal',
                        marginBottom: '40px',
                        color: textColor,
                        opacity: 0.9 // Improved contrast
                    }}>
                        {subheadline}
                    </h2>

                    <a
                        href={isEditing ? '#' : ctaLink}
                        onClick={handleCTA}
                        style={{
                            display: 'inline-block',
                            background: textColor,
                            color: backgroundColor, // Invert colors for contrast
                            padding: '18px 40px',
                            borderRadius: '0px', // Sharp corners for luxury feel? or rounded. Let's go rounded pill for modish.
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            cursor: isEditing ? 'default' : 'pointer'
                        }}
                    >
                        {ctaText}
                    </a>
                </div>

            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                @media (max-width: 768px) {
                    div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                        text-align: center !important;
                    }
                    div[style*="order: 1"] {
                        order: 2 !important; 
                        text-align: center !important;
                    }
                    div[style*="order: 2"] {
                        order: 1 !important;
                    }
                }
             `}</style>
        </div>
    );
};

export default HeroPremiumSection;

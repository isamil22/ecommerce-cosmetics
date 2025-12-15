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

    // Determine active product: Section override > Global Page Product > Null (if 'NONE')
    const activeProductId = data?.productId === 'NONE' ? null : (data?.productId || productId);

    const handleCTA = useLandingPageCTA(activeProductId, ctaData);

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
            className="hero-premium-section"
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
            }}
        >
            <style>{`
                .hero-premium-section .giant-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: clamp(80px, 20vw, 400px);
                    font-weight: 900;
                    color: white;
                    white-space: nowrap;
                    line-height: 1;
                    opacity: 0.6;
                    z-index: 1;
                    mix-blend-mode: overlay;
                    pointer-events: none;
                    user-select: none;
                }

                .hero-premium-section .content-grid {
                    position: relative;
                    z-index: 10;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    max-width: 1200px;
                    width: 100%;
                    padding: 20px;
                    gap: 50px;
                    align-items: center;
                }

                .hero-premium-section .image-column {
                    order: 2;
                    display: flex;
                    justify-content: center;
                    transition: transform 0.1s ease-out;
                }

                .hero-premium-section .text-column {
                    order: 1;
                    text-align: left;
                }

                .hero-premium-section .product-image {
                    max-height: 600px;
                    width: auto;
                    max-width: 100%;
                    filter: drop-shadow(0 20px 50px rgba(0,0,0,0.3));
                    animation: float 6s ease-in-out infinite;
                }

                .hero-premium-section .placeholder-image {
                    width: 400px;
                    height: 500px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 20px;
                    border: 2px dashed #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    max-width: 100%;
                }

                .hero-premium-section .badge {
                    display: inline-block;
                    padding: 8px 20px;
                    border: 1px solid ${textColor};
                    border-radius: 50px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                    color: ${textColor};
                }

                .hero-premium-section .main-headline {
                    font-size: clamp(3rem, 5vw, 5rem);
                    line-height: 1.2;
                    margin: 0 0 10px 0;
                    color: ${textColor};
                    font-weight: 700;
                }

                .hero-premium-section .sub-headline {
                    font-size: clamp(1.5rem, 3vw, 2.5rem);
                    font-weight: 400;
                    font-style: normal;
                    margin-bottom: 40px;
                    color: ${textColor};
                    opacity: 0.9;
                }

                .hero-premium-section .cta-button {
                    display: inline-block;
                    background: ${textColor};
                    color: ${backgroundColor};
                    padding: 18px 40px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }

                .hero-premium-section .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }

                /* Mobile Responsiveness */
                @media (max-width: 991px) {
                    .hero-premium-section {
                        min-height: auto;
                        padding: 80px 0;
                    }

                    .hero-premium-section .content-grid {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 40px;
                    }

                    .hero-premium-section .image-column {
                        order: 1; /* Image first on mobile usually looks better for products */
                    }

                    .hero-premium-section .text-column {
                        order: 2;
                        text-align: center;
                    }
                    
                    .hero-premium-section .product-image {
                        max-height: 400px;
                    }

                    .hero-premium-section .giant-text {
                        font-size: 18vw; /* Scale down giant text */
                    }

                    .hero-premium-section .cta-button {
                        width: 100%;
                        max-width: 300px;
                    }
                }
            `}</style>

            {/* 1. LAYER ONE: Giant Background Text */}
            <div className="giant-text">
                {titleBack.toUpperCase()}
            </div>

            {/* 2. LAYER TWO: Main Content Container (Grid) */}
            <div className="content-grid">

                {/* Left Side: Product Image (Floating) */}
                <div
                    className="image-column"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    }}
                >
                    {productImage ? (
                        <img
                            src={productImage}
                            alt="Premium Product"
                            className="product-image"
                        />
                    ) : (
                        <div className="placeholder-image">
                            Upload Transparent Product Image
                        </div>
                    )}
                </div>

                {/* Right Side: Text & Details */}
                <div className="text-column">
                    {badge && (
                        <span className="badge">
                            {badge}
                        </span>
                    )}

                    <h1 className="main-headline">
                        {headline}
                    </h1>

                    <h2 className="sub-headline">
                        {subheadline}
                    </h2>

                    <a
                        href={isEditing ? '#' : ctaLink}
                        onClick={handleCTA}
                        className="cta-button"
                        style={{ cursor: isEditing ? 'default' : 'pointer' }}
                    >
                        {ctaText}
                    </a>
                </div>

            </div>
        </div>
    );
};

export default HeroPremiumSection;

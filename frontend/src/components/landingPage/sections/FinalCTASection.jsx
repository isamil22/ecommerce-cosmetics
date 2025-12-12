import React, { useEffect, useState, useRef } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * Premium Final CTA Section
 * Compelling last call-to-action with animations and trust elements
 */
const FinalCTASection = ({ data, isEditing = false, productId = null, availableVariants = [] }) => {
    // Merge local data with global variants if not present locally
    const ctaData = { ...data, variants: data?.variants || availableVariants };
    const handleCTA = useLandingPageCTA(productId, ctaData);
    const {
        title = 'Ready to Transform Your Life?',
        subtitle = 'Join thousands of satisfied customers who made the decision to change',
        ctaText = 'Buy Now - $49.99',
        ctaLink = '#order',
        trustBadges = ['Free Shipping', '30-Day Money Back', 'Secure Checkout'],
        backgroundColor = '#ffffff',
        // New premium options
        price = '$49.99',
        originalPrice = '$99.99',
        savings = 'Save 50%',
        guarantee = '30-Day Money-Back Guarantee',
    } = data || {};

    const [isVisible, setIsVisible] = useState(false);
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

    return (
        <div
            ref={sectionRef}
            style={{
                background: backgroundColor === '#ffffff'
                    ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #fff0f5 100%)'
                    : backgroundColor,
                textAlign: 'center',
                padding: '120px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decorations */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                left: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255,105,180,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-100px',
                right: '-100px',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(147,112,219,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(147,112,219,0.1) 100%)',
                    color: '#ff69b4',
                    padding: '10px 25px',
                    borderRadius: '50px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    marginBottom: '30px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s ease',
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🎁</span>
                    Special Offer - Limited Time Only
                </div>

                {/* Title */}
                <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    color: '#222',
                    lineHeight: '1.2',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.1s',
                }}>
                    {title}
                </h2>

                {/* Subtitle */}
                <p style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    color: '#666',
                    marginBottom: '3rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.6',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.2s',
                }}>
                    {subtitle}
                </p>

                {/* Price Box */}
                <div style={{
                    display: 'inline-block',
                    background: 'white',
                    borderRadius: '24px',
                    padding: '40px 60px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    marginBottom: '40px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                }}>
                    {/* Savings Badge */}
                    {savings && (
                        <div style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            display: 'inline-block',
                            padding: '6px 16px',
                            borderRadius: '50px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            marginBottom: '20px',
                        }}>
                            {savings}
                        </div>
                    )}

                    {/* Price Display */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'center',
                        gap: '15px',
                        marginBottom: '25px',
                    }}>
                        {originalPrice && (
                            <span style={{
                                fontSize: '1.5rem',
                                color: '#999',
                                textDecoration: 'line-through',
                            }}>
                                {originalPrice}
                            </span>
                        )}
                        <span style={{
                            fontSize: 'clamp(3rem, 8vw, 4rem)',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            {price}
                        </span>
                    </div>

                    {/* CTA Button */}
                    {!isEditing ? (
                        <a
                            href={ctaLink || '#'}
                            onClick={handleCTA}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                                color: 'white',
                                padding: '22px 60px',
                                borderRadius: '60px',
                                textDecoration: 'none',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                boxShadow: '0 10px 40px rgba(255,105,180,0.4)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                                e.target.style.boxShadow = '0 15px 50px rgba(255,105,180,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 10px 40px rgba(255,105,180,0.4)';
                            }}
                        >
                            <span>{ctaText}</span>
                            <span style={{ fontSize: '1.5rem', transition: 'transform 0.3s' }}>→</span>
                        </a>
                    ) : (
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                                color: 'white',
                                padding: '22px 60px',
                                borderRadius: '60px',
                                border: 'none',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                cursor: 'not-allowed',
                                boxShadow: '0 10px 40px rgba(255,105,180,0.4)',
                            }}
                        >
                            {ctaText} →
                        </button>
                    )}

                    {/* Guarantee */}
                    {guarantee && (
                        <div style={{
                            marginTop: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#666',
                            fontSize: '0.95rem',
                        }}>
                            <span style={{ fontSize: '1.3rem' }}>🛡️</span>
                            {guarantee}
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    flexWrap: 'wrap',
                    marginTop: '20px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.5s',
                }}>
                    {trustBadges.map((badge, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                background: 'white',
                                borderRadius: '50px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                fontSize: '0.95rem',
                                color: '#555',
                            }}
                        >
                            <span style={{
                                width: '24px',
                                height: '24px',
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.8rem',
                            }}>✓</span>
                            {badge}
                        </div>
                    ))}
                </div>

                {/* Payment Methods */}
                <div style={{
                    marginTop: '50px',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s ease 0.6s',
                }}>
                    <p style={{
                        color: '#999',
                        fontSize: '0.85rem',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        Secure Payment Methods
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        opacity: 0.6,
                        fontSize: '2rem',
                    }}>
                        <span>💳</span>
                        <span>🏦</span>
                        <span>📱</span>
                        <span>🔒</span>
                    </div>
                </div>

                {/* Final Trust Line */}
                <p style={{
                    marginTop: '40px',
                    color: '#888',
                    fontSize: '0.9rem',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s ease 0.7s',
                }}>
                    ⭐ Rated 4.9/5 by 50,000+ happy customers
                </p>
            </div>
        </div>
    );
};

export default FinalCTASection;

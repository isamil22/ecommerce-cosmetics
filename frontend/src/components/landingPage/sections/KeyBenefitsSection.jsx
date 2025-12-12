import React, { useEffect, useState, useRef } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * Premium Key Benefits Section
 * Beautiful benefit cards with animations and modern design
 */
const KeyBenefitsSection = ({ data, availableVariants, productId }) => {
    const {
        title = 'Why Choose Us?',
        subtitle = 'Here are the key benefits of our product',
        benefits = [
            { icon: '💎', title: 'Premium Quality', description: 'Made with the finest ingredients' },
            { icon: '⚡', title: 'Fast Results', description: 'See results in just 7 days' },
            { icon: '🌿', title: 'Natural Formula', description: '100% natural and organic' },
        ],
        backgroundColor = '#ffffff',
        columns = 3,
    } = data || {};

    // Merge section variants with global available variants for the CTA
    const ctaData = {
        ...data,
        variants: data?.variants || availableVariants || []
    };

    const handleCTA = useLandingPageCTA(productId, ctaData);

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const gridColumns = {
        2: 'repeat(auto-fit, minmax(350px, 1fr))',
        3: 'repeat(auto-fit, minmax(300px, 1fr))',
        4: 'repeat(auto-fit, minmax(250px, 1fr))',
    };

    const getBackground = () => {
        switch (data.backgroundStyle) {
            case 'gradient-pink':
                return 'linear-gradient(135deg, #FFF0F5 0%, #ffffff 50%, #E6E6FA 100%)';
            case 'gradient-blue':
                return 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #e6e6fa 100%)';
            case 'gradient-gold':
                return 'linear-gradient(135deg, #fffdf2 0%, #ffffff 50%, #fff5e6 100%)';
            case 'luxury':
                return 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f3f3f3 100%)';
            default:
                return backgroundColor === '#ffffff'
                    ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)'
                    : backgroundColor;
        }
    };

    return (
        <div
            ref={sectionRef}
            style={{
                background: getBackground(),
                padding: '100px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Ambient Orbs for Pro Look */}
            {data.backgroundStyle && data.backgroundStyle.includes('gradient') && (
                <>
                    <div style={{
                        position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                        filter: 'blur(60px)', pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                        filter: 'blur(60px)', pointerEvents: 'none'
                    }} />
                </>
            )}

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Section Header */}
                <div style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        color: '#222',
                        lineHeight: '1.2',
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        color: '#666',
                        marginBottom: '4rem',
                        maxWidth: '600px',
                        margin: '0 auto 4rem',
                        lineHeight: '1.6',
                    }}>
                        {subtitle}
                    </p>
                </div>

                {/* Benefits Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns[columns] || gridColumns[3],
                    gap: data.layout === 'ingredients' ? '50px' : '30px',
                }}>
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            style={(data.layout === 'ingredients' || data.layout === 'steps') ? {
                                textAlign: 'center',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: `${0.1 * index}s`,
                                position: 'relative', // Needed for steps absolute positioning
                            } : {
                                padding: '45px 35px',
                                background: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.03)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'default',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                                transitionDelay: `${0.1 * index}s`,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={(e) => {
                                if (data.layout === 'ingredients') {
                                    e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                                    e.currentTarget.querySelector('img').style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                                } else if (data.layout === 'steps') {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                } else {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(255,105,180,0.15)';
                                    e.currentTarget.querySelector('.benefit-icon').style.transform = 'scale(1.1) rotate(5deg)';
                                    e.currentTarget.querySelector('.benefit-glow').style.opacity = '1';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (data.layout === 'ingredients') {
                                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                                    e.currentTarget.querySelector('img').style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                } else if (data.layout === 'steps') {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                } else {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                                    e.currentTarget.querySelector('.benefit-icon').style.transform = 'scale(1) rotate(0deg)';
                                    e.currentTarget.querySelector('.benefit-glow').style.opacity = '0';
                                }
                            }}
                        >
                            {/* Pro Ingredients Layout */}
                            {data.layout === 'ingredients' ? (
                                <>
                                    <div style={{
                                        position: 'relative',
                                        width: '180px',
                                        height: '180px',
                                        margin: '0 auto 25px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '4px solid #fff',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    }}>
                                        <img
                                            src={benefit.image || '/placeholder-image.jpg'}
                                            alt={benefit.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'all 0.5s ease',
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100"/><text fill="%23999" font-family="Arial" font-size="12" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>';
                                            }}
                                        />
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        marginBottom: '10px',
                                        color: '#222',
                                    }}>{benefit.title}</h3>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#666',
                                        lineHeight: '1.6',
                                    }}>{benefit.description}</p>
                                </>
                            ) : data.layout === 'steps' ? (
                                /* Process/Steps Layout */
                                <>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '40px',
                                        height: '40px',
                                        background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        boxShadow: '0 4px 10px rgba(255, 105, 180, 0.4)',
                                        zIndex: 2,
                                    }}>
                                        {index + 1}
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        {benefit.icon && (
                                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{benefit.icon}</div>
                                        )}
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                                            {benefit.title}
                                        </h3>
                                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                                            {benefit.description}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Standard Benefit Layout */}
                                    <div
                                        className="benefit-glow"
                                        style={{
                                            position: 'absolute',
                                            top: '-50%',
                                            left: '-50%',
                                            width: '200%',
                                            height: '200%',
                                            background: 'radial-gradient(circle at center, rgba(255,105,180,0.1) 0%, transparent 50%)',
                                            opacity: 0,
                                            transition: 'opacity 0.4s ease',
                                            pointerEvents: 'none',
                                        }}
                                    />

                                    <div
                                        className="benefit-icon"
                                        style={{
                                            width: '90px',
                                            height: '90px',
                                            margin: '0 auto 25px',
                                            background: 'linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(147,112,219,0.1) 100%)',
                                            borderRadius: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2.8rem',
                                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    >
                                        {benefit.icon}
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '700',
                                        marginBottom: '15px',
                                        color: '#222',
                                        position: 'relative',
                                    }}>
                                        {benefit.title}
                                    </h3>

                                    <p style={{
                                        fontSize: '1rem',
                                        color: '#666',
                                        lineHeight: '1.7',
                                        margin: 0,
                                        position: 'relative',
                                    }}>
                                        {benefit.description}
                                    </p>

                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '60px',
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #ff69b4, #9370db)',
                                        borderRadius: '4px 4px 0 0',
                                    }} />
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div style={{
                    marginTop: '60px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.5s',
                }}>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        marginBottom: '20px',
                    }}>
                        Ready to experience the difference?
                    </p>
                    <a
                        href="#order"
                        onClick={handleCTA}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#ff69b4',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.gap = '15px';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.gap = '8px';
                        }}
                    >
                        Get Started Today <span>→</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default KeyBenefitsSection;

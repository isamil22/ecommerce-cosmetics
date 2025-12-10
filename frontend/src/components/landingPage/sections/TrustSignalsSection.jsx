import React, { useEffect, useState, useRef } from 'react';

/**
 * Premium Trust Signals Section Component
 * Animated trust badges with counters and modern design
 */
const TrustSignalsSection = ({ data }) => {
    const {
        badges = [
            { icon: '🏆', text: 'Award Winning', subtext: 'Best Product 2024' },
            { icon: '✓', text: '100% Guaranteed', subtext: '30-Day Money Back' },
            { icon: '⭐', text: '50,000+ Reviews', subtext: '4.9 Average Rating' },
            { icon: '🚚', text: 'Free Shipping', subtext: 'On Orders $50+' },
        ],
        backgroundColor = '#ffffff',
        // New premium options
        showStats = true,
        stats = [
            { number: '50K+', label: 'Happy Customers' },
            { number: '4.9', label: 'Star Rating' },
            { number: '30', label: 'Day Guarantee' },
            { number: '24/7', label: 'Support' },
        ],
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
                    ? 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)'
                    : backgroundColor,
                padding: '80px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,105,180,0.3), transparent)',
            }} />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                {/* Stats Counter Section */}
                {showStats && stats && stats.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '40px',
                        marginBottom: '60px',
                        textAlign: 'center',
                    }}>
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                                }}
                            >
                                <div style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, #ff69b4 0%, #9370db 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '8px',
                                }}>
                                    {stat.number}
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: '#666',
                                    fontWeight: '500',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Trust Badges */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '25px',
                }}>
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign: 'center',
                                padding: '35px 25px',
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'default',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                transitionDelay: `${0.1 * index}s`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,105,180,0.15)';
                                e.currentTarget.style.borderColor = 'rgba(255,105,180,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                            }}
                        >
                            {/* Icon Container */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto 20px',
                                background: 'linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(147,112,219,0.1) 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                            }}>
                                {badge.icon}
                            </div>
                            
                            {/* Badge Text */}
                            <h3 style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: '#333',
                                margin: '0 0 8px 0',
                            }}>
                                {badge.text}
                            </h3>
                            
                            {/* Subtext */}
                            {badge.subtext && (
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: '#888',
                                    margin: 0,
                                }}>
                                    {badge.subtext}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Featured In / As Seen On */}
                <div style={{
                    marginTop: '60px',
                    textAlign: 'center',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.4s',
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        color: '#999',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '25px',
                    }}>
                        Trusted by thousands of happy customers
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '40px',
                        flexWrap: 'wrap',
                        opacity: 0.4,
                        filter: 'grayscale(100%)',
                    }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Forbes</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Vogue</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Elle</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>GQ</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Cosmopolitan</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustSignalsSection;

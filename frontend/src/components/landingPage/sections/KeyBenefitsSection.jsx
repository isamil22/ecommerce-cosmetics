import React, { useEffect, useState, useRef } from 'react';

/**
 * Premium Key Benefits Section
 * Beautiful benefit cards with animations and modern design
 */
const KeyBenefitsSection = ({ data }) => {
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

    return (
        <div 
            ref={sectionRef}
            style={{
                background: backgroundColor === '#ffffff' 
                    ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)'
                    : backgroundColor,
                padding: '100px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,105,180,0.05) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 50%, rgba(147,112,219,0.05) 0%, transparent 50%)`,
                pointerEvents: 'none',
            }} />

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
                    gap: '30px',
                }}>
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            style={{
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
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(255,105,180,0.15)';
                                e.currentTarget.querySelector('.benefit-icon').style.transform = 'scale(1.1) rotate(5deg)';
                                e.currentTarget.querySelector('.benefit-glow').style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                                e.currentTarget.querySelector('.benefit-icon').style.transform = 'scale(1) rotate(0deg)';
                                e.currentTarget.querySelector('.benefit-glow').style.opacity = '0';
                            }}
                        >
                            {/* Hover Glow Effect */}
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

                            {/* Icon */}
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

                            {/* Title */}
                            <h3 style={{
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                marginBottom: '15px',
                                color: '#222',
                                position: 'relative',
                            }}>
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontSize: '1rem',
                                color: '#666',
                                lineHeight: '1.7',
                                margin: 0,
                                position: 'relative',
                            }}>
                                {benefit.description}
                            </p>

                            {/* Bottom Accent Line */}
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
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#ff69b4',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
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

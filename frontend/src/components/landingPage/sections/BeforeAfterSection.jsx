import React, { useState, useEffect, useRef } from 'react';

/**
 * Premium Before/After Section Component
 * Interactive before and after comparison with slider
 */
const BeforeAfterSection = ({ data }) => {
    const {
        title = 'See The Transformation',
        subtitle = 'Real results from real customers',
        comparisons = [],
        backgroundColor = '#ffffff',
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

    if (!comparisons.length) {
        return null;
    }

    return (
        <section 
            ref={sectionRef}
            style={{
                background: backgroundColor === '#ffffff' 
                    ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
                    : backgroundColor,
                padding: '100px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(255,105,180,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Header */}
                {(title || subtitle) && (
                    <div style={{ 
                        textAlign: 'center', 
                        marginBottom: '60px',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(147,112,219,0.1) 100%)',
                            color: '#ff69b4',
                            padding: '8px 20px',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '20px',
                        }}>
                            ✨ Real Results
                        </div>
                        {title && (
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: '800',
                                marginBottom: '1rem',
                                color: '#222',
                            }}>
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p style={{
                                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                                color: '#666',
                                maxWidth: '600px',
                                margin: '0 auto',
                            }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Comparisons Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: comparisons.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))',
                    gap: '40px',
                }}>
                    {comparisons.map((comparison, index) => (
                        <ComparisonCard 
                            key={index} 
                            comparison={comparison} 
                            index={index}
                            isVisible={isVisible}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '60px',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s ease 0.5s',
                }}>
                    <p style={{
                        color: '#666',
                        marginBottom: '15px',
                    }}>
                        Ready to see your own transformation?
                    </p>
                    <a
                        href="#order"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                            color: 'white',
                            padding: '16px 35px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: '700',
                            boxShadow: '0 8px 25px rgba(255,105,180,0.35)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 12px 35px rgba(255,105,180,0.45)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 25px rgba(255,105,180,0.35)';
                        }}
                    >
                        Start Your Transformation →
                    </a>
                </div>
            </div>
        </section>
    );
};

// Interactive Comparison Card with Slider
const ComparisonCard = ({ comparison, index, isVisible }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleMove);
            document.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        return url.startsWith('http') ? url : `${window.location.origin}${url}`;
    };

    const beforeUrl = getImageUrl(comparison.beforeImage);
    const afterUrl = getImageUrl(comparison.afterImage);

    return (
        <div 
            style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`,
            }}
        >
            {/* Interactive Comparison Container */}
            <div 
                ref={containerRef}
                style={{
                    position: 'relative',
                    height: '400px',
                    cursor: 'ew-resize',
                    userSelect: 'none',
                    overflow: 'hidden',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* After Image (Full) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: afterUrl ? `url(${afterUrl})` : '#d4edda',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    {!afterUrl && (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#155724',
                            fontSize: '1.2rem',
                        }}>
                            📷 After Image
                        </div>
                    )}
                </div>

                {/* Before Image (Clipped) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: beforeUrl ? `url(${beforeUrl})` : '#f8d7da',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}>
                    {!beforeUrl && (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#721c24',
                            fontSize: '1.2rem',
                        }}>
                            📷 Before Image
                        </div>
                    )}
                </div>

                {/* Slider Handle */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${sliderPosition}%`,
                    transform: 'translateX(-50%)',
                    width: '4px',
                    background: 'white',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    zIndex: 10,
                }}>
                    {/* Handle Button */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'ew-resize',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: '#ff69b4',
                            fontWeight: 'bold',
                        }}>
                            <span style={{ fontSize: '1rem' }}>◀</span>
                            <span style={{ fontSize: '1rem' }}>▶</span>
                        </div>
                    </div>
                </div>

                {/* Labels */}
                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    zIndex: 5,
                }}>
                    {comparison.beforeLabel || 'Before'}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    zIndex: 5,
                }}>
                    {comparison.afterLabel || 'After'}
                </div>

                {/* Drag Hint */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '6px 15px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    opacity: isDragging ? 0 : 0.8,
                    transition: 'opacity 0.3s ease',
                }}>
                    ← Drag to compare →
                </div>
            </div>

            {/* Caption */}
            {comparison.caption && (
                <div style={{
                    padding: '25px 30px',
                    textAlign: 'center',
                    borderTop: '1px solid #f0f0f0',
                    background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
                }}>
                    <p style={{
                        margin: 0,
                        color: '#444',
                        fontSize: '1.05rem',
                        lineHeight: '1.6',
                    }}>
                        <span style={{ 
                            color: '#ff69b4', 
                            fontWeight: '600',
                            marginRight: '8px',
                        }}>✨</span>
                        {comparison.caption}
                    </p>
                    {comparison.timeframe && (
                        <p style={{
                            margin: '10px 0 0 0',
                            color: '#888',
                            fontSize: '0.9rem',
                        }}>
                            Results after {comparison.timeframe}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BeforeAfterSection;

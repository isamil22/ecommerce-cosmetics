import React, { useRef, useState, useEffect } from 'react';

/**
 * Zig-Zag Features Section
 * Displays content in an alternating grid layout with premium scroll animations
 */
const FeaturesZigZagSection = ({ data }) => {
    const {
        features = [],
        backgroundColor = '#ffffff',
        textColor = '#333333'
    } = data || {};

    return (
        <div style={{ backgroundColor, padding: '0', overflow: 'hidden' }} className="features-zigzag-section">

            <style>{`
                .features-zigzag-section .feature-row {
                    display: flex;
                    align-items: center;
                    min-height: 60vh;
                    flex-wrap: wrap;
                    opacity: 0;
                    transform: translateY(50px);
                    transition: opacity 1s ease-out, transform 1s ease-out;
                }
                
                .features-zigzag-section .feature-row.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .features-zigzag-section .feature-image-side {
                    flex: 1;
                    min-width: 350px;
                    height: 70vh;
                    min-height: 500px;
                    position: relative;
                    overflow: hidden;
                    opacity: 0;
                    border-radius: 30px !important;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
                }
                
                .features-zigzag-section .feature-text-side {
                    flex: 1;
                    min-width: 350px;
                    padding: 50px 60px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: right; /* Default to Right for Arabic */
                    align-items: flex-end; /* Align items to right */
                    direction: rtl; /* Enforce RTL */
                    opacity: 0;
                    transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
                }

                .features-zigzag-section .feature-row.is-visible .feature-image-side,
                .features-zigzag-section .feature-row.is-visible .feature-text-side {
                    opacity: 1;
                    transform: translateX(0) !important;
                }

                .features-zigzag-section .feature-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    border-radius: 30px !important;
                    transition: transform 10s ease;
                    transform: scale(1.2);
                }

                .features-zigzag-section .feature-row.is-visible .feature-image {
                    transform: scale(1.05);
                }

                .features-zigzag-section .feature-title {
                    font-size: clamp(2rem, 4vw, 3.5rem);
                    font-weight: 800;
                    margin-bottom: 18px;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                }

                .features-zigzag-section .feature-divider {
                    width: 60px;
                    height: 4px;
                    background: linear-gradient(to right, #ff69b4, #ff1493);
                    margin-bottom: 20px;
                    transform-origin: right; /* Transform from right for RTL */
                    margin-left: auto; /* Align to right */
                    margin-right: 0;
                    transform: scaleX(0);
                    transition: transform 1s ease 0.8s;
                }

                .features-zigzag-section .feature-row.is-visible .feature-divider {
                    transform: scaleX(1);
                }

                .features-zigzag-section .feature-description {
                    font-size: 1.1rem;
                    line-height: 1.5;
                    opacity: 0.8;
                    max-width: 550px;
                    white-space: pre-line;
                }

                /* Tablet & Mobile Styles */
                @media (max-width: 991px) {
                    .features-zigzag-section .feature-row {
                        flex-direction: column !important;
                        min-height: auto;
                        padding-bottom: 40px;
                    }
                    
                    .features-zigzag-section .feature-image-side,
                    .features-zigzag-section .feature-text-side {
                        width: 100%;
                        flex: none;
                        min-width: 0;
                    }

                    .features-zigzag-section .feature-image-side {
                        height: 50vh;
                        min-height: 300px;
                        max-height: 500px;
                    }

                    .features-zigzag-section .feature-text-side {
                        padding: 50px 30px;
                        align-items: flex-end; /* Right align on tablet */
                        text-align: right;
                    }
                    
                    .features-zigzag-section .feature-title {
                        font-size: 2.25rem;
                        margin-bottom: 20px;
                    }

                    .features-zigzag-section .feature-divider {
                        margin: 0 0 25px auto;
                    }

                    .features-zigzag-section .feature-description {
                        margin: 0 0 0 auto;
                        font-size: 1.1rem;
                    }
                }

                /* Mobile Optimization */
                @media (max-width: 640px) {
                    .features-zigzag-section .feature-row {
                        flex-direction: column !important;
                        padding-bottom: 30px;
                    }

                    .features-zigzag-section .feature-image-side {
                        height: 280px;
                        min-height: 200px;
                        width: 100% !important;
                        flex: none !important;
                    }

                    .features-zigzag-section .feature-text-side {
                        padding: 15px 20px 25px;
                        text-align: right;
                        align-items: flex-end;
                        direction: rtl;
                        width: 100% !important;
                        flex: none !important;
                    }

                    .features-zigzag-section .feature-title {
                        font-size: 1.5rem;
                        margin-bottom: 12px;
                        line-height: 1.2;
                    }
                    
                    .features-zigzag-section .feature-description {
                        font-size: 0.95rem;
                        line-height: 1.45;
                        margin-right: 0;
                        margin-left: 0;
                    }

                    .features-zigzag-section .feature-divider {
                        margin: 0 0 15px auto;
                        height: 3px;
                    }
                }
            `}</style>

            {features.map((feature, index) => (
                <FeatureRow
                    key={index}
                    feature={feature}
                    index={index}
                    textColor={textColor}
                />
            ))}

            {features.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
                    لم يتم إضافة محتوى المميزات بعد.
                </div>
            )}
        </div>
    );
};

// Separated Row Component to handle individual Intersection Observer logic
const FeatureRow = ({ feature, index, textColor }) => {
    const isImageLeft = index % 2 === 0;
    const [isVisible, setIsVisible] = useState(false);
    const rowRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger when 20% of the item is visible
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Animate only once
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        if (rowRef.current) {
            observer.observe(rowRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Initial transform values for sliding direction
    const slideImageStart = isImageLeft ? 'translateX(-50px)' : 'translateX(50px)';
    const slideTextStart = isImageLeft ? 'translateX(50px)' : 'translateX(-50px)';

    return (
        <div
            ref={rowRef}
            className={`feature-row ${isVisible ? 'is-visible' : ''}`}
            style={{
                flexDirection: isImageLeft ? 'row' : 'row-reverse',
            }}
        >
            {/* IMAGE SIDE */}
            <div
                className="feature-image-side"
                style={{
                    borderRadius: '30px', /* Force inline style for shadow shape */
                    transform: isVisible ? 'none' : slideImageStart,
                    overflow: 'visible' /* Let the inner mask handle clipping */
                }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    transform: 'translateZ(0)', /* Force GPU layer for clipping mask */
                    isolation: 'isolate'
                }}>
                    {feature.image ? (
                        <img
                            src={feature.image}
                            alt={feature.title}
                            className="feature-image"
                            style={{ borderRadius: '30px' }} /* Keep just in case */
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ccc',
                            fontSize: '1.2rem',
                            borderRadius: '30px'
                        }}>
                            صورة توضيحية
                        </div>
                    )}
                </div>
            </div>

            {/* TEXT SIDE */}
            <div
                className="feature-text-side"
                style={{
                    transform: isVisible ? 'none' : slideTextStart
                }}
            >
                <h2 className="feature-title" style={{ color: textColor }}>
                    {feature.title}
                </h2>
                <div className="feature-divider" />
                <div
                    className="feature-description"
                    style={{ color: textColor }}
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                />
            </div>
        </div>
    );
};

export default FeaturesZigZagSection;

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
                    min-height: 80vh;
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
                    transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
                }
                
                .features-zigzag-section .feature-text-side {
                    flex: 1;
                    min-width: 350px;
                    padding: 80px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: left;
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
                    transition: transform 10s ease;
                    transform: scale(1.2);
                }

                .features-zigzag-section .feature-row.is-visible .feature-image {
                    transform: scale(1.05);
                }

                .features-zigzag-section .feature-title {
                    font-size: clamp(2.5rem, 4vw, 3.5rem);
                    font-weight: 800;
                    margin-bottom: 25px;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                }

                .features-zigzag-section .feature-divider {
                    width: 60px;
                    height: 4px;
                    background: linear-gradient(to right, #ff69b4, #ff1493);
                    margin-bottom: 30px;
                    transform-origin: left;
                    transform: scaleX(0);
                    transition: transform 1s ease 0.8s;
                }

                .features-zigzag-section .feature-row.is-visible .feature-divider {
                    transform: scaleX(1);
                }

                .features-zigzag-section .feature-description {
                    font-size: 1.2rem;
                    line-height: 1.8;
                    opacity: 0.8;
                    max-width: 550px;
                }

                /* Responsive Styles */
                @media (max-width: 991px) {
                    .features-zigzag-section .feature-row {
                        flex-direction: column !important;
                        min-height: auto;
                        padding-bottom: 60px;
                    }
                    
                    .features-zigzag-section .feature-image-side,
                    .features-zigzag-section .feature-text-side {
                        width: 100%;
                        flex: none;
                        min-width: 0;
                    }

                    .features-zigzag-section .feature-image-side {
                        height: 400px;
                        min-height: 300px;
                    }

                    .features-zigzag-section .feature-text-side {
                        padding: 40px 20px;
                        align-items: center; /* Center text on mobile if desired, or keep left */
                        text-align: center;
                    }
                    
                    .features-zigzag-section .feature-title {
                        font-size: 2.5rem;
                    }

                    .features-zigzag-section .feature-divider {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .features-zigzag-section .feature-description {
                        margin-left: auto;
                        margin-right: auto;
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
                    No features content added yet.
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
                    transform: isVisible ? 'none' : slideImageStart
                }}
            >
                {feature.image ? (
                    <img
                        src={feature.image}
                        alt={feature.title}
                        className="feature-image"
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
                    }}>
                        Image Placeholder
                    </div>
                )}
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
                <p className="feature-description" style={{ color: textColor }}>
                    {feature.description}
                </p>
            </div>
        </div>
    );
};

export default FeaturesZigZagSection;

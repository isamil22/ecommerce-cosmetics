import React from 'react';

/**
 * Zig-Zag Features Section
 * Displays content in an alternating grid layout (Image Left/Text Right -> Text Left/Image Right)
 * Premium, minimalist aesthetic.
 */
const FeaturesZigZagSection = ({ data }) => {
    const {
        features = [],
        backgroundColor = '#ffffff',
        textColor = '#333333'
    } = data || {};

    return (
        <div style={{ backgroundColor, padding: '80px 0', overflow: 'hidden' }}>
            {features.map((feature, index) => {
                // Alternating layout: Even index = Image Left, Odd index = Image Right
                const isImageLeft = index % 2 === 0;

                return (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: isImageLeft ? 'row' : 'row-reverse',
                            alignItems: 'center',
                            minHeight: '600px', // Large, immersive rows
                            flexWrap: 'wrap' // Stack on mobile
                        }}
                    >
                        {/* IMAGE SIDE */}
                        <div style={{
                            flex: 1,
                            minWidth: '350px',
                            height: '600px',
                            display: 'flex'
                        }}>
                            {feature.image ? (
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#aaa',
                                    fontSize: '1.2rem',
                                    border: '1px dashed #ddd'
                                }}>
                                    Image Placeholder
                                </div>
                            )}
                        </div>

                        {/* TEXT SIDE */}
                        <div style={{
                            flex: 1,
                            minWidth: '350px',
                            padding: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            textAlign: 'left'
                        }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '20px',
                                color: textColor,
                                lineHeight: '1.2'
                            }}>
                                {feature.title}
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: textColor,
                                opacity: 0.8,
                                maxWidth: '500px'
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    </div>
                );
            })}

            {features.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No features content added yet.
                </div>
            )}

            {/* Mobile Responsiveness */}
            <style>{`
                @media (max-width: 768px) {
                    div[style*="flex-direction: row"],
                    div[style*="flex-direction: row-reverse"] {
                        flex-direction: column !important;
                        height: auto !important;
                    }
                    div[style*="min-height: 600px"] {
                        min-height: auto !important;
                    }
                    div[style*="height: 600px"] {
                        height: 350px !important;
                    }
                    div[style*="padding: 60px"] {
                        padding: 40px 20px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default FeaturesZigZagSection;

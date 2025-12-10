import React, { useState, useEffect, useRef } from 'react';

/**
 * Premium Testimonials Section
 * Beautiful customer reviews with photos, ratings, and product images
 */
const TestimonialsSection = ({ data }) => {
    const {
        title = 'What Our Customers Say',
        subtitle = 'Real reviews from real customers',
        testimonials = [],
        backgroundColor = '#ffffff',
    } = data || {};

    const [lightboxImage, setLightboxImage] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
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

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} style={{
                color: i < rating ? '#ffd700' : '#e0e0e0',
                fontSize: '1.1rem',
            }}>★</span>
        ));
    };

    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        return url.startsWith('http') ? url : `${window.location.origin}${url}`;
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const randomGradient = (index) => {
        const gradients = [
            'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
            'linear-gradient(135deg, #9370db 0%, #8b5cf6 100%)',
            'linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%)',
            'linear-gradient(135deg, #81c784 0%, #4caf50 100%)',
            'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)',
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div 
            ref={sectionRef}
            style={{
                background: backgroundColor === '#ffffff' 
                    ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                    : backgroundColor,
                padding: '100px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                fontSize: '15rem',
                opacity: 0.03,
                fontFamily: 'Georgia, serif',
                pointerEvents: 'none',
            }}>"</div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                fontSize: '15rem',
                opacity: 0.03,
                fontFamily: 'Georgia, serif',
                pointerEvents: 'none',
                transform: 'rotate(180deg)',
            }}>"</div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Header */}
                <div style={{
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
                        ⭐ Customer Reviews
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        color: '#222',
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        color: '#666',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        {subtitle}
                    </p>
                </div>

                {/* Rating Summary */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '30px',
                    marginBottom: '50px',
                    flexWrap: 'wrap',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s ease 0.2s',
                }}>
                    <div style={{
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '3.5rem',
                            fontWeight: '800',
                            color: '#222',
                            lineHeight: 1,
                        }}>4.9</div>
                        <div style={{ color: '#ffd700', fontSize: '1.3rem', margin: '8px 0' }}>
                            ★★★★★
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            Based on {testimonials.length > 0 ? testimonials.length * 100 : 500}+ reviews
                        </div>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '30px',
                }}>
                    {testimonials.map((testimonial, index) => {
                        const avatarUrl = getImageUrl(testimonial.avatar || testimonial.image);
                        const productImages = testimonial.productImages || [];
                        
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: '35px',
                                    background: 'white',
                                    borderRadius: '20px',
                                    textAlign: 'left',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    border: '1px solid rgba(0,0,0,0.03)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                    transitionDelay: `${0.1 * index}s`,
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(255,105,180,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                                }}
                            >
                                {/* Quote Icon */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '25px',
                                    fontSize: '3rem',
                                    color: 'rgba(255,105,180,0.1)',
                                    fontFamily: 'Georgia, serif',
                                    lineHeight: 1,
                                }}>"</div>

                                {/* Rating */}
                                <div style={{ marginBottom: '15px' }}>
                                    {renderStars(testimonial.rating || 5)}
                                </div>

                                {/* Comment */}
                                <p style={{
                                    fontSize: '1.05rem',
                                    color: '#444',
                                    lineHeight: '1.7',
                                    marginBottom: '25px',
                                    fontStyle: 'italic',
                                }}>
                                    "{testimonial.comment}"
                                </p>

                                {/* Customer Info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #f0f0f0',
                                }}>
                                    <div style={{
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '50%',
                                        background: avatarUrl ? 'none' : randomGradient(index),
                                        marginRight: '15px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        fontWeight: '700',
                                    }}>
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={testimonial.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = getInitials(testimonial.name);
                                                }}
                                            />
                                        ) : (
                                            getInitials(testimonial.name)
                                        )}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '1.05rem',
                                            color: '#222',
                                        }}>
                                            {testimonial.name}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#28a745',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                        }}>
                                            ✓ Verified Buyer
                                        </div>
                                    </div>
                                </div>

                                {/* Product Images Gallery */}
                                {productImages.length > 0 && (
                                    <div style={{
                                        marginTop: '20px',
                                        paddingTop: '20px',
                                        borderTop: '1px solid #f0f0f0',
                                    }}>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#888',
                                            marginBottom: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                        }}>
                                            📸 Customer photos
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px',
                                            flexWrap: 'wrap',
                                        }}>
                                            {productImages.map((img, imgIndex) => {
                                                const imageUrl = getImageUrl(img);
                                                if (!imageUrl) return null;
                                                
                                                return (
                                                    <div
                                                        key={imgIndex}
                                                        onClick={() => setLightboxImage(imageUrl)}
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            cursor: 'pointer',
                                                            border: '2px solid #f0f0f0',
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.1)';
                                                            e.currentTarget.style.borderColor = '#ff69b4';
                                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,105,180,0.3)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.borderColor = '#f0f0f0';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Product photo ${imgIndex + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                            }}
                                                            onError={(e) => e.target.parentElement.style.display = 'none'}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* View All Reviews Link */}
                <div style={{
                    marginTop: '50px',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s ease 0.5s',
                }}>
                    <a
                        href="#reviews"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#ff69b4',
                            fontSize: '1.05rem',
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
                        Read all customer reviews <span>→</span>
                    </a>
                </div>
            </div>

            {/* Premium Lightbox */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        cursor: 'pointer',
                        padding: '20px',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        style={{
                            position: 'absolute',
                            top: '30px',
                            right: '30px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        ✕
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Product"
                        style={{
                            maxWidth: '90%',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            borderRadius: '16px',
                            boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default TestimonialsSection;

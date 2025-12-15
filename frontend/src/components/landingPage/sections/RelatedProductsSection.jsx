import React, { useEffect, useState, useRef } from 'react';
import { useLandingPageAddToCart } from '../LandingPageCTAHandler';
import { getProductById } from '../../../api/apiService';
import { useNavigate } from 'react-router-dom';

const RelatedProductsSection = ({ data, productId, availableVariants, fetchCartCount }) => {
    const {
        title = 'You Might Also Like',
        subtitle = 'Perfect additions to your routine',
        productIds = [],
        backgroundColor = '#ffffff', // Default to white for premium feel, or blend with gradient
    } = data || {};

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!productIds || productIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const productPromises = productIds.map(id => getProductById(id));
                const responses = await Promise.all(productPromises);
                const fetchedProducts = responses.map(res => res.data).filter(p => p);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [productIds]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <div
            ref={sectionRef}
            style={{
                padding: '100px 20px',
                background: backgroundColor === '#f9f9f9' || backgroundColor === '#ffffff'
                    ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                    : backgroundColor,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative Background Blob */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                maxWidth: '1200px',
                background: 'radial-gradient(circle at center, rgba(255,105,180,0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.8s ease-out'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        color: '#222',
                        marginBottom: '10px',
                        letterSpacing: '-0.5px'
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#666',
                        marginBottom: '60px',
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.6'
                    }}>
                        {subtitle}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    justifyContent: 'center'
                }}>
                    {loading ? (
                        <p>Loading recommendations...</p>
                    ) : (
                        products.map((product, index) => (
                            <RelatedProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                currentLandingPageProductId={productId}
                                fetchCartCount={fetchCartCount}
                                isSectionVisible={isVisible}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Sub-component for individual card with Variant Logic
const RelatedProductCard = ({ product, index, currentLandingPageProductId, fetchCartCount, isSectionVisible }) => {
    const navigate = useNavigate();
    const handleAddToCart = useLandingPageAddToCart(product.id, null, fetchCartCount);
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = product.images && product.images[0]
        ? (product.images[0].startsWith('http') ? product.images[0] : `${window.location.origin}${product.images[0]}`)
        : '/placeholder.png';

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        handleAddToCart(e);
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.04)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            border: '1px solid rgba(0,0,0,0.03)',
            transform: isHovered ? 'translateY(-10px)' : (isSectionVisible ? 'translateY(0)' : 'translateY(50px)'),
            height: '100%',
            opacity: isSectionVisible ? 1 : 0,
            transitionDelay: `${index * 0.15}s` // Dynamic stagger
        }}
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ height: '320px', overflow: 'hidden', position: 'relative', backgroundColor: '#f8f9fa' }}>
                <img
                    src={imageUrl}
                    alt={product.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                    }}
                />
                {/* Overlay Gradient on Hover */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 100%)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s ease'
                }} />
            </div>

            <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#222',
                    lineHeight: '1.3'
                }}>
                    {product.name}
                </h3>
                <div style={{
                    fontSize: '1.4rem',
                    color: '#ff69b4',
                    fontWeight: '800',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    ${product.price}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <button
                        onClick={handleButtonClick}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isHovered
                                ? 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)'
                                : 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: isHovered ? '0 10px 20px rgba(255,105,180,0.3)' : '0 5px 15px rgba(255,105,180,0.2)',
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        Add to Cart
                        <span style={{ fontSize: '1.2rem', lineHeight: 0, marginBottom: '2px' }}>+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RelatedProductsSection;

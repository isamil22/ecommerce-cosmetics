import React, { useEffect, useState, useRef } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * Premium Key Benefits Section
 * Beautiful benefit cards with animations and modern design
 */
const KeyBenefitsSection = ({ data, availableVariants, productId }) => {
    const {
        title: dbTitle,
        subtitle: dbSubtitle,
        benefits: dbBenefits,
        backgroundColor = '#ffffff',
        columns = 3,
    } = data || {};

    const title = (!dbTitle || dbTitle === 'Why Choose Us?') ? 'لماذا تختاريننا؟' : dbTitle;
    const subtitle = (!dbSubtitle || dbSubtitle === 'Here are the key benefits of our product') ? 'إليك الفوائد الرئيسية لمنتجنا' : dbSubtitle;

    const benefits = (dbBenefits || []).map(b => {
        if (b.title === 'Premium Quality') return { ...b, title: 'جودة ممتازة', description: 'مصنوع من أجود المكونات' };
        if (b.title === 'Fast Results') return { ...b, title: 'نتائج سريعة', description: 'لاحظي الفرق في 7 أيام فقط' };
        if (b.title === 'Natural Formula') return { ...b, title: 'تركيبة طبيعية', description: 'طبيعي وعضوي 100%' };
        return b;
    });

    const finalBenefits = (benefits && benefits.length > 0) ? benefits : [
        { icon: '💎', title: 'جودة ممتازة', description: 'مصنوع من أجود المكونات' },
        { icon: '⚡', title: 'نتائج سريعة', description: 'لاحظي الفرق في 7 أيام فقط' },
        { icon: '🌿', title: 'تركيبة طبيعية', description: 'طبيعي وعضوي 100%' },
    ];

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

    const getBackground = () => {
        // Enforce simple white background as requested by user
        return '#ffffff';
    };

    return (
        <div
            ref={sectionRef}
            className="key-benefits-section"
            style={{
                background: getBackground(),
            }}
        >
            <style>{`
                .key-benefits-section {
                    padding: 100px 20px;
                    position: relative;
                    overflow: hidden;
                }

                .key-benefits-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }

                .section-header {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .section-header.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .section-title {
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: #222;
                    line-height: 1.2;
                }

                .section-subtitle {
                    font-size: clamp(1rem, 2vw, 1.2rem);
                    color: #666;
                    margin: 0 auto 4rem;
                    max-width: 600px;
                    line-height: 1.6;
                }

                .benefits-grid {
                    display: grid;
                    gap: 30px;
                    grid-template-columns: repeat(3, 1fr); /* Default desktop */
                }

                .benefits-grid.columns-2 { grid-template-columns: repeat(2, 1fr); }
                .benefits-grid.columns-3 { grid-template-columns: repeat(3, 1fr); }
                .benefits-grid.columns-4 { grid-template-columns: repeat(4, 1fr); }

                .benefit-card {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .benefit-card.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Standard Card Style */
                .benefit-card.style-standard {
                    padding: 45px 35px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.03);
                    overflow: hidden;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
                }

                .benefit-card.style-standard:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 50px rgba(255,105,180,0.15);
                }

                /* Ingredients Style */
                .benefit-card.style-ingredients {
                    text-align: center;
                }

                .ingredient-img-wrapper {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    margin: 0 auto 25px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 4px solid #fff;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }
                
                .ingredient-img-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .benefit-card.style-ingredients:hover .ingredient-img-wrapper img {
                    transform: scale(1.1);
                }

                /* Steps Style */
                .benefit-card.style-steps {
                    text-align: center;
                    position: relative;
                    padding-top: 20px;
                }

                .step-number {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #ff69b4, #ff1493);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.2rem;
                    box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
                    z-index: 2;
                }

                .benefit-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #222;
                }

                .benefit-description {
                    font-size: 1rem;
                    color: #666;
                    line-height: 1.6;
                    margin: 0;
                }

                .benefit-icon-wrapper {
                    width: 90px;
                    height: 90px;
                    margin: 0 auto 25px;
                    background: linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(147,112,219,0.1) 100%);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.8rem;
                    transition: transform 0.4s ease;
                }

                .benefit-card.style-standard:hover .benefit-icon-wrapper {
                    transform: scale(1.1) rotate(5deg);
                }

                /* TABLET RESPONSIVE */
                @media (max-width: 991px) {
                    .benefits-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 20px;
                    }
                }

                /* MOBILE RESPONSIVE (Phones) */
                @media (max-width: 640px) {
                    .key-benefits-section {
                        padding: 60px 20px;
                    }

                    .section-subtitle {
                        margin-bottom: 3rem;
                        font-size: 1rem;
                    }

                    .section-title {
                        font-size: 1.75rem; /* Smaller title */
                    }

                    .benefits-grid {
                        grid-template-columns: 1fr !important; /* Stack columns */
                        gap: 25px; /* Reduced gap */
                    }

                    /* Ingredients Specific Mobile */
                    .ingredient-img-wrapper {
                        width: 120px; /* Smaller image */
                        height: 120px;
                        margin-bottom: 15px;
                    }

                    .benefit-title {
                        font-size: 1.25rem;
                        margin-bottom: 8px;
                    }

                    .benefit-description {
                        font-size: 0.95rem; /* Readable but smaller */
                    }

                    /* Standard Card Mobile */
                    .benefit-card.style-standard {
                        padding: 30px 20px;
                    }
                    
                    .benefit-icon-wrapper {
                        width: 70px;
                        height: 70px;
                        font-size: 2rem;
                        margin-bottom: 15px;
                    }
                }

                /* HYPER-COMPACT MOBILE (Small Screens) */
                @media (max-width: 480px) {
                    .key-benefits-section {
                        padding: 40px 15px !important;
                    }
                    .benefit-card.style-standard {
                        padding: 20px 15px !important;
                    }
                    .section-title {
                        font-size: 1.5rem !important;
                        margin-bottom: 0.5rem !important;
                    }
                    .section-subtitle {
                        font-size: 0.9rem !important;
                        margin-bottom: 25px !important;
                    }
                    .ingredient-img-wrapper {
                        width: 90px !important;
                        height: 90px !important;
                        margin-bottom: 10px !important;
                        border-width: 3px !important;
                    }
                    .benefit-title {
                        font-size: 1.1rem !important;
                    }
                    .benefit-description {
                        font-size: 0.85rem !important;
                    }
                    .benefit-icon-wrapper {
                        width: 50px !important;
                        height: 50px !important;
                        font-size: 1.5rem !important;
                        margin-bottom: 10px !important;
                    }
                    .benefits-grid {
                        gap: 20px !important;
                    }
                }
            `}</style>

            {/* Ambient Orbs */}
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

            <div className="key-benefits-container">
                {/* Section Header */}
                <div className={`section-header ${isVisible ? 'is-visible' : ''}`}>
                    <h2 className="section-title">
                        {title}
                    </h2>
                    <p className="section-subtitle">
                        {subtitle}
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className={`benefits-grid columns-${columns} ${data.layout === 'ingredients' ? 'style-ingredients' : ''}`}>
                    {benefits.map((benefit, index) => {
                        const delay = 0.1 * index;
                        const cardStyle = data.layout === 'ingredients' ? 'style-ingredients'
                            : data.layout === 'steps' ? 'style-steps'
                                : 'style-standard';

                        return (
                            <div
                                key={index}
                                className={`benefit-card ${cardStyle} ${isVisible ? 'is-visible' : ''}`}
                                style={{ transitionDelay: `${delay}s` }}
                            >
                                {/* Ingredients Layout */}
                                {data.layout === 'ingredients' ? (
                                    <>
                                        <div className="ingredient-img-wrapper">
                                            <img
                                                src={benefit.image || '/placeholder-image.jpg'}
                                                alt={benefit.title}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100"/><text fill="%23999" font-family="Arial" font-size="12" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>';
                                                }}
                                            />
                                        </div>
                                        <h3 className="benefit-title">{benefit.title}</h3>
                                        <p className="benefit-description">{benefit.description}</p>
                                    </>
                                ) : data.layout === 'steps' ? (
                                    /* Process/Steps Layout */
                                    <>
                                        <div className="step-number">
                                            {index + 1}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            {benefit.icon && (
                                                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{benefit.icon}</div>
                                            )}
                                            <h3 className="benefit-title">
                                                {benefit.title}
                                            </h3>
                                            <p className="benefit-description">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    /* Standard Benefit Layout */
                                    <>
                                        <div className="benefit-icon-wrapper">
                                            {benefit.icon}
                                        </div>

                                        <h3 className="benefit-title">
                                            {benefit.title}
                                        </h3>

                                        <p className="benefit-description">
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
                        );
                    })}
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
                        هل أنت مستعدة لتجربة الفرق؟
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
                        ابدئي اليوم <span>→</span>
                    </a>
                </div>
            </div >
        </div >
    );
};

export default KeyBenefitsSection;

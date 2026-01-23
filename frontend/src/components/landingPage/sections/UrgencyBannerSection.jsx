import React, { useState, useEffect, useRef } from 'react';
import { useLandingPageCTA } from '../LandingPageCTAHandler';

/**
 * Premium Urgency Banner Section
 * Eye-catching limited time offer with animated countdown timer
 */
const UrgencyBannerSection = ({ data, isEditing = false, productId = null, availableVariants = [] }) => {
    // Merge local data with global variants if not present locally
    const ctaData = { ...data, variants: data?.variants || availableVariants };
    const handleCTA = useLandingPageCTA(productId, ctaData);
    const {
        title: dbTitle,
        discount: dbDiscount,
        message: dbMessage,
        ctaText: dbCtaText,
        ctaLink = '#order',
        backgroundColor = '#ff69b4',
        textColor = '#ffffff',
        countdownEndDate,
        // New premium options
        showStock = true,
        stockLeft = 47,
        showBuyers = true,
        recentBuyers = 23,
    } = data || {};

    const title = (!dbTitle || dbTitle === '🔥 LIMITED TIME OFFER!') ? '🔥 عرض لفترة محدودة!' : dbTitle;
    const discount = (!dbDiscount || dbDiscount === '20% OFF') ? 'خصم 20%' : dbDiscount;
    const message = (!dbMessage || dbMessage === 'Offer ends soon') ? 'ينتهي العرض قريبا' : dbMessage;
    const ctaText = (!dbCtaText || dbCtaText === 'Claim Your Discount') ? 'احصل على الخصم' : dbCtaText;

    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 5,
        minutes: 23,
        seconds: 15,
    });
    const [isVisible, setIsVisible] = useState(false);
    const [pulse, setPulse] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isEditing) return;

        const calculateTimeLeft = () => {
            let endDate;
            if (countdownEndDate) {
                endDate = new Date(countdownEndDate).getTime();
            } else {
                // Default: 2 days from now
                endDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
            }

            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownEndDate, isEditing]);

    // Pulse effect on second change
    useEffect(() => {
        setPulse(true);
        const timeout = setTimeout(() => setPulse(false), 100);
        return () => clearTimeout(timeout);
    }, [timeLeft.seconds]);

    const TimeBlock = ({ value, label }) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <div style={{
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px 25px',
                minWidth: '90px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                transform: pulse && label === 'Seconds' ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.1s ease',
            }}>
                <div style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: '800',
                    lineHeight: 1,
                    fontFamily: 'monospace',
                }}>
                    {String(value).padStart(2, '0')}
                </div>
            </div>
            <div style={{
                marginTop: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.9,
            }}>
                {label}
            </div>
        </div>
    );

    return (
        <div
            ref={sectionRef}
            style={{
                background: `linear-gradient(135deg, ${backgroundColor} 0%, #ff1493 50%, #c71585 100%)`,
                color: textColor,
                textAlign: 'center',
                padding: '80px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)
                `,
                pointerEvents: 'none',
            }} />

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        left: `${10 + i * 12}%`,
                        top: `${20 + (i % 3) * 30}%`,
                        animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                    }}
                />
            ))}

            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Badge */}
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '10px 25px',
                    borderRadius: '50px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    marginBottom: '25px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s ease',
                    animation: 'pulse 2s ease-in-out infinite',
                }}>
                    ⚡ خصم خيالي - لا تفوت الفرصة!
                </div>

                {/* Title */}
                <h2 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: '700',
                    marginBottom: '20px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.1s',
                }}>
                    {title}
                </h2>

                {/* Discount */}
                <div style={{
                    fontSize: 'clamp(3.5rem, 10vw, 6rem)',
                    fontWeight: '900',
                    marginBottom: '15px',
                    textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                }}>
                    {discount}
                </div>

                {/* Message */}
                <p style={{
                    fontSize: '1.2rem',
                    marginBottom: '35px',
                    opacity: 0.95,
                }}>
                    {message}
                </p>

                {/* Countdown Timer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(10px, 3vw, 25px)',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease 0.3s',
                }}>
                    <TimeBlock value={timeLeft.days} label="أيام" />
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', alignSelf: 'center', opacity: 0.5 }}>:</div>
                    <TimeBlock value={timeLeft.hours} label="ساعات" />
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', alignSelf: 'center', opacity: 0.5 }}>:</div>
                    <TimeBlock value={timeLeft.minutes} label="دقائق" />
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', alignSelf: 'center', opacity: 0.5 }}>:</div>
                    <TimeBlock value={timeLeft.seconds} label="ثواني" />
                </div>

                {/* Social Proof */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    marginBottom: '35px',
                    flexWrap: 'wrap',
                    fontSize: '1rem',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.6s ease 0.4s',
                }}>
                    {showStock && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.15)',
                            padding: '10px 20px',
                            borderRadius: '50px',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>📦</span>
                            <span>متبقي <strong>{stockLeft}</strong> فقط في المخزون!</span>
                        </div>
                    )}
                    {showBuyers && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.15)',
                            padding: '10px 20px',
                            borderRadius: '50px',
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>👥</span>
                            <span><strong>{recentBuyers}</strong> شخص اشتروا هذا اليوم</span>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                {!isEditing ? (
                    <a
                        href={ctaLink || '#'}
                        onClick={handleCTA}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'white',
                            color: backgroundColor,
                            padding: '20px 50px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: 'buttonPulse 2s ease-in-out infinite',
                        }}
                        className="urgency-cta-btn"
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-5px) scale(1.05)';
                            e.target.style.boxShadow = '0 15px 50px rgba(0,0,0,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
                        }}
                    >
                        {ctaText} <span style={{ fontSize: '1.4rem' }}>→</span>
                    </a>
                ) : (
                    <button
                        style={{
                            background: 'white',
                            color: backgroundColor,
                            padding: '20px 50px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            cursor: 'not-allowed',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        }}
                    >
                        {ctaText} →
                    </button>
                )}

                <style>{`
                    @media (max-width: 480px) {
                        .urgency-cta-btn {
                            padding: 15px 30px !important;
                            font-size: 1rem !important;
                            width: 100%;
                            justify-content: center;
                        }
                    }
                `}</style>

                {/* Guarantee Badge */}
                <div style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '25px',
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    flexWrap: 'wrap',
                }}>
                    <span>✓ شحن مجاني</span>
                    <span>✓ ضمان 30 يوم</span>
                    <span>✓ دفع آمن</span>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                @keyframes buttonPulse {
                    0%, 100% { box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
                    50% { box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 0 0 10px rgba(255,255,255,0.1); }
                }
            `}</style>
        </div>
    );
};

export default UrgencyBannerSection;

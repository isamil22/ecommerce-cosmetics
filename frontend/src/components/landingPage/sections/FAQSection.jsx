import React, { useState, useRef, useEffect } from 'react';

/**
 * Premium FAQ Section
 * Beautiful accordion with smooth animations
 */
const FAQSection = ({ data }) => {
    const {
        title = 'Frequently Asked Questions',
        subtitle = 'Got questions? We have answers',
        faqs = [
            { question: 'How long does shipping take?', answer: 'We offer free shipping and delivery takes 3-5 business days.' },
            { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund you.' },
            { question: 'Is this product safe to use?', answer: 'Yes, our product is made with natural ingredients and is safe for all skin types.' },
            { question: 'How do I use this product?', answer: 'Apply a small amount to clean skin twice daily for best results.' },
        ],
        backgroundColor = '#fafafa',
    } = data || {};

    const [openIndex, setOpenIndex] = useState(0); // First one open by default
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

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div 
            ref={sectionRef}
            style={{
                background: backgroundColor === '#fafafa' 
                    ? 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
                    : backgroundColor,
                padding: '100px 20px',
                position: 'relative',
            }}
        >
            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '5%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,105,180,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(147,112,219,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            <div style={{
                maxWidth: '850px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '50px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(147,112,219,0.1) 100%)',
                        color: '#ff69b4',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        FAQ
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        color: '#222',
                    }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{
                            fontSize: '1.15rem',
                            color: '#666',
                            maxWidth: '500px',
                            margin: '0 auto',
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* FAQ Items */}
                <div>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => toggleFAQ(index)}
                            isVisible={isVisible}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <div style={{
                    marginTop: '50px',
                    textAlign: 'center',
                    padding: '40px',
                    background: 'linear-gradient(135deg, rgba(255,105,180,0.05) 0%, rgba(147,112,219,0.05) 100%)',
                    borderRadius: '20px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease 0.5s',
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        marginBottom: '10px',
                        color: '#333',
                    }}>
                        Still have questions?
                    </h3>
                    <p style={{
                        color: '#666',
                        marginBottom: '20px',
                    }}>
                        We're here to help! Contact our friendly support team.
                    </p>
                    <a
                        href="mailto:support@example.com"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                            color: 'white',
                            padding: '14px 30px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(255,105,180,0.3)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(255,105,180,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(255,105,180,0.3)';
                        }}
                    >
                        📧 Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

// Separate FAQ Item component for better animation control
const FAQItem = ({ faq, index, isOpen, onToggle, isVisible }) => {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isOpen ? contentRef.current.scrollHeight : 0);
        }
    }, [isOpen]);

    return (
        <div
            style={{
                marginBottom: '15px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: isOpen 
                    ? '0 10px 40px rgba(255,105,180,0.12)' 
                    : '0 2px 10px rgba(0,0,0,0.04)',
                border: isOpen 
                    ? '2px solid rgba(255,105,180,0.2)' 
                    : '2px solid transparent',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${0.1 * index}s`,
            }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: '100%',
                    padding: '25px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: isOpen ? '#ff69b4' : '#333',
                    textAlign: 'left',
                    transition: 'color 0.3s ease',
                }}
            >
                <span style={{ paddingRight: '20px' }}>{faq.question}</span>
                <span style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isOpen 
                        ? 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)' 
                        : '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                }}>
                    <span style={{
                        color: isOpen ? 'white' : '#666',
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        display: 'block',
                        lineHeight: 1,
                    }}>
                        +
                    </span>
                </span>
            </button>
            <div 
                style={{
                    height: height,
                    overflow: 'hidden',
                    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div 
                    ref={contentRef}
                    style={{
                        padding: '0 30px 25px 30px',
                        fontSize: '1rem',
                        color: '#666',
                        lineHeight: '1.7',
                    }}
                >
                    {faq.answer}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;

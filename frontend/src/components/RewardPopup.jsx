import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RewardPopup = ({ coupons }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState(null);

    useEffect(() => {
        console.log("RewardPopup coupons prop:", coupons);
        // Show popup if there are coupons and it hasn't been dismissed manually this session
        if (coupons && coupons.length > 0) {
            // Pick the first one or the one with highest value
            // Prioritize % discounts
            // Sort by value (highest first), then by code/id to be deterministic
            const sortedCoupons = [...coupons]
                .sort((a, b) => b.discountValue - a.discountValue || b.id - a.id);

            // Find the first coupon that HAS NOT been seen yet
            let targetCoupon = null;
            for (const coupon of sortedCoupons) {
                const seenKey = `seen_coupon_${coupon.code}`;
                if (!sessionStorage.getItem(seenKey)) {
                    targetCoupon = coupon;
                    break;
                }
            }

            console.log("Selected target coupon:", targetCoupon);

            if (targetCoupon) {
                setCurrentCoupon(targetCoupon);
                // Delay slightly for effect
                setTimeout(() => {
                    console.log("Setting popup visible");
                    setIsVisible(true);
                }, 2000);
            }
        }
    }, [coupons]);

    const handleClose = () => {
        setIsVisible(false);
        if (currentCoupon) {
            sessionStorage.setItem(`seen_coupon_${currentCoupon.code}`, 'true');
        }
    };

    const handleCopy = async () => {
        if (!currentCoupon) return;

        try {
            // Try modern API first (requires HTTPS)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(currentCoupon.code);
            } else {
                // Fallback for HTTP / non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = currentCoupon.code;

                // Ensure it's not visible but part of the DOM
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);

                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }

                document.body.removeChild(textArea);
            }

            // Show success alert
            alert('تم نسخ الكود! / Code copié!');
        } catch (err) {
            console.error('Failed to copy (all methods): ', err);
            // Even if copy fails, show the code so they can manual copy
            prompt("Copy this code / Copiez ce code:", currentCoupon.code);
        }
    };

    if (!currentCoupon) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px', // Left side to not block chat widgets usually on right
                        zIndex: 9999,
                        maxWidth: '350px',
                        width: '90%',
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 15px 40px rgba(255, 107, 107, 0.4)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>

                        {/* Confetti Decoration */}
                        <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎉</div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                            أهلاً بعودتك! / Bon retour!
                        </h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '20px' }}>
                            لديك كود خصم غير مستخدم!
                            <br />
                            Vous avez un code promo inutilisé !
                        </p>

                        <div
                            onClick={handleCopy}
                            style={{
                                background: 'rgba(255,255,255,0.9)',
                                color: '#FF6B6B',
                                padding: '12px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                border: '2px dashed #FF6B6B',
                                cursor: 'pointer',
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{currentCoupon.code}</span>
                            <span style={{ fontSize: '0.8rem', background: '#FF6B6B', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>
                                Copy
                            </span>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.8 }}>
                            خصم {currentCoupon.discountValue}% على طلبك القادم
                            <br />
                            {currentCoupon.discountValue}% de réduction sur votre prochaine commande
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RewardPopup;

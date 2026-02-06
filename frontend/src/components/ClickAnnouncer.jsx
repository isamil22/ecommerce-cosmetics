import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ClickAnnouncer = () => {
    const [clicks, setClicks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const { clientX, clientY } = e;
            const newClick = {
                id: Date.now(),
                x: clientX,
                y: clientY,
            };

            setClicks((prev) => [...prev, newClick]);

            // Clean up after animation
            setTimeout(() => {
                setClicks((prev) => prev.filter((click) => click.id !== newClick.id));
            }, 800);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    if (clicks.length === 0) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            {clicks.map((click) => (
                <div
                    key={click.id}
                    className="click-ripple"
                    style={{
                        position: 'absolute',
                        left: click.x,
                        top: click.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {/* Inner core */}
                    <div className="ripple-core"></div>
                    {/* Outer ring */}
                    <div className="ripple-ring"></div>
                </div>
            ))}
            <style jsx>{`
                @keyframes ripple-expand {
                    0% {
                        transform: scale(0);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                @keyframes core-ping {
                    0% {
                        transform: scale(0.2);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .ripple-ring {
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(255, 215, 0, 0.6); /* Gold */
                    border-radius: 50%;
                    animation: ripple-expand 0.6s ease-out forwards;
                    box-shadow: 0 0 10px rgba(236, 72, 153, 0.4); /* Pink Glow */
                }
                .ripple-core {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 10px;
                    height: 10px;
                    background: radial-gradient(circle, #fff 0%, #ffd700 100%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: core-ping 0.4s ease-out forwards;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ClickAnnouncer;

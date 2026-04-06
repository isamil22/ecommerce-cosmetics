import React, { useState, useEffect } from 'react';

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

    return (
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
        </div>
    );
};

export default ClickAnnouncer;

import React, { useState, useEffect } from 'react';

const OrderUrgencyTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [deliveryDay, setDeliveryDay] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const cutoff = new Date();
            cutoff.setHours(16, 0, 0, 0);

            let diff = cutoff.getTime() - now.getTime();

            if (diff < 0) {
                cutoff.setDate(cutoff.getDate() + 1);
                diff = cutoff.getTime() - now.getTime();
            }

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours, minutes, seconds });
        };

        const getDeliveryDay = () => {
            const now = new Date();
            const today = new Date();
            today.setHours(16, 0, 0, 0);
            const isBeforeCutoff = now < today;

            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + (isBeforeCutoff ? 3 : 4));

            const options = { weekday: 'long' };
            setDeliveryDay(new Intl.DateTimeFormat('en-US', options).format(deliveryDate));
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        getDeliveryDay();

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-lg">
            <p className="font-semibold">
                Want it by <span className="font-extrabold">{deliveryDay}</span>?
            </p>
            <p className="text-sm">
                Order within the next{' '}
                <span className="font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}:</span>
                <span className="font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}:</span>
                <span className="font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </p>
        </div>
    );
};

export default OrderUrgencyTimer;
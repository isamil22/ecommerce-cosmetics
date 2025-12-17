import React from 'react';
import { formatPrice } from '../utils/currency';

const ShippingThresholdIndicator = ({ currentTotal = 0 }) => {
    // Set your free shipping threshold here (e.g., $50)
    const SHIPPING_THRESHOLD = 50;

    const amountLeft = SHIPPING_THRESHOLD - currentTotal;
    const progressPercentage = Math.min((currentTotal / SHIPPING_THRESHOLD) * 100, 100);

    return (
        <div className="my-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            {amountLeft > 0 ? (
                <div>
                    <p className="text-green-800 font-semibold text-center">
                        You're only <span className="font-bold">{formatPrice(amountLeft)}</span> away from free shipping!
                    </p>
                </div>
            ) : (
                <div>
                    <p className="text-green-800 font-bold text-center">
                        🎉 Congratulations! You've unlocked FREE shipping!
                    </p>
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
                ></div>
            </div>
        </div>
    );
};

export default ShippingThresholdIndicator;
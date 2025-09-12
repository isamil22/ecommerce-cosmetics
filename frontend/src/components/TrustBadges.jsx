import React from 'react';
// You can find icons from a library like react-icons
// For this example, we'll use simple text placeholders
const TrustBadges = () => {
    const features = [
        { icon: '🚚', text: 'Fast Shipping' },
        { icon: '🔒', text: 'Secure Payment' },
        { icon: '⭐', text: 'Premium Quality' },
        { icon: '🔄', text: 'Easy Returns' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
            {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-2">
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="text-sm font-semibold text-gray-700 mt-2">{feature.text}</span>
                </div>
            ))}
        </div>
    );
};

export default TrustBadges;
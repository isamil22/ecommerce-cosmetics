import React, { useState, useEffect } from 'react';

// A list of sample names and locations for variety
const names = ["Amina", "Youssef", "Fatima", "Mehdi", "Sara", "Karim", "Nadia"];
const cities = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier"];

const PurchasePopup = ({ productName, productImage }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [purchaseInfo, setPurchaseInfo] = useState({ name: '', city: '', time: '' });

    useEffect(() => {
        const showRandomPopup = () => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomTime = Math.floor(Math.random() * 59) + 1;

            setPurchaseInfo({
                name: randomName,
                city: randomCity,
                time: `${randomTime} minute${randomTime > 1 ? 's' : ''} ago`,
            });
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
            }, 5000); // Popup visible for 5 seconds
        };

        // Start the popups after an initial delay and then repeat randomly
        const initialTimeout = setTimeout(() => {
            showRandomPopup();
            const intervalId = setInterval(showRandomPopup, Math.random() * (20000 - 8000) + 8000); // every 8-20 seconds
            return () => clearInterval(intervalId);
        }, 7000); // Initial delay of 7 seconds

        return () => clearTimeout(initialTimeout);
    }, [productName]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-white p-3 rounded-lg shadow-2xl border flex items-center animate-nudge">
            <img src={productImage} alt={productName} className="w-16 h-16 object-cover rounded-md mr-4" />
            <div>
                <p className="font-bold text-gray-800">
                    {purchaseInfo.name} in {purchaseInfo.city}
                </p>
                <p className="text-sm text-gray-600">
                    purchased {productName}
                </p>
                <p className="text-xs text-gray-400 mt-1">{purchaseInfo.time}</p>
            </div>
        </div>
    );
};

export default PurchasePopup;
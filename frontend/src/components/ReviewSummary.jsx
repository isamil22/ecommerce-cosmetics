import React, { useEffect, useState } from 'react';

const ReviewSummary = ({ comments }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true);
    }, []);

    if (!comments || comments.length === 0) {
        return null;
    }

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach(comment => {
        if (ratingCounts[comment.score] !== undefined) {
            ratingCounts[comment.score]++;
        }
    });

    const totalReviews = comments.length;
    const averageRating = (comments.reduce((acc, c) => acc + c.score, 0) / totalReviews).toFixed(1);

    return (
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left Column: Big Stats */}
            <div className="flex flex-col items-center justify-center text-center lg:w-1/3 space-y-2">
                <div className="text-6xl lg:text-7xl font-black bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {averageRating}
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-2xl lg:text-3xl">
                    {'★'.repeat(Math.round(averageRating))}
                    <span className="text-gray-200">{'★'.repeat(5 - Math.round(averageRating))}</span>
                </div>
                <p className="text-gray-500 font-bold text-sm lg:text-base">
                    Basé sur {totalReviews} avis / بناءً على {totalReviews} مراجعات
                </p>
            </div>

            {/* Right Column: Histogram */}
            <div className="flex-1 w-full space-y-3">
                {Object.keys(ratingCounts).reverse().map(star => {
                    const count = ratingCounts[star];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    return (
                        <div key={star} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                            <div className="w-12 flex items-center gap-1">
                                {star} <span className="text-yellow-400 text-base">★</span>
                            </div>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out ${animated ? 'w-[var(--width)]' : 'w-0'}`}
                                    style={{ '--width': `${percentage}%`, width: animated ? `${percentage}%` : '0%' }}
                                ></div>
                            </div>
                            <div className="w-10 text-right text-gray-400">
                                {count}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewSummary;
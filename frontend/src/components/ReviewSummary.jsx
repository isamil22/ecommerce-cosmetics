import React from 'react';

const ReviewSummary = ({ comments }) => {
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

    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Customer Reviews</h3>
            {Object.keys(ratingCounts).reverse().map(star => (
                <div key={star} className="flex items-center space-x-2 text-sm">
                    <span>{star} star</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-yellow-400 h-2.5 rounded-full"
                            style={{ width: `${(ratingCounts[star] / totalReviews) * 100}%` }}
                        ></div>
                    </div>
                    <span className="w-10 text-right">{ratingCounts[star]}</span>
                </div>
            ))}
        </div>
    );
};

export default ReviewSummary;
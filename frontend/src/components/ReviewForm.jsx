import React, { useState } from 'react';
import { addReview } from '/src/api/apiService.js';

const ReviewForm = ({ onReviewSubmitted }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!content || rating < 1 || rating > 5) {
            setError('Please provide valid content and a rating between 1 and 5.');
            return;
        }

        try {
            // The API call no longer sends a productId
            await addReview({ content, rating });
            setSuccess('Thank you! Your review has been submitted for approval.');
            setContent('');
            setRating(5);
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
        }
    };

    const renderStars = (selectedRating) => {
        return [...Array(5)].map((_, index) => (
            <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className={`w-8 h-8 transition-colors duration-200 ${
                    index < selectedRating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 focus:outline-none`}
            >
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </button>
        ));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-green-700 text-sm">{success}</p>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-3">
                    Rating / التقييم
                </label>
                <div className="flex items-center space-x-2 mb-2">
                    {renderStars(rating)}
                    <span className="ml-3 text-sm text-gray-600">
                        {rating === 5 && 'Excellent / ممتاز'}
                        {rating === 4 && 'Good / جيد'}
                        {rating === 3 && 'Average / متوسط'}
                        {rating === 2 && 'Fair / مقبول'}
                        {rating === 1 && 'Poor / ضعيف'}
                    </span>
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-3">
                    Your Review / تقييمك
                </label>
                <textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                    rows="4" 
                    placeholder="Share your experience with our beauty products and service..."
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm resize-none transition-all duration-200"
                />
                <p className="mt-2 text-xs text-gray-500">
                    {content.length}/500 characters
                </p>
            </div>

            <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Submit Review / إرسال التقييم
            </button>
        </form>
    );
};

export default ReviewForm;
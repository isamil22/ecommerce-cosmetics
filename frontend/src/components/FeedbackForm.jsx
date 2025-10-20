import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { submitOrderFeedback, submitGuestOrderFeedback } from '../api/apiService';
import { toast } from 'react-toastify';

const FeedbackForm = ({ orderId, isAuthenticated = false }) => {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState('');

    const handleFeedback = async (rating) => {
        if (!orderId) {
            toast.error('Order ID is required for feedback');
            return;
        }

        setSubmitting(true);
        
        try {
            // Submit feedback to database
            if (isAuthenticated) {
                await submitOrderFeedback(orderId, rating, comment);
            } else {
                await submitGuestOrderFeedback(orderId, rating, comment);
            }

            // Track with Google Analytics
            ReactGA.event({
                category: 'Feedback',
                action: 'user_rating',
                label: `Rating: ${rating}`,
                value: parseInt(orderId) || 0
            });

            setSubmitted(true);
            toast.success('Thank you for your feedback!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center p-6 border rounded-lg mt-8 bg-green-50 border-green-200">
                <div className="text-green-600 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-green-700 font-semibold text-lg">Thank you for your feedback!</p>
                <p className="text-green-600 text-sm mt-1">Your rating has been recorded successfully.</p>
            </div>
        );
    }

    return (
        <div className="text-center p-6 border rounded-lg mt-8 bg-gray-50">
            <h3 className="font-bold mb-4 text-lg text-gray-700">How was your shopping experience?</h3>
            
            {/* Rating Buttons */}
            <div className="flex justify-center space-x-4 mb-4">
                <button 
                    onClick={() => handleFeedback('Good')} 
                    disabled={submitting}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    <span>👍</span>
                    <span>Good</span>
                </button>
                <button 
                    onClick={() => handleFeedback('Okay')} 
                    disabled={submitting}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    <span>😐</span>
                    <span>Okay</span>
                </button>
                <button 
                    onClick={() => handleFeedback('Bad')} 
                    disabled={submitting}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    <span>👎</span>
                    <span>Bad</span>
                </button>
            </div>

            {/* Optional Comment */}
            <div className="mt-4">
                <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Optional: Tell us more about your experience
                </label>
                <textarea
                    id="feedback-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share any additional comments about your order..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
            </div>

            {submitting && (
                <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Submitting feedback...</span>
                </div>
            )}
        </div>
    );
};

export default FeedbackForm;
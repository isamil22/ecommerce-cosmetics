import React, { useState, useEffect } from 'react';
import { getOrderFeedback } from '../api/apiService';
import { useLanguage } from '../contexts/LanguageContext';

const OrderFeedbackSection = ({ orderId }) => {
    const { t } = useLanguage();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getOrderFeedback(orderId);
                console.log('Feedback API response:', response.data);

                // Check if response.data is valid
                if (response.data && response.data.rating) {
                    setFeedback(response.data);
                } else {
                    console.log('Invalid feedback data received:', response.data);
                    setFeedback(null);
                }
            } catch (err) {
                console.error('Error fetching feedback for order:', orderId, err);
                setError(err.message || t('orderFeedback.error'));
                setFeedback(null);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchFeedback();
        }
    }, [orderId, t]);

    const getRatingColor = (rating) => {
        switch (rating) {
            case 'Good':
                return 'text-green-600 bg-green-100';
            case 'Okay':
                return 'text-yellow-600 bg-yellow-100';
            case 'Bad':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getRatingIcon = (rating) => {
        switch (rating) {
            case 'Good':
                return '👍';
            case 'Okay':
                return '😐';
            case 'Bad':
                return '👎';
            default:
                return '⭐';
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-sm text-gray-600">{t('orderFeedback.loading')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {t('orderFeedback.title')}
            </h5>

            {error ? (
                <div className="text-center py-4">
                    <div className="text-red-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-red-600">{t('orderFeedback.error')}</p>
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                </div>
            ) : feedback ? (
                <div className="space-y-3">
                    {/* Rating Display */}
                    <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getRatingColor(feedback.rating)}`}>
                            <span>{getRatingIcon(feedback.rating)}</span>
                            <span>{feedback.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                            {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                    </div>

                    {/* Comment Display */}
                    {feedback.comment && (
                        <div className="bg-white rounded-lg p-3 border border-purple-100">
                            <p className="text-sm text-gray-700 italic">
                                "{feedback.comment}"
                            </p>
                        </div>
                    )}

                    {/* User Info */}
                    {feedback.user && (
                        <div className="text-xs text-gray-500">
                            {t('orderFeedback.from')} {feedback.user.username || feedback.user.email || t('orderFeedback.anonymous')}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500">{t('orderFeedback.noFeedback')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('orderFeedback.noFeedbackDesc')}</p>
                </div>
            )}
        </div>
    );
};

export default OrderFeedbackSection;

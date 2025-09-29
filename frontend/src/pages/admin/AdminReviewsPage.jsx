import React, { useState, useEffect } from 'react';
import { getAllReviews, createAdminReview, updateReview, approveReview, deleteReview } from '../../api/apiService.js';

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved'
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        content: '',
        rating: 5,
        customName: '',
        approved: true
    });

    // Fetch all reviews
    const fetchReviews = async () => {
        try {
            setError('');
            setSuccess('');
            const response = await getAllReviews();
            setReviews(response.data);
        } catch (err) {
            setError('Failed to fetch reviews.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Filter reviews based on active tab
    const filteredReviews = reviews.filter(review => {
        if (activeTab === 'pending') return !review.approved;
        if (activeTab === 'approved') return review.approved;
        return true; // 'all'
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Create new review
    const handleCreateReview = async (e) => {
        e.preventDefault();
        try {
            await createAdminReview(formData);
            setSuccess('Review created successfully!');
            setShowCreateForm(false);
            setFormData({ content: '', rating: 5, customName: '', approved: true });
            fetchReviews();
        } catch (err) {
            setError('Failed to create review.');
            console.error(err);
        }
    };

    // Start editing a review
    const handleStartEdit = (review) => {
        setEditingReview(review.id);
        setFormData({
            content: review.content,
            rating: review.rating,
            customName: review.customName || '',
            approved: review.approved
        });
        setShowCreateForm(false);
    };

    // Update review
    const handleUpdateReview = async (e, reviewId) => {
        e.preventDefault();
        try {
            await updateReview(reviewId, formData);
            setSuccess('Review updated successfully!');
            setEditingReview(null);
            setFormData({ content: '', rating: 5, customName: '', approved: true });
            fetchReviews();
        } catch (err) {
            setError('Failed to update review.');
            console.error(err);
        }
    };

    // Approve review
    const handleApprove = async (reviewId) => {
        try {
            await approveReview(reviewId);
            setSuccess('Review approved successfully!');
            fetchReviews();
        } catch (err) {
            setError('Failed to approve review.');
            console.error(err);
        }
    };

    // Delete review
    const handleDelete = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteReview(reviewId);
                setSuccess('Review deleted successfully!');
                fetchReviews();
            } catch (err) {
                setError('Failed to delete review.');
                console.error(err);
            }
        }
    };

    // Cancel editing or creating
    const handleCancel = () => {
        setEditingReview(null);
        setShowCreateForm(false);
        setFormData({ content: '', rating: 5, customName: '', approved: true });
    };

    // Render star rating selector
    const renderStarSelector = (currentRating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className={`text-3xl ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Reviews</h1>
                <button
                    onClick={() => {
                        setShowCreateForm(true);
                        setEditingReview(null);
                        setFormData({ content: '', rating: 5, customName: '', approved: true });
                    }}
                    className="bg-pink-500 text-white py-2 px-6 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                >
                    + Create New Review
                </button>
            </div>

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</div>}
            {success && <div className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{success}</div>}

            {/* Create/Edit Form */}
            {(showCreateForm || editingReview) && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border-2 border-pink-300">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingReview ? 'Edit Review' : 'Create New Review'}
                    </h2>
                    <form onSubmit={editingReview ? (e) => handleUpdateReview(e, editingReview) : handleCreateReview}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                name="customName"
                                value={formData.customName}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Review Content
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3"
                                rows="4"
                                placeholder="Enter review content"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Rating
                            </label>
                            {renderStarSelector(formData.rating)}
                            <p className="text-sm text-gray-500 mt-1">{formData.rating} out of 5 stars</p>
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="approved"
                                    checked={formData.approved}
                                    onChange={handleInputChange}
                                    className="mr-2 w-4 h-4"
                                />
                                <span className="text-gray-700 font-semibold">Approved (visible on homepage)</span>
                            </label>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                            >
                                {editingReview ? 'Update Review' : 'Create Review'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b-2 border-gray-200">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`py-2 px-6 font-semibold transition-colors ${
                        activeTab === 'all'
                            ? 'text-pink-500 border-b-2 border-pink-500'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    All Reviews ({reviews.length})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-2 px-6 font-semibold transition-colors ${
                        activeTab === 'pending'
                            ? 'text-pink-500 border-b-2 border-pink-500'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Pending ({reviews.filter(r => !r.approved).length})
                </button>
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`py-2 px-6 font-semibold transition-colors ${
                        activeTab === 'approved'
                            ? 'text-pink-500 border-b-2 border-pink-500'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Approved ({reviews.filter(r => r.approved).length})
                </button>
            </div>

            {/* Reviews List */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="space-y-4">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                            <div
                                key={review.id}
                                className={`p-4 border rounded-lg shadow-sm ${
                                    review.approved ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {review.createdByAdmin && (
                                                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    ADMIN CREATED
                                                </span>
                                            )}
                                            {review.approved ? (
                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    APPROVED
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    PENDING
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-semibold text-gray-800">
                                            {review.createdByAdmin ? (
                                                <span>Customer: <span className="font-normal text-gray-600">{review.customName || 'Anonymous'}</span></span>
                                            ) : (
                                                <span>User: <span className="font-normal text-gray-600">{review.userEmail}</span></span>
                                            )}
                                        </p>
                                        <p className="font-semibold text-gray-800 mt-1">
                                            Rating:{' '}
                                            <span className="font-normal text-yellow-500">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </p>
                                        <blockquote className="mt-2 text-gray-600 italic border-l-4 border-gray-300 pl-4">
                                            "{review.content}"
                                        </blockquote>
                                    </div>
                                    <div className="flex flex-col space-y-2 ml-4">
                                        <button
                                            onClick={() => handleStartEdit(review)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            Edit
                                        </button>
                                        {!review.approved && (
                                            <button
                                                onClick={() => handleApprove(review.id)}
                                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors text-sm"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No reviews found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReviewsPage;
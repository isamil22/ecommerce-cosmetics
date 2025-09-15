import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, updateComment, deleteComment, addAdminComment, deleteCommentImage } from '../../api/apiService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const AdminProductCommentsPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingComment, setEditingComment] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCommentData, setNewCommentData] = useState({
        name: '',
        content: '',
        score: 5,
        images: []
    });

    const fetchProductComments = async () => {
        try {
            const response = await getProductById(productId);
            setProduct(response.data);
            setComments(response.data.comments || []);
        } catch (error) {
            toast.error("Failed to fetch product comments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductComments();
    }, [productId]);

    const handleEdit = (comment) => {
        setEditingComment({ ...comment });
    };

    const handleDelete = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(commentId);
                toast.success("Comment deleted successfully!");
                fetchProductComments();
            } catch (error) {
                toast.error("Failed to delete comment.");
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateComment(editingComment.id, editingComment);
            toast.success("Comment updated successfully!");
            setEditingComment(null);
            fetchProductComments();
        } catch (error) {
            toast.error("Failed to update comment.");
        }
    };

    const handleNewCommentChange = (e) => {
        const { name, value } = e.target;
        setNewCommentData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewCommentImageChange = (e) => {
        setNewCommentData(prev => ({ ...prev, images: Array.from(e.target.files) }));
    };

    const handleAddNewComment = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCommentData.name);
        formData.append('content', newCommentData.content);
        formData.append('score', newCommentData.score);
        newCommentData.images.forEach(image => {
            formData.append('images', image);
        });

        try {
            await addAdminComment(productId, formData);
            toast.success('Comment added successfully!');
            setIsAddModalOpen(false);
            setNewCommentData({ name: '', content: '', score: 5, images: [] });
            fetchProductComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment.');
        }
    };

    const handleImageDelete = async (commentId, imageUrl) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                await deleteCommentImage(commentId, imageUrl);
                toast.success("Image deleted successfully!");
                fetchProductComments();
                if (editingComment && editingComment.id === commentId) {
                    setEditingComment(prev => ({
                        ...prev,
                        images: prev.images.filter(img => img !== imageUrl)
                    }));
                }
            } catch (error) {
                toast.error("Failed to delete image.");
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Comments for {product?.name}</h1>
                <div>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mr-4">
                        Add New Comment
                    </button>
                    <Link to="/admin/products" className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                        Back to Products
                    </Link>
                </div>
            </div>

            {/* Add Comment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Comment</h2>
                        <form onSubmit={handleAddNewComment}>
                            {/* Form fields for adding a comment */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newName">
                                    Display Name
                                </label>
                                <input id="newName" type="text" name="name" value={newCommentData.name} onChange={handleNewCommentChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newContent">
                                    Content
                                </label>
                                <textarea id="newContent" name="content" value={newCommentData.content} onChange={handleNewCommentChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows="4" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newScore">
                                    Score
                                </label>
                                <input id="newScore" type="number" name="score" min="1" max="5" value={newCommentData.score} onChange={handleNewCommentChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newImages">
                                    Images
                                </label>
                                <input id="newImages" type="file" name="images" onChange={handleNewCommentImageChange} multiple className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add Comment
                                </button>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Comment Modal */}
            {editingComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Comment</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    value={editingComment.content}
                                    onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="4"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score">
                                    Score
                                </label>
                                <input
                                    id="score"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={editingComment.score}
                                    onChange={(e) => setEditingComment({ ...editingComment, score: parseInt(e.target.value, 10) })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                                <div className="flex flex-wrap gap-2">
                                    {editingComment.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img src={image} alt="" className="w-24 h-24 object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(editingComment.id, image)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingComment(null)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {comments.map((comment) => (
                        <tr key={comment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{comment.userFullName}</td>
                            <td className="px-6 py-4">{comment.content}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{comment.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => handleEdit(comment)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button onClick={() => handleDelete(comment.id)} className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductCommentsPage;
import React, { useState, useEffect } from 'react';
import { getAllComments, updateComment, deleteComment } from '../../api/apiService';
import { toast } from 'react-toastify';

const AdminCommentsPage = () => {
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await getAllComments();
            setComments(response.data);
        } catch (error) {
            toast.error("Failed to fetch comments.");
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleEdit = (comment) => {
        setEditingComment({ ...comment });
    };

    const handleDelete = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(commentId);
                toast.success("Comment deleted successfully!");
                fetchComments();
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
            fetchComments();
        } catch (error) {
            toast.error("Failed to update comment.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Comments</h1>
            {editingComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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

export default AdminCommentsPage;
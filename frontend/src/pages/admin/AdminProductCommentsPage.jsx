import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, updateProductComment, deleteProductComment, addAdminComment, deleteCommentImage } from '../../api/apiService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminProductCommentsPage = () => {
    const { t } = useLanguage();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingComment, setEditingComment] = useState(null);
    const [newImage, setNewImage] = useState([]);
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
            toast.error(t('productComments.messages.fetchError'));
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
        if (window.confirm(t('productComments.messages.deleteConfirm'))) {
            try {
                await deleteProductComment(commentId);
                toast.success(t('productComments.messages.deleteSuccess'));
                fetchProductComments();
            } catch (error) {
                toast.error(t('productComments.messages.deleteError'));
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('comment', new Blob([JSON.stringify(editingComment)], { type: "application/json" }));
        if (newImage && newImage.length > 0) {
            newImage.forEach(img => {
                formData.append('images', img);
            });
        }

        try {
            await updateProductComment(editingComment.id, formData);
            toast.success(t('productComments.messages.updateSuccess'));
            setEditingComment(null);
            setNewImage([]);
            fetchProductComments();
        } catch (error) {
            toast.error(t('productComments.messages.updateError'));
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
            toast.success(t('productComments.messages.addSuccess'));
            setIsAddModalOpen(false);
            setNewCommentData({ name: '', content: '', score: 5, images: [] });
            fetchProductComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error(t('productComments.messages.addError'));
        }
    };

    const handleImageDelete = async (commentId, imageUrl) => {
        if (window.confirm(t('productComments.messages.deleteImageConfirm'))) {
            try {
                await deleteCommentImage(commentId, imageUrl);
                toast.success(t('productComments.messages.deleteImageSuccess'));
                fetchProductComments();
                if (editingComment && editingComment.id === commentId) {
                    setEditingComment(prev => ({
                        ...prev,
                        images: prev.images.filter(img => img !== imageUrl)
                    }));
                }
            } catch (error) {
                toast.error(t('productComments.messages.deleteImageError'));
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('productComments.title').replace('{productName}', product?.name || '')}</h1>
                <div>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mr-4">
                        {t('productComments.addNew')}
                    </button>
                    <Link to="/admin/products" className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                        {t('productComments.backToProducts')}
                    </Link>
                </div>
            </div>

            {/* Add Comment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{t('productComments.form.addTitle')}</h2>
                        <form onSubmit={handleAddNewComment}>
                            {/* Form fields for adding a comment */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newName">
                                    {t('productComments.form.displayName')}
                                </label>
                                <input id="newName" type="text" name="name" value={newCommentData.name} onChange={handleNewCommentChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newContent">
                                    {t('productComments.form.content')}
                                </label>
                                <textarea id="newContent" name="content" value={newCommentData.content} onChange={handleNewCommentChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows="4" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newScore">
                                    {t('productComments.form.score')}
                                </label>
                                <input id="newScore" type="number" name="score" min="1" max="5" value={newCommentData.score} onChange={handleNewCommentChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newImages">
                                    {t('productComments.form.images')}
                                </label>
                                <input id="newImages" type="file" name="images" onChange={handleNewCommentImageChange} multiple className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    {t('productComments.form.add')}
                                </button>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                    {t('productComments.form.cancel')}
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
                        <h2 className="text-2xl font-bold mb-4">{t('productComments.form.editTitle')}</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    {t('productComments.form.displayName')}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={editingComment.userFullName || ''}
                                    onChange={(e) => setEditingComment({ ...editingComment, userFullName: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                    {t('productComments.form.content')}
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
                                    {t('productComments.form.score')}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">{t('productComments.form.images')}</label>
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
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                    {t('productComments.form.newImages')}
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    multiple
                                    onChange={(e) => setNewImage(Array.from(e.target.files))}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
                                />
                                {newImage && newImage.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newImage.map((file, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedImages = [...newImage];
                                                        updatedImages.splice(index, 1);
                                                        setNewImage(updatedImages);
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    {t('productComments.form.update')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingComment(null)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    {t('productComments.form.cancel')}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('productComments.table.user')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('productComments.table.comment')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('productComments.table.score')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('productComments.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {comments.map((comment) => (
                            <tr key={comment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{comment.userFullName}</td>
                                <td className="px-6 py-4">{comment.content}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{comment.score}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(comment)} className="text-indigo-600 hover:text-indigo-900">{t('productComments.table.edit')}</button>
                                    <button onClick={() => handleDelete(comment.id)} className="ml-4 text-red-600 hover:text-red-900">{t('productComments.table.delete')}</button>
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
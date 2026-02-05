import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPacks, deletePack } from '../../api/apiService'; // Correct path
import Loader from '../../components/Loader'; // Correct path
import {
    FiPlus,
    FiEdit3,
    FiThumbsUp,
    FiMessageSquare,
    FiTrash2,
    FiPackage,
    FiDollarSign,
    FiMoreVertical,
    FiEye,
    FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminPacksPage = () => {
    const { t } = useLanguage();
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingPackId, setDeletingPackId] = useState(null);
    const [hoveredPackId, setHoveredPackId] = useState(null);

    const fetchPacks = async () => {
        try {
            const response = await getAllPacks();
            const packsArray = Array.isArray(response.data) ? response.data : response.data.content;

            if (Array.isArray(packsArray)) {
                setPacks(packsArray);
            } else {
                setError(t('packForm.errors.fetchFailed'));
            }

        } catch (err) {
            setError(t('packForm.errors.fetchFailed'));
            console.error("Fetch Packs Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacks();
    }, []);

    const handleDelete = async (packId) => {
        if (window.confirm(t('managePacks.deleteConfirm'))) {
            setDeletingPackId(packId);
            try {
                await deletePack(packId);
                toast.success(t('managePacks.deleteSuccess'));
                fetchPacks(); // Refresh the list
            } catch (err) {
                setError(t('managePacks.deleteFailed'));
                toast.error(t('managePacks.deleteFailed') + ' Please try again.');
            } finally {
                setDeletingPackId(null);
            }
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchPacks();
    };


    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Enhanced Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FiPackage className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{t('managePacks.title')}</h1>
                            <p className="text-gray-600 mt-1">{t('managePacks.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            <span>{t('adminDashboard.refresh')}</span>
                        </button>
                        <Link
                            to="/admin/packs/new"
                            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <FiPlus className="w-5 h-5" />
                            <span className="font-semibold">{t('managePacks.addNew')}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Enhanced Packs List */}
            {packs && packs.length > 0 ? (
                <div className="space-y-4">
                    {packs.map((pack) => (
                        <div
                            key={pack.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            onMouseEnter={() => setHoveredPackId(pack.id)}
                            onMouseLeave={() => setHoveredPackId(null)}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                            <FiPackage className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800 mb-1">{pack.name}</h2>
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <FiDollarSign className="w-4 h-4" />
                                                <span className="font-semibold">
                                                    {pack.price != null ? `$${pack.price.toFixed(2)}` : 'No price set'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Action Buttons */}
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            to={`/admin/packs/edit/${pack.id}`}
                                            className="group flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            <FiEdit3 className="w-4 h-4 group-hover:animate-pulse" />
                                            <span className="font-medium">{t('managePacks.actions.edit')}</span>
                                        </Link>

                                        <Link
                                            to={`/admin/packs/${pack.id}/recommendations`}
                                            className="group flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            <FiThumbsUp className="w-4 h-4 group-hover:animate-bounce" />
                                            <span className="font-medium">{t('managePacks.actions.recommendations')}</span>
                                        </Link>

                                        <Link
                                            to={`/admin/packs/${pack.id}/comments`}
                                            className="group flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            <FiMessageSquare className="w-4 h-4 group-hover:animate-pulse" />
                                            <span className="font-medium">{t('managePacks.actions.comments')}</span>
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(pack.id)}
                                            disabled={deletingPackId === pack.id}
                                            className="group flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deletingPackId === pack.id ? (
                                                <FiRefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <FiTrash2 className="w-4 h-4 group-hover:animate-pulse" />
                                            )}
                                            <span className="font-medium">
                                                {deletingPackId === pack.id ? t('managePacks.actions.deleting') : t('managePacks.actions.delete')}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Pack Description Preview */}
                                {pack.description && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {pack.description.replace(/<[^>]*>/g, '').substring(0, 150)}
                                            {pack.description.length > 150 && '...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('managePacks.noPacks')}</h3>
                    <p className="text-gray-500 mb-6">{t('managePacks.noPacksDesc')}</p>
                    <Link
                        to="/admin/packs/new"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span className="font-semibold">{t('managePacks.createFirst')}</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminPacksPage;
import React, { useState, useEffect } from 'react';
import { getAllPermissions, createPermission, updatePermission, deletePermission, getAllResources, getAllActions } from '../../api/rbacService';
import { FiPlus, FiEdit3, FiTrash2, FiSave, FiX, FiKey, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminPermissionsPage = () => {
    const { t } = useLanguage();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [filterResource, setFilterResource] = useState('ALL');
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        resource: '',
        action: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [permsRes, resourcesRes] = await Promise.all([
                getAllPermissions(),
                getAllResources()
            ]);
            setPermissions(permsRes.data);
            setResources(resourcesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(t('permissionsPage.messages.fetchFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Auto-generate name from resource and action
            const permissionData = {
                ...formData,
                name: `${formData.resource}:${formData.action}`
            };

            if (editingPermission) {
                await updatePermission(editingPermission.id, permissionData);
                toast.success(t('permissionsPage.messages.updateSuccess'));
            } else {
                await createPermission(permissionData);
                toast.success(t('permissionsPage.messages.createSuccess'));
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving permission:', error);
            toast.error(error.response?.data?.message || t('permissionsPage.messages.saveFailed'));
        }
    };

    const handleEdit = (permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name,
            description: permission.description || '',
            resource: permission.resource,
            action: permission.action
        });
        setShowModal(true);
    };

    const handleDelete = async (permissionId, permissionName) => {
        if (window.confirm(t('permissionsPage.messages.deleteConfirm').replace('{name}', permissionName))) {
            try {
                await deletePermission(permissionId);
                toast.success(t('permissionsPage.messages.deleteSuccess'));
                fetchData();
            } catch (error) {
                console.error('Error deleting permission:', error);
                toast.error(error.response?.data?.message || t('permissionsPage.messages.deleteFailed'));
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', resource: '', action: '' });
        setEditingPermission(null);
    };

    const filteredPermissions = filterResource === 'ALL'
        ? permissions
        : permissions.filter(p => p.resource === filterResource);

    const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) {
            acc[perm.resource] = [];
        }
        acc[perm.resource].push(perm);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <FiKey className="mr-3 text-pink-600" />
                            {t('permissionsPage.title')}
                        </h1>
                        <p className="text-gray-600 mt-2">{t('permissionsPage.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
                    >
                        <FiPlus className="mr-2" />
                        {t('permissionsPage.createButton')}
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4">
                    <FiFilter className="text-gray-600" />
                    <label className="text-gray-700 font-medium">{t('permissionsPage.filterResource')}</label>
                    <select
                        value={filterResource}
                        onChange={(e) => setFilterResource(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="ALL">{t('permissionsPage.allResources')}</option>
                        {resources.map(resource => (
                            <option key={resource} value={resource}>{resource}</option>
                        ))}
                    </select>
                    <span className="text-gray-500 text-sm">
                        {t('permissionsPage.showingCount').replace('{count}', filteredPermissions.length).replace('{total}', permissions.length)}
                    </span>
                </div>
            </div>

            {/* Permissions by Resource */}
            <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                    <div key={resource} className="bg-white rounded-xl shadow-lg">
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
                            <h3 className="text-lg font-bold text-gray-900">{resource}</h3>
                            <p className="text-gray-600 text-sm">{perms.length} permission(s)</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {perms.map(perm => (
                                    <div key={perm.id} className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">{perm.action}</h4>
                                                <p className="text-gray-500 text-xs mt-1">{perm.name}</p>
                                            </div>
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => handleEdit(perm)}
                                                    className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                                                >
                                                    <FiEdit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(perm.id, perm.name)}
                                                    className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {perm.description && (
                                            <p className="text-gray-600 text-sm mt-2">{perm.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FiKey className="mr-2 text-pink-600" />
                                    {editingPermission ? t('permissionsPage.editPermission') : t('permissionsPage.createPermission')}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Resource */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    {t('permissionsPage.resource')} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.resource}
                                    onChange={(e) => setFormData({ ...formData, resource: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder={t('permissionsPage.resourcePlaceholder')}
                                    required
                                />
                            </div>

                            {/* Action */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    {t('permissionsPage.action')} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.action}
                                    onChange={(e) => setFormData({ ...formData, action: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder={t('permissionsPage.actionPlaceholder')}
                                    required
                                />
                            </div>

                            {/* Auto-generated Name Preview */}
                            {formData.resource && formData.action && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-gray-600">{t('permissionsPage.permissionName')}</p>
                                    <p className="font-bold text-blue-900">{formData.resource}:{formData.action}</p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    {t('permissionsPage.description')}
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder={t('permissionsPage.descriptionPlaceholder')}
                                    rows="3"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                >
                                    <FiX className="mr-2" />
                                    {t('permissionsPage.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
                                >
                                    <FiSave className="mr-2" />
                                    {editingPermission ? t('permissionsPage.update') : t('permissionsPage.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPermissionsPage;


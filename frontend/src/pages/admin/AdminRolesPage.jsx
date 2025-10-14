import React, { useState, useEffect } from 'react';
import { getAllRoles, getAllPermissions, createRole, updateRole, deleteRole, assignPermissionsToRole } from '../../api/rbacService';
import { FiPlus, FiEdit3, FiTrash2, FiSave, FiX, FiShield, FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminRolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissionIds: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rolesRes, permsRes] = await Promise.all([
                getAllRoles(),
                getAllPermissions()
            ]);
            setRoles(rolesRes.data);
            setPermissions(permsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch roles and permissions');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await updateRole(editingRole.id, formData);
                toast.success('Role updated successfully!');
            } else {
                await createRole(formData);
                toast.success('Role created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving role:', error);
            toast.error(error.response?.data?.message || 'Failed to save role');
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            permissionIds: role.permissions?.map(p => p.id) || []
        });
        setShowModal(true);
    };

    const handleDelete = async (roleId, roleName) => {
        if (window.confirm(`Are you sure you want to delete role "${roleName}"? This cannot be undone.`)) {
            try {
                await deleteRole(roleId);
                toast.success('Role deleted successfully!');
                fetchData();
            } catch (error) {
                console.error('Error deleting role:', error);
                toast.error(error.response?.data?.message || 'Failed to delete role. It may be assigned to users.');
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', permissionIds: [] });
        setEditingRole(null);
    };

    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter(id => id !== permissionId)
                : [...prev.permissionIds, permissionId]
        }));
    };

    const groupPermissionsByResource = () => {
        const grouped = {};
        permissions.forEach(perm => {
            if (!grouped[perm.resource]) {
                grouped[perm.resource] = [];
            }
            grouped[perm.resource].push(perm);
        });
        return grouped;
    };

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
                            <FiShield className="mr-3 text-pink-600" />
                            Role Management
                        </h1>
                        <p className="text-gray-600 mt-2">Create and manage roles with specific permissions</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
                    >
                        <FiPlus className="mr-2" />
                        Create New Role
                    </button>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <FiLock className="text-pink-600 mr-2" />
                                        <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">{role.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(role)}
                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                    >
                                        <FiEdit3 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(role.id, role.name)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm font-medium">Permissions:</span>
                                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {role.permissions?.length || 0}
                                    </span>
                                </div>
                                {role.permissions && role.permissions.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {role.permissions.slice(0, 6).map(perm => (
                                            <span key={perm.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                {perm.name}
                                            </span>
                                        ))}
                                        {role.permissions.length > 6 && (
                                            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                                                +{role.permissions.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FiShield className="mr-2 text-pink-600" />
                                    {editingRole ? 'Edit Role' : 'Create New Role'}
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
                            {/* Role Name */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Role Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="e.g., ROLE_CONTENT_MANAGER"
                                    required
                                />
                                <p className="text-gray-500 text-sm mt-1">Use format: ROLE_NAME (e.g., ROLE_MANAGER)</p>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Describe what this role can do..."
                                    rows="3"
                                />
                            </div>

                            {/* Permissions */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-3">
                                    Assign Permissions ({formData.permissionIds.length} selected)
                                </label>
                                
                                <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                    {Object.entries(groupPermissionsByResource()).map(([resource, perms]) => (
                                        <div key={resource} className="border-b border-gray-100 pb-4 last:border-0">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <FiLock className="mr-2 text-pink-600" />
                                                {resource}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {perms.map(perm => (
                                                    <label key={perm.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.permissionIds.includes(perm.id)}
                                                            onChange={() => handlePermissionToggle(perm.id)}
                                                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                        />
                                                        <span className="text-gray-700 text-sm flex-1">{perm.action}</span>
                                                        <span className="text-gray-500 text-xs">{perm.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
                                >
                                    <FiSave className="mr-2" />
                                    {editingRole ? 'Update Role' : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRolesPage;


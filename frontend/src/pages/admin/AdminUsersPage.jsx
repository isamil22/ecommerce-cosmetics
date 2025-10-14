import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../api/apiService';
import { getAllRoles, getUserRoles, assignRolesToUser, getUserPermissions } from '../../api/rbacService';
import { FiShield, FiKey, FiEdit3, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [availableRoles, setAvailableRoles] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState([]);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        }
    };

    const fetchAvailableRoles = async () => {
        try {
            const response = await getAllRoles();
            setAvailableRoles(response.data);
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAvailableRoles();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setError('');
        setSuccess('');
        try {
            await updateUserRole(userId, newRole);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            setSuccess(`User #${userId}'s role updated to ${newRole}.`);
        } catch (err) {
            setError(`Failed to update role for user #${userId}.`);
            console.error(err);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm(`Are you sure you want to delete user #${userId}? This action cannot be undone.`)) {
            setError('');
            setSuccess('');
            try {
                await deleteUser(userId);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                setSuccess(`User #${userId} has been deleted.`);
                toast.success('User deleted successfully!');
            } catch (err) {
                setError(`Failed to delete user #${userId}.`);
                console.error(err);
                toast.error('Failed to delete user');
            }
        }
    };

    const handleManageRoles = async (user) => {
        try {
            setSelectedUser(user);
            const rolesRes = await getUserRoles(user.id);
            setUserRoles(rolesRes.data);
            setSelectedRoleIds(rolesRes.data.map(r => r.id));
            setShowRoleModal(true);
        } catch (error) {
            console.error('Error fetching user roles:', error);
            toast.error('Failed to load user roles');
        }
    };

    const handleViewPermissions = async (user) => {
        try {
            setSelectedUser(user);
            const permsRes = await getUserPermissions(user.id);
            setUserPermissions(permsRes.data);
            setShowPermissionsModal(true);
        } catch (error) {
            console.error('Error fetching user permissions:', error);
            toast.error('Failed to load user permissions');
        }
    };

    const handleSaveRoles = async () => {
        try {
            await assignRolesToUser(selectedUser.id, selectedRoleIds);
            toast.success('Roles assigned successfully!');
            setShowRoleModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error assigning roles:', error);
            toast.error('Failed to assign roles');
        }
    };

    const toggleRoleSelection = (roleId) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{success}</p>}

            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legacy Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RBAC Roles</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email Confirmed</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="block w-full text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <button
                                    onClick={() => handleManageRoles(user)}
                                    className="flex items-center space-x-1 text-pink-600 hover:text-pink-800 hover:bg-pink-50 px-3 py-1 rounded-lg transition-colors"
                                >
                                    <FiShield className="w-4 h-4" />
                                    <span>Manage</span>
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.emailConfirmation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.emailConfirmation ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => handleViewPermissions(user)}
                                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                        title="View Permissions"
                                    >
                                        <FiKey className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Delete User"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Manage Roles Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FiShield className="mr-2 text-pink-600" />
                                    Manage Roles - {selectedUser.email}
                                </h2>
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-600 text-sm mb-4">
                                    Select the roles to assign to this user. Users can have multiple roles.
                                </p>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {availableRoles.map(role => (
                                        <label key={role.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200 hover:border-pink-300 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={selectedRoleIds.includes(role.id)}
                                                onChange={() => toggleRoleSelection(role.id)}
                                                className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                            />
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{role.name}</div>
                                                <div className="text-gray-600 text-sm">{role.description}</div>
                                                <div className="text-gray-500 text-xs mt-1">
                                                    {role.permissions?.length || 0} permissions
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                >
                                    <FiX className="mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRoles}
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
                                >
                                    <FiSave className="mr-2" />
                                    Save Roles
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Permissions Modal */}
            {showPermissionsModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200 rounded-t-2xl sticky top-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FiKey className="mr-2 text-blue-600" />
                                    User Permissions - {selectedUser.email}
                                </h2>
                                <button
                                    onClick={() => setShowPermissionsModal(false)}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                This user has <strong>{userPermissions.length}</strong> permissions through their assigned roles.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {userPermissions.map(perm => (
                                    <div key={perm.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                        <FiKey className="w-4 h-4 text-green-600" />
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">{perm.name}</div>
                                            <div className="text-gray-500 text-xs">{perm.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, updateUserRole, deleteUser, exportUsersToCsv } from '../../api/apiService';
import UserEditModal from '../../components/UserEditModal';
import UserCreateModal from '../../components/UserCreateModal';
import { 
    FiSearch, FiFilter, FiRefreshCw, FiPlus, FiEdit3, FiTrash2, 
    FiUsers, FiShield, FiMail, FiCheckCircle, FiXCircle, FiMoreVertical,
    FiDownload, FiUpload, FiEye, FiSettings, FiTrendingUp, FiCalendar,
    FiUserCheck, FiUserX, FiCrown, FiUser, FiSortAsc, FiSortDesc,
    FiClock, FiPhone, FiImage, FiFileText, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('table');
    
    // Bulk Actions
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    
    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    // Animation States
    const [hoveredUserId, setHoveredUserId] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            const matchesSearch = 
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toString().includes(searchTerm);
            
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'confirmed' && user.emailConfirmation) ||
                (statusFilter === 'unconfirmed' && !user.emailConfirmation);
            
            const matchesActive = user.isActive !== false; // Default to active if not set
            
            return matchesSearch && matchesRole && matchesStatus;
        });

        // Sort users
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'fullName':
                    aValue = (a.fullName || '').toLowerCase();
                    bValue = (b.fullName || '').toLowerCase();
                    break;
                case 'role':
                    aValue = a.role;
                    bValue = b.role;
                    break;
                case 'emailConfirmation':
                    aValue = a.emailConfirmation ? 1 : 0;
                    bValue = b.emailConfirmation ? 1 : 0;
                    break;
                case 'lastLoginAt':
                    aValue = a.lastLoginAt ? new Date(a.lastLoginAt) : new Date(0);
                    bValue = b.lastLoginAt ? new Date(b.lastLoginAt) : new Date(0);
                    break;
                case 'isActive':
                    aValue = a.isActive !== false ? 1 : 0;
                    bValue = b.isActive !== false ? 1 : 0;
                    break;
                default:
                    aValue = a.id;
                    bValue = b.id;
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

    // User statistics
    const userStats = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role === 'ADMIN').length;
        const regularUsers = users.filter(u => u.role === 'USER').length;
        const confirmed = users.filter(u => u.emailConfirmation).length;
        const unconfirmed = total - confirmed;
        
        return { total, admins, regularUsers, confirmed, unconfirmed };
    }, [users]);

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
            setDeletingUserId(userId);
            setError('');
            setSuccess('');
            try {
                await deleteUser(userId);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                setSuccess(`User #${userId} has been deleted.`);
                setSelectedUsers(prev => prev.filter(id => id !== userId));
            } catch (err) {
                setError(`Failed to delete user #${userId}.`);
                console.error(err);
            } finally {
                setDeletingUserId(null);
            }
        }
    };

    // Bulk Actions
    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredAndSortedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredAndSortedUsers.map(user => user.id));
        }
    };

    const handleBulkRoleChange = async (newRole) => {
        if (selectedUsers.length === 0) return;
        
        setError('');
        setSuccess('');
        try {
            const promises = selectedUsers.map(userId => updateUserRole(userId, newRole));
            await Promise.all(promises);
            
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    selectedUsers.includes(user.id) ? { ...user, role: newRole } : user
                )
            );
            setSuccess(`${selectedUsers.length} users updated to ${newRole} role.`);
            setSelectedUsers([]);
        } catch (err) {
            setError('Failed to update some user roles.');
            console.error(err);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) return;
        
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
            setError('');
            setSuccess('');
            try {
                const promises = selectedUsers.map(userId => deleteUser(userId));
                await Promise.all(promises);
                
                setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
                setSuccess(`${selectedUsers.length} users have been deleted.`);
                setSelectedUsers([]);
            } catch (err) {
                setError('Failed to delete some users.');
                console.error(err);
            }
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleEditSuccess = (message) => {
        setSuccess(message);
        setError('');
        fetchUsers(); // Refresh the user list
    };

    const handleExportUsers = async () => {
        try {
            const response = await exportUsersToCsv();
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setSuccess('Users exported successfully!');
        } catch (err) {
            setError('Failed to export users');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-600">Manage users, roles, and permissions</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleExportUsers}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FiDownload className="mr-2" />
                        Export CSV
                    </button>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                        <FiPlus className="mr-2" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <FiXCircle className="mr-2" />
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <FiCheckCircle className="mr-2" />
                    {success}
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiUsers className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FiCrown className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">{userStats.admins}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiUser className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Regular Users</p>
                            <p className="text-2xl font-bold text-gray-900">{userStats.regularUsers}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <FiUserCheck className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Confirmed</p>
                            <p className="text-2xl font-bold text-gray-900">{userStats.confirmed}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <FiUserX className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Unconfirmed</p>
                            <p className="text-2xl font-bold text-gray-900">{userStats.unconfirmed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by email, name, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                    </div>
                    
                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="USER">Users</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                    
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="unconfirmed">Unconfirmed</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FiSettings className="mr-2 text-pink-600" />
                            <span className="text-pink-800 font-medium">
                                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleBulkRoleChange('ADMIN')}
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                            >
                                Make Admin
                            </button>
                            <button
                                onClick={() => handleBulkRoleChange('USER')}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                                Make User
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                    />
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex items-center">
                                        ID
                                        {sortBy === 'id' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('fullName')}
                                >
                                    <div className="flex items-center">
                                        Name
                                        {sortBy === 'fullName' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center">
                                        Email
                                        {sortBy === 'email' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center">
                                        Role
                                        {sortBy === 'role' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('emailConfirmation')}
                                >
                                    <div className="flex items-center">
                                        Status
                                        {sortBy === 'emailConfirmation' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('lastLoginAt')}
                                >
                                    <div className="flex items-center">
                                        Last Login
                                        {sortBy === 'lastLoginAt' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('isActive')}
                                >
                                    <div className="flex items-center">
                                        Active
                                        {sortBy === 'isActive' && (
                                            sortOrder === 'asc' ? <FiSortAsc className="ml-1" /> : <FiSortDesc className="ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedUsers.map((user) => (
                                <tr 
                                    key={user.id} 
                                    className={`hover:bg-gray-50 transition-colors ${selectedUsers.includes(user.id) ? 'bg-pink-50' : ''}`}
                                    onMouseEnter={() => setHoveredUserId(user.id)}
                                    onMouseLeave={() => setHoveredUserId(null)}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{user.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.fullName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <FiMail className="mr-2 text-gray-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                                user.role === 'ADMIN' 
                                                    ? 'bg-purple-100 text-purple-800 border-purple-200' 
                                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                            }`}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.emailConfirmation 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.emailConfirmation ? (
                                                <>
                                                    <FiCheckCircle className="mr-1" />
                                                    Confirmed
                                                </>
                                            ) : (
                                                <>
                                                    <FiXCircle className="mr-1" />
                                                    Unconfirmed
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.lastLoginAt ? (
                                            <div className="flex items-center">
                                                <FiClock className="mr-1 text-gray-400" />
                                                {new Date(user.lastLoginAt).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Never</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.isActive !== false 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.isActive !== false ? (
                                                <>
                                                    <FiToggleRight className="mr-1" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <FiToggleLeft className="mr-1" />
                                                    Inactive
                                                </>
                                            )}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                                                title="Edit User"
                                            >
                                                <FiEdit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                disabled={deletingUserId === user.id}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                                                title="Delete User"
                                            >
                                                {deletingUserId === user.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                ) : (
                                                    <FiTrash2 className="h-4 w-4" />
                                                )}
                                </button>
                                        </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
                
                {/* Empty State */}
                {filteredAndSortedUsers.length === 0 && (
                    <div className="text-center py-12">
                        <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'Get started by creating a new user.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className="mt-6 text-sm text-gray-600">
                Showing {filteredAndSortedUsers.length} of {users.length} users
                {searchTerm && ` matching "${searchTerm}"`}
                {roleFilter !== 'all' && ` with role "${roleFilter}"`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            </div>

            {/* User Edit Modal */}
            <UserEditModal
                user={editingUser}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                }}
                onSuccess={handleEditSuccess}
            />

            {/* User Create Modal */}
            <UserCreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default AdminUsersPage;
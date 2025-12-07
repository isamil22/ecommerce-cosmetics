// frontend/src/api/rbacService.js
// API service for RBAC (Role-Based Access Control) operations

import axios from 'axios';

// Use relative URL so Nginx can proxy requests to backend in Docker
const API_URL = '/api';

// Get JWT token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========================================
// Role Management APIs
// ========================================

/**
 * Get all roles with their permissions
 */
export const getAllRoles = () => {
    return axios.get(`${API_URL}/roles`, { headers: getAuthHeaders() });
};

/**
 * Get a specific role by ID
 */
export const getRoleById = (roleId) => {
    return axios.get(`${API_URL}/roles/${roleId}`, { headers: getAuthHeaders() });
};

/**
 * Get a role by name
 */
export const getRoleByName = (roleName) => {
    return axios.get(`${API_URL}/roles/name/${roleName}`, { headers: getAuthHeaders() });
};

/**
 * Create a new role
 */
export const createRole = (roleData) => {
    return axios.post(`${API_URL}/roles`, roleData, { headers: getAuthHeaders() });
};

/**
 * Update an existing role
 */
export const updateRole = (roleId, roleData) => {
    return axios.put(`${API_URL}/roles/${roleId}`, roleData, { headers: getAuthHeaders() });
};

/**
 * Delete a role
 */
export const deleteRole = (roleId) => {
    return axios.delete(`${API_URL}/roles/${roleId}`, { headers: getAuthHeaders() });
};

/**
 * Assign permissions to a role
 */
export const assignPermissionsToRole = (roleId, permissionIds) => {
    return axios.post(`${API_URL}/roles/${roleId}/permissions`, permissionIds, { headers: getAuthHeaders() });
};

/**
 * Add a single permission to a role
 */
export const addPermissionToRole = (roleId, permissionId) => {
    return axios.post(`${API_URL}/roles/${roleId}/permissions/${permissionId}`, {}, { headers: getAuthHeaders() });
};

/**
 * Remove a permission from a role
 */
export const removePermissionFromRole = (roleId, permissionId) => {
    return axios.delete(`${API_URL}/roles/${roleId}/permissions/${permissionId}`, { headers: getAuthHeaders() });
};

/**
 * Search roles by name
 */
export const searchRoles = (namePattern) => {
    return axios.get(`${API_URL}/roles/search`, {
        params: { name: namePattern },
        headers: getAuthHeaders()
    });
};

// ========================================
// Permission Management APIs
// ========================================

/**
 * Get all permissions
 */
export const getAllPermissions = () => {
    return axios.get(`${API_URL}/permissions`, { headers: getAuthHeaders() });
};

/**
 * Get a specific permission by ID
 */
export const getPermissionById = (permissionId) => {
    return axios.get(`${API_URL}/permissions/${permissionId}`, { headers: getAuthHeaders() });
};

/**
 * Get a permission by name
 */
export const getPermissionByName = (permissionName) => {
    return axios.get(`${API_URL}/permissions/name/${permissionName}`, { headers: getAuthHeaders() });
};

/**
 * Create a new permission
 */
export const createPermission = (permissionData) => {
    return axios.post(`${API_URL}/permissions`, permissionData, { headers: getAuthHeaders() });
};

/**
 * Update an existing permission
 */
export const updatePermission = (permissionId, permissionData) => {
    return axios.put(`${API_URL}/permissions/${permissionId}`, permissionData, { headers: getAuthHeaders() });
};

/**
 * Delete a permission
 */
export const deletePermission = (permissionId) => {
    return axios.delete(`${API_URL}/permissions/${permissionId}`, { headers: getAuthHeaders() });
};

/**
 * Get all unique resource names
 */
export const getAllResources = () => {
    return axios.get(`${API_URL}/permissions/resources`, { headers: getAuthHeaders() });
};

/**
 * Get all unique action names
 */
export const getAllActions = () => {
    return axios.get(`${API_URL}/permissions/actions`, { headers: getAuthHeaders() });
};

/**
 * Get permissions by resource
 */
export const getPermissionsByResource = (resource) => {
    return axios.get(`${API_URL}/permissions/resource/${resource}`, { headers: getAuthHeaders() });
};

/**
 * Get permissions by action
 */
export const getPermissionsByAction = (action) => {
    return axios.get(`${API_URL}/permissions/action/${action}`, { headers: getAuthHeaders() });
};

/**
 * Get permissions for a specific role
 */
export const getRolePermissions = (roleId) => {
    return axios.get(`${API_URL}/permissions/role/${roleId}`, { headers: getAuthHeaders() });
};

/**
 * Search permissions by name
 */
export const searchPermissionsByName = (namePattern) => {
    return axios.get(`${API_URL}/permissions/search/name`, {
        params: { name: namePattern },
        headers: getAuthHeaders()
    });
};

/**
 * Search permissions by resource
 */
export const searchPermissionsByResource = (resourcePattern) => {
    return axios.get(`${API_URL}/permissions/search/resource`, {
        params: { resource: resourcePattern },
        headers: getAuthHeaders()
    });
};

// ========================================
// User Role Assignment APIs
// ========================================

/**
 * Assign roles to a user (replaces existing roles)
 */
export const assignRolesToUser = (userId, roleIds) => {
    return axios.post(`${API_URL}/users/${userId}/roles`, roleIds, { headers: getAuthHeaders() });
};

/**
 * Add a single role to a user
 */
export const addRoleToUser = (userId, roleId) => {
    return axios.post(`${API_URL}/users/${userId}/roles/${roleId}`, {}, { headers: getAuthHeaders() });
};

/**
 * Remove a role from a user
 */
export const removeRoleFromUser = (userId, roleId) => {
    return axios.delete(`${API_URL}/users/${userId}/roles/${roleId}`, { headers: getAuthHeaders() });
};

/**
 * Get all roles for a specific user
 */
export const getUserRoles = (userId) => {
    return axios.get(`${API_URL}/users/${userId}/roles`, { headers: getAuthHeaders() });
};

/**
 * Get all permissions for a specific user
 */
export const getUserPermissions = (userId) => {
    return axios.get(`${API_URL}/users/${userId}/permissions`, { headers: getAuthHeaders() });
};

/**
 * Check if a user has a specific permission
 */
export const checkUserPermission = (userId, permissionName) => {
    return axios.get(`${API_URL}/permissions/check`, {
        params: { userId, permissionName },
        headers: getAuthHeaders()
    });
};


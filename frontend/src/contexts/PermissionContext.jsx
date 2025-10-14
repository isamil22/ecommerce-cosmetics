// frontend/src/contexts/PermissionContext.jsx
// Context for managing user permissions throughout the app

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserPermissions } from '../api/rbacService';
import { getUserProfile } from '../api/apiService';

const PermissionContext = createContext();

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

export const PermissionProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Fetch user permissions on mount or when auth changes
    const fetchUserPermissions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setPermissions([]);
            setRoles([]);
            setUserId(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Get user profile to get their ID
            const profileResponse = await getUserProfile();
            const currentUserId = profileResponse.data.id;
            setUserId(currentUserId);

            // Fetch user's permissions
            const permissionsResponse = await getUserPermissions(currentUserId);
            const userPermissions = permissionsResponse.data || [];
            setPermissions(userPermissions);

            // Extract unique roles from user profile or permissions
            // For now, we'll use the old role field as a fallback
            const userRole = profileResponse.data.role;
            setRoles([userRole]); // Can be enhanced later to fetch actual RBAC roles

        } catch (error) {
            console.error('Error fetching user permissions:', error);
            setPermissions([]);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPermissions();
    }, []);

    // Check if user has a specific permission
    const hasPermission = (permissionName) => {
        if (loading) return false;
        
        // Admin has all permissions
        if (roles.includes('ADMIN')) return true;
        
        // Check if user has the specific permission
        return permissions.some(perm => perm.name === permissionName);
    };

    // Check if user has any of the provided permissions
    const hasAnyPermission = (permissionNames) => {
        if (loading) return false;
        if (roles.includes('ADMIN')) return true;
        
        return permissionNames.some(permName => 
            permissions.some(perm => perm.name === permName)
        );
    };

    // Check if user has all of the provided permissions
    const hasAllPermissions = (permissionNames) => {
        if (loading) return false;
        if (roles.includes('ADMIN')) return true;
        
        return permissionNames.every(permName => 
            permissions.some(perm => perm.name === permName)
        );
    };

    // Check if user has a specific role
    const hasRole = (roleName) => {
        if (loading) return false;
        return roles.includes(roleName);
    };

    // Refresh permissions (call after role assignment changes)
    const refreshPermissions = () => {
        fetchUserPermissions();
    };

    const value = {
        permissions,
        roles,
        loading,
        userId,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        refreshPermissions
    };

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};


// frontend/src/components/PermissionGuard.jsx
// Component to conditionally render content based on user permissions

import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';

const PermissionGuard = ({ 
    permission, 
    anyPermissions,
    allPermissions,
    role,
    fallback = null, 
    children 
}) => {
    // Always call the hook - React hooks must be called unconditionally
    const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, loading } = usePermissions();

    if (loading) {
        return fallback;
    }

    let hasAccess = false;

    if (role) {
        hasAccess = hasRole(role);
    } else if (permission) {
        hasAccess = hasPermission(permission);
    } else if (anyPermissions && anyPermissions.length > 0) {
        hasAccess = hasAnyPermission(anyPermissions);
    } else if (allPermissions && allPermissions.length > 0) {
        hasAccess = hasAllPermissions(allPermissions);
    }

    return hasAccess ? children : fallback;
};

export default PermissionGuard;


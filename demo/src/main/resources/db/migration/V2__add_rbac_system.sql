-- V2__add_rbac_system.sql
-- Add Role-Based Access Control (RBAC) system

-- ============================================
-- RBAC Core Tables
-- ============================================

-- Roles Table
-- Stores all available roles in the system
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions Table
-- Stores all available permissions in the system
-- Format: RESOURCE:ACTION (e.g., PRODUCT:VIEW, USER:EDIT)
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_permission_name (name),
    INDEX idx_resource (resource),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Junction Tables (Many-to-Many Relationships)
-- ============================================

-- User-Roles Junction Table
-- Allows users to have multiple roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role-Permissions Junction Table
-- Allows roles to have multiple permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Initial Data Seeding
-- ============================================

-- Insert Default Roles
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Full system access with all permissions'),
('ROLE_MANAGER', 'Manager role with limited administrative access'),
('ROLE_EDITOR', 'Editor role with content management permissions'),
('ROLE_VIEWER', 'Viewer role with read-only access'),
('ROLE_USER', 'Standard user role with basic permissions');

-- Insert Default Permissions
-- Product Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('PRODUCT:VIEW', 'View products', 'PRODUCT', 'VIEW'),
('PRODUCT:CREATE', 'Create new products', 'PRODUCT', 'CREATE'),
('PRODUCT:EDIT', 'Edit existing products', 'PRODUCT', 'EDIT'),
('PRODUCT:DELETE', 'Delete products', 'PRODUCT', 'DELETE'),

-- Order Permissions
('ORDER:VIEW', 'View orders', 'ORDER', 'VIEW'),
('ORDER:CREATE', 'Create orders', 'ORDER', 'CREATE'),
('ORDER:EDIT', 'Edit orders', 'ORDER', 'EDIT'),
('ORDER:DELETE', 'Delete orders', 'ORDER', 'DELETE'),
('ORDER:MANAGE', 'Manage order status and fulfillment', 'ORDER', 'MANAGE'),

-- User Permissions
('USER:VIEW', 'View users', 'USER', 'VIEW'),
('USER:CREATE', 'Create new users', 'USER', 'CREATE'),
('USER:EDIT', 'Edit user information', 'USER', 'EDIT'),
('USER:DELETE', 'Delete users', 'USER', 'DELETE'),
('USER:PROMOTE', 'Promote users to admin', 'USER', 'PROMOTE'),

-- Role & Permission Management
('ROLE:VIEW', 'View roles', 'ROLE', 'VIEW'),
('ROLE:CREATE', 'Create new roles', 'ROLE', 'CREATE'),
('ROLE:EDIT', 'Edit roles', 'ROLE', 'EDIT'),
('ROLE:DELETE', 'Delete roles', 'ROLE', 'DELETE'),
('ROLE:ASSIGN', 'Assign roles to users', 'ROLE', 'ASSIGN'),

('PERMISSION:VIEW', 'View permissions', 'PERMISSION', 'VIEW'),
('PERMISSION:CREATE', 'Create permissions', 'PERMISSION', 'CREATE'),
('PERMISSION:EDIT', 'Edit permissions', 'PERMISSION', 'EDIT'),
('PERMISSION:DELETE', 'Delete permissions', 'PERMISSION', 'DELETE'),
('PERMISSION:ASSIGN', 'Assign permissions to roles', 'PERMISSION', 'ASSIGN'),

-- Category Permissions
('CATEGORY:VIEW', 'View categories', 'CATEGORY', 'VIEW'),
('CATEGORY:CREATE', 'Create categories', 'CATEGORY', 'CREATE'),
('CATEGORY:EDIT', 'Edit categories', 'CATEGORY', 'EDIT'),
('CATEGORY:DELETE', 'Delete categories', 'CATEGORY', 'DELETE'),

-- Pack Permissions
('PACK:VIEW', 'View packs', 'PACK', 'VIEW'),
('PACK:CREATE', 'Create packs', 'PACK', 'CREATE'),
('PACK:EDIT', 'Edit packs', 'PACK', 'EDIT'),
('PACK:DELETE', 'Delete packs', 'PACK', 'DELETE'),

-- Custom Pack Permissions
('CUSTOM_PACK:VIEW', 'View custom packs', 'CUSTOM_PACK', 'VIEW'),
('CUSTOM_PACK:CREATE', 'Create custom packs', 'CUSTOM_PACK', 'CREATE'),
('CUSTOM_PACK:EDIT', 'Edit custom packs', 'CUSTOM_PACK', 'EDIT'),
('CUSTOM_PACK:DELETE', 'Delete custom packs', 'CUSTOM_PACK', 'DELETE'),

-- Review Permissions
('REVIEW:VIEW', 'View reviews', 'REVIEW', 'VIEW'),
('REVIEW:APPROVE', 'Approve reviews', 'REVIEW', 'APPROVE'),
('REVIEW:REJECT', 'Reject reviews', 'REVIEW', 'REJECT'),
('REVIEW:DELETE', 'Delete reviews', 'REVIEW', 'DELETE'),

-- Comment Permissions
('COMMENT:VIEW', 'View comments', 'COMMENT', 'VIEW'),
('COMMENT:APPROVE', 'Approve comments', 'COMMENT', 'APPROVE'),
('COMMENT:REJECT', 'Reject comments', 'COMMENT', 'REJECT'),
('COMMENT:DELETE', 'Delete comments', 'COMMENT', 'DELETE'),

-- Coupon Permissions
('COUPON:VIEW', 'View coupons', 'COUPON', 'VIEW'),
('COUPON:CREATE', 'Create coupons', 'COUPON', 'CREATE'),
('COUPON:EDIT', 'Edit coupons', 'COUPON', 'EDIT'),
('COUPON:DELETE', 'Delete coupons', 'COUPON', 'DELETE'),

-- Analytics Permissions
('ANALYTICS:VIEW', 'View analytics dashboard', 'ANALYTICS', 'VIEW'),
('ANALYTICS:EXPORT', 'Export analytics data', 'ANALYTICS', 'EXPORT'),

-- Settings Permissions
('SETTINGS:VIEW', 'View settings', 'SETTINGS', 'VIEW'),
('SETTINGS:EDIT', 'Edit settings', 'SETTINGS', 'EDIT'),

-- Hero & Announcement Permissions
('HERO:VIEW', 'View hero settings', 'HERO', 'VIEW'),
('HERO:EDIT', 'Edit hero settings', 'HERO', 'EDIT'),
('ANNOUNCEMENT:VIEW', 'View announcements', 'ANNOUNCEMENT', 'VIEW'),
('ANNOUNCEMENT:EDIT', 'Edit announcements', 'ANNOUNCEMENT', 'EDIT'),

-- Dashboard Permission
('DASHBOARD:VIEW', 'View admin dashboard', 'DASHBOARD', 'VIEW');

-- ============================================
-- Assign All Permissions to ROLE_ADMIN
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'),
    id
FROM permissions;

-- ============================================
-- Assign Permissions to ROLE_MANAGER
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_MANAGER'),
    id
FROM permissions
WHERE name IN (
    'PRODUCT:VIEW', 'PRODUCT:CREATE', 'PRODUCT:EDIT',
    'ORDER:VIEW', 'ORDER:EDIT', 'ORDER:MANAGE',
    'USER:VIEW',
    'CATEGORY:VIEW', 'CATEGORY:CREATE', 'CATEGORY:EDIT',
    'PACK:VIEW', 'PACK:CREATE', 'PACK:EDIT',
    'CUSTOM_PACK:VIEW', 'CUSTOM_PACK:CREATE', 'CUSTOM_PACK:EDIT',
    'REVIEW:VIEW', 'REVIEW:APPROVE', 'REVIEW:REJECT',
    'COMMENT:VIEW', 'COMMENT:APPROVE', 'COMMENT:REJECT',
    'COUPON:VIEW', 'COUPON:CREATE', 'COUPON:EDIT',
    'ANALYTICS:VIEW',
    'DASHBOARD:VIEW'
);

-- ============================================
-- Assign Permissions to ROLE_EDITOR
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_EDITOR'),
    id
FROM permissions
WHERE name IN (
    'PRODUCT:VIEW', 'PRODUCT:CREATE', 'PRODUCT:EDIT',
    'CATEGORY:VIEW',
    'PACK:VIEW', 'PACK:CREATE', 'PACK:EDIT',
    'CUSTOM_PACK:VIEW', 'CUSTOM_PACK:CREATE', 'CUSTOM_PACK:EDIT',
    'REVIEW:VIEW', 'REVIEW:APPROVE',
    'COMMENT:VIEW', 'COMMENT:APPROVE',
    'HERO:VIEW', 'HERO:EDIT',
    'ANNOUNCEMENT:VIEW', 'ANNOUNCEMENT:EDIT',
    'DASHBOARD:VIEW'
);

-- ============================================
-- Assign Permissions to ROLE_VIEWER
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_VIEWER'),
    id
FROM permissions
WHERE name IN (
    'PRODUCT:VIEW',
    'ORDER:VIEW',
    'USER:VIEW',
    'CATEGORY:VIEW',
    'PACK:VIEW',
    'CUSTOM_PACK:VIEW',
    'REVIEW:VIEW',
    'COMMENT:VIEW',
    'COUPON:VIEW',
    'ANALYTICS:VIEW',
    'DASHBOARD:VIEW'
);

-- ============================================
-- Assign Permissions to ROLE_USER
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_USER'),
    id
FROM permissions
WHERE name IN (
    'PRODUCT:VIEW',
    'ORDER:VIEW',
    'ORDER:CREATE'
);

-- ============================================
-- Migrate Existing Users to New RBAC System
-- ============================================

-- Assign ROLE_ADMIN to users who currently have ADMIN role
INSERT INTO user_roles (user_id, role_id)
SELECT 
    u.id,
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
FROM users u
WHERE u.role = 'ADMIN';

-- Assign ROLE_USER to users who currently have USER role
INSERT INTO user_roles (user_id, role_id)
SELECT 
    u.id,
    (SELECT id FROM roles WHERE name = 'ROLE_USER')
FROM users u
WHERE u.role = 'USER';

-- ============================================
-- Notes for Future Steps
-- ============================================
-- The 'role' column in the users table is kept for backward compatibility
-- It will be deprecated in favor of the user_roles table
-- Future migration can remove the 'role' column after full RBAC implementation


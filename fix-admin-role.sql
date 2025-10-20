-- Fix admin user role assignment
-- This script will ensure the admin user has ROLE_ADMIN role

-- First, let's check the current state
SELECT 'Current admin user:' as info;
SELECT u.id, u.email, u.full_name, u.role 
FROM users u 
WHERE u.email = 'admin@example.com';

-- Check if ROLE_ADMIN exists
SELECT 'Available roles:' as info;
SELECT id, name, description FROM roles;

-- Check current role assignments for admin user
SELECT 'Current role assignments for admin:' as info;
SELECT ur.user_id, ur.role_id, r.name as role_name
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN users u ON ur.user_id = u.id
WHERE u.email = 'admin@example.com';

-- Check if admin user has ROLE_ADMIN
SELECT 'Admin user role check:' as info;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            JOIN users u ON ur.user_id = u.id 
            WHERE u.email = 'admin@example.com' AND r.name = 'ROLE_ADMIN'
        ) 
        THEN 'HAS ROLE_ADMIN' 
        ELSE 'MISSING ROLE_ADMIN' 
    END as admin_role_status;

-- If admin user doesn't have ROLE_ADMIN, assign it
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com' 
  AND r.name = 'ROLE_ADMIN'
  AND NOT EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

-- Verify the assignment
SELECT 'After assignment - admin user roles:' as info;
SELECT ur.user_id, ur.role_id, r.name as role_name
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN users u ON ur.user_id = u.id
WHERE u.email = 'admin@example.com';

-- Check HERO permissions for ROLE_ADMIN
SELECT 'HERO permissions for ROLE_ADMIN:' as info;
SELECT p.name, p.description
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
JOIN roles r ON rp.role_id = r.id
WHERE r.name = 'ROLE_ADMIN' AND p.name LIKE 'HERO%';

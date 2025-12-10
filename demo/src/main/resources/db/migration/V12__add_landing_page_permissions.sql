-- =====================================================
-- Landing Page Permissions
-- Adds RBAC permissions for landing page management
-- =====================================================

-- Insert Landing Page Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('LANDING_PAGE:VIEW', 'View landing pages in admin panel', 'LANDING_PAGE', 'VIEW'),
('LANDING_PAGE:CREATE', 'Create new landing pages', 'LANDING_PAGE', 'CREATE'),
('LANDING_PAGE:UPDATE', 'Edit existing landing pages', 'LANDING_PAGE', 'UPDATE'),
('LANDING_PAGE:DELETE', 'Delete landing pages', 'LANDING_PAGE', 'DELETE'),
('LANDING_PAGE:PUBLISH', 'Publish/unpublish landing pages', 'LANDING_PAGE', 'PUBLISH');

-- Assign Landing Page Permissions to Roles

-- ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ROLE_ADMIN'
AND p.name IN (
    'LANDING_PAGE:VIEW',
    'LANDING_PAGE:CREATE',
    'LANDING_PAGE:UPDATE',
    'LANDING_PAGE:DELETE',
    'LANDING_PAGE:PUBLISH'
);

-- MANAGER gets all landing page permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ROLE_MANAGER'
AND p.name IN (
    'LANDING_PAGE:VIEW',
    'LANDING_PAGE:CREATE',
    'LANDING_PAGE:UPDATE',
    'LANDING_PAGE:DELETE',
    'LANDING_PAGE:PUBLISH'
);

-- EDITOR gets view, create, and update permissions (no delete or publish)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ROLE_EDITOR'
AND p.name IN (
    'LANDING_PAGE:VIEW',
    'LANDING_PAGE:CREATE',
    'LANDING_PAGE:UPDATE'
);


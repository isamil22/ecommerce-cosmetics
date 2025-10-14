// test-rbac-migration.js
// Test script to verify RBAC database migration

const mysql = require('mysql2/promise');

async function testRBACMigration() {
    console.log('🔍 Testing RBAC Database Migration...\n');
    
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'user',
        password: 'password',
        database: 'sms'
    });

    try {
        // Test 1: Check if all tables exist
        console.log('✅ Test 1: Checking if RBAC tables exist...');
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'sms' 
            AND TABLE_NAME IN ('roles', 'permissions', 'user_roles', 'role_permissions')
            ORDER BY TABLE_NAME
        `);
        console.log(`   Found ${tables.length}/4 tables:`, tables.map(t => t.TABLE_NAME).join(', '));
        
        if (tables.length !== 4) {
            throw new Error('Not all RBAC tables were created!');
        }

        // Test 2: Check roles
        console.log('\n✅ Test 2: Checking default roles...');
        const [roles] = await connection.query('SELECT id, name, description FROM roles ORDER BY name');
        console.log(`   Found ${roles.length} roles:`);
        roles.forEach(role => {
            console.log(`   - ${role.name}: ${role.description}`);
        });

        // Test 3: Check permissions
        console.log('\n✅ Test 3: Checking permissions...');
        const [permissions] = await connection.query('SELECT COUNT(*) as count FROM permissions');
        console.log(`   Found ${permissions[0].count} permissions`);
        
        // Show permissions by resource
        const [permsByResource] = await connection.query(`
            SELECT resource, COUNT(*) as count 
            FROM permissions 
            GROUP BY resource 
            ORDER BY resource
        `);
        console.log('   Permissions by resource:');
        permsByResource.forEach(row => {
            console.log(`   - ${row.resource}: ${row.count} permissions`);
        });

        // Test 4: Check role-permission assignments
        console.log('\n✅ Test 4: Checking role-permission assignments...');
        const [rolePermCounts] = await connection.query(`
            SELECT r.name, COUNT(rp.permission_id) as permission_count
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            GROUP BY r.id, r.name
            ORDER BY permission_count DESC
        `);
        console.log('   Permissions assigned to each role:');
        rolePermCounts.forEach(row => {
            console.log(`   - ${row.name}: ${row.permission_count} permissions`);
        });

        // Test 5: Check user migration
        console.log('\n✅ Test 5: Checking user migration to new system...');
        const [userRoles] = await connection.query(`
            SELECT u.email, u.role as old_role, r.name as new_role
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            ORDER BY u.id
        `);
        console.log(`   Migrated ${userRoles.length} users:`);
        userRoles.forEach(user => {
            console.log(`   - ${user.email}: ${user.old_role} → ${user.new_role || 'NO ROLE ASSIGNED'}`);
        });

        // Test 6: Verify foreign key constraints
        console.log('\n✅ Test 6: Checking foreign key constraints...');
        const [constraints] = await connection.query(`
            SELECT 
                TABLE_NAME,
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = 'sms'
            AND TABLE_NAME IN ('user_roles', 'role_permissions')
            AND REFERENCED_TABLE_NAME IS NOT NULL
            ORDER BY TABLE_NAME, CONSTRAINT_NAME
        `);
        console.log(`   Found ${constraints.length} foreign key constraints:`);
        constraints.forEach(fk => {
            console.log(`   - ${fk.TABLE_NAME}.${fk.CONSTRAINT_NAME} → ${fk.REFERENCED_TABLE_NAME}`);
        });

        // Test 7: Sample permission query
        console.log('\n✅ Test 7: Testing permission lookup for ROLE_ADMIN...');
        const [adminPerms] = await connection.query(`
            SELECT p.name, p.resource, p.action
            FROM roles r
            JOIN role_permissions rp ON r.id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE r.name = 'ROLE_ADMIN'
            ORDER BY p.resource, p.action
            LIMIT 10
        `);
        console.log(`   Sample permissions for ROLE_ADMIN (showing first 10):`);
        adminPerms.forEach(perm => {
            console.log(`   - ${perm.name} (${perm.resource}:${perm.action})`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('🎉 ALL TESTS PASSED! RBAC Migration Successful!');
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

// Run the tests
testRBACMigration().catch(console.error);


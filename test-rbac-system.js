// test-rbac-system.js
// Comprehensive test for RBAC implementation (Steps 1-5)

const mysql = require('mysql2/promise');

async function testRBACSystem() {
    console.log('🔬 Testing RBAC System Implementation (Steps 1-5)\n');
    console.log('=' .repeat(70));
    
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'user',
        password: 'password',
        database: 'sms'
    });

    let allTestsPassed = true;

    try {
        // =====================================
        // TEST 1: Database Schema
        // =====================================
        console.log('\n📋 TEST 1: Verify Database Schema');
        console.log('-'.repeat(70));
        
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'sms' 
            AND TABLE_NAME IN ('roles', 'permissions', 'user_roles', 'role_permissions')
            ORDER BY TABLE_NAME
        `);
        
        if (tables.length === 4) {
            console.log('✅ All 4 RBAC tables exist:', tables.map(t => t.TABLE_NAME).join(', '));
        } else {
            console.log('❌ FAILED: Expected 4 tables, found', tables.length);
            allTestsPassed = false;
        }

        // =====================================
        // TEST 2: Roles Data
        // =====================================
        console.log('\n📋 TEST 2: Verify Roles Data');
        console.log('-'.repeat(70));
        
        const [roles] = await connection.query('SELECT * FROM roles ORDER BY name');
        console.log(`✅ Found ${roles.length} roles:`);
        roles.forEach(role => {
            console.log(`   - ${role.name}: ${role.description}`);
        });
        
        if (roles.length !== 5) {
            console.log('❌ WARNING: Expected 5 roles, found', roles.length);
            allTestsPassed = false;
        }

        // =====================================
        // TEST 3: Permissions Data
        // =====================================
        console.log('\n📋 TEST 3: Verify Permissions Data');
        console.log('-'.repeat(70));
        
        const [permissions] = await connection.query('SELECT COUNT(*) as count FROM permissions');
        console.log(`✅ Total permissions: ${permissions[0].count}`);
        
        const [permsByResource] = await connection.query(`
            SELECT resource, COUNT(*) as count 
            FROM permissions 
            GROUP BY resource 
            ORDER BY resource
        `);
        console.log('   Permissions grouped by resource:');
        permsByResource.forEach(row => {
            console.log(`   - ${row.resource}: ${row.count} permissions`);
        });
        
        if (permissions[0].count < 40) {
            console.log('❌ WARNING: Expected at least 40 permissions, found', permissions[0].count);
        }

        // =====================================
        // TEST 4: Role-Permission Assignments
        // =====================================
        console.log('\n📋 TEST 4: Verify Role-Permission Assignments');
        console.log('-'.repeat(70));
        
        const [rolePermCounts] = await connection.query(`
            SELECT r.name, COUNT(rp.permission_id) as permission_count
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            GROUP BY r.id, r.name
            ORDER BY permission_count DESC
        `);
        
        console.log('✅ Permissions assigned to each role:');
        rolePermCounts.forEach(row => {
            console.log(`   - ${row.name}: ${row.permission_count} permissions`);
        });
        
        // Verify ROLE_ADMIN has all permissions
        const adminPerms = rolePermCounts.find(r => r.name === 'ROLE_ADMIN');
        if (adminPerms && adminPerms.permission_count === permissions[0].count) {
            console.log('✅ ROLE_ADMIN correctly has all permissions');
        } else {
            console.log('❌ FAILED: ROLE_ADMIN should have all permissions');
            allTestsPassed = false;
        }

        // =====================================
        // TEST 5: User-Role Assignments
        // =====================================
        console.log('\n📋 TEST 5: Verify User-Role Assignments');
        console.log('-'.repeat(70));
        
        const [userRoles] = await connection.query(`
            SELECT u.email, u.role as old_role, r.name as new_role
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            ORDER BY u.id
        `);
        
        console.log(`✅ Found ${userRoles.length} user-role assignments:`);
        userRoles.forEach(row => {
            console.log(`   - ${row.email}: ${row.old_role} (old) → ${row.new_role || 'NO ROLE'} (new)`);
        });
        
        if (userRoles.length < 2) {
            console.log('❌ WARNING: Expected at least 2 user-role assignments');
        }

        // =====================================
        // TEST 6: Foreign Key Constraints
        // =====================================
        console.log('\n📋 TEST 6: Verify Foreign Key Constraints');
        console.log('-'.repeat(70));
        
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
        
        console.log(`✅ Found ${constraints.length} foreign key constraints:`);
        constraints.forEach(fk => {
            console.log(`   - ${fk.TABLE_NAME} → ${fk.REFERENCED_TABLE_NAME}`);
        });
        
        if (constraints.length !== 4) {
            console.log('❌ WARNING: Expected 4 foreign key constraints, found', constraints.length);
        }

        // =====================================
        // TEST 7: Sample Permission Queries
        // =====================================
        console.log('\n📋 TEST 7: Test Permission Queries');
        console.log('-'.repeat(70));
        
        // Get all permissions for ROLE_ADMIN
        const [adminPermissions] = await connection.query(`
            SELECT p.name, p.resource, p.action
            FROM roles r
            JOIN role_permissions rp ON r.id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE r.name = 'ROLE_ADMIN'
            ORDER BY p.resource, p.action
            LIMIT 10
        `);
        
        console.log('✅ Sample permissions for ROLE_ADMIN (first 10):');
        adminPermissions.forEach(perm => {
            console.log(`   - ${perm.name} (${perm.resource}:${perm.action})`);
        });

        // =====================================
        // TEST 8: User Permission Lookup
        // =====================================
        console.log('\n📋 TEST 8: Test User Permission Lookup');
        console.log('-'.repeat(70));
        
        const [adminUser] = await connection.query(`
            SELECT u.id, u.email 
            FROM users u 
            WHERE u.email = 'admin@example.com'
        `);
        
        if (adminUser.length > 0) {
            const [userPermissions] = await connection.query(`
                SELECT DISTINCT p.name
                FROM users u
                JOIN user_roles ur ON u.id = ur.user_id
                JOIN roles r ON ur.role_id = r.id
                JOIN role_permissions rp ON r.id = rp.role_id
                JOIN permissions p ON rp.permission_id = p.id
                WHERE u.id = ?
                LIMIT 10
            `, [adminUser[0].id]);
            
            console.log(`✅ Admin user has ${userPermissions.length > 0 ? userPermissions.length + '+' : 0} permissions (showing first 10):`);
            userPermissions.forEach(perm => {
                console.log(`   - ${perm.name}`);
            });
        } else {
            console.log('⚠️  No admin user found in database');
        }

        // =====================================
        // TEST 9: Check for Duplicate Data
        // =====================================
        console.log('\n📋 TEST 9: Check for Data Integrity');
        console.log('-'.repeat(70));
        
        const [duplicateRoles] = await connection.query(`
            SELECT name, COUNT(*) as count 
            FROM roles 
            GROUP BY name 
            HAVING count > 1
        `);
        
        if (duplicateRoles.length === 0) {
            console.log('✅ No duplicate role names found');
        } else {
            console.log('❌ FAILED: Duplicate roles found:', duplicateRoles);
            allTestsPassed = false;
        }
        
        const [duplicatePerms] = await connection.query(`
            SELECT name, COUNT(*) as count 
            FROM permissions 
            GROUP BY name 
            HAVING count > 1
        `);
        
        if (duplicatePerms.length === 0) {
            console.log('✅ No duplicate permission names found');
        } else {
            console.log('❌ FAILED: Duplicate permissions found:', duplicatePerms);
            allTestsPassed = false;
        }

        // =====================================
        // TEST 10: Verify Timestamps
        // =====================================
        console.log('\n📋 TEST 10: Verify Timestamps');
        console.log('-'.repeat(70));
        
        const [roleTimestamps] = await connection.query(`
            SELECT name, created_at, updated_at 
            FROM roles 
            WHERE created_at IS NOT NULL 
            LIMIT 3
        `);
        
        if (roleTimestamps.length > 0) {
            console.log('✅ Timestamps are being set correctly:');
            roleTimestamps.forEach(role => {
                console.log(`   - ${role.name}: Created ${role.created_at}`);
            });
        } else {
            console.log('❌ WARNING: No timestamps found on roles');
        }

        // =====================================
        // FINAL SUMMARY
        // =====================================
        console.log('\n' + '='.repeat(70));
        if (allTestsPassed) {
            console.log('🎉 ALL TESTS PASSED! RBAC System is working correctly!');
        } else {
            console.log('⚠️  Some tests failed or showed warnings. Review above.');
        }
        console.log('='.repeat(70));
        
        // =====================================
        // QUICK STATS
        // =====================================
        console.log('\n📊 RBAC System Statistics:');
        console.log('-'.repeat(70));
        console.log(`✅ Roles: ${roles.length}`);
        console.log(`✅ Permissions: ${permissions[0].count}`);
        console.log(`✅ User-Role Assignments: ${userRoles.length}`);
        
        const [totalRolePerms] = await connection.query('SELECT COUNT(*) as count FROM role_permissions');
        console.log(`✅ Role-Permission Assignments: ${totalRolePerms[0].count}`);
        
    } catch (error) {
        console.error('\n❌ TEST FAILED WITH ERROR:', error.message);
        console.error(error);
        allTestsPassed = false;
    } finally {
        await connection.end();
    }
    
    process.exit(allTestsPassed ? 0 : 1);
}

// Run the tests
testRBACSystem().catch(console.error);


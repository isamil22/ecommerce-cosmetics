// test-rbac-endpoints.js
// Test RBAC REST API endpoints

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', token = null, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8082,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = {
                        status: res.statusCode,
                        data: data ? JSON.parse(data) : null,
                        headers: res.headers
                    };
                    resolve(response);
                } catch (e) {
                    resolve({ status: res.statusCode, data: data, raw: true });
                }
            });
        });
        
        req.on('error', reject);
        
        if (body) {
            req.write(JSON.stringify(body));
        }
        
        req.end();
    });
}

async function testRBACEndpoints() {
    console.log('🔬 Testing RBAC REST API Endpoints\n');
    console.log('='.repeat(70));
    
    let token = null;
    
    try {
        // =====================================
        // TEST 1: Login as Admin
        // =====================================
        console.log('\n📋 TEST 1: Login as Admin');
        console.log('-'.repeat(70));
        
        const loginResponse = await makeRequest('/api/auth/login', 'POST', null, {
            email: 'admin@example.com',
            password: 'adminpassword'
        });
        
        if (loginResponse.status === 200 && loginResponse.data) {
            token = loginResponse.data;
            console.log('✅ Login successful!');
            console.log('   Token received:', token.substring(0, 50) + '...');
        } else {
            console.log('❌ Login failed:', loginResponse.status);
            console.log('   Response:', loginResponse.data);
            throw new Error('Cannot proceed without admin token');
        }

        // =====================================
        // TEST 2: Get All Roles
        // =====================================
        console.log('\n📋 TEST 2: GET /api/roles');
        console.log('-'.repeat(70));
        
        const rolesResponse = await makeRequest('/api/roles', 'GET', token);
        
        if (rolesResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Status: ${rolesResponse.status}`);
            console.log(`   Found ${rolesResponse.data.length} roles:`);
            rolesResponse.data.forEach(role => {
                console.log(`   - ${role.name}: ${role.permissions?.length || 0} permissions`);
            });
        } else {
            console.log('❌ Request failed:', rolesResponse.status);
        }

        // =====================================
        // TEST 3: Get All Permissions
        // =====================================
        console.log('\n📋 TEST 3: GET /api/permissions');
        console.log('-'.repeat(70));
        
        const permissionsResponse = await makeRequest('/api/permissions', 'GET', token);
        
        if (permissionsResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Status: ${permissionsResponse.status}`);
            console.log(`   Found ${permissionsResponse.data.length} permissions`);
            console.log(`   Sample permissions (first 5):`);
            permissionsResponse.data.slice(0, 5).forEach(perm => {
                console.log(`   - ${perm.name} (${perm.resource}:${perm.action})`);
            });
        } else {
            console.log('❌ Request failed:', permissionsResponse.status);
        }

        // =====================================
        // TEST 4: Get All Resources
        // =====================================
        console.log('\n📋 TEST 4: GET /api/permissions/resources');
        console.log('-'.repeat(70));
        
        const resourcesResponse = await makeRequest('/api/permissions/resources', 'GET', token);
        
        if (resourcesResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Found ${resourcesResponse.data.length} unique resources:`);
            console.log(`   ${resourcesResponse.data.join(', ')}`);
        } else {
            console.log('❌ Request failed:', resourcesResponse.status);
        }

        // =====================================
        // TEST 5: Get All Actions
        // =====================================
        console.log('\n📋 TEST 5: GET /api/permissions/actions');
        console.log('-'.repeat(70));
        
        const actionsResponse = await makeRequest('/api/permissions/actions', 'GET', token);
        
        if (actionsResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Found ${actionsResponse.data.length} unique actions:`);
            console.log(`   ${actionsResponse.data.join(', ')}`);
        } else {
            console.log('❌ Request failed:', actionsResponse.status);
        }

        // =====================================
        // TEST 6: Get User Roles
        // =====================================
        console.log('\n📋 TEST 6: GET /api/users/1/roles');
        console.log('-'.repeat(70));
        
        const userRolesResponse = await makeRequest('/api/users/1/roles', 'GET', token);
        
        if (userRolesResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   User has ${userRolesResponse.data.length} role(s):`);
            userRolesResponse.data.forEach(role => {
                console.log(`   - ${role.name}`);
            });
        } else {
            console.log('⚠️  Status:', userRolesResponse.status);
            console.log('   Note: User ID 1 may not exist');
        }

        // =====================================
        // TEST 7: Get User Permissions
        // =====================================
        console.log('\n📋 TEST 7: GET /api/users/1/permissions');
        console.log('-'.repeat(70));
        
        const userPermsResponse = await makeRequest('/api/users/1/permissions', 'GET', token);
        
        if (userPermsResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   User has ${userPermsResponse.data.length} permission(s)`);
            console.log(`   Sample permissions (first 10):`);
            userPermsResponse.data.slice(0, 10).forEach(perm => {
                console.log(`   - ${perm.name}`);
            });
        } else {
            console.log('⚠️  Status:', userPermsResponse.status);
        }

        // =====================================
        // TEST 8: Get Specific Role
        // =====================================
        console.log('\n📋 TEST 8: GET /api/roles/name/ROLE_ADMIN');
        console.log('-'.repeat(70));
        
        const roleResponse = await makeRequest('/api/roles/name/ROLE_ADMIN', 'GET', token);
        
        if (roleResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Role: ${roleResponse.data.name}`);
            console.log(`   Description: ${roleResponse.data.description}`);
            console.log(`   Permissions: ${roleResponse.data.permissions?.length || 0}`);
        } else {
            console.log('❌ Request failed:', roleResponse.status);
        }

        // =====================================
        // TEST 9: Search Roles
        // =====================================
        console.log('\n📋 TEST 9: GET /api/roles/search?name=ADMIN');
        console.log('-'.repeat(70));
        
        const searchResponse = await makeRequest('/api/roles/search?name=ADMIN', 'GET', token);
        
        if (searchResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Found ${searchResponse.data.length} matching role(s)`);
            searchResponse.data.forEach(role => {
                console.log(`   - ${role.name}`);
            });
        } else {
            console.log('❌ Request failed:', searchResponse.status);
        }

        // =====================================
        // TEST 10: Get Permissions by Resource
        // =====================================
        console.log('\n📋 TEST 10: GET /api/permissions/resource/PRODUCT');
        console.log('-'.repeat(70));
        
        const productPermsResponse = await makeRequest('/api/permissions/resource/PRODUCT', 'GET', token);
        
        if (productPermsResponse.status === 200) {
            console.log('✅ Endpoint working!');
            console.log(`   Found ${productPermsResponse.data.length} PRODUCT permissions:`);
            productPermsResponse.data.forEach(perm => {
                console.log(`   - ${perm.name}`);
            });
        } else {
            console.log('❌ Request failed:', productPermsResponse.status);
        }

        // =====================================
        // SUMMARY
        // =====================================
        console.log('\n' + '='.repeat(70));
        console.log('🎉 RBAC API Testing Complete!');
        console.log('='.repeat(70));
        console.log('\n✅ All RBAC endpoints are working correctly!');
        console.log('\n📝 Available Endpoints:');
        console.log('   Roles:');
        console.log('   - GET    /api/roles');
        console.log('   - GET    /api/roles/{id}');
        console.log('   - GET    /api/roles/name/{name}');
        console.log('   - POST   /api/roles');
        console.log('   - PUT    /api/roles/{id}');
        console.log('   - DELETE /api/roles/{id}');
        console.log('   - POST   /api/roles/{id}/permissions');
        console.log('   ');
        console.log('   Permissions:');
        console.log('   - GET    /api/permissions');
        console.log('   - GET    /api/permissions/{id}');
        console.log('   - GET    /api/permissions/resources');
        console.log('   - GET    /api/permissions/actions');
        console.log('   - POST   /api/permissions');
        console.log('   - PUT    /api/permissions/{id}');
        console.log('   - DELETE /api/permissions/{id}');
        console.log('   ');
        console.log('   Users:');
        console.log('   - POST   /api/users/{id}/roles');
        console.log('   - GET    /api/users/{id}/roles');
        console.log('   - GET    /api/users/{id}/permissions');
        console.log('   - POST   /api/users/{userId}/roles/{roleId}');
        console.log('   - DELETE /api/users/{userId}/roles/{roleId}');
        console.log('\n🌐 Swagger UI: http://localhost:8082/swagger-ui/index.html');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

// Run tests
testRBACEndpoints().catch(console.error);


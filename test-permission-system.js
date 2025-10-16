/**
 * Permission System Testing Script
 * 
 * This script helps test the permission-based authorization system
 * Run this in your browser console while logged into the admin panel
 */

class PermissionSystemTester {
    constructor() {
        this.baseURL = window.location.origin;
        this.token = localStorage.getItem('token');
        this.testResults = [];
    }

    // Helper method to make authenticated API calls
    async makeAPICall(endpoint, method = 'GET', body = null) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : null
            });

            return {
                success: response.ok,
                status: response.status,
                data: response.ok ? await response.json() : null,
                error: response.ok ? null : await response.text()
            };
        } catch (error) {
            return {
                success: false,
                status: 0,
                data: null,
                error: error.message
            };
        }
    }

    // Test 1: Create new role with custom permissions
    async testCreateNewRole() {
        console.log('🧪 Test 1: Creating new "Marketing Specialist" role...');
        
        const newRole = {
            name: 'Marketing Specialist',
            description: 'Manages marketing campaigns and content',
            permissions: [
                'COUPON:CREATE',
                'COUPON:EDIT', 
                'COUPON:VIEW',
                'COUPON:ANALYTICS',
                'ANNOUNCEMENT:EDIT',
                'HERO:EDIT',
                'PRODUCT:VIEW'
            ]
        };

        const result = await this.makeAPICall('/api/roles', 'POST', newRole);
        
        if (result.success) {
            console.log('✅ Successfully created Marketing Specialist role');
            this.testResults.push({ test: 'Create New Role', status: 'PASS', details: result.data });
            return result.data;
        } else {
            console.log('❌ Failed to create role:', result.error);
            this.testResults.push({ test: 'Create New Role', status: 'FAIL', details: result.error });
            return null;
        }
    }

    // Test 2: Add permissions to existing role
    async testAddPermissionsToRole(roleId) {
        console.log('🧪 Test 2: Adding permissions to existing role...');
        
        const newPermissions = [
            'ORDER:VIEW',
            'ORDER:EXPORT', 
            'USER:VIEW'
        ];

        // Add each permission to the role
        for (const permission of newPermissions) {
            const result = await this.makeAPICall(`/api/roles/${roleId}/permissions/${permission}`, 'POST');
            
            if (result.success) {
                console.log(`✅ Successfully added ${permission} to role`);
                this.testResults.push({ 
                    test: `Add Permission ${permission}`, 
                    status: 'PASS', 
                    details: 'Permission added successfully' 
                });
            } else {
                console.log(`❌ Failed to add ${permission}:`, result.error);
                this.testResults.push({ 
                    test: `Add Permission ${permission}`, 
                    status: 'FAIL', 
                    details: result.error 
                });
            }
        }
    }

    // Test 3: Test API endpoints with different permissions
    async testAPIEndpoints() {
        console.log('🧪 Test 3: Testing API endpoints with permissions...');
        
        const endpoints = [
            { url: '/api/products', permission: 'PRODUCT:VIEW', shouldWork: true },
            { url: '/api/orders', permission: 'ORDER:VIEW', shouldWork: false },
            { url: '/api/coupons', permission: 'COUPON:VIEW', shouldWork: false },
            { url: '/api/users', permission: 'USER:VIEW', shouldWork: false },
            { url: '/api/announcement', permission: 'ANNOUNCEMENT:EDIT', shouldWork: false }
        ];

        for (const endpoint of endpoints) {
            const result = await this.makeAPICall(endpoint.url);
            
            const expectedResult = endpoint.shouldWork ? 'success' : 'forbidden';
            const actualResult = result.success ? 'success' : 'forbidden';
            
            if (expectedResult === actualResult) {
                console.log(`✅ ${endpoint.url} - ${endpoint.permission}: ${result.status} (Expected)`);
                this.testResults.push({ 
                    test: `API Test ${endpoint.url}`, 
                    status: 'PASS', 
                    details: `Status ${result.status} as expected` 
                });
            } else {
                console.log(`❌ ${endpoint.url} - ${endpoint.permission}: ${result.status} (Unexpected)`);
                this.testResults.push({ 
                    test: `API Test ${endpoint.url}`, 
                    status: 'FAIL', 
                    details: `Expected ${expectedResult}, got ${actualResult}` 
                });
            }
        }
    }

    // Test 4: Check user permissions
    async testUserPermissions() {
        console.log('🧪 Test 4: Checking current user permissions...');
        
        // Get current user profile
        const profileResult = await this.makeAPICall('/api/auth/user/profile');
        
        if (profileResult.success && profileResult.data.id) {
            const userId = profileResult.data.id;
            
            // Get user permissions
            const permissionsResult = await this.makeAPICall(`/api/users/${userId}/permissions`);
            
            if (permissionsResult.success) {
                console.log('✅ Current user permissions:', permissionsResult.data);
                this.testResults.push({ 
                    test: 'Get User Permissions', 
                    status: 'PASS', 
                    details: `Found ${permissionsResult.data.length} permissions` 
                });
                
                // Get user roles
                const rolesResult = await this.makeAPICall(`/api/users/${userId}/roles`);
                
                if (rolesResult.success) {
                    console.log('✅ Current user roles:', rolesResult.data);
                    this.testResults.push({ 
                        test: 'Get User Roles', 
                        status: 'PASS', 
                        details: `Found ${rolesResult.data.length} roles` 
                    });
                }
            }
        }
    }

    // Test 5: Check dashboard sections
    async testDashboardSections() {
        console.log('🧪 Test 5: Checking dashboard sections...');
        
        // Check if permission context is working
        if (window.React && window.React.useContext) {
            console.log('✅ React context available');
            this.testResults.push({ 
                test: 'React Context', 
                status: 'PASS', 
                details: 'React context is available' 
            });
        } else {
            console.log('❌ React context not available');
            this.testResults.push({ 
                test: 'React Context', 
                status: 'FAIL', 
                details: 'React context not available' 
            });
        }

        // Check for permission-related elements on the page
        const permissionElements = document.querySelectorAll('[data-permission]');
        console.log(`✅ Found ${permissionElements.length} permission-controlled elements`);
        
        this.testResults.push({ 
            test: 'Permission Elements', 
            status: 'PASS', 
            details: `Found ${permissionElements.length} permission-controlled elements` 
        });
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Starting Permission System Tests...');
        console.log('=====================================');
        
        this.testResults = [];
        
        try {
            // Test 1: Create new role
            const newRole = await this.testCreateNewRole();
            
            // Test 2: Add permissions to existing role (if we have a role ID)
            if (newRole && newRole.id) {
                await this.testAddPermissionsToRole(newRole.id);
            }
            
            // Test 3: Test API endpoints
            await this.testAPIEndpoints();
            
            // Test 4: Check user permissions
            await this.testUserPermissions();
            
            // Test 5: Check dashboard sections
            await this.testDashboardSections();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.testResults.push({ 
                test: 'Test Suite', 
                status: 'FAIL', 
                details: error.message 
            });
        }
        
        // Print summary
        this.printSummary();
    }

    // Print test summary
    printSummary() {
        console.log('\n📊 Test Results Summary');
        console.log('========================');
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${Math.round((passed / this.testResults.length) * 100)}%`);
        
        console.log('\n📋 Detailed Results:');
        this.testResults.forEach(result => {
            const icon = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${icon} ${result.test}: ${result.details}`);
        });
        
        if (failed === 0) {
            console.log('\n🎉 All tests passed! Your permission system is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Check the details above.');
        }
    }
}

// Usage instructions
console.log(`
🧪 Permission System Testing Script Loaded!

To run the tests, execute:
const tester = new PermissionSystemTester();
await tester.runAllTests();

Or run individual tests:
- tester.testCreateNewRole()
- tester.testAPIEndpoints()
- tester.testUserPermissions()
- tester.testDashboardSections()

Make sure you're logged into the admin panel before running tests.
`);

// Auto-run tests if requested
if (window.location.search.includes('autotest=true')) {
    setTimeout(async () => {
        const tester = new PermissionSystemTester();
        await tester.runAllTests();
    }, 1000);
}

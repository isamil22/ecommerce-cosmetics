// COMPREHENSIVE ADMIN-ONLY RESTRICTION TEST
// This test verifies that only admin users can save notification settings

const axios = require('axios');

const BASE_URL = 'http://localhost:8081';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'adminpassword';
const USER_EMAIL = 'user@example.com';
const USER_PASSWORD = 'userpassword';

let adminToken = '';
let userToken = '';

async function loginAdmin() {
    try {
        console.log('🔐 Testing Admin Login...');
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        
        adminToken = response.data;
        console.log('✅ Admin login successful');
        console.log(`   Response: ${JSON.stringify(response.data)}`);
        console.log(`   Token: ${adminToken ? adminToken.substring(0, 20) + '...' : 'No token found'}`);
        return true;
    } catch (error) {
        console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function loginUser() {
    try {
        console.log('🔐 Testing Regular User Login...');
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: USER_EMAIL,
            password: USER_PASSWORD
        });
        
        userToken = response.data;
        console.log('✅ Regular user login successful');
        console.log(`   Token: ${userToken ? userToken.substring(0, 20) + '...' : 'No token found'}`);
        return true;
    } catch (error) {
        console.log('❌ Regular user login failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testAdminCanSaveSettings() {
    try {
        console.log('\n🔧 Testing Admin Can Save Settings...');
        
        const settings = {
            enabled: true,
            showPurchaseNotifications: true,
            position: 'top-right',
            notificationDurationSeconds: 5,
            showVisitorCounter: true,
            visitorCounterPosition: 'bottom-right'
        };
        
        const response = await axios.post(`${BASE_URL}/api/notification-settings`, settings, {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Admin successfully saved settings');
        console.log(`   Response: ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        console.log('❌ Admin save failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function testUserCannotSaveSettings() {
    try {
        console.log('\n🚫 Testing Regular User Cannot Save Settings...');
        
        const settings = {
            enabled: true,
            showPurchaseNotifications: true,
            position: 'top-left',
            notificationDurationSeconds: 3,
            showVisitorCounter: true,
            visitorCounterPosition: 'bottom-left'
        };
        
        const response = await axios.post(`${BASE_URL}/api/notification-settings`, settings, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('❌ Regular user should NOT be able to save settings');
        console.log(`   Unexpected success: ${JSON.stringify(response.data)}`);
        return false;
    } catch (error) {
        if (error.response?.status === 403) {
            console.log('✅ Regular user correctly blocked (403 Forbidden)');
            console.log(`   Error: ${error.response.data.message}`);
            return true;
        } else {
            console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
            return false;
        }
    }
}

async function testUnauthenticatedAccess() {
    try {
        console.log('\n🔒 Testing Unauthenticated Access...');
        
        const settings = {
            enabled: true,
            showPurchaseNotifications: true,
            position: 'top-center',
            notificationDurationSeconds: 4
        };
        
        const response = await axios.post(`${BASE_URL}/api/notification-settings`, settings, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('❌ Unauthenticated access should be blocked');
        console.log(`   Unexpected success: ${JSON.stringify(response.data)}`);
        return false;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Unauthenticated access correctly blocked (401 Unauthorized)');
            console.log(`   Error: ${error.response.data.message}`);
            return true;
        } else {
            console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
            return false;
        }
    }
}

async function testGetSettings() {
    try {
        console.log('\n📖 Testing Get Settings (Admin)...');
        
        const response = await axios.get(`${BASE_URL}/api/notification-settings`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        console.log('✅ Admin can get settings');
        console.log(`   Settings: ${JSON.stringify(response.data, null, 2)}`);
        return true;
    } catch (error) {
        console.log('❌ Admin get settings failed:', error.response?.data?.message || error.message);
        return false;
    }
}

async function runComprehensiveTest() {
    console.log('🚀 STARTING COMPREHENSIVE ADMIN-ONLY RESTRICTION TEST');
    console.log('=' .repeat(60));
    
    let testResults = [];
    
    // Test 1: Admin Login
    const adminLoginSuccess = await loginAdmin();
    testResults.push({ test: 'Admin Login', result: adminLoginSuccess });
    
    // Test 2: Regular User Login
    const userLoginSuccess = await loginUser();
    testResults.push({ test: 'User Login', result: userLoginSuccess });
    
    if (!adminLoginSuccess || !userLoginSuccess) {
        console.log('\n❌ Login tests failed. Cannot proceed with authorization tests.');
        return;
    }
    
    // Test 3: Admin Can Save Settings
    const adminSaveSuccess = await testAdminCanSaveSettings();
    testResults.push({ test: 'Admin Can Save', result: adminSaveSuccess });
    
    // Test 4: Regular User Cannot Save Settings
    const userSaveBlocked = await testUserCannotSaveSettings();
    testResults.push({ test: 'User Blocked from Save', result: userSaveBlocked });
    
    // Test 5: Unauthenticated Access Blocked
    const unauthenticatedBlocked = await testUnauthenticatedAccess();
    testResults.push({ test: 'Unauthenticated Blocked', result: unauthenticatedBlocked });
    
    // Test 6: Admin Can Get Settings
    const adminGetSuccess = await testGetSettings();
    testResults.push({ test: 'Admin Can Get Settings', result: adminGetSuccess });
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    
    const passedTests = testResults.filter(t => t.result).length;
    const totalTests = testResults.length;
    
    testResults.forEach(test => {
        const status = test.result ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} - ${test.test}`);
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log(`🎯 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Admin-only restriction is working perfectly!');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
    }
    
    console.log('=' .repeat(60));
}

// Run the test
runComprehensiveTest().catch(console.error);

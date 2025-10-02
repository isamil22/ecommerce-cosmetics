// Debug user roles and JWT tokens
const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:8081';

async function debugUserRoles() {
    try {
        console.log('🔍 DEBUGGING USER ROLES AND JWT TOKENS');
        console.log('=' .repeat(50));
        
        // Login as admin
        console.log('\n1. Admin Login:');
        const adminResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'admin@example.com',
            password: 'adminpassword'
        });
        
        const adminToken = adminResponse.data;
        console.log(`   Token: ${adminToken.substring(0, 50)}...`);
        
        // Decode JWT token
        const adminDecoded = jwt.decode(adminToken);
        console.log(`   Decoded: ${JSON.stringify(adminDecoded, null, 2)}`);
        
        // Login as user
        console.log('\n2. Regular User Login:');
        const userResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'user@example.com',
            password: 'userpassword'
        });
        
        const userToken = userResponse.data;
        console.log(`   Token: ${userToken.substring(0, 50)}...`);
        
        // Decode JWT token
        const userDecoded = jwt.decode(userToken);
        console.log(`   Decoded: ${JSON.stringify(userDecoded, null, 2)}`);
        
        // Test admin access
        console.log('\n3. Testing Admin Access:');
        try {
            const adminSettingsResponse = await axios.get(`${BASE_URL}/api/notification-settings`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            console.log('   ✅ Admin can access settings');
        } catch (error) {
            console.log(`   ❌ Admin access failed: ${error.response?.status} - ${error.response?.data?.message}`);
        }
        
        // Test user access
        console.log('\n4. Testing User Access:');
        try {
            const userSettingsResponse = await axios.get(`${BASE_URL}/api/notification-settings`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            console.log('   ❌ User should NOT be able to access settings');
        } catch (error) {
            console.log(`   ✅ User correctly blocked: ${error.response?.status} - ${error.response?.data?.message}`);
        }
        
    } catch (error) {
        console.log('❌ Debug failed:', error.message);
    }
}

debugUserRoles();

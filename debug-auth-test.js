/**
 * Debug Authentication Test
 * This script debugs the authentication process step by step
 */

const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';

async function debugAuthentication() {
    console.log('🔍 DEBUGGING AUTHENTICATION PROCESS');
    console.log('===================================\n');

    const loginData = {
        email: 'admin@example.com',
        password: 'admin123'
    };

    console.log('📝 Login data:');
    console.log(JSON.stringify(loginData, null, 2));
    console.log('\n🚀 Attempting login...');

    try {
        const response = await axios.post(`${API_BASE}/auth/login`, loginData, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Login successful!');
        console.log('📊 Response details:');
        console.log(`   Status: ${response.status}`);
        console.log(`   Status Text: ${response.statusText}`);
        console.log(`   Headers: ${JSON.stringify(response.headers, null, 2)}`);
        console.log(`   Data Type: ${typeof response.data}`);
        console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
        
        if (response.data && typeof response.data === 'string') {
            console.log(`\n🎫 JWT Token received: ${response.data.substring(0, 50)}...`);
            
            // Test the token with coupon endpoints
            console.log('\n🧪 Testing token with coupon endpoints...');
            
            try {
                const couponResponse = await axios.get(`${API_BASE}/coupons`, {
                    headers: {
                        'Authorization': `Bearer ${response.data}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
                
                console.log('✅ Token works with coupon endpoints!');
                console.log(`   Status: ${couponResponse.status}`);
                console.log(`   Coupons found: ${couponResponse.data.length || 0}`);
                
            } catch (couponError) {
                console.log('❌ Token failed with coupon endpoints');
                console.log(`   Status: ${couponError.response?.status}`);
                console.log(`   Error: ${couponError.response?.data || couponError.message}`);
            }
        }

    } catch (error) {
        console.log('❌ Login failed!');
        console.log('📊 Error details:');
        console.log(`   Status: ${error.response?.status || 'No status'}`);
        console.log(`   Status Text: ${error.response?.statusText || 'No status text'}`);
        console.log(`   Headers: ${JSON.stringify(error.response?.headers || {}, null, 2)}`);
        console.log(`   Data: ${JSON.stringify(error.response?.data || {}, null, 2)}`);
        console.log(`   Message: ${error.message}`);
        console.log(`   Code: ${error.code}`);
    }
}

// Run debug
debugAuthentication().catch(error => {
    console.error('❌ Debug script failed:', error);
});

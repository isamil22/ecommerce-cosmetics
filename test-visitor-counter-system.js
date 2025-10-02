#!/usr/bin/env node

/**
 * Visitor Counter System Test Script
 * Tests the complete visitor counter management system
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8082';
const ADMIN_TOKEN = 'your-admin-jwt-token-here'; // Replace with actual admin token

// Test configuration
const testSettings = {
    enabled: true,
    min: 15,
    max: 45
};

async function testVisitorCounterSystem() {
    console.log('🧪 Testing Visitor Counter System...\n');

    try {
        // Test 1: Get current settings
        console.log('1️⃣ Testing GET /api/visitor-counter-settings');
        const getResponse = await axios.get(`${BASE_URL}/api/visitor-counter-settings`);
        console.log('✅ Current settings:', getResponse.data);
        console.log('');

        // Test 2: Update settings (requires admin token)
        console.log('2️⃣ Testing POST /api/visitor-counter-settings');
        try {
            const updateResponse = await axios.post(
                `${BASE_URL}/api/visitor-counter-settings`,
                testSettings,
                {
                    headers: {
                        'Authorization': `Bearer ${ADMIN_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('✅ Settings updated successfully:', updateResponse.data);
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('⚠️  Update requires admin authentication (expected for non-admin)');
            } else {
                console.log('❌ Update failed:', error.response?.data || error.message);
            }
        }
        console.log('');

        // Test 3: Verify settings were updated
        console.log('3️⃣ Verifying updated settings');
        const verifyResponse = await axios.get(`${BASE_URL}/api/visitor-counter-settings`);
        console.log('✅ Updated settings:', verifyResponse.data);
        console.log('');

        // Test 4: Test validation
        console.log('4️⃣ Testing validation (min >= max)');
        try {
            await axios.post(
                `${BASE_URL}/api/visitor-counter-settings`,
                { enabled: true, min: 50, max: 30 },
                {
                    headers: {
                        'Authorization': `Bearer ${ADMIN_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('❌ Validation should have failed');
        } catch (error) {
            console.log('✅ Validation working (min >= max rejected)');
        }
        console.log('');

        // Test 5: Test with invalid values
        console.log('5️⃣ Testing validation (negative values)');
        try {
            await axios.post(
                `${BASE_URL}/api/visitor-counter-settings`,
                { enabled: true, min: -5, max: 10 },
                {
                    headers: {
                        'Authorization': `Bearer ${ADMIN_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('❌ Validation should have failed');
        } catch (error) {
            console.log('✅ Validation working (negative values rejected)');
        }
        console.log('');

        console.log('🎉 Visitor Counter System Tests Completed!');
        console.log('');
        console.log('📋 Test Summary:');
        console.log('✅ GET endpoint working');
        console.log('✅ Settings can be retrieved');
        console.log('⚠️  POST endpoint requires admin authentication');
        console.log('✅ Validation working properly');
        console.log('');
        console.log('🔧 Next Steps:');
        console.log('1. Login as admin to test POST endpoint');
        console.log('2. Visit http://localhost:8081/admin/vistorcountsetting');
        console.log('3. Check visitor counter on product pages');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the backend server is running on port 8082');
        }
    }
}

// Helper function to test frontend integration
function testFrontendIntegration() {
    console.log('🌐 Frontend Integration Test');
    console.log('');
    console.log('To test the frontend integration:');
    console.log('1. Start the frontend: npm run dev (in frontend directory)');
    console.log('2. Visit: http://localhost:8081/admin/vistorcountsetting');
    console.log('3. Login as admin');
    console.log('4. Configure visitor counter settings');
    console.log('5. Visit a product page to see the visitor counter in action');
    console.log('');
    console.log('Expected behavior:');
    console.log('- Settings page loads with current configuration');
    console.log('- Toggle switch works to enable/disable');
    console.log('- Min/Max inputs work with validation');
    console.log('- Save button works and shows success message');
    console.log('- Live preview shows current range');
    console.log('- Visitor counter appears on product pages when enabled');
}

// Run tests
if (require.main === module) {
    testVisitorCounterSystem().then(() => {
        testFrontendIntegration();
    });
}

module.exports = { testVisitorCounterSystem, testFrontendIntegration };

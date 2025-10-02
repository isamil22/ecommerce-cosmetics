const axios = require('axios');

const BASE_URL = 'http://localhost:8081';

async function testEnhancedCounter() {
    console.log('🚀 Testing Enhanced Visitor Counter System...\n');
    
    try {
        // Test 1: Check if backend is running
        console.log('1. Testing backend connection...');
        try {
            const response = await axios.get(`${BASE_URL}/api/enhanced-visitor-counter-settings`, {
                timeout: 5000,
                validateStatus: () => true
            });
            
            if (response.status === 403) {
                console.log('✅ Backend is running (403 Forbidden is expected without auth)');
            } else if (response.status === 200) {
                console.log('✅ Backend is running and accessible');
                console.log('📊 Settings:', JSON.stringify(response.data, null, 2));
            } else {
                console.log(`⚠️ Backend responded with status: ${response.status}`);
            }
        } catch (error) {
            console.log('❌ Backend connection failed:', error.message);
            return;
        }
        
        // Test 2: Check if frontend is running
        console.log('\n2. Testing frontend connection...');
        try {
            const response = await axios.get(`${BASE_URL}/`, {
                timeout: 5000,
                validateStatus: () => true
            });
            
            if (response.status === 200) {
                console.log('✅ Frontend is running and accessible');
            } else {
                console.log(`⚠️ Frontend responded with status: ${response.status}`);
            }
        } catch (error) {
            console.log('❌ Frontend connection failed:', error.message);
        }
        
        // Test 3: Check admin page
        console.log('\n3. Testing admin page...');
        try {
            const response = await axios.get(`${BASE_URL}/admin/enhanced-visitor-counter`, {
                timeout: 5000,
                validateStatus: () => true
            });
            
            if (response.status === 200) {
                console.log('✅ Admin page is accessible');
            } else if (response.status === 302 || response.status === 401) {
                console.log('✅ Admin page exists (redirect to login is expected)');
            } else {
                console.log(`⚠️ Admin page responded with status: ${response.status}`);
            }
        } catch (error) {
            console.log('❌ Admin page test failed:', error.message);
        }
        
        console.log('\n🎉 Enhanced Visitor Counter System Test Complete!');
        console.log('\n📋 Next Steps:');
        console.log('1. Navigate to http://localhost:8081/admin/enhanced-visitor-counter');
        console.log('2. Login as admin to configure settings');
        console.log('3. Visit frontend pages to see the counter in action');
        console.log('4. Check that "Total Views", "Added Today", and "Activity Level" are displaying');
        
    } catch (error) {
        console.log('💥 Test failed:', error.message);
    }
}

testEnhancedCounter();

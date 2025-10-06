/**
 * Simple server connection test for coupon system
 */

const axios = require('axios');

async function testServerConnection() {
    console.log('🔍 Testing server connection...\n');
    
    const baseUrl = 'http://localhost:8081';
    
    try {
        // Test basic server connectivity
        console.log('1. Testing basic server connectivity...');
        const healthResponse = await axios.get(`${baseUrl}/api/health`, { timeout: 5000 });
        console.log('✅ Server is running and responding');
        console.log(`   Status: ${healthResponse.status}`);
        console.log(`   Response: ${JSON.stringify(healthResponse.data)}\n`);
    } catch (error) {
        console.log('❌ Basic server connectivity failed');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}\n`);
        
        // Try alternative endpoints
        console.log('2. Trying alternative endpoints...');
        
        try {
            const altResponse = await axios.get(`${baseUrl}/api/products`, { timeout: 5000 });
            console.log('✅ Alternative endpoint (/api/products) is accessible');
            console.log(`   Status: ${altResponse.status}\n`);
        } catch (altError) {
            console.log('❌ Alternative endpoints also failed');
            console.log(`   Error: ${altError.message}\n`);
        }
    }
    
    // Test coupon endpoints specifically
    console.log('3. Testing coupon endpoints...');
    
    try {
        const couponsResponse = await axios.get(`${baseUrl}/api/coupons`, { 
            timeout: 5000,
            validateStatus: function (status) {
                return status < 500; // Accept any status less than 500
            }
        });
        
        if (couponsResponse.status === 200) {
            console.log('✅ Coupons endpoint is accessible');
            console.log(`   Status: ${couponsResponse.status}`);
            console.log(`   Coupons found: ${couponsResponse.data.length || 0}\n`);
        } else if (couponsResponse.status === 401) {
            console.log('⚠️ Coupons endpoint requires authentication');
            console.log(`   Status: ${couponsResponse.status}`);
            console.log('   This is expected for admin endpoints\n');
        } else {
            console.log(`⚠️ Coupons endpoint returned status: ${couponsResponse.status}`);
            console.log(`   Response: ${JSON.stringify(couponsResponse.data)}\n`);
        }
    } catch (error) {
        console.log('❌ Coupons endpoint test failed');
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test coupon validation endpoint (should not require auth)
    console.log('4. Testing coupon validation endpoint...');
    
    try {
        const validateResponse = await axios.get(`${baseUrl}/api/coupons/validate/TEST123`, { 
            timeout: 5000,
            validateStatus: function (status) {
                return status < 500;
            }
        });
        
        if (validateResponse.status === 400) {
            console.log('✅ Coupon validation endpoint is working');
            console.log('   Status: 400 (Bad Request) - Expected for invalid coupon\n');
        } else if (validateResponse.status === 404) {
            console.log('✅ Coupon validation endpoint is accessible');
            console.log('   Status: 404 (Not Found) - Expected for invalid coupon\n');
        } else {
            console.log(`⚠️ Coupon validation returned unexpected status: ${validateResponse.status}\n`);
        }
    } catch (error) {
        console.log('❌ Coupon validation endpoint test failed');
        console.log(`   Error: ${error.message}\n`);
    }
    
    console.log('📋 Server Connection Test Summary:');
    console.log('=====================================');
    console.log('If you see mostly ✅ marks above, your server is running correctly.');
    console.log('If you see ❌ marks, please check:');
    console.log('1. Is your backend server running on http://localhost:8081?');
    console.log('2. Are there any error messages in your server logs?');
    console.log('3. Is the database connected and accessible?');
    console.log('\nTo start your server (if not running):');
    console.log('1. Navigate to your project directory');
    console.log('2. Run: ./mvnw spring-boot:run (for Maven) or ./gradlew bootRun (for Gradle)');
    console.log('3. Wait for "Started Application" message');
    console.log('\nOnce your server is running, you can run the comprehensive tests!');
}

// Run the test
testServerConnection().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});

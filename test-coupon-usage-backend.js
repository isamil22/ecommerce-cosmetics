const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:8082/api';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const TEST_COUPON_CODE = 'BACKEND_TEST_2024';

let authToken = null;

// API Service
const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
apiService.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

async function login() {
    try {
        console.log('🔐 Logging in as admin...');
        const response = await apiService.post('/auth/login', {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        authToken = response.data.token;
        console.log('✅ Login successful!');
        return true;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        return false;
    }
}

async function createTestCoupon() {
    try {
        console.log('🎫 Creating test coupon...');
        const couponData = {
            name: 'Backend Test Coupon',
            code: TEST_COUPON_CODE,
            discountType: 'PERCENTAGE',
            discountValue: 20,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 10,
            type: 'USER'
        };

        const response = await apiService.post('/coupons', couponData);
        console.log('✅ Test coupon created!', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to create coupon:', error.response?.data || error.message);
        return null;
    }
}

async function getCouponUsage() {
    try {
        const response = await apiService.get('/coupons');
        const coupons = response.data || [];
        const testCoupon = coupons.find(c => c.code === TEST_COUPON_CODE);
        
        if (!testCoupon) {
            throw new Error('Test coupon not found');
        }
        
        return {
            id: testCoupon.id,
            timesUsed: testCoupon.timesUsed || 0,
            usageLimit: testCoupon.usageLimit || 0,
            details: testCoupon
        };
    } catch (error) {
        console.error('❌ Failed to get coupon usage:', error.response?.data || error.message);
        return null;
    }
}

async function simulateCouponApplication() {
    try {
        console.log('🔍 Validating coupon...');
        const response = await apiService.get(`/coupons/validate/${TEST_COUPON_CODE}`);
        console.log('✅ Coupon validation successful!', response.data);
        return true;
    } catch (error) {
        console.error('❌ Coupon validation failed:', error.response?.data || error.message);
        return false;
    }
}

async function testCouponUsageIncrement() {
    try {
        console.log('🎯 Testing coupon usage increment...');
        
        // Get initial usage count
        const initialData = await getCouponUsage();
        if (!initialData) {
            console.error('❌ Could not get initial coupon data');
            return false;
        }
        
        const initialUsage = initialData.timesUsed;
        console.log(`📊 Initial usage count: ${initialUsage}`);
        
        // Simulate multiple coupon applications
        const testCount = 3;
        let successCount = 0;
        
        for (let i = 1; i <= testCount; i++) {
            console.log(`\n🔄 Test ${i}/${testCount}: Applying coupon...`);
            
            const success = await simulateCouponApplication();
            if (success) {
                successCount++;
                console.log(`✅ Test ${i} completed successfully!`);
            } else {
                console.log(`❌ Test ${i} failed!`);
            }
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Get final usage count
        const finalData = await getCouponUsage();
        if (!finalData) {
            console.error('❌ Could not get final coupon data');
            return false;
        }
        
        const finalUsage = finalData.timesUsed;
        const actualIncrease = finalUsage - initialUsage;
        
        console.log('\n📊 Test Results:');
        console.log(`Initial Usage: ${initialUsage}`);
        console.log(`Final Usage: ${finalUsage}`);
        console.log(`Expected Increase: ${testCount}`);
        console.log(`Actual Increase: ${actualIncrease}`);
        console.log(`Success Rate: ${Math.round((successCount / testCount) * 100)}%`);
        
        if (actualIncrease === testCount) {
            console.log('🎉 SUCCESS: Usage count increased correctly!');
            return true;
        } else if (actualIncrease > 0) {
            console.log(`⚠️ PARTIAL SUCCESS: Usage increased by ${actualIncrease} (expected ${testCount})`);
            return false;
        } else {
            console.log('❌ FAILED: Usage count did not increase!');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

async function runCompleteTest() {
    console.log('🚀 Starting comprehensive coupon usage test...\n');
    
    try {
        // Step 1: Login
        const loginSuccess = await login();
        if (!loginSuccess) {
            console.error('❌ Cannot proceed without login');
            return;
        }
        
        // Step 2: Create test coupon
        const coupon = await createTestCoupon();
        if (!coupon) {
            console.error('❌ Cannot proceed without test coupon');
            return;
        }
        
        // Step 3: Test usage increment
        const testSuccess = await testCouponUsageIncrement();
        
        // Step 4: Final summary
        console.log('\n🎯 FINAL SUMMARY:');
        console.log(`Test ${testSuccess ? 'PASSED' : 'FAILED'}!`);
        console.log('\nNext Steps:');
        console.log('1. Check the admin dashboard at /admin/analytics');
        console.log('2. Verify the coupon usage count increased');
        console.log('3. Check individual coupon analytics');
        
    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
    }
}

// Run the test
if (require.main === module) {
    runCompleteTest();
}

module.exports = {
    login,
    createTestCoupon,
    getCouponUsage,
    simulateCouponApplication,
    testCouponUsageIncrement,
    runCompleteTest
};

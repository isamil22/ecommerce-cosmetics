const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:8082/api';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

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

async function checkCouponsForNullTimesUsed() {
    try {
        console.log('🔍 Checking coupons for null timesUsed values...');
        const response = await apiService.get('/coupons');
        const coupons = response.data || [];
        
        const nullTimesUsedCoupons = coupons.filter(coupon => coupon.timesUsed === null);
        const undefinedTimesUsedCoupons = coupons.filter(coupon => coupon.timesUsed === undefined);
        
        console.log(`📊 Found ${nullTimesUsedCoupons.length} coupons with null timesUsed`);
        console.log(`📊 Found ${undefinedTimesUsedCoupons.length} coupons with undefined timesUsed`);
        
        if (nullTimesUsedCoupons.length > 0) {
            console.log('🚨 CRITICAL: Found coupons with null timesUsed values:');
            nullTimesUsedCoupons.forEach(coupon => {
                console.log(`  - ID: ${coupon.id}, Code: ${coupon.code}, Name: ${coupon.name}`);
            });
        }
        
        if (undefinedTimesUsedCoupons.length > 0) {
            console.log('⚠️ WARNING: Found coupons with undefined timesUsed values:');
            undefinedTimesUsedCoupons.forEach(coupon => {
                console.log(`  - ID: ${coupon.id}, Code: ${coupon.code}, Name: ${coupon.name}`);
            });
        }
        
        return {
            totalCoupons: coupons.length,
            nullTimesUsed: nullTimesUsedCoupons.length,
            undefinedTimesUsed: undefinedTimesUsedCoupons.length,
            nullCoupons: nullTimesUsedCoupons,
            undefinedCoupons: undefinedTimesUsedCoupons
        };
        
    } catch (error) {
        console.error('❌ Failed to check coupons:', error.response?.data || error.message);
        return null;
    }
}

async function createTestCoupon() {
    try {
        console.log('🎫 Creating test coupon...');
        const couponData = {
            name: 'Quick Fix Test Coupon',
            code: 'QUICK_FIX_TEST',
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
        console.error('❌ Failed to create test coupon:', error.response?.data || error.message);
        return null;
    }
}

async function testCouponUsageIncrement() {
    try {
        console.log('🎯 Testing coupon usage increment...');
        
        // Get initial usage count
        const initialResponse = await apiService.get('/coupons');
        const initialCoupons = initialResponse.data || [];
        const testCoupon = initialCoupons.find(c => c.code === 'QUICK_FIX_TEST');
        
        if (!testCoupon) {
            console.error('❌ Test coupon not found');
            return false;
        }
        
        const initialUsage = testCoupon.timesUsed || 0;
        console.log(`📊 Initial usage count: ${initialUsage}`);
        
        // Validate coupon (this should trigger usage increment if order is created)
        console.log('🔍 Validating coupon...');
        const validateResponse = await apiService.get('/coupons/validate/QUICK_FIX_TEST');
        console.log('✅ Coupon validation successful!', validateResponse.data);
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check final usage count
        const finalResponse = await apiService.get('/coupons');
        const finalCoupons = finalResponse.data || [];
        const finalTestCoupon = finalCoupons.find(c => c.code === 'QUICK_FIX_TEST');
        
        if (!finalTestCoupon) {
            console.error('❌ Test coupon not found in final check');
            return false;
        }
        
        const finalUsage = finalTestCoupon.timesUsed || 0;
        const increase = finalUsage - initialUsage;
        
        console.log(`📊 Final usage count: ${finalUsage}`);
        console.log(`📈 Usage increase: ${increase}`);
        
        if (increase > 0) {
            console.log('✅ SUCCESS: Usage count increased!');
            return true;
        } else {
            console.log('❌ FAILURE: Usage count did not increase!');
            console.log('This means the OrderService is not properly incrementing usage count.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        return false;
    }
}

async function runQuickFix() {
    console.log('🚀 Starting quick fix for coupon usage issue...\n');
    
    try {
        // Step 1: Login
        const loginSuccess = await login();
        if (!loginSuccess) {
            console.error('❌ Cannot proceed without login');
            return;
        }
        
        // Step 2: Check for null timesUsed values
        console.log('\n📊 Step 1: Checking for null timesUsed values...');
        const nullCheck = await checkCouponsForNullTimesUsed();
        if (!nullCheck) {
            console.error('❌ Could not check coupons');
            return;
        }
        
        if (nullCheck.nullTimesUsed > 0) {
            console.log('\n🚨 CRITICAL ISSUE FOUND!');
            console.log('You have coupons with null timesUsed values.');
            console.log('This will cause NullPointerException in OrderService.');
            console.log('\n🔧 SOLUTION:');
            console.log('Run this SQL command in your database:');
            console.log('UPDATE coupons SET times_used = 0 WHERE times_used IS NULL;');
            console.log('\nOr use the provided fix_coupon_times_used.sql file.');
        }
        
        // Step 3: Create test coupon
        console.log('\n🎫 Step 2: Creating test coupon...');
        const testCoupon = await createTestCoupon();
        if (!testCoupon) {
            console.error('❌ Could not create test coupon');
            return;
        }
        
        // Step 4: Test usage increment
        console.log('\n🎯 Step 3: Testing usage increment...');
        const testSuccess = await testCouponUsageIncrement();
        
        // Step 5: Final recommendations
        console.log('\n💡 FINAL RECOMMENDATIONS:');
        
        if (nullCheck.nullTimesUsed > 0) {
            console.log('1. 🚨 URGENT: Fix null timesUsed values in database');
            console.log('2. Restart your backend application');
            console.log('3. Test again with the debug tool');
        } else if (!testSuccess) {
            console.log('1. Check if OrderService.java fix was applied');
            console.log('2. Restart your backend application');
            console.log('3. Check backend logs for errors');
            console.log('4. Verify order creation includes coupon code');
        } else {
            console.log('1. ✅ System appears to be working correctly');
            console.log('2. Check your frontend order creation process');
            console.log('3. Verify coupon codes are being sent to backend');
        }
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Run the debug tool: debug-coupon-usage-issue.html');
        console.log('2. Check the admin dashboard analytics');
        console.log('3. Test with a real order creation');
        
    } catch (error) {
        console.error('❌ Quick fix failed:', error.message);
    }
}

// Run the quick fix
if (require.main === module) {
    runQuickFix();
}

module.exports = {
    login,
    checkCouponsForNullTimesUsed,
    createTestCoupon,
    testCouponUsageIncrement,
    runQuickFix
};

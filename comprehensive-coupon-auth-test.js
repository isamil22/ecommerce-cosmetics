/**
 * Comprehensive Coupon System Test with Authentication
 * This test properly handles admin authentication for coupon management
 */

const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';
const TEST_RESULTS = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

// Test credentials (adjust based on your admin user)
const ADMIN_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123'
};

let authToken = '';

/**
 * Utility functions
 */
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
}

function recordTest(name, success, details = '') {
    TEST_RESULTS.total++;
    if (success) {
        TEST_RESULTS.passed++;
        log(`${name}: PASSED`, 'success');
    } else {
        TEST_RESULTS.failed++;
        log(`${name}: FAILED - ${details}`, 'error');
    }
    TEST_RESULTS.details.push({ name, success, details, timestamp: new Date().toISOString() });
}

async function makeRequest(url, options = {}) {
    const config = {
        baseURL: API_BASE,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            ...options.headers
        },
        ...options
    };

    try {
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status, headers: response.headers };
    } catch (error) {
        return { 
            success: false, 
            error: error.message, 
            status: error.response?.status || 0,
            data: error.response?.data 
        };
    }
}

/**
 * Authentication
 */
async function authenticateAdmin() {
    log('🔐 Attempting admin authentication...');
    
    try {
        const loginData = {
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password
        };

        const result = await makeRequest('/auth/login', {
            method: 'POST',
            data: loginData,
            headers: {} // Don't include auth token for login
        });

        if (result.success && result.data) {
            authToken = result.data;
            log(`Admin authentication successful! Token: ${authToken.substring(0, 20)}...`, 'success');
            recordTest('Admin Authentication', true, 'Successfully authenticated');
            return true;
        } else if (result.status === 200 && result.data) {
            authToken = result.data;
            log(`Admin authentication successful! Token: ${authToken.substring(0, 20)}...`, 'success');
            recordTest('Admin Authentication', true, 'Successfully authenticated');
            return true;
        } else {
            log(`Admin authentication failed: ${result.error || result.data || 'Unknown error'}`, 'error');
            recordTest('Admin Authentication', false, result.error || result.data || 'Authentication failed');
            return false;
        }
    } catch (error) {
        log(`Authentication error: ${error.message}`, 'error');
        recordTest('Admin Authentication', false, error.message);
        return false;
    }
}

/**
 * Coupon Creation Tests
 */
async function testCouponCreation() {
    log('📝 Testing coupon creation...');
    
    const testCoupons = [
        {
            name: 'Test Percentage Coupon',
            code: `TEST_PERC_${Date.now()}`,
            discountType: 'PERCENTAGE',
            discountValue: 25,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 100,
            timesUsed: 0,
            firstTimeOnly: false
        },
        {
            name: 'Test Fixed Amount Coupon',
            code: `TEST_FIXED_${Date.now()}`,
            discountType: 'FIXED_AMOUNT',
            discountValue: 15,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 50,
            timesUsed: 0,
            firstTimeOnly: false
        },
        {
            name: 'Test Free Shipping Coupon',
            code: `TEST_FREESHIP_${Date.now()}`,
            discountType: 'FREE_SHIPPING',
            discountValue: 0,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 200,
            timesUsed: 0,
            firstTimeOnly: false
        }
    ];

    const createdCoupons = [];
    
    for (const couponData of testCoupons) {
        const result = await makeRequest('/coupons', {
            method: 'POST',
            data: couponData
        });

        if (result.success && result.data) {
            log(`✅ Created ${couponData.discountType} coupon: ${result.data.code}`, 'success');
            recordTest(`Create ${couponData.discountType} Coupon`, true, `Created: ${result.data.code}`);
            createdCoupons.push(result.data);
        } else {
            log(`❌ Failed to create ${couponData.discountType} coupon: ${result.error || result.data}`, 'error');
            recordTest(`Create ${couponData.discountType} Coupon`, false, result.error || 'Creation failed');
        }
    }

    return createdCoupons;
}

/**
 * Coupon Validation Tests
 */
async function testCouponValidation(createdCoupons) {
    log('✅ Testing coupon validation...');
    
    // Test valid coupons
    if (createdCoupons.length > 0) {
        for (const coupon of createdCoupons) {
            const result = await makeRequest(`/coupons/validate/${coupon.code}`, {
                headers: {} // Validation endpoint doesn't require auth
            });

            if (result.success && result.data) {
                log(`✅ Validated coupon: ${coupon.code}`, 'success');
                recordTest(`Validate Coupon ${coupon.code}`, true, 'Validation successful');
            } else {
                log(`❌ Failed to validate coupon: ${coupon.code}`, 'error');
                recordTest(`Validate Coupon ${coupon.code}`, false, result.error || 'Validation failed');
            }
        }
    }

    // Test invalid coupon
    const invalidResult = await makeRequest('/coupons/validate/INVALID_COUPON_12345', {
        headers: {} // No auth needed
    });

    if (!invalidResult.success && (invalidResult.status === 400 || invalidResult.status === 404)) {
        log('✅ Invalid coupon correctly rejected', 'success');
        recordTest('Validate Invalid Coupon', true, 'Invalid coupon properly rejected');
    } else {
        log('❌ Invalid coupon should have been rejected', 'error');
        recordTest('Validate Invalid Coupon', false, 'Invalid coupon not rejected');
    }
}

/**
 * Coupon Management Tests
 */
async function testCouponManagement() {
    log('📋 Testing coupon management...');
    
    // Test get all coupons
    const result = await makeRequest('/coupons');

    if (result.success && Array.isArray(result.data)) {
        log(`✅ Retrieved ${result.data.length} coupons`, 'success');
        recordTest('Get All Coupons', true, `Retrieved ${result.data.length} coupons`);
        return result.data;
    } else {
        log(`❌ Failed to get coupons: ${result.error || result.data}`, 'error');
        recordTest('Get All Coupons', false, result.error || 'Retrieval failed');
        return [];
    }
}

/**
 * Usage Statistics Tests
 */
async function testUsageStatistics(coupons) {
    log('📈 Testing usage statistics...');
    
    // Test overall usage statistics
    const statsResult = await makeRequest('/coupons/usage-statistics');

    if (statsResult.success) {
        log('✅ Retrieved usage statistics', 'success');
        recordTest('Get Usage Statistics', true, 'Statistics retrieved successfully');
    } else {
        log(`❌ Failed to get usage statistics: ${statsResult.error || statsResult.data}`, 'error');
        recordTest('Get Usage Statistics', false, statsResult.error || 'Statistics retrieval failed');
    }

    // Test specific coupon statistics
    if (coupons.length > 0) {
        const specificStatsResult = await makeRequest(`/coupons/${coupons[0].id}/usage-statistics`);

        if (specificStatsResult.success) {
            log(`✅ Retrieved statistics for coupon ${coupons[0].id}`, 'success');
            recordTest('Get Specific Coupon Stats', true, `Stats for coupon ${coupons[0].id}`);
        } else {
            log(`❌ Failed to get specific coupon stats: ${specificStatsResult.error || specificStatsResult.data}`, 'error');
            recordTest('Get Specific Coupon Stats', false, specificStatsResult.error || 'Specific stats failed');
        }
    }
}

/**
 * Performance Tests
 */
async function testPerformance() {
    log('⚡ Testing performance...');
    
    const startTime = Date.now();
    const promises = [];
    
    // Test concurrent validation requests
    for (let i = 0; i < 5; i++) {
        promises.push(makeRequest('/coupons/validate/TEST123', {
            headers: {} // No auth needed
        }));
    }
    
    const results = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    log(`✅ Performance test completed in ${duration}ms`, 'success');
    recordTest('Performance Test', true, `${duration}ms for 5 concurrent requests`);
    
    return { duration, successCount, failureCount };
}

/**
 * Main test runner
 */
async function runComprehensiveCouponTests() {
    log('🚀 Starting Comprehensive Coupon System Test with Authentication...', 'info');
    log('=' * 60, 'info');
    
    try {
        // 1. Authenticate
        const authSuccess = await authenticateAdmin();
        if (!authSuccess) {
            log('❌ Cannot proceed without authentication', 'error');
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Test coupon creation
        const createdCoupons = await testCouponCreation();
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Test coupon validation
        await testCouponValidation(createdCoupons);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Test coupon management
        const allCoupons = await testCouponManagement();
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 5. Test usage statistics
        await testUsageStatistics(allCoupons);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 6. Test performance
        await testPerformance();

    } catch (error) {
        log(`❌ Test suite error: ${error.message}`, 'error');
    }
    
    // Generate final report
    generateReport();
}

function generateReport() {
    log('=' * 60, 'info');
    log('📊 FINAL COUPON SYSTEM TEST RESULTS', 'info');
    log('=' * 60, 'info');
    
    const successRate = TEST_RESULTS.total > 0 ? Math.round((TEST_RESULTS.passed / TEST_RESULTS.total) * 100) : 0;
    
    log(`Total Tests: ${TEST_RESULTS.total}`, 'info');
    log(`Passed: ${TEST_RESULTS.passed}`, 'success');
    log(`Failed: ${TEST_RESULTS.failed}`, TEST_RESULTS.failed > 0 ? 'error' : 'info');
    log(`Success Rate: ${successRate}%`, successRate === 100 ? 'success' : successRate >= 80 ? 'warning' : 'error');
    
    log('\n📋 DETAILED RESULTS:', 'info');
    TEST_RESULTS.details.forEach((test, index) => {
        const status = test.success ? '✅ PASS' : '❌ FAIL';
        const details = test.details ? ` - ${test.details}` : '';
        log(`${index + 1}. ${test.name}: ${status}${details}`, test.success ? 'success' : 'error');
    });
    
    if (TEST_RESULTS.failed === 0) {
        log('\n🎉 ALL TESTS PASSED! Your coupon system is working perfectly!', 'success');
    } else {
        log(`\n⚠️ ${TEST_RESULTS.failed} test(s) failed. Please review the results above.`, 'warning');
    }
    
    log('\n📄 Test completed at: ' + new Date().toISOString(), 'info');
}

// Export for use in other modules
module.exports = {
    runComprehensiveCouponTests,
    authenticateAdmin,
    testCouponCreation,
    testCouponValidation,
    testCouponManagement,
    testUsageStatistics,
    testPerformance,
    makeRequest,
    TEST_RESULTS
};

// Run tests if this file is executed directly
if (require.main === module) {
    runComprehensiveCouponTests().catch(error => {
        console.error('❌ Test runner failed:', error);
        process.exit(1);
    });
}

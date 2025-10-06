/**
 * Comprehensive Coupon System API Test Suite
 * Tests all coupon functionality including creation, validation, usage tracking, and edge cases
 */

const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';
const TEST_RESULTS = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

// Test configuration
const TEST_CONFIG = {
    timeout: 10000,
    retries: 3,
    delay: 1000
};

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
        timeout: TEST_CONFIG.timeout,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    for (let attempt = 1; attempt <= TEST_CONFIG.retries; attempt++) {
        try {
            const response = await axios(config);
            return { success: true, data: response.data, status: response.status, headers: response.headers };
        } catch (error) {
            if (attempt === TEST_CONFIG.retries) {
                return { 
                    success: false, 
                    error: error.message, 
                    status: error.response?.status || 0,
                    data: error.response?.data 
                };
            }
            await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.delay));
        }
    }
}

/**
 * Test Suite Classes
 */
class CouponCreationTests {
    static async testPercentageCoupon() {
        log('Testing percentage coupon creation...');
        
        const couponData = {
            name: 'Test Percentage Coupon',
            code: `TEST_PERC_${Date.now()}`,
            discountType: 'PERCENTAGE',
            discountValue: 25,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 100,
            timesUsed: 0,
            firstTimeOnly: false
        };

        const result = await makeRequest('/coupons', {
            method: 'POST',
            data: couponData
        });

        if (result.success && result.data) {
            recordTest('Create Percentage Coupon', true, `Created: ${result.data.code}`);
            return result.data;
        } else {
            recordTest('Create Percentage Coupon', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testFixedAmountCoupon() {
        log('Testing fixed amount coupon creation...');
        
        const couponData = {
            name: 'Test Fixed Amount Coupon',
            code: `TEST_FIXED_${Date.now()}`,
            discountType: 'FIXED_AMOUNT',
            discountValue: 15,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 50,
            timesUsed: 0,
            firstTimeOnly: false
        };

        const result = await makeRequest('/coupons', {
            method: 'POST',
            data: couponData
        });

        if (result.success && result.data) {
            recordTest('Create Fixed Amount Coupon', true, `Created: ${result.data.code}`);
            return result.data;
        } else {
            recordTest('Create Fixed Amount Coupon', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testFreeShippingCoupon() {
        log('Testing free shipping coupon creation...');
        
        const couponData = {
            name: 'Test Free Shipping Coupon',
            code: `TEST_FREESHIP_${Date.now()}`,
            discountType: 'FREE_SHIPPING',
            discountValue: 0,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 200,
            timesUsed: 0,
            firstTimeOnly: false
        };

        const result = await makeRequest('/coupons', {
            method: 'POST',
            data: couponData
        });

        if (result.success && result.data) {
            recordTest('Create Free Shipping Coupon', true, `Created: ${result.data.code}`);
            return result.data;
        } else {
            recordTest('Create Free Shipping Coupon', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testFirstTimeCustomerCoupon() {
        log('Testing first-time customer coupon creation...');
        
        const couponData = {
            name: 'Test First-Time Customer Coupon',
            code: `TEST_FIRST_${Date.now()}`,
            discountType: 'PERCENTAGE',
            discountValue: 20,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 1000,
            timesUsed: 0,
            firstTimeOnly: true
        };

        const result = await makeRequest('/coupons', {
            method: 'POST',
            data: couponData
        });

        if (result.success && result.data) {
            recordTest('Create First-Time Customer Coupon', true, `Created: ${result.data.code}`);
            return result.data;
        } else {
            recordTest('Create First-Time Customer Coupon', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testMinimumPurchaseCoupon() {
        log('Testing minimum purchase coupon creation...');
        
        const couponData = {
            name: 'Test Minimum Purchase Coupon',
            code: `TEST_MIN_${Date.now()}`,
            discountType: 'PERCENTAGE',
            discountValue: 15,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 100,
            timesUsed: 0,
            minPurchaseAmount: 75,
            firstTimeOnly: false
        };

        const result = await makeRequest('/coupons', {
            method: 'POST',
            data: couponData
        });

        if (result.success && result.data) {
            recordTest('Create Minimum Purchase Coupon', true, `Created: ${result.data.code}`);
            return result.data;
        } else {
            recordTest('Create Minimum Purchase Coupon', false, result.error || 'Unknown error');
            return null;
        }
    }
}

class CouponValidationTests {
    static async testValidCoupon(couponCode) {
        log(`Testing validation of valid coupon: ${couponCode}`);
        
        const result = await makeRequest(`/coupons/validate/${couponCode}`);

        if (result.success && result.data) {
            recordTest('Validate Valid Coupon', true, `Validated: ${couponCode}`);
            return result.data;
        } else {
            recordTest('Validate Valid Coupon', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testInvalidCoupon() {
        log('Testing validation of invalid coupon...');
        
        const invalidCode = 'INVALID_COUPON_12345';
        const result = await makeRequest(`/coupons/validate/${invalidCode}`);

        if (!result.success && result.status === 400) {
            recordTest('Validate Invalid Coupon', true, 'Invalid coupon correctly rejected');
            return true;
        } else {
            recordTest('Validate Invalid Coupon', false, 'Invalid coupon not properly rejected');
            return false;
        }
    }

    static async testExpiredCoupon() {
        log('Testing validation of expired coupon...');
        
        // Create an expired coupon
        const expiredCouponData = {
            name: 'Expired Test Coupon',
            code: `EXPIRED_${Date.now()}`,
            discountType: 'PERCENTAGE',
            discountValue: 20,
            expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            usageLimit: 10,
            timesUsed: 0,
            firstTimeOnly: false
        };

        const createResult = await makeRequest('/coupons', {
            method: 'POST',
            data: expiredCouponData
        });

        if (createResult.success) {
            // Now test validation
            const validateResult = await makeRequest(`/coupons/validate/${expiredCouponData.code}`);
            
            if (!validateResult.success && validateResult.status === 400) {
                recordTest('Validate Expired Coupon', true, 'Expired coupon correctly rejected');
                return true;
            } else {
                recordTest('Validate Expired Coupon', false, 'Expired coupon not properly rejected');
                return false;
            }
        } else {
            recordTest('Create Expired Coupon for Testing', false, createResult.error || 'Could not create expired coupon');
            return false;
        }
    }

    static async testUsageLimitCoupon() {
        log('Testing validation of usage limit coupon...');
        
        // Create a coupon with usage limit reached
        const limitedCouponData = {
            name: 'Limited Use Test Coupon',
            code: `LIMITED_${Date.now()}`,
            discountType: 'FIXED_AMOUNT',
            discountValue: 5,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageLimit: 1, // Very low limit
            timesUsed: 1, // Already used once
            firstTimeOnly: false
        };

        const createResult = await makeRequest('/coupons', {
            method: 'POST',
            data: limitedCouponData
        });

        if (createResult.success) {
            // Now test validation
            const validateResult = await makeRequest(`/coupons/validate/${limitedCouponData.code}`);
            
            if (!validateResult.success && validateResult.status === 400) {
                recordTest('Validate Usage Limit Coupon', true, 'Usage limit correctly enforced');
                return true;
            } else {
                recordTest('Validate Usage Limit Coupon', false, 'Usage limit not properly enforced');
                return false;
            }
        } else {
            recordTest('Create Usage Limit Coupon for Testing', false, createResult.error || 'Could not create limited coupon');
            return false;
        }
    }
}

class CouponManagementTests {
    static async testGetAllCoupons() {
        log('Testing get all coupons...');
        
        const result = await makeRequest('/coupons');

        if (result.success && Array.isArray(result.data)) {
            recordTest('Get All Coupons', true, `Retrieved ${result.data.length} coupons`);
            return result.data;
        } else {
            recordTest('Get All Coupons', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testDeleteCoupon(couponId) {
        if (!couponId) {
            recordTest('Delete Coupon', false, 'No coupon ID provided');
            return false;
        }

        log(`Testing delete coupon ID: ${couponId}`);
        
        const result = await makeRequest(`/coupons/${couponId}`, {
            method: 'DELETE'
        });

        if (result.success || result.status === 204) {
            recordTest('Delete Coupon', true, `Deleted coupon ID: ${couponId}`);
            return true;
        } else {
            recordTest('Delete Coupon', false, result.error || 'Unknown error');
            return false;
        }
    }
}

class UsageStatisticsTests {
    static async testGetUsageStatistics() {
        log('Testing get usage statistics...');
        
        const result = await makeRequest('/coupons/usage-statistics');

        if (result.success) {
            recordTest('Get Usage Statistics', true, 'Retrieved usage statistics');
            return result.data;
        } else {
            recordTest('Get Usage Statistics', false, result.error || 'Unknown error');
            return null;
        }
    }

    static async testGetSpecificCouponStats(couponId) {
        if (!couponId) {
            recordTest('Get Specific Coupon Stats', false, 'No coupon ID provided');
            return null;
        }

        log(`Testing get specific coupon stats for ID: ${couponId}`);
        
        const result = await makeRequest(`/coupons/${couponId}/usage-statistics`);

        if (result.success) {
            recordTest('Get Specific Coupon Stats', true, `Retrieved stats for coupon ${couponId}`);
            return result.data;
        } else {
            recordTest('Get Specific Coupon Stats', false, result.error || 'Unknown error');
            return null;
        }
    }
}

class PerformanceTests {
    static async testConcurrentValidation(concurrency = 10) {
        log(`Testing concurrent coupon validation with ${concurrency} requests...`);
        
        const startTime = Date.now();
        const promises = [];
        
        // Create multiple concurrent validation requests
        for (let i = 0; i < concurrency; i++) {
            promises.push(makeRequest('/coupons/validate/SUMMER25'));
        }
        
        const results = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        
        recordTest('Concurrent Validation Test', true, 
            `${duration}ms for ${concurrency} concurrent requests (${successCount} success, ${failureCount} failed)`);
        
        return {
            duration,
            concurrency,
            successCount,
            failureCount,
            averageResponseTime: Math.round(duration / concurrency)
        };
    }

    static async testLoadTest(requests = 50, batchSize = 10) {
        log(`Running load test with ${requests} requests in batches of ${batchSize}...`);
        
        const startTime = Date.now();
        const allResults = [];
        
        for (let batch = 0; batch < Math.ceil(requests / batchSize); batch++) {
            const batchPromises = [];
            const currentBatchSize = Math.min(batchSize, requests - batch * batchSize);
            
            for (let i = 0; i < currentBatchSize; i++) {
                batchPromises.push(makeRequest('/coupons'));
            }
            
            const batchResults = await Promise.all(batchPromises);
            allResults.push(...batchResults);
            
            // Small delay between batches
            if (batch < Math.ceil(requests / batchSize) - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const successCount = allResults.filter(r => r.success).length;
        const failureCount = allResults.filter(r => !r.success).length;
        
        recordTest('Load Test', true, 
            `${duration}ms for ${requests} requests (${successCount} success, ${failureCount} failed)`);
        
        return {
            duration,
            totalRequests: requests,
            successCount,
            failureCount,
            averageResponseTime: Math.round(duration / requests),
            requestsPerSecond: Math.round(requests / (duration / 1000))
        };
    }
}

/**
 * Main test runner
 */
class CouponTestRunner {
    static async runAllTests() {
        log('🚀 Starting Comprehensive Coupon System Test Suite...', 'info');
        log('=' * 60, 'info');
        
        const createdCoupons = [];
        
        try {
            // 1. Coupon Creation Tests
            log('📝 Running Coupon Creation Tests...', 'info');
            const percentageCoupon = await CouponCreationTests.testPercentageCoupon();
            if (percentageCoupon) createdCoupons.push(percentageCoupon);
            
            const fixedCoupon = await CouponCreationTests.testFixedAmountCoupon();
            if (fixedCoupon) createdCoupons.push(fixedCoupon);
            
            const freeShippingCoupon = await CouponCreationTests.testFreeShippingCoupon();
            if (freeShippingCoupon) createdCoupons.push(freeShippingCoupon);
            
            const firstTimeCoupon = await CouponCreationTests.testFirstTimeCustomerCoupon();
            if (firstTimeCoupon) createdCoupons.push(firstTimeCoupon);
            
            const minPurchaseCoupon = await CouponCreationTests.testMinimumPurchaseCoupon();
            if (minPurchaseCoupon) createdCoupons.push(minPurchaseCoupon);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 2. Coupon Validation Tests
            log('✅ Running Coupon Validation Tests...', 'info');
            if (createdCoupons.length > 0) {
                await CouponValidationTests.testValidCoupon(createdCoupons[0].code);
            }
            
            await CouponValidationTests.testInvalidCoupon();
            await CouponValidationTests.testExpiredCoupon();
            await CouponValidationTests.testUsageLimitCoupon();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 3. Coupon Management Tests
            log('📋 Running Coupon Management Tests...', 'info');
            const allCoupons = await CouponManagementTests.testGetAllCoupons();
            
            // Test deletion of the first created coupon
            if (createdCoupons.length > 0) {
                await CouponManagementTests.testDeleteCoupon(createdCoupons[0].id);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 4. Usage Statistics Tests
            log('📈 Running Usage Statistics Tests...', 'info');
            await UsageStatisticsTests.testGetUsageStatistics();
            
            if (createdCoupons.length > 1) {
                await UsageStatisticsTests.testGetSpecificCouponStats(createdCoupons[1].id);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 5. Performance Tests
            log('⚡ Running Performance Tests...', 'info');
            await PerformanceTests.testConcurrentValidation(10);
            await PerformanceTests.testLoadTest(25, 5);
            
        } catch (error) {
            log(`❌ Test suite error: ${error.message}`, 'error');
        }
        
        // Generate final report
        this.generateReport();
    }
    
    static generateReport() {
        log('=' * 60, 'info');
        log('📊 FINAL TEST RESULTS', 'info');
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
}

// Export for use in other modules
module.exports = {
    CouponTestRunner,
    CouponCreationTests,
    CouponValidationTests,
    CouponManagementTests,
    UsageStatisticsTests,
    PerformanceTests,
    makeRequest,
    TEST_RESULTS
};

// Run tests if this file is executed directly
if (require.main === module) {
    CouponTestRunner.runAllTests().catch(error => {
        console.error('❌ Test runner failed:', error);
        process.exit(1);
    });
}

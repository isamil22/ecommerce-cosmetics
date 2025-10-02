#!/usr/bin/env node

/**
 * COMPREHENSIVE VISITOR COUNTER TESTING SUITE
 * Hard testing to find any problems in the visitor counter system
 */

const axios = require('axios');
const fs = require('fs');

// Configuration
const BACKEND_URL = 'http://localhost:8082';
const FRONTEND_URL = 'http://localhost:8081';
const TEST_RESULTS = [];

// Test data
const testCases = [
    // Valid configurations
    { name: 'Normal Range', data: { enabled: true, min: 10, max: 50 } },
    { name: 'Small Range', data: { enabled: true, min: 1, max: 5 } },
    { name: 'Large Range', data: { enabled: true, min: 100, max: 999 } },
    { name: 'Same Min Max', data: { enabled: true, min: 25, max: 25 } },
    { name: 'Disabled', data: { enabled: false, min: 10, max: 50 } },
    
    // Invalid configurations (should fail)
    { name: 'Min Greater Than Max', data: { enabled: true, min: 50, max: 10 }, shouldFail: true },
    { name: 'Negative Min', data: { enabled: true, min: -5, max: 10 }, shouldFail: true },
    { name: 'Negative Max', data: { enabled: true, min: 10, max: -5 }, shouldFail: true },
    { name: 'Zero Min', data: { enabled: true, min: 0, max: 10 }, shouldFail: true },
    { name: 'Zero Max', data: { enabled: true, min: 10, max: 0 }, shouldFail: true },
    { name: 'Very Large Numbers', data: { enabled: true, min: 999999, max: 9999999 }, shouldFail: true },
    { name: 'Decimal Numbers', data: { enabled: true, min: 10.5, max: 20.7 }, shouldFail: true },
    { name: 'String Values', data: { enabled: true, min: 'ten', max: 'fifty' }, shouldFail: true },
    { name: 'Null Values', data: { enabled: true, min: null, max: null }, shouldFail: true },
    { name: 'Missing Fields', data: { enabled: true }, shouldFail: true },
    { name: 'Empty Object', data: {}, shouldFail: true },
];

// Helper function to log test results
function logTest(testName, status, message, data = null) {
    const result = {
        test: testName,
        status: status,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    };
    TEST_RESULTS.push(result);
    
    const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${statusIcon} ${testName}: ${message}`);
    if (data) {
        console.log(`   Data: ${JSON.stringify(data)}`);
    }
}

// Test 1: Backend API Health Check
async function testBackendHealth() {
    console.log('\n🔍 Testing Backend Health...');
    
    try {
        const response = await axios.get(`${BACKEND_URL}/api/hello`);
        logTest('Backend Health Check', 'PASS', 'Backend is responding');
        return true;
    } catch (error) {
        logTest('Backend Health Check', 'FAIL', `Backend not responding: ${error.message}`);
        return false;
    }
}

// Test 2: Get Visitor Counter Settings (No Auth Required)
async function testGetSettings() {
    console.log('\n📥 Testing GET Visitor Counter Settings...');
    
    try {
        const response = await axios.get(`${BACKEND_URL}/api/visitor-counter-settings`);
        
        if (response.data && typeof response.data === 'object') {
            logTest('GET Settings', 'PASS', 'Successfully retrieved settings', response.data);
            
            // Validate response structure
            const requiredFields = ['enabled', 'min', 'max'];
            const missingFields = requiredFields.filter(field => !(field in response.data));
            
            if (missingFields.length === 0) {
                logTest('GET Settings Structure', 'PASS', 'Response has all required fields');
            } else {
                logTest('GET Settings Structure', 'FAIL', `Missing fields: ${missingFields.join(', ')}`);
            }
            
            // Validate data types
            if (typeof response.data.enabled === 'boolean') {
                logTest('GET Settings Data Types', 'PASS', 'Enabled field is boolean');
            } else {
                logTest('GET Settings Data Types', 'FAIL', `Enabled field should be boolean, got ${typeof response.data.enabled}`);
            }
            
            if (typeof response.data.min === 'number' && typeof response.data.max === 'number') {
                logTest('GET Settings Data Types', 'PASS', 'Min/Max fields are numbers');
            } else {
                logTest('GET Settings Data Types', 'FAIL', `Min/Max should be numbers, got min: ${typeof response.data.min}, max: ${typeof response.data.max}`);
            }
            
            return response.data;
        } else {
            logTest('GET Settings', 'FAIL', 'Invalid response format');
            return null;
        }
    } catch (error) {
        logTest('GET Settings', 'FAIL', `Failed to get settings: ${error.message}`);
        return null;
    }
}

// Test 3: POST Settings Without Authentication (Should Fail)
async function testPostWithoutAuth() {
    console.log('\n🔒 Testing POST Without Authentication...');
    
    const testData = { enabled: true, min: 10, max: 50 };
    
    try {
        await axios.post(`${BACKEND_URL}/api/visitor-counter-settings`, testData);
        logTest('POST Without Auth', 'FAIL', 'Should have failed without authentication');
    } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
            logTest('POST Without Auth', 'PASS', 'Correctly rejected without authentication');
        } else {
            logTest('POST Without Auth', 'FAIL', `Unexpected error: ${error.message}`);
        }
    }
}

// Test 4: Test Various Configuration Scenarios
async function testConfigurationScenarios() {
    console.log('\n⚙️ Testing Configuration Scenarios...');
    
    // Note: These tests will fail without proper admin authentication
    // But we can test the API structure and error handling
    
    for (const testCase of testCases) {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/visitor-counter-settings`, testCase.data);
            
            if (testCase.shouldFail) {
                logTest(`Config: ${testCase.name}`, 'FAIL', 'Should have failed but succeeded');
            } else {
                logTest(`Config: ${testCase.name}`, 'PASS', 'Configuration accepted');
            }
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                logTest(`Config: ${testCase.name}`, 'SKIP', 'Authentication required (expected)');
            } else if (testCase.shouldFail && error.response?.status >= 400) {
                logTest(`Config: ${testCase.name}`, 'PASS', 'Correctly rejected invalid configuration');
            } else if (!testCase.shouldFail) {
                logTest(`Config: ${testCase.name}`, 'FAIL', `Valid config rejected: ${error.message}`);
            } else {
                logTest(`Config: ${testCase.name}`, 'UNKNOWN', `Unexpected error: ${error.message}`);
            }
        }
    }
}

// Test 5: Database Operations
async function testDatabaseOperations() {
    console.log('\n💾 Testing Database Operations...');
    
    try {
        // Get current settings multiple times to test consistency
        const responses = await Promise.all([
            axios.get(`${BACKEND_URL}/api/visitor-counter-settings`),
            axios.get(`${BACKEND_URL}/api/visitor-counter-settings`),
            axios.get(`${BACKEND_URL}/api/visitor-counter-settings`)
        ]);
        
        const allSame = responses.every(response => 
            JSON.stringify(response.data) === JSON.stringify(responses[0].data)
        );
        
        if (allSame) {
            logTest('Database Consistency', 'PASS', 'Multiple requests return same data');
        } else {
            logTest('Database Consistency', 'FAIL', 'Inconsistent data returned');
        }
        
    } catch (error) {
        logTest('Database Consistency', 'FAIL', `Database test failed: ${error.message}`);
    }
}

// Test 6: Performance Testing
async function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    const startTime = Date.now();
    const requests = [];
    
    // Make 10 concurrent requests
    for (let i = 0; i < 10; i++) {
        requests.push(axios.get(`${BACKEND_URL}/api/visitor-counter-settings`));
    }
    
    try {
        const responses = await Promise.all(requests);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration < 2000) {
            logTest('Performance Test', 'PASS', `10 concurrent requests completed in ${duration}ms`);
        } else {
            logTest('Performance Test', 'WARN', `10 concurrent requests took ${duration}ms (slow)`);
        }
        
        // Check all responses are successful
        const allSuccessful = responses.every(response => response.status === 200);
        if (allSuccessful) {
            logTest('Concurrent Requests', 'PASS', 'All concurrent requests successful');
        } else {
            logTest('Concurrent Requests', 'FAIL', 'Some concurrent requests failed');
        }
        
    } catch (error) {
        logTest('Performance Test', 'FAIL', `Performance test failed: ${error.message}`);
    }
}

// Test 7: Error Handling
async function testErrorHandling() {
    console.log('\n🚨 Testing Error Handling...');
    
    // Test invalid endpoints
    const invalidEndpoints = [
        '/api/visitor-counter-settings-invalid',
        '/api/visitor-counter-setting', // missing 's'
        '/api/visitor-counter-settings/',
        '/api/visitor-counter-settings/123'
    ];
    
    for (const endpoint of invalidEndpoints) {
        try {
            await axios.get(`${BACKEND_URL}${endpoint}`);
            logTest(`Invalid Endpoint: ${endpoint}`, 'FAIL', 'Should have returned 404');
        } catch (error) {
            if (error.response?.status === 404) {
                logTest(`Invalid Endpoint: ${endpoint}`, 'PASS', 'Correctly returned 404');
            } else {
                logTest(`Invalid Endpoint: ${endpoint}`, 'UNKNOWN', `Unexpected status: ${error.response?.status}`);
            }
        }
    }
    
    // Test invalid HTTP methods
    try {
        await axios.put(`${BACKEND_URL}/api/visitor-counter-settings`, {});
        logTest('Invalid Method: PUT', 'FAIL', 'Should not accept PUT method');
    } catch (error) {
        if (error.response?.status === 405 || error.response?.status === 404) {
            logTest('Invalid Method: PUT', 'PASS', 'Correctly rejected PUT method');
        } else {
            logTest('Invalid Method: PUT', 'UNKNOWN', `Unexpected response: ${error.response?.status}`);
        }
    }
}

// Test 8: Data Validation
async function testDataValidation() {
    console.log('\n✅ Testing Data Validation...');
    
    const originalSettings = await testGetSettings();
    
    if (originalSettings) {
        // Test that min <= max
        if (originalSettings.min <= originalSettings.max) {
            logTest('Data Validation: Min <= Max', 'PASS', 'Current settings are valid');
        } else {
            logTest('Data Validation: Min <= Max', 'FAIL', 'Current settings are invalid (min > max)');
        }
        
        // Test that values are positive
        if (originalSettings.min >= 0 && originalSettings.max >= 0) {
            logTest('Data Validation: Positive Values', 'PASS', 'Values are non-negative');
        } else {
            logTest('Data Validation: Positive Values', 'FAIL', 'Negative values detected');
        }
        
        // Test that enabled is boolean
        if (typeof originalSettings.enabled === 'boolean') {
            logTest('Data Validation: Boolean Enabled', 'PASS', 'Enabled field is boolean');
        } else {
            logTest('Data Validation: Boolean Enabled', 'FAIL', 'Enabled field is not boolean');
        }
    }
}

// Generate Test Report
function generateTestReport() {
    console.log('\n📊 TEST REPORT SUMMARY');
    console.log('=' .repeat(50));
    
    const passCount = TEST_RESULTS.filter(r => r.status === 'PASS').length;
    const failCount = TEST_RESULTS.filter(r => r.status === 'FAIL').length;
    const skipCount = TEST_RESULTS.filter(r => r.status === 'SKIP').length;
    const warnCount = TEST_RESULTS.filter(r => r.status === 'WARN').length;
    
    console.log(`✅ PASSED: ${passCount}`);
    console.log(`❌ FAILED: ${failCount}`);
    console.log(`⚠️  WARNINGS: ${warnCount}`);
    console.log(`⏭️  SKIPPED: ${skipCount}`);
    console.log(`📊 TOTAL TESTS: ${TEST_RESULTS.length}`);
    
    const successRate = ((passCount / TEST_RESULTS.length) * 100).toFixed(1);
    console.log(`🎯 SUCCESS RATE: ${successRate}%`);
    
    // Save detailed report
    const reportData = {
        summary: {
            total: TEST_RESULTS.length,
            passed: passCount,
            failed: failCount,
            warnings: warnCount,
            skipped: skipCount,
            successRate: successRate
        },
        tests: TEST_RESULTS,
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('visitor-counter-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: visitor-counter-test-report.json');
    
    // Show failed tests
    const failedTests = TEST_RESULTS.filter(r => r.status === 'FAIL');
    if (failedTests.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        failedTests.forEach(test => {
            console.log(`   - ${test.test}: ${test.message}`);
        });
    }
    
    // Show warnings
    const warnings = TEST_RESULTS.filter(r => r.status === 'WARN');
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        warnings.forEach(test => {
            console.log(`   - ${test.test}: ${test.message}`);
        });
    }
}

// Main test runner
async function runAllTests() {
    console.log('🧪 COMPREHENSIVE VISITOR COUNTER TESTING SUITE');
    console.log('=' .repeat(60));
    console.log(`🎯 Testing Backend: ${BACKEND_URL}`);
    console.log(`🌐 Testing Frontend: ${FRONTEND_URL}`);
    console.log(`⏰ Started: ${new Date().toLocaleString()}`);
    
    try {
        // Run all tests
        const backendHealthy = await testBackendHealth();
        
        if (backendHealthy) {
            await testGetSettings();
            await testPostWithoutAuth();
            await testConfigurationScenarios();
            await testDatabaseOperations();
            await testPerformance();
            await testErrorHandling();
            await testDataValidation();
        } else {
            console.log('\n❌ Backend is not healthy. Skipping remaining tests.');
            logTest('Backend Health', 'FAIL', 'Backend not responding - cannot run other tests');
        }
        
    } catch (error) {
        console.error('\n💥 Test suite crashed:', error.message);
        logTest('Test Suite', 'FAIL', `Test suite crashed: ${error.message}`);
    }
    
    generateTestReport();
    
    console.log('\n🎉 Testing completed!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Review the test report above');
    console.log('2. Fix any failed tests');
    console.log('3. Run frontend tests manually');
    console.log('4. Test the complete user flow');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { runAllTests, logTest };

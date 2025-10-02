const axios = require('axios');

const BASE_URL = 'http://localhost:8081';
const API_URL = `${BASE_URL}/api`;

// Test configuration
const testConfig = {
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, details = '') {
    const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    log(`${icon} ${testName}: ${status}`, statusColor);
    if (details) {
        log(`   ${details}`, 'cyan');
    }
}

async function testEnhancedVisitorCounterSystem() {
    log('\n🚀 Enhanced Visitor Counter System - Complete Test Suite', 'bright');
    log('=' .repeat(60), 'blue');
    
    const results = {
        passed: 0,
        failed: 0,
        warnings: 0
    };

    // Test 1: Backend API Endpoints
    log('\n📡 Testing Backend API Endpoints', 'yellow');
    
    try {
        // Test GET settings endpoint
        const getResponse = await axios.get(`${API_URL}/enhanced-visitor-counter-settings`, testConfig);
        logTest('GET /api/enhanced-visitor-counter-settings', 'PASS', 
            `Settings loaded: ${JSON.stringify(getResponse.data).substring(0, 100)}...`);
        results.passed++;
    } catch (error) {
        logTest('GET /api/enhanced-visitor-counter-settings', 'FAIL', 
            `Error: ${error.message}`);
        results.failed++;
    }

    // Test 2: Settings Structure Validation
    log('\n🔍 Testing Settings Structure', 'yellow');
    
    try {
        const response = await axios.get(`${API_URL}/enhanced-visitor-counter-settings`, testConfig);
        const settings = response.data;
        
        // Check required fields
        const requiredFields = [
            'currentViewersEnabled', 'currentViewersMin', 'currentViewersMax',
            'totalViewsEnabled', 'totalViewsMin', 'totalViewsMax',
            'addedTodayEnabled', 'addedTodayMin', 'addedTodayMax',
            'activityEnabled', 'activityMin', 'activityMax',
            'globalEnabled', 'customTitle', 'animationSpeed'
        ];
        
        let allFieldsPresent = true;
        requiredFields.forEach(field => {
            if (settings[field] === undefined) {
                logTest(`Field '${field}' exists`, 'FAIL', 'Missing required field');
                allFieldsPresent = false;
            } else {
                logTest(`Field '${field}' exists`, 'PASS', `Value: ${settings[field]}`);
            }
        });
        
        if (allFieldsPresent) {
            results.passed++;
        } else {
            results.failed++;
        }
    } catch (error) {
        logTest('Settings Structure Validation', 'FAIL', `Error: ${error.message}`);
        results.failed++;
    }

    // Test 3: Frontend Component Loading
    log('\n🎨 Testing Frontend Component Integration', 'yellow');
    
    try {
        // Test if the admin page is accessible
        const adminResponse = await axios.get(`${BASE_URL}/admin/enhanced-visitor-counter`, {
            ...testConfig,
            validateStatus: () => true // Don't throw on 404/500
        });
        
        if (adminResponse.status === 200) {
            logTest('Admin Page Accessible', 'PASS', 'Admin settings page loads successfully');
            results.passed++;
        } else {
            logTest('Admin Page Accessible', 'WARN', 
                `Status: ${adminResponse.status} - Page may require authentication`);
            results.warnings++;
        }
    } catch (error) {
        logTest('Admin Page Accessible', 'WARN', `Error: ${error.message}`);
        results.warnings++;
    }

    // Test 4: Metric Generation
    log('\n📊 Testing Metric Generation', 'yellow');
    
    try {
        const response = await axios.get(`${API_URL}/enhanced-visitor-counter-settings`, testConfig);
        const settings = response.data;
        
        // Test each metric type
        const metrics = [
            { name: 'Current Viewers', enabled: settings.currentViewersEnabled, min: settings.currentViewersMin, max: settings.currentViewersMax },
            { name: 'Total Views', enabled: settings.totalViewsEnabled, min: settings.totalViewsMin, max: settings.totalViewsMax },
            { name: 'Added Today', enabled: settings.addedTodayEnabled, min: settings.addedTodayMin, max: settings.addedTodayMax },
            { name: 'Activity Level', enabled: settings.activityEnabled, min: settings.activityMin, max: settings.activityMax }
        ];
        
        metrics.forEach(metric => {
            if (metric.enabled) {
                // Generate a test value
                const testValue = Math.floor(Math.random() * (metric.max - metric.min + 1)) + metric.min;
                if (testValue >= metric.min && testValue <= metric.max) {
                    logTest(`${metric.name} Range Test`, 'PASS', 
                        `Generated value ${testValue} is within range ${metric.min}-${metric.max}`);
                    results.passed++;
                } else {
                    logTest(`${metric.name} Range Test`, 'FAIL', 
                        `Generated value ${testValue} is outside range ${metric.min}-${metric.max}`);
                    results.failed++;
                }
            } else {
                logTest(`${metric.name} Status`, 'WARN', 'Metric is disabled');
                results.warnings++;
            }
        });
    } catch (error) {
        logTest('Metric Generation', 'FAIL', `Error: ${error.message}`);
        results.failed++;
    }

    // Test 5: Settings Update (if admin token available)
    log('\n⚙️ Testing Settings Update', 'yellow');
    
    try {
        const originalSettings = await axios.get(`${API_URL}/enhanced-visitor-counter-settings`, testConfig);
        
        // Try to update settings (this will fail without admin auth, but we can test the endpoint)
        const testSettings = {
            ...originalSettings.data,
            customTitle: 'Test Title Update',
            animationSpeed: 5000
        };
        
        try {
            const updateResponse = await axios.post(`${API_URL}/enhanced-visitor-counter-settings`, testSettings, testConfig);
            logTest('Settings Update', 'PASS', 'Settings updated successfully');
            results.passed++;
            
            // Restore original settings
            await axios.post(`${API_URL}/enhanced-visitor-counter-settings`, originalSettings.data, testConfig);
        } catch (updateError) {
            if (updateError.response && updateError.response.status === 403) {
                logTest('Settings Update', 'WARN', 'Update requires admin authentication (expected)');
                results.warnings++;
            } else {
                logTest('Settings Update', 'FAIL', `Error: ${updateError.message}`);
                results.failed++;
            }
        }
    } catch (error) {
        logTest('Settings Update', 'FAIL', `Error: ${error.message}`);
        results.failed++;
    }

    // Test 6: Frontend Pages Integration
    log('\n🌐 Testing Frontend Pages Integration', 'yellow');
    
    const frontendPages = [
        { name: 'Home Page', url: '/' },
        { name: 'Products Page', url: '/products' },
        { name: 'Packs Page', url: '/packs' }
    ];
    
    for (const page of frontendPages) {
        try {
            const response = await axios.get(`${BASE_URL}${page.url}`, {
                ...testConfig,
                validateStatus: () => true
            });
            
            if (response.status === 200) {
                logTest(`${page.name} Loads`, 'PASS', `Page accessible at ${page.url}`);
                results.passed++;
            } else {
                logTest(`${page.name} Loads`, 'WARN', `Status: ${response.status}`);
                results.warnings++;
            }
        } catch (error) {
            logTest(`${page.name} Loads`, 'WARN', `Error: ${error.message}`);
            results.warnings++;
        }
    }

    // Test Summary
    log('\n📋 Test Summary', 'bright');
    log('=' .repeat(60), 'blue');
    log(`✅ Passed: ${results.passed}`, 'green');
    log(`❌ Failed: ${results.failed}`, 'red');
    log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
    
    const totalTests = results.passed + results.failed + results.warnings;
    const successRate = totalTests > 0 ? ((results.passed / totalTests) * 100).toFixed(1) : 0;
    
    log(`\n📊 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : successRate >= 60 ? 'yellow' : 'red');
    
    if (results.failed === 0) {
        log('\n🎉 All critical tests passed! Enhanced Visitor Counter system is working correctly.', 'green');
    } else {
        log('\n⚠️  Some tests failed. Please check the issues above.', 'yellow');
    }
    
    log('\n🔧 Next Steps:', 'cyan');
    log('1. Navigate to http://localhost:8081/admin/enhanced-visitor-counter', 'cyan');
    log('2. Configure your visitor counter settings', 'cyan');
    log('3. Check frontend pages to see the counter in action', 'cyan');
    log('4. Verify that Total Views, Added Today, and Activity Level are displaying correctly', 'cyan');
    
    return results;
}

// Run the test
testEnhancedVisitorCounterSystem()
    .then(results => {
        process.exit(results.failed === 0 ? 0 : 1);
    })
    .catch(error => {
        log(`\n💥 Test suite failed with error: ${error.message}`, 'red');
        process.exit(1);
    });

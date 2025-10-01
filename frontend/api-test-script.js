/**
 * API Test Script for Admin Product Form
 * Tests all API endpoints used by the product form
 */

console.log('🔌 API ENDPOINT TESTING SCRIPT');
console.log('==============================');

const API_BASE_URL = 'http://localhost:8080/api';

// Test configuration
const TEST_CONFIG = {
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Helper function to make API calls
async function testApiEndpoint(method, endpoint, data = null, expectedStatus = 200) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: { ...TEST_CONFIG.headers },
        ...(data && { body: JSON.stringify(data) })
    };

    try {
        console.log(`🔍 Testing ${method} ${endpoint}...`);
        const startTime = Date.now();
        
        const response = await fetch(url, options);
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (response.status === expectedStatus) {
            console.log(`✅ ${method} ${endpoint}: PASSED (${duration}ms)`);
            
            // Try to parse response if it's JSON
            try {
                const responseData = await response.json();
                return { success: true, data: responseData, duration };
            } catch {
                return { success: true, data: null, duration };
            }
        } else {
            console.log(`❌ ${method} ${endpoint}: FAILED - Expected ${expectedStatus}, got ${response.status}`);
            return { success: false, status: response.status, duration };
        }
    } catch (error) {
        console.log(`❌ ${method} ${endpoint}: ERROR - ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Test functions for each API endpoint
const ApiTests = {
    // Test basic connectivity
    async testConnectivity() {
        console.log('\n🌐 TESTING BASIC CONNECTIVITY');
        console.log('==============================');
        
        const result = await testApiEndpoint('GET', '/hello');
        return result.success;
    },

    // Test categories endpoint
    async testCategories() {
        console.log('\n📂 TESTING CATEGORIES ENDPOINT');
        console.log('==============================');
        
        const result = await testApiEndpoint('GET', '/categories');
        if (result.success && result.data) {
            console.log(`📊 Found ${result.data.length} categories`);
            return true;
        }
        return false;
    },

    // Test products endpoint
    async testProducts() {
        console.log('\n📦 TESTING PRODUCTS ENDPOINT');
        console.log('============================');
        
        const result = await testApiEndpoint('GET', '/products?page=0&size=5');
        if (result.success && result.data) {
            console.log(`📊 Found ${result.data.content?.length || 0} products`);
            return true;
        }
        return false;
    },

    // Test packable products endpoint
    async testPackableProducts() {
        console.log('\n📦 TESTING PACKABLE PRODUCTS ENDPOINT');
        console.log('=====================================');
        
        const result = await testApiEndpoint('GET', '/products/packable');
        if (result.success) {
            console.log(`📊 Packable products endpoint accessible`);
            return true;
        }
        return false;
    },

    // Test product creation (without authentication - should fail)
    async testProductCreation() {
        console.log('\n➕ TESTING PRODUCT CREATION ENDPOINT');
        console.log('====================================');
        
        const testProduct = {
            name: 'Test Product',
            brand: 'Test Brand',
            price: 29.99,
            quantity: 100,
            categoryId: 1,
            type: 'BOTH',
            description: 'Test description',
            bestseller: false,
            newArrival: false,
            hasVariants: false,
            isPackable: false
        };

        // This should fail without authentication (401 or 403)
        const result = await testApiEndpoint('POST', '/products', testProduct, 401);
        return result.success; // Success means it properly rejected unauthorized access
    },

    // Test image upload endpoint
    async testImageUpload() {
        console.log('\n📸 TESTING IMAGE UPLOAD ENDPOINT');
        console.log('=================================');
        
        // Create a test file
        const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('image', testFile);

        try {
            const response = await fetch(`${API_BASE_URL}/products/description-image`, {
                method: 'POST',
                body: formData
            });

            if (response.status === 401 || response.status === 403) {
                console.log('✅ Image upload endpoint accessible (properly rejects unauthorized access)');
                return true;
            } else if (response.ok) {
                console.log('✅ Image upload endpoint working');
                return true;
            } else {
                console.log(`❌ Image upload endpoint failed with status: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Image upload endpoint error: ${error.message}`);
            return false;
        }
    }
};

// Main test runner
async function runApiTests() {
    console.log('🚀 STARTING API ENDPOINT TESTS');
    console.log('==============================');
    console.log(`Testing against: ${API_BASE_URL}\n`);

    const results = {
        connectivity: false,
        categories: false,
        products: false,
        packableProducts: false,
        productCreation: false,
        imageUpload: false
    };

    try {
        // Run all tests
        results.connectivity = await ApiTests.testConnectivity();
        results.categories = await ApiTests.testCategories();
        results.products = await ApiTests.testProducts();
        results.packableProducts = await ApiTests.testPackableProducts();
        results.productCreation = await ApiTests.testProductCreation();
        results.imageUpload = await ApiTests.testImageUpload();

        // Calculate results
        const passed = Object.values(results).filter(Boolean).length;
        const total = Object.keys(results).length;
        const successRate = ((passed / total) * 100).toFixed(1);

        console.log('\n🎯 API TEST RESULTS');
        console.log('==================');
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Success Rate: ${successRate}%`);

        console.log('\n📊 DETAILED RESULTS:');
        Object.entries(results).forEach(([test, result]) => {
            const status = result ? '✅ PASS' : '❌ FAIL';
            const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            console.log(`${status} ${testName}`);
        });

        if (successRate >= 80) {
            console.log('\n🎉 API endpoints are working well!');
        } else if (successRate >= 60) {
            console.log('\n⚠️  Some API endpoints have issues.');
        } else {
            console.log('\n❌ Multiple API endpoints need attention.');
        }

        // Recommendations
        console.log('\n📋 RECOMMENDATIONS:');
        if (!results.connectivity) {
            console.log('- Check if backend server is running on port 8080');
        }
        if (!results.categories) {
            console.log('- Verify categories endpoint is working');
        }
        if (!results.products) {
            console.log('- Check products endpoint and database connection');
        }
        if (!results.productCreation) {
            console.log('- Verify product creation endpoint authentication');
        }

        return results;

    } catch (error) {
        console.error('❌ Test suite failed with error:', error);
        return null;
    }
}

// Quick connectivity test
async function quickConnectivityTest() {
    console.log('⚡ QUICK CONNECTIVITY TEST');
    console.log('==========================');
    
    try {
        const response = await fetch(`${API_BASE_URL}/hello`, { 
            method: 'GET',
            timeout: 3000
        });
        
        if (response.ok) {
            console.log('✅ Backend server is running and accessible');
            return true;
        } else {
            console.log(`❌ Backend server responded with status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Cannot connect to backend server: ${error.message}`);
        console.log('💡 Make sure the backend server is running on port 8080');
        return false;
    }
}

// Export functions for use
window.apiTest = {
    runAllTests: runApiTests,
    quickTest: quickConnectivityTest,
    testConnectivity: ApiTests.testConnectivity,
    testCategories: ApiTests.testCategories,
    testProducts: ApiTests.testProducts,
    testPackableProducts: ApiTests.testPackableProducts,
    testProductCreation: ApiTests.testProductCreation,
    testImageUpload: ApiTests.testImageUpload
};

console.log('\n🔧 API test functions loaded successfully!');
console.log('Available functions:');
console.log('- apiTest.runAllTests() - Run all API endpoint tests');
console.log('- apiTest.quickTest() - Quick connectivity test');
console.log('- apiTest.testConnectivity() - Test basic connectivity');
console.log('- apiTest.testCategories() - Test categories endpoint');
console.log('- apiTest.testProducts() - Test products endpoint');
console.log('- apiTest.testPackableProducts() - Test packable products');
console.log('- apiTest.testProductCreation() - Test product creation');
console.log('- apiTest.testImageUpload() - Test image upload');
console.log('\n🚀 Ready to test API endpoints!');

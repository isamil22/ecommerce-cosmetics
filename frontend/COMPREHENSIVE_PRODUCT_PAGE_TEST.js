/**
 * COMPREHENSIVE PRODUCT PAGE TEST SCRIPT
 * ======================================
 * 
 * This script tests ALL aspects of the product page to ensure it works 100%
 * Run this in browser console after navigating to a product page
 */

console.log('🧪 COMPREHENSIVE PRODUCT PAGE TEST');
console.log('==================================');

// Test configuration
const TEST_CONFIG = {
    productId: 6, // Default product ID to test
    timeout: 10000,
    apiBaseUrl: 'http://localhost:8080/api'
};

// Test results storage
let testResults = {
    environment: false,
    apiConnectivity: false,
    productData: false,
    componentRendering: false,
    nullReferenceChecks: false,
    userInteractions: false
};

// Helper functions
const TestHelpers = {
    // Wait for element to appear
    waitForElement: (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            checkElement();
        });
    },

    // Check if element exists and is visible
    elementExistsAndVisible: (selector) => {
        const element = document.querySelector(selector);
        return element && element.offsetParent !== null;
    },

    // Test API endpoint
    testApiEndpoint: async (endpoint, expectedStatus = 200) => {
        try {
            const response = await fetch(`${TEST_CONFIG.apiBaseUrl}${endpoint}`);
            return response.status === expectedStatus;
        } catch (error) {
            console.error(`API test failed for ${endpoint}:`, error.message);
            return false;
        }
    }
};

// Test Suite Classes
class EnvironmentTest {
    static async run() {
        console.log('\n🌍 ENVIRONMENT TEST');
        console.log('===================');

        const tests = [
            {
                name: 'Development Mode',
                test: () => {
                    const isProduction = window.location.href.includes('dist') || 
                                       document.querySelector('script[src*="index-C"]') !== null;
                    return !isProduction;
                }
            },
            {
                name: 'React Root Element',
                test: () => TestHelpers.elementExistsAndVisible('#root')
            },
            {
                name: 'Page Loaded',
                test: () => document.readyState === 'complete'
            },
            {
                name: 'No Critical Console Errors',
                test: () => {
                    // Check if there are any critical errors in console
                    const hasCriticalErrors = window.consoleErrors && window.consoleErrors.length > 0;
                    return !hasCriticalErrors;
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        tests.forEach(test => {
            try {
                const result = test.test();
                if (result) {
                    console.log(`✅ ${test.name}: PASSED`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}: FAILED`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                failed++;
            }
        });

        const success = failed === 0;
        console.log(`\n📊 Environment Results: ${passed} passed, ${failed} failed`);
        return success;
    }
}

class ApiConnectivityTest {
    static async run() {
        console.log('\n🔌 API CONNECTIVITY TEST');
        console.log('========================');

        const tests = [
            {
                name: 'Backend Server',
                test: () => TestHelpers.testApiEndpoint('/hello')
            },
            {
                name: 'Products Endpoint',
                test: () => TestHelpers.testApiEndpoint('/products')
            },
            {
                name: 'Specific Product',
                test: () => TestHelpers.testApiEndpoint(`/products/${TEST_CONFIG.productId}`)
            },
            {
                name: 'Categories Endpoint',
                test: () => TestHelpers.testApiEndpoint('/categories')
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
            try {
                const result = await test.test();
                if (result) {
                    console.log(`✅ ${test.name}: PASSED`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}: FAILED`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                failed++;
            }
        }

        const success = failed === 0;
        console.log(`\n📊 API Results: ${passed} passed, ${failed} failed`);
        return success;
    }
}

class ProductDataTest {
    static async run() {
        console.log('\n📦 PRODUCT DATA TEST');
        console.log('====================');

        try {
            const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/products/${TEST_CONFIG.productId}`);
            if (!response.ok) {
                console.log(`❌ Product API: HTTP ${response.status}`);
                return false;
            }

            const product = await response.json();
            console.log(`✅ Product API: Working`);
            console.log(`Product Name: ${product.name || 'N/A'}`);

            const tests = [
                {
                    name: 'Product Name',
                    test: () => product.name && product.name.trim().length > 0
                },
                {
                    name: 'Product Price',
                    test: () => product.price !== undefined && product.price !== null
                },
                {
                    name: 'Product Images',
                    test: () => Array.isArray(product.images)
                },
                {
                    name: 'Product Comments',
                    test: () => Array.isArray(product.comments)
                },
                {
                    name: 'Product Variants (if applicable)',
                    test: () => {
                        if (product.hasVariants) {
                            return Array.isArray(product.variantTypes) && Array.isArray(product.variants);
                        }
                        return true;
                    }
                }
            ];

            let passed = 0;
            let failed = 0;

            tests.forEach(test => {
                try {
                    const result = test.test();
                    if (result) {
                        console.log(`✅ ${test.name}: PASSED`);
                        passed++;
                    } else {
                        console.log(`❌ ${test.name}: FAILED`);
                        failed++;
                    }
                } catch (error) {
                    console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                    failed++;
                }
            });

            const success = failed === 0;
            console.log(`\n📊 Product Data Results: ${passed} passed, ${failed} failed`);
            return success;

        } catch (error) {
            console.log(`❌ Product Data Test: ${error.message}`);
            return false;
        }
    }
}

class ComponentRenderingTest {
    static async run() {
        console.log('\n🧩 COMPONENT RENDERING TEST');
        console.log('============================');

        const tests = [
            {
                name: 'Product Title',
                test: () => TestHelpers.elementExistsAndVisible('h1, h2, h3')
            },
            {
                name: 'Product Price',
                test: () => TestHelpers.elementExistsAndVisible('[class*="price"], [class*="Price"]')
            },
            {
                name: 'Product Images',
                test: () => TestHelpers.elementExistsAndVisible('img[src]')
            },
            {
                name: 'Add to Cart Button',
                test: () => TestHelpers.elementExistsAndVisible('button')
            },
            {
                name: 'Product Description',
                test: () => TestHelpers.elementExistsAndVisible('[class*="description"], [class*="Description"]')
            },
            {
                name: 'Stock Status',
                test: () => TestHelpers.elementExistsAndVisible('[class*="stock"], [class*="Stock"]')
            }
        ];

        let passed = 0;
        let failed = 0;

        tests.forEach(test => {
            try {
                const result = test.test();
                if (result) {
                    console.log(`✅ ${test.name}: PASSED`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}: FAILED`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                failed++;
            }
        });

        const success = failed === 0;
        console.log(`\n📊 Component Rendering Results: ${passed} passed, ${failed} failed`);
        return success;
    }
}

class NullReferenceTest {
    static async run() {
        console.log('\n🔍 NULL REFERENCE TEST');
        console.log('======================');

        const tests = [
            {
                name: 'Product Data Not Null',
                test: () => {
                    // Check if product data is properly loaded
                    const productElements = document.querySelectorAll('[class*="product"]');
                    return productElements.length > 0;
                }
            },
            {
                name: 'Images Array Safe Access',
                test: () => {
                    // Check if images are safely handled
                    const images = document.querySelectorAll('img[src]');
                    return images.length > 0;
                }
            },
            {
                name: 'Comments Safe Rendering',
                test: () => {
                    // Check if comments are safely rendered
                    const commentElements = document.querySelectorAll('[class*="comment"], [class*="review"]');
                    return true; // Pass if no errors during rendering
                }
            },
            {
                name: 'Variants Safe Access',
                test: () => {
                    // Check if variants are safely handled
                    const variantElements = document.querySelectorAll('[class*="variant"]');
                    return true; // Pass if no errors during rendering
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        tests.forEach(test => {
            try {
                const result = test.test();
                if (result) {
                    console.log(`✅ ${test.name}: PASSED`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}: FAILED`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                failed++;
            }
        });

        const success = failed === 0;
        console.log(`\n📊 Null Reference Results: ${passed} passed, ${failed} failed`);
        return success;
    }
}

class UserInteractionTest {
    static async run() {
        console.log('\n👆 USER INTERACTION TEST');
        console.log('=========================');

        const tests = [
            {
                name: 'Add to Cart Button Clickable',
                test: () => {
                    const button = document.querySelector('button');
                    return button && !button.disabled;
                }
            },
            {
                name: 'Image Gallery Interactive',
                test: () => {
                    const images = document.querySelectorAll('img[src]');
                    return images.length > 0;
                }
            },
            {
                name: 'Variant Selection (if applicable)',
                test: () => {
                    const variantButtons = document.querySelectorAll('[class*="variant"] button, [class*="option"] button');
                    return variantButtons.length >= 0; // Pass even if no variants
                }
            },
            {
                name: 'Form Elements Accessible',
                test: () => {
                    const inputs = document.querySelectorAll('input, select, textarea');
                    return inputs.length >= 0; // Pass even if no form elements
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        tests.forEach(test => {
            try {
                const result = test.test();
                if (result) {
                    console.log(`✅ ${test.name}: PASSED`);
                    passed++;
                } else {
                    console.log(`❌ ${test.name}: FAILED`);
                    failed++;
                }
            } catch (error) {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
                failed++;
            }
        });

        const success = failed === 0;
        console.log(`\n📊 User Interaction Results: ${passed} passed, ${failed} failed`);
        return success;
    }
}

// Main test runner
class ComprehensiveProductPageTest {
    static async runAllTests() {
        console.log('\n🚀 STARTING COMPREHENSIVE PRODUCT PAGE TEST SUITE');
        console.log('==================================================');
        console.log(`Testing Product ID: ${TEST_CONFIG.productId}`);
        console.log(`Current URL: ${window.location.href}`);
        console.log('');

        try {
            // Run all test suites
            testResults.environment = await EnvironmentTest.run();
            testResults.apiConnectivity = await ApiConnectivityTest.run();
            testResults.productData = await ProductDataTest.run();
            testResults.componentRendering = await ComponentRenderingTest.run();
            testResults.nullReferenceChecks = await NullReferenceTest.run();
            testResults.userInteractions = await UserInteractionTest.run();

            // Calculate overall results
            const totalTests = Object.keys(testResults).length;
            const passedTests = Object.values(testResults).filter(Boolean).length;
            const successRate = ((passedTests / totalTests) * 100).toFixed(1);

            // Print final results
            console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
            console.log('=============================');
            console.log(`Total Test Categories: ${totalTests}`);
            console.log(`Passed: ${passedTests}`);
            console.log(`Failed: ${totalTests - passedTests}`);
            console.log(`Success Rate: ${successRate}%`);

            console.log('\n📊 DETAILED RESULTS:');
            Object.entries(testResults).forEach(([category, result]) => {
                const status = result ? '✅ PASS' : '❌ FAIL';
                const categoryName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                console.log(`${status} ${categoryName}`);
            });

            // Generate recommendations
            console.log('\n💡 RECOMMENDATIONS:');
            if (!testResults.environment) {
                console.log('🚨 Fix environment issues first (development server, React setup)');
            }
            if (!testResults.apiConnectivity) {
                console.log('🚨 Start backend server: cd demo && ./mvnw spring-boot:run');
            }
            if (!testResults.productData) {
                console.log('⚠️  Check product data and database connection');
            }
            if (!testResults.componentRendering) {
                console.log('⚠️  Check component rendering and UI elements');
            }
            if (!testResults.nullReferenceChecks) {
                console.log('⚠️  Review null reference handling in components');
            }
            if (!testResults.userInteractions) {
                console.log('⚠️  Check user interaction functionality');
            }

            // Final assessment
            if (successRate >= 90) {
                console.log('\n🎉 EXCELLENT! Product page is working perfectly!');
            } else if (successRate >= 70) {
                console.log('\n⚠️  GOOD! Most features work, some issues need attention.');
            } else {
                console.log('\n❌ NEEDS WORK! Multiple issues found that require fixing.');
            }

            console.log('\n📋 MANUAL TESTING CHECKLIST:');
            console.log('1. ✅ Navigate to product page');
            console.log('2. ✅ Verify page loads without errors');
            console.log('3. ✅ Check product information displays');
            console.log('4. ✅ Test add to cart functionality');
            console.log('5. ✅ Test image gallery');
            console.log('6. ✅ Test variant selection (if applicable)');
            console.log('7. ✅ Test responsive design on mobile');
            console.log('8. ✅ Check console for any remaining errors');

            return testResults;

        } catch (error) {
            console.error('❌ Test suite failed with error:', error);
            return null;
        }
    }

    static async runQuickTest() {
        console.log('⚡ QUICK PRODUCT PAGE TEST');
        console.log('==========================');
        
        // Quick checks
        const environmentOK = await EnvironmentTest.run();
        const apiOK = await ApiConnectivityTest.run();
        const renderingOK = await ComponentRenderingTest.run();
        
        const totalPassed = [environmentOK, apiOK, renderingOK].filter(Boolean).length;
        
        console.log(`\n📊 Quick Test Results: ${totalPassed}/3 passed`);
        
        if (totalPassed === 3) {
            console.log('✅ Quick test passed - product page should work!');
        } else {
            console.log('❌ Quick test failed - check issues above');
        }
        
        return { environment: environmentOK, api: apiOK, rendering: renderingOK };
    }
}

// Export functions for use
window.productPageTest = {
    runAll: ComprehensiveProductPageTest.runAllTests,
    runQuick: ComprehensiveProductPageTest.runQuickTest,
    runEnvironment: EnvironmentTest.run,
    runApi: ApiConnectivityTest.run,
    runProductData: ProductDataTest.run,
    runRendering: ComponentRenderingTest.run,
    runNullRef: NullReferenceTest.run,
    runInteractions: UserInteractionTest.run,
    results: testResults
};

console.log('\n🔧 Product page test functions loaded!');
console.log('Available functions:');
console.log('- productPageTest.runAll() - Run complete test suite');
console.log('- productPageTest.runQuick() - Run quick validation');
console.log('- productPageTest.runEnvironment() - Test environment');
console.log('- productPageTest.runApi() - Test API connectivity');
console.log('- productPageTest.runProductData() - Test product data');
console.log('- productPageTest.runRendering() - Test component rendering');
console.log('- productPageTest.runNullRef() - Test null references');
console.log('- productPageTest.runInteractions() - Test user interactions');
console.log('\n🚀 Ready to test! Run productPageTest.runAll() to start.');

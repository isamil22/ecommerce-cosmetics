/**
 * COMPREHENSIVE TEST EXECUTION SCRIPT
 * ===================================
 * 
 * This script runs both API endpoint tests and form functionality tests
 * to ensure 100% functionality of the admin product form.
 * 
 * Usage:
 * 1. Ensure both frontend and backend servers are running
 * 2. Navigate to admin product form page in browser
 * 3. Open developer console
 * 4. Copy and paste this script
 * 5. Run: runComprehensiveTests()
 */

console.log('🧪 COMPREHENSIVE ADMIN PRODUCT FORM TESTING');
console.log('============================================');
console.log('This script will test both API endpoints and form functionality');
console.log('');

// Test execution configuration
const TEST_CONFIG = {
    apiBaseUrl: 'http://localhost:8080/api',
    frontendUrl: window.location.origin,
    timeout: 10000,
    retryAttempts: 3
};

// Test results storage
let testResults = {
    api: {
        connectivity: false,
        categories: false,
        products: false,
        packableProducts: false,
        productCreation: false,
        imageUpload: false
    },
    form: {
        basicInfo: { passed: 0, failed: 0 },
        variants: { passed: 0, failed: 0 },
        images: { passed: 0, failed: 0 },
        fbt: { passed: 0, failed: 0 },
        validation: { passed: 0, failed: 0 },
        editor: { passed: 0, failed: 0 }
    }
};

// API Testing Functions
const ApiTests = {
    async testConnectivity() {
        try {
            const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/hello`, { 
                method: 'GET',
                timeout: 3000
            });
            
            if (response.ok) {
                console.log('✅ API Connectivity: PASSED');
                return true;
            } else {
                console.log(`❌ API Connectivity: FAILED (${response.status})`);
                return false;
            }
        } catch (error) {
            console.log(`❌ API Connectivity: ERROR - ${error.message}`);
            return false;
        }
    },

    async testCategories() {
        try {
            const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/categories`);
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Categories API: PASSED (${data.length} categories)`);
                return true;
            } else {
                console.log(`❌ Categories API: FAILED (${response.status})`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Categories API: ERROR - ${error.message}`);
            return false;
        }
    },

    async testProducts() {
        try {
            const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/products?page=0&size=5`);
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Products API: PASSED (${data.content?.length || 0} products)`);
                return true;
            } else {
                console.log(`❌ Products API: FAILED (${response.status})`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Products API: ERROR - ${error.message}`);
            return false;
        }
    },

    async testPackableProducts() {
        try {
            const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/products/packable`);
            if (response.ok) {
                console.log('✅ Packable Products API: PASSED');
                return true;
            } else {
                console.log(`❌ Packable Products API: FAILED (${response.status})`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Packable Products API: ERROR - ${error.message}`);
            return false;
        }
    }
};

// Form Testing Functions
const FormTests = {
    testBasicFields() {
        console.log('\n📋 TESTING BASIC FORM FIELDS');
        console.log('=============================');
        
        const tests = [
            {
                name: 'Product Name Field',
                test: () => {
                    const field = document.querySelector('input[name="name"]');
                    if (field) {
                        field.value = 'Test Product';
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                        return field.value === 'Test Product';
                    }
                    return false;
                }
            },
            {
                name: 'Price Field',
                test: () => {
                    const field = document.querySelector('input[name="price"]');
                    if (field) {
                        field.value = '29.99';
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                        return field.value === '29.99';
                    }
                    return false;
                }
            },
            {
                name: 'Category Dropdown',
                test: () => {
                    const field = document.querySelector('select[name="categoryId"]');
                    if (field && field.options.length > 1) {
                        field.value = field.options[1].value;
                        field.dispatchEvent(new Event('change', { bubbles: true }));
                        return field.value !== '';
                    }
                    return false;
                }
            },
            {
                name: 'Has Variants Checkbox',
                test: () => {
                    const field = document.querySelector('input[name="hasVariants"]');
                    if (field) {
                        field.checked = true;
                        field.dispatchEvent(new Event('change', { bubbles: true }));
                        return field.checked === true;
                    }
                    return false;
                }
            },
            {
                name: 'Is Packable Checkbox',
                test: () => {
                    const field = document.querySelector('input[name="isPackable"]');
                    if (field) {
                        field.checked = true;
                        field.dispatchEvent(new Event('change', { bubbles: true }));
                        return field.checked === true;
                    }
                    return false;
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

        return { passed, failed };
    },

    testVariants() {
        console.log('\n🔄 TESTING VARIANT FUNCTIONALITY');
        console.log('=================================');
        
        const tests = [
            {
                name: 'Variant Types Section Appears',
                test: () => {
                    const variantSection = document.querySelector('.bg-white.rounded-2xl.shadow-lg.border.border-gray-100.p-8');
                    return variantSection && variantSection.textContent.includes('Variant Types');
                }
            },
            {
                name: 'Add Variant Type Button',
                test: () => {
                    const buttons = Array.from(document.querySelectorAll('button[type="button"]'));
                    return buttons.some(btn => btn.textContent.includes('Add Variant Type'));
                }
            },
            {
                name: 'TinyMCE Editor Loaded',
                test: () => {
                    const editor = document.querySelector('.tox-tinymce');
                    return editor !== null;
                }
            },
            {
                name: 'Image Upload Input',
                test: () => {
                    const imageInput = document.querySelector('input[type="file"][multiple]');
                    return imageInput !== null;
                }
            },
            {
                name: 'FBT Multi-Select Component',
                test: () => {
                    const fbtComponent = document.querySelector('.basic-multi-select');
                    return fbtComponent !== null;
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

        return { passed, failed };
    }
};

// Main test execution function
async function runComprehensiveTests() {
    console.log('🚀 STARTING COMPREHENSIVE TEST SUITE');
    console.log('====================================');
    console.log(`Frontend URL: ${TEST_CONFIG.frontendUrl}`);
    console.log(`API Base URL: ${TEST_CONFIG.apiBaseUrl}`);
    console.log('');

    // Check if we're on the right page
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/admin/products')) {
        console.log('⚠️  WARNING: Not on admin products page');
        console.log('Please navigate to /admin/products/create or /admin/products/edit/:id');
        console.log('');
    }

    try {
        // Run API tests
        console.log('🔌 TESTING API ENDPOINTS');
        console.log('========================');
        
        testResults.api.connectivity = await ApiTests.testConnectivity();
        testResults.api.categories = await ApiTests.testCategories();
        testResults.api.products = await ApiTests.testProducts();
        testResults.api.packableProducts = await ApiTests.testPackableProducts();

        // Run form tests
        console.log('\n📝 TESTING FORM FUNCTIONALITY');
        console.log('=============================');
        
        testResults.form.basicInfo = FormTests.testBasicFields();
        testResults.form.variants = FormTests.testVariants();

        // Calculate and display results
        const apiPassed = Object.values(testResults.api).filter(Boolean).length;
        const apiTotal = Object.keys(testResults.api).length;
        const apiSuccessRate = ((apiPassed / apiTotal) * 100).toFixed(1);

        const formPassed = Object.values(testResults.form).reduce((sum, result) => sum + result.passed, 0);
        const formFailed = Object.values(testResults.form).reduce((sum, result) => sum + result.failed, 0);
        const formTotal = formPassed + formFailed;
        const formSuccessRate = ((formPassed / formTotal) * 100).toFixed(1);

        console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
        console.log('=============================');
        console.log(`API Tests: ${apiPassed}/${apiTotal} passed (${apiSuccessRate}%)`);
        console.log(`Form Tests: ${formPassed}/${formTotal} passed (${formSuccessRate}%)`);

        console.log('\n📊 DETAILED API RESULTS:');
        Object.entries(testResults.api).forEach(([test, result]) => {
            const status = result ? '✅ PASS' : '❌ FAIL';
            const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            console.log(`${status} ${testName}`);
        });

        console.log('\n📊 DETAILED FORM RESULTS:');
        Object.entries(testResults.form).forEach(([category, result]) => {
            const categoryName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const total = result.passed + result.failed;
            const rate = total > 0 ? ((result.passed / total) * 100).toFixed(1) : '0';
            console.log(`${categoryName}: ${result.passed}/${total} passed (${rate}%)`);
        });

        // Overall assessment
        const overallSuccessRate = ((apiPassed + formPassed) / (apiTotal + formTotal)) * 100;
        
        console.log('\n🎉 OVERALL ASSESSMENT');
        console.log('====================');
        console.log(`Overall Success Rate: ${overallSuccessRate.toFixed(1)}%`);

        if (overallSuccessRate >= 90) {
            console.log('🎉 EXCELLENT! Admin Product Form is fully functional!');
        } else if (overallSuccessRate >= 70) {
            console.log('⚠️  GOOD! Most features work, some issues need attention.');
        } else {
            console.log('❌ NEEDS WORK! Multiple issues found that require fixing.');
        }

        // Recommendations
        console.log('\n📋 RECOMMENDATIONS:');
        if (!testResults.api.connectivity) {
            console.log('- Start the backend server on port 8080');
        }
        if (!testResults.api.categories) {
            console.log('- Check categories endpoint and database');
        }
        if (!testResults.api.products) {
            console.log('- Verify products endpoint functionality');
        }
        if (testResults.form.basicInfo.failed > 0) {
            console.log('- Check form field implementations');
        }
        if (testResults.form.variants.failed > 0) {
            console.log('- Verify variant functionality and UI components');
        }

        console.log('\n📋 MANUAL TESTING STILL NEEDED:');
        console.log('1. Test actual form submission with valid data');
        console.log('2. Test variant creation and combination generation');
        console.log('3. Test image uploads (main and variant images)');
        console.log('4. Test frequently bought together selection');
        console.log('5. Test form validation with invalid data');
        console.log('6. Test editing existing products');
        console.log('7. Test responsive design on mobile devices');

        return testResults;

    } catch (error) {
        console.error('❌ Test suite failed with error:', error);
        return null;
    }
}

// Quick test function
async function runQuickTest() {
    console.log('⚡ QUICK TEST');
    console.log('============');
    
    // Test API connectivity
    const apiWorking = await ApiTests.testConnectivity();
    
    // Test basic form elements
    const nameField = document.querySelector('input[name="name"]') !== null;
    const priceField = document.querySelector('input[name="price"]') !== null;
    const categoryField = document.querySelector('select[name="categoryId"]') !== null;
    const variantCheckbox = document.querySelector('input[name="hasVariants"]') !== null;
    const packableCheckbox = document.querySelector('input[name="isPackable"]') !== null;
    
    const formElementsWorking = [nameField, priceField, categoryField, variantCheckbox, packableCheckbox].filter(Boolean).length;
    
    console.log(`API Connectivity: ${apiWorking ? '✅' : '❌'}`);
    console.log(`Form Elements: ${formElementsWorking}/5 working`);
    
    if (apiWorking && formElementsWorking >= 4) {
        console.log('✅ Quick test passed - ready for comprehensive testing!');
    } else {
        console.log('❌ Quick test failed - check server and page setup');
    }
    
    return { api: apiWorking, form: formElementsWorking >= 4 };
}

// Export functions
window.comprehensiveTest = {
    runAll: runComprehensiveTests,
    runQuick: runQuickTest,
    results: testResults
};

console.log('\n🔧 Comprehensive test functions loaded!');
console.log('Available functions:');
console.log('- comprehensiveTest.runAll() - Run complete test suite');
console.log('- comprehensiveTest.runQuick() - Run quick validation');
console.log('\n🚀 Ready to test! Run comprehensiveTest.runAll() to start.');

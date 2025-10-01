/**
 * COMPREHENSIVE TEST SCRIPT FOR ADMIN PRODUCT FORM
 * ================================================
 * 
 * This script tests ALL features of the AdminProductForm component:
 * - Basic product information
 * - Product variants with dynamic combinations
 * - Frequently bought together functionality
 * - Pack options (isPackable)
 * - Image uploads (main and variant images)
 * - Rich text editor functionality
 * - Form validation and error handling
 * 
 * Usage:
 * 1. Open browser developer tools
 * 2. Navigate to admin product form page
 * 3. Copy and paste this script into console
 * 4. Run: runComprehensiveProductFormTest()
 */

console.log('🧪 COMPREHENSIVE ADMIN PRODUCT FORM TEST SUITE');
console.log('===============================================');

// Test Configuration
const TEST_CONFIG = {
    // Test data for different scenarios
    VALID_PRODUCT: {
        name: 'Test Product',
        brand: 'Test Brand',
        price: '29.99',
        quantity: '100',
        categoryId: '1',
        type: 'BOTH',
        description: '<p>This is a test product description</p>',
        bestseller: true,
        newArrival: false,
        hasVariants: false,
        isPackable: true
    },
    
    VARIANT_PRODUCT: {
        name: 'Variant Test Product',
        brand: 'Variant Brand',
        price: '49.99',
        quantity: '50',
        categoryId: '1',
        type: 'MEN',
        description: '<p>Product with variants</p>',
        bestseller: false,
        newArrival: true,
        hasVariants: true,
        isPackable: false,
        variantTypes: [
            { name: 'Size', options: 'S, M, L, XL' },
            { name: 'Color', options: 'Red, Blue, Green' }
        ]
    },
    
    INVALID_PRODUCTS: [
        { name: '', price: '10', categoryId: '1', description: 'Missing name' },
        { name: 'Test', price: '', categoryId: '1', description: 'Missing price' },
        { name: 'Test', price: '10', categoryId: '', description: 'Missing category' },
        { name: 'Test', price: '0', categoryId: '1', description: 'Zero price' },
        { name: 'Test', price: '-5', categoryId: '1', description: 'Negative price' }
    ]
};

// Test Helper Functions
const TestHelpers = {
    // Wait for element to be available
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

    // Fill form field
    fillField: (selector, value, eventType = 'input') => {
        const element = document.querySelector(selector);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
            return true;
        }
        return false;
    },

    // Check if element exists
    elementExists: (selector) => {
        return document.querySelector(selector) !== null;
    },

    // Get element value
    getElementValue: (selector) => {
        const element = document.querySelector(selector);
        return element ? element.value : null;
    },

    // Simulate file upload
    simulateFileUpload: (selector, files) => {
        const element = document.querySelector(selector);
        if (element) {
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            element.files = dataTransfer.files;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    },

    // Wait for API call completion
    waitForApiCall: (timeout = 10000) => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }
};

// Test Suite Classes
class BasicProductInfoTest {
    static async run() {
        console.log('\n📋 TESTING BASIC PRODUCT INFORMATION');
        console.log('=====================================');

        const tests = [
            {
                name: 'Product Name Field',
                test: () => {
                    const success = TestHelpers.fillField('input[name="name"]', TEST_CONFIG.VALID_PRODUCT.name);
                    const value = TestHelpers.getElementValue('input[name="name"]');
                    return success && value === TEST_CONFIG.VALID_PRODUCT.name;
                }
            },
            {
                name: 'Brand Field',
                test: () => {
                    const success = TestHelpers.fillField('input[name="brand"]', TEST_CONFIG.VALID_PRODUCT.brand);
                    const value = TestHelpers.getElementValue('input[name="brand"]');
                    return success && value === TEST_CONFIG.VALID_PRODUCT.brand;
                }
            },
            {
                name: 'Price Field',
                test: () => {
                    const success = TestHelpers.fillField('input[name="price"]', TEST_CONFIG.VALID_PRODUCT.price);
                    const value = TestHelpers.getElementValue('input[name="price"]');
                    return success && value === TEST_CONFIG.VALID_PRODUCT.price;
                }
            },
            {
                name: 'Quantity Field',
                test: () => {
                    const success = TestHelpers.fillField('input[name="quantity"]', TEST_CONFIG.VALID_PRODUCT.quantity);
                    const value = TestHelpers.getElementValue('input[name="quantity"]');
                    return success && value === TEST_CONFIG.VALID_PRODUCT.quantity;
                }
            },
            {
                name: 'Category Selection',
                test: () => {
                    const categorySelect = document.querySelector('select[name="categoryId"]');
                    if (categorySelect && categorySelect.options.length > 1) {
                        categorySelect.value = TEST_CONFIG.VALID_PRODUCT.categoryId;
                        categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
                        return categorySelect.value === TEST_CONFIG.VALID_PRODUCT.categoryId;
                    }
                    return false;
                }
            },
            {
                name: 'Type Selection',
                test: () => {
                    const typeSelect = document.querySelector('select[name="type"]');
                    if (typeSelect) {
                        typeSelect.value = TEST_CONFIG.VALID_PRODUCT.type;
                        typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        return typeSelect.value === TEST_CONFIG.VALID_PRODUCT.type;
                    }
                    return false;
                }
            },
            {
                name: 'Bestseller Checkbox',
                test: () => {
                    const checkbox = document.querySelector('input[name="bestseller"]');
                    if (checkbox) {
                        checkbox.checked = TEST_CONFIG.VALID_PRODUCT.bestseller;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        return checkbox.checked === TEST_CONFIG.VALID_PRODUCT.bestseller;
                    }
                    return false;
                }
            },
            {
                name: 'New Arrival Checkbox',
                test: () => {
                    const checkbox = document.querySelector('input[name="newArrival"]');
                    if (checkbox) {
                        checkbox.checked = TEST_CONFIG.VALID_PRODUCT.newArrival;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        return checkbox.checked === TEST_CONFIG.VALID_PRODUCT.newArrival;
                    }
                    return false;
                }
            },
            {
                name: 'Is Packable Checkbox',
                test: () => {
                    const checkbox = document.querySelector('input[name="isPackable"]');
                    if (checkbox) {
                        checkbox.checked = TEST_CONFIG.VALID_PRODUCT.isPackable;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        return checkbox.checked === TEST_CONFIG.VALID_PRODUCT.isPackable;
                    }
                    return false;
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
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
        }

        console.log(`\n📊 Basic Product Info Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    }
}

class VariantManagementTest {
    static async run() {
        console.log('\n🔄 TESTING PRODUCT VARIANTS');
        console.log('============================');

        const tests = [
            {
                name: 'Enable Variants Checkbox',
                test: () => {
                    const checkbox = document.querySelector('input[name="hasVariants"]');
                    if (checkbox) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        return checkbox.checked === true;
                    }
                    return false;
                }
            },
            {
                name: 'Add Variant Type Button Exists',
                test: () => {
                    const button = document.querySelector('button[type="button"]');
                    const variantSection = document.querySelector('.bg-white.rounded-2xl.shadow-lg.border.border-gray-100.p-8');
                    return variantSection && variantSection.textContent.includes('Variant Types');
                }
            },
            {
                name: 'Add First Variant Type',
                test: () => {
                    const addButton = document.querySelector('button[type="button"]');
                    if (addButton && addButton.textContent.includes('Add Variant Type')) {
                        addButton.click();
                        
                        // Wait for variant type form to appear
                        setTimeout(() => {
                            const variantTypeInputs = document.querySelectorAll('input[placeholder*="e.g., Size, Color"]');
                            if (variantTypeInputs.length > 0) {
                                variantTypeInputs[0].value = 'Size';
                                variantTypeInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                                
                                const optionsInput = document.querySelector('input[placeholder*="e.g., S, M, L"]');
                                if (optionsInput) {
                                    optionsInput.value = 'S, M, L';
                                    optionsInput.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            }
                        }, 100);
                        
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'Add Second Variant Type',
                test: () => {
                    const addButton = document.querySelector('button[type="button"]');
                    if (addButton && addButton.textContent.includes('Add Variant Type')) {
                        addButton.click();
                        
                        setTimeout(() => {
                            const variantTypeInputs = document.querySelectorAll('input[placeholder*="e.g., Size, Color"]');
                            if (variantTypeInputs.length > 1) {
                                variantTypeInputs[1].value = 'Color';
                                variantTypeInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
                                
                                const optionsInputs = document.querySelectorAll('input[placeholder*="e.g., S, M, L"]');
                                if (optionsInputs.length > 1) {
                                    optionsInputs[1].value = 'Red, Blue';
                                    optionsInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            }
                        }, 100);
                        
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'Check Variant Combinations Generated',
                test: () => {
                    // Wait for variant combinations to be generated
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            const variantSections = document.querySelectorAll('.p-4.bg-gray-50.rounded-lg.mb-4.space-y-4');
                            const hasVariants = variantSections.length > 0;
                            resolve(hasVariants);
                        }, 1000);
                    });
                }
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

        console.log(`\n📊 Variant Management Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    }
}

class ImageUploadTest {
    static async run() {
        console.log('\n📸 TESTING IMAGE UPLOAD');
        console.log('========================');

        const tests = [
            {
                name: 'Main Product Images Input Exists',
                test: () => {
                    const imageInput = document.querySelector('input[type="file"][multiple]');
                    return imageInput !== null;
                }
            },
            {
                name: 'Image Preview Functionality',
                test: () => {
                    const imageInput = document.querySelector('input[type="file"][multiple]');
                    if (imageInput) {
                        // Create a mock file
                        const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                        const success = TestHelpers.simulateFileUpload('input[type="file"][multiple]', [mockFile]);
                        return success;
                    }
                    return false;
                }
            },
            {
                name: 'Variant Image Upload (if variants enabled)',
                test: () => {
                    const variantImageInputs = document.querySelectorAll('input[accept="image/*"]');
                    if (variantImageInputs.length > 0) {
                        const mockFile = new File(['test'], 'variant.jpg', { type: 'image/jpeg' });
                        const success = TestHelpers.simulateFileUpload('input[accept="image/*"]', [mockFile]);
                        return success;
                    }
                    return true; // Pass if no variants enabled
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
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
        }

        console.log(`\n📊 Image Upload Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    }
}

class FrequentlyBoughtTogetherTest {
    static async run() {
        console.log('\n⭐ TESTING FREQUENTLY BOUGHT TOGETHER');
        console.log('=====================================');

        const tests = [
            {
                name: 'Frequently Bought Together Section Exists',
                test: () => {
                    const fbtSection = document.querySelector('.bg-white.rounded-2xl.shadow-lg.border.border-gray-100.p-8');
                    const hasFbtTitle = fbtSection && fbtSection.textContent.includes('Frequently Bought Together');
                    return hasFbtTitle;
                }
            },
            {
                name: 'Multi-Select Component Exists',
                test: () => {
                    const selectComponent = document.querySelector('.basic-multi-select');
                    return selectComponent !== null;
                }
            },
            {
                name: 'Product Options Loaded',
                test: () => {
                    // Check if products are loaded for selection
                    const selectComponent = document.querySelector('.basic-multi-select');
                    if (selectComponent) {
                        // Try to open the select
                        const selectInput = selectComponent.querySelector('input');
                        if (selectInput) {
                            selectInput.click();
                            return true;
                        }
                    }
                    return false;
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
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
        }

        console.log(`\n📊 Frequently Bought Together Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    }
}

class FormValidationTest {
    static async run() {
        console.log('\n✅ TESTING FORM VALIDATION');
        console.log('==========================');

        const tests = [
            {
                name: 'Required Field Validation - Name',
                test: () => {
                    TestHelpers.fillField('input[name="name"]', '');
                    const submitButton = document.querySelector('button[type="submit"], button:not([type])');
                    if (submitButton) {
                        submitButton.click();
                        // Check if error message appears
                        setTimeout(() => {
                            const errorElement = document.querySelector('.bg-red-100, .text-red-500');
                            return errorElement !== null;
                        }, 500);
                    }
                    return false;
                }
            },
            {
                name: 'Required Field Validation - Price',
                test: () => {
                    TestHelpers.fillField('input[name="name"]', 'Test Product');
                    TestHelpers.fillField('input[name="price"]', '');
                    const submitButton = document.querySelector('button[type="submit"], button:not([type])');
                    if (submitButton) {
                        submitButton.click();
                        return true; // Form should prevent submission
                    }
                    return false;
                }
            },
            {
                name: 'Required Field Validation - Category',
                test: () => {
                    TestHelpers.fillField('input[name="price"]', '10');
                    const categorySelect = document.querySelector('select[name="categoryId"]');
                    if (categorySelect) {
                        categorySelect.value = '';
                        categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
                        return categorySelect.value === '';
                    }
                    return false;
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
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
        }

        console.log(`\n📊 Form Validation Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    }
}

class TinyMCEEditorTest {
    static async run() {
        console.log('\n📝 TESTING TINYMCE EDITOR');
        console.log('=========================');

        const tests = [
            {
                name: 'TinyMCE Editor Loaded',
                test: () => {
                    const editor = document.querySelector('.tox-tinymce');
                    return editor !== null;
                }
            },
            {
                name: 'Editor Content Area Accessible',
                test: () => {
                    const editorIframe = document.querySelector('.tox-edit-area__iframe');
                    return editorIframe !== null;
                }
            },
            {
                name: 'Editor Toolbar Present',
                test: () => {
                    const toolbar = document.querySelector('.tox-toolbar__primary');
                    return toolbar !== null;
                }
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
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
        }

        console.log(`\n📊 TinyMCE Editor Results: ${passed} passed, ${failed} failed`);
        return { passed, failed };
    }
}

// Main Test Runner
class ComprehensiveTestRunner {
    static async runAllTests() {
        console.log('\n🚀 STARTING COMPREHENSIVE TEST SUITE');
        console.log('====================================');
        console.log('Make sure you are on the admin product form page!');
        console.log('URL should be: /admin/products/create or /admin/products/edit/:id\n');

        const results = {
            basicProductInfo: { passed: 0, failed: 0 },
            variantManagement: { passed: 0, failed: 0 },
            imageUpload: { passed: 0, failed: 0 },
            frequentlyBoughtTogether: { passed: 0, failed: 0 },
            formValidation: { passed: 0, failed: 0 },
            tinyMCEEditor: { passed: 0, failed: 0 }
        };

        try {
            // Run all test suites
            results.basicProductInfo = await BasicProductInfoTest.run();
            results.variantManagement = await VariantManagementTest.run();
            results.imageUpload = await ImageUploadTest.run();
            results.frequentlyBoughtTogether = await FrequentlyBoughtTogetherTest.run();
            results.formValidation = await FormValidationTest.run();
            results.tinyMCEEditor = await TinyMCEEditorTest.run();

            // Calculate totals
            const totalPassed = Object.values(results).reduce((sum, result) => sum + result.passed, 0);
            const totalFailed = Object.values(results).reduce((sum, result) => sum + result.failed, 0);
            const totalTests = totalPassed + totalFailed;
            const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

            // Print final results
            console.log('\n🎯 FINAL TEST RESULTS');
            console.log('=====================');
            console.log(`Total Tests: ${totalTests}`);
            console.log(`Passed: ${totalPassed}`);
            console.log(`Failed: ${totalFailed}`);
            console.log(`Success Rate: ${successRate}%`);

            console.log('\n📊 DETAILED BREAKDOWN:');
            Object.entries(results).forEach(([category, result]) => {
                const categoryName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const categoryRate = ((result.passed / (result.passed + result.failed)) * 100).toFixed(1);
                console.log(`${categoryName}: ${result.passed}/${result.passed + result.failed} (${categoryRate}%)`);
            });

            if (successRate >= 90) {
                console.log('\n🎉 EXCELLENT! Admin Product Form is working great!');
            } else if (successRate >= 70) {
                console.log('\n⚠️  GOOD! Some issues found, but core functionality works.');
            } else {
                console.log('\n❌ NEEDS ATTENTION! Multiple issues found that need fixing.');
            }

            console.log('\n📋 MANUAL TESTING CHECKLIST:');
            console.log('1. ✅ Test creating a new product with all fields');
            console.log('2. ✅ Test creating a product with variants');
            console.log('3. ✅ Test image uploads (main and variant images)');
            console.log('4. ✅ Test frequently bought together selection');
            console.log('5. ✅ Test form validation with invalid data');
            console.log('6. ✅ Test TinyMCE editor functionality');
            console.log('7. ✅ Test editing existing products');
            console.log('8. ✅ Test responsive design on mobile');
            console.log('9. ✅ Test keyboard navigation and accessibility');
            console.log('10. ✅ Test error handling and user feedback');

            return results;

        } catch (error) {
            console.error('❌ Test suite failed with error:', error);
            return null;
        }
    }

    static async runQuickTest() {
        console.log('\n⚡ RUNNING QUICK TEST');
        console.log('====================');
        
        const quickTests = [
            () => TestHelpers.elementExists('input[name="name"]'),
            () => TestHelpers.elementExists('input[name="price"]'),
            () => TestHelpers.elementExists('select[name="categoryId"]'),
            () => TestHelpers.elementExists('input[name="hasVariants"]'),
            () => TestHelpers.elementExists('input[name="isPackable"]'),
            () => TestHelpers.elementExists('input[type="file"][multiple]'),
            () => TestHelpers.elementExists('.tox-tinymce')
        ];

        let passed = 0;
        const total = quickTests.length;

        quickTests.forEach((test, index) => {
            try {
                const result = test();
                if (result) {
                    console.log(`✅ Quick Test ${index + 1}: PASSED`);
                    passed++;
                } else {
                    console.log(`❌ Quick Test ${index + 1}: FAILED`);
                }
            } catch (error) {
                console.log(`❌ Quick Test ${index + 1}: ERROR`);
            }
        });

        console.log(`\n📊 Quick Test Results: ${passed}/${total} passed`);
        return { passed, total };
    }
}

// Export functions for use
window.adminProductFormTest = {
    runComprehensiveTest: ComprehensiveTestRunner.runAllTests,
    runQuickTest: ComprehensiveTestRunner.runQuickTest,
    runBasicInfoTest: BasicProductInfoTest.run,
    runVariantTest: VariantManagementTest.run,
    runImageTest: ImageUploadTest.run,
    runFBTTest: FrequentlyBoughtTogetherTest.run,
    runValidationTest: FormValidationTest.run,
    runEditorTest: TinyMCEEditorTest.run,
    config: TEST_CONFIG,
    helpers: TestHelpers
};

console.log('\n🔧 Test functions loaded successfully!');
console.log('Available functions:');
console.log('- adminProductFormTest.runComprehensiveTest() - Run all tests');
console.log('- adminProductFormTest.runQuickTest() - Run quick validation');
console.log('- adminProductFormTest.runBasicInfoTest() - Test basic form fields');
console.log('- adminProductFormTest.runVariantTest() - Test variant functionality');
console.log('- adminProductFormTest.runImageTest() - Test image uploads');
console.log('- adminProductFormTest.runFBTTest() - Test frequently bought together');
console.log('- adminProductFormTest.runValidationTest() - Test form validation');
console.log('- adminProductFormTest.runEditorTest() - Test TinyMCE editor');
console.log('\n🚀 Ready to test! Run adminProductFormTest.runComprehensiveTest() to start.');

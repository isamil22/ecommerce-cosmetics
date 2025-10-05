// Comprehensive Test Script for Comment Visibility Control
// Run this in browser console on the pack pages to verify functionality

console.log('🧪 Starting Comment Visibility Control Test...');

// Test 1: Admin Pack Form Test
async function testAdminPackForm() {
    console.log('\n📝 Test 1: Admin Pack Form Comment Control');
    
    try {
        // Navigate to admin pack form
        window.location.href = 'http://localhost:8081/admin/packs/new';
        
        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if comment control exists
        const commentControls = document.querySelectorAll('input[name="commentsEnabled"]');
        
        if (commentControls.length === 2) {
            console.log('✅ Comment visibility controls found');
            
            // Check default selection
            const showCommentsRadio = document.querySelector('input[name="commentsEnabled"][value="true"]');
            const hideCommentsRadio = document.querySelector('input[name="commentsEnabled"][value="false"]');
            
            if (showCommentsRadio && showCommentsRadio.checked) {
                console.log('✅ Default selection is "Show Comments"');
            } else {
                console.log('❌ Default selection is not "Show Comments"');
            }
            
            // Test toggle functionality
            hideCommentsRadio.click();
            if (hideCommentsRadio.checked) {
                console.log('✅ Can switch to "Hide Comments"');
            } else {
                console.log('❌ Cannot switch to "Hide Comments"');
            }
            
            showCommentsRadio.click();
            if (showCommentsRadio.checked) {
                console.log('✅ Can switch back to "Show Comments"');
            } else {
                console.log('❌ Cannot switch back to "Show Comments"');
            }
            
            return true;
        } else {
            console.log('❌ Comment visibility controls not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing admin pack form:', error);
        return false;
    }
}

// Test 2: Create Pack with Comments Enabled
async function testCreatePackWithComments() {
    console.log('\n📦 Test 2: Create Pack with Comments Enabled');
    
    try {
        // Fill out basic pack information
        const nameInput = document.querySelector('input[name="name"]');
        const priceInput = document.querySelector('input[name="price"]');
        
        if (nameInput && priceInput) {
            nameInput.value = 'Test Pack with Comments';
            priceInput.value = '29.99';
            
            // Ensure comments are enabled
            const showCommentsRadio = document.querySelector('input[name="commentsEnabled"][value="true"]');
            if (showCommentsRadio) {
                showCommentsRadio.click();
            }
            
            console.log('✅ Pack form filled with comments enabled');
            return true;
        } else {
            console.log('❌ Could not find pack form inputs');
            return false;
        }
    } catch (error) {
        console.error('❌ Error creating pack with comments:', error);
        return false;
    }
}

// Test 3: Create Pack with Comments Disabled
async function testCreatePackWithoutComments() {
    console.log('\n🚫 Test 3: Create Pack with Comments Disabled');
    
    try {
        // Fill out basic pack information
        const nameInput = document.querySelector('input[name="name"]');
        const priceInput = document.querySelector('input[name="price"]');
        
        if (nameInput && priceInput) {
            nameInput.value = 'Test Pack without Comments';
            priceInput.value = '39.99';
            
            // Ensure comments are disabled
            const hideCommentsRadio = document.querySelector('input[name="commentsEnabled"][value="false"]');
            if (hideCommentsRadio) {
                hideCommentsRadio.click();
            }
            
            console.log('✅ Pack form filled with comments disabled');
            return true;
        } else {
            console.log('❌ Could not find pack form inputs');
            return false;
        }
    } catch (error) {
        console.error('❌ Error creating pack without comments:', error);
        return false;
    }
}

// Test 4: Verify Comments Section on Pack Page
async function testPackPageComments(packId, shouldHaveComments) {
    console.log(`\n👀 Test 4: Verify Comments on Pack ${packId} (should ${shouldHaveComments ? 'have' : 'not have'} comments)`);
    
    try {
        // Navigate to pack page
        window.location.href = `http://localhost:8081/packs/${packId}`;
        
        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Look for comments section
        const commentsSection = document.querySelector('.mt-12'); // Comments section wrapper
        const commentsHeader = document.querySelector('h2:contains("التعليقات")') || 
                              document.querySelector('h2:contains("Comments")');
        const commentForm = document.querySelector('h3:contains("اترك تعليقك")') ||
                           document.querySelector('h3:contains("Leave Your Comment")');
        
        if (shouldHaveComments) {
            if (commentsSection && commentsHeader) {
                console.log('✅ Comments section found on pack page');
                return true;
            } else {
                console.log('❌ Comments section not found on pack page (but should be there)');
                return false;
            }
        } else {
            if (!commentsSection || !commentsHeader) {
                console.log('✅ Comments section correctly hidden on pack page');
                return true;
            } else {
                console.log('❌ Comments section found on pack page (but should be hidden)');
                return false;
            }
        }
    } catch (error) {
        console.error('❌ Error testing pack page comments:', error);
        return false;
    }
}

// Test 5: API Response Test
async function testAPIResponse() {
    console.log('\n🔌 Test 5: API Response Test');
    
    try {
        // Test pack API endpoint
        const response = await fetch('http://localhost:8080/api/packs/1');
        
        if (response.ok) {
            const packData = await response.json();
            
            if (packData.data && typeof packData.data.commentsEnabled !== 'undefined') {
                console.log('✅ API returns commentsEnabled field:', packData.data.commentsEnabled);
                return true;
            } else {
                console.log('❌ API does not return commentsEnabled field');
                return false;
            }
        } else {
            console.log('❌ API request failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing API:', error);
        return false;
    }
}

// Test 6: Form Submission Test
async function testFormSubmission() {
    console.log('\n📤 Test 6: Form Submission Test');
    
    try {
        // Check if form includes commentsEnabled in submission
        const form = document.querySelector('form');
        
        if (form) {
            // Create a test FormData to see what gets submitted
            const formData = new FormData(form);
            const packData = JSON.parse(formData.get('pack'));
            
            if (typeof packData.commentsEnabled !== 'undefined') {
                console.log('✅ Form includes commentsEnabled in submission:', packData.commentsEnabled);
                return true;
            } else {
                console.log('❌ Form does not include commentsEnabled in submission');
                return false;
            }
        } else {
            console.log('❌ Could not find form element');
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing form submission:', error);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Running Comprehensive Comment Visibility Control Tests...\n');
    
    const results = {
        adminForm: false,
        apiResponse: false,
        formSubmission: false
    };
    
    try {
        // Test admin form
        results.adminForm = await testAdminPackForm();
        
        // Test API response
        results.apiResponse = await testAPIResponse();
        
        // Test form submission (if on admin form page)
        if (window.location.pathname.includes('/admin/packs/new')) {
            results.formSubmission = await testFormSubmission();
        }
        
        // Summary
        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        console.log(`Admin Form Control: ${results.adminForm ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`API Response: ${results.apiResponse ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Form Submission: ${results.formSubmission ? '✅ PASS' : '❌ FAIL'}`);
        
        const totalTests = Object.keys(results).length;
        const passedTests = Object.values(results).filter(Boolean).length;
        
        console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Comment visibility control is working correctly.');
        } else {
            console.log('⚠️ Some tests failed. Please check the implementation.');
        }
        
    } catch (error) {
        console.error('❌ Error running tests:', error);
    }
}

// Auto-run tests if on the right page
if (window.location.pathname.includes('/admin/packs/new')) {
    console.log('🎯 Detected admin pack form page. Auto-running tests...');
    runAllTests();
} else if (window.location.pathname.includes('/packs/')) {
    console.log('🎯 Detected pack detail page. Testing comments section...');
    const packId = window.location.pathname.split('/packs/')[1];
    testPackPageComments(packId, true); // Assume should have comments for existing packs
} else {
    console.log('🎯 Ready to run tests. Please navigate to the admin pack form or pack detail page.');
    console.log('💡 Available test functions:');
    console.log('   - testAdminPackForm()');
    console.log('   - testCreatePackWithComments()');
    console.log('   - testCreatePackWithoutComments()');
    console.log('   - testPackPageComments(packId, shouldHaveComments)');
    console.log('   - testAPIResponse()');
    console.log('   - testFormSubmission()');
    console.log('   - runAllTests()');
}

// Export functions for manual testing
window.testCommentVisibility = {
    testAdminPackForm,
    testCreatePackWithComments,
    testCreatePackWithoutComments,
    testPackPageComments,
    testAPIResponse,
    testFormSubmission,
    runAllTests
};

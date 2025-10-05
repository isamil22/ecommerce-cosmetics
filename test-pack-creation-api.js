// Test script for pack creation API
// Run this in browser console on the admin page (http://localhost:8081/admin/packs/new)

console.log('🧪 Starting Pack Creation API Test');

// Test data for pack creation
const testPackData = {
    name: `Test Beauty Pack - ${new Date().toISOString()}`,
    description: `<p>This is a test beauty pack created via API testing.</p>
    <ul>
        <li>High-quality skincare products</li>
        <li>Professional makeup items</li>
        <li>Perfect for daily routine</li>
        <li>Great value for money</li>
    </ul>
    <p><strong>Perfect for:</strong> Beauty enthusiasts, skincare beginners</p>`,
    price: 99.99,
    productIds: [2, 3], // COSRX BHA and Lip Butter
    recommendedProductIds: [4, 5], // Hair Treatment and Perfume
    recommendedPackIds: [1] // Existing pack
};

console.log('📋 Test Pack Data:', testPackData);

// Function to test pack creation
async function testPackCreation() {
    try {
        console.log('🚀 Starting pack creation test...');
        
        // Get authentication token from localStorage or session
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
        console.log('🔑 Auth token found:', token ? 'Yes' : 'No');
        
        // Test API endpoint
        const response = await fetch('http://localhost:8082/api/packs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testPackData)
        });
        
        console.log('📡 API Response Status:', response.status);
        console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Pack created successfully!', result);
            
            // Verify pack was created
            await verifyPackCreation(result.id || result.packId);
            
            return result;
        } else {
            const errorText = await response.text();
            console.error('❌ Pack creation failed:', response.status, errorText);
            
            if (response.status === 403) {
                console.log('🔐 Authentication required. Please log in as admin first.');
                console.log('💡 Try logging in at: http://localhost:8081/login');
            }
            
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('💥 Test failed:', error);
        throw error;
    }
}

// Function to verify pack creation
async function verifyPackCreation(packId) {
    try {
        console.log(`🔍 Verifying pack creation for ID: ${packId}`);
        
        const response = await fetch(`http://localhost:8082/api/packs/${packId}`);
        
        if (response.ok) {
            const pack = await response.json();
            console.log('✅ Pack verification successful:', pack);
            return pack;
        } else {
            console.error('❌ Pack verification failed:', response.status);
            throw new Error(`Verification failed: HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('💥 Verification error:', error);
        throw error;
    }
}

// Function to test existing packs API
async function testPacksAPI() {
    try {
        console.log('📡 Testing packs API...');
        
        const response = await fetch('http://localhost:8082/api/packs');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Packs API working:', data);
            console.log(`📊 Found ${data.value?.length || data.data?.length || 0} packs`);
            return data;
        } else {
            console.error('❌ Packs API failed:', response.status);
            throw new Error(`Packs API failed: HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('💥 Packs API error:', error);
        throw error;
    }
}

// Function to test products API
async function testProductsAPI() {
    try {
        console.log('📡 Testing products API...');
        
        const response = await fetch('http://localhost:8082/api/products');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Products API working:', data);
            console.log(`📊 Found ${data.content?.length || data.data?.length || 0} products`);
            return data;
        } else {
            console.error('❌ Products API failed:', response.status);
            throw new Error(`Products API failed: HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('💥 Products API error:', error);
        throw error;
    }
}

// Function to run complete test suite
async function runCompleteTest() {
    console.log('🧪 Running complete pack creation test suite...');
    
    try {
        // Test 1: Products API
        console.log('\n=== Test 1: Products API ===');
        await testProductsAPI();
        
        // Test 2: Packs API
        console.log('\n=== Test 2: Packs API ===');
        await testPacksAPI();
        
        // Test 3: Pack Creation
        console.log('\n=== Test 3: Pack Creation ===');
        await testPackCreation();
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('\n💥 Test suite failed:', error);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Make sure you are logged in as an admin user');
        console.log('2. Check that all services are running (docker ps)');
        console.log('3. Verify the API endpoints are accessible');
        console.log('4. Check browser network tab for detailed error information');
    }
}

// Auto-run tests when script loads
console.log('🚀 Auto-running API tests...');
runCompleteTest();

// Export functions for manual testing
window.testPackCreation = testPackCreation;
window.testPacksAPI = testPacksAPI;
window.testProductsAPI = testProductsAPI;
window.runCompleteTest = runCompleteTest;

console.log('💡 Manual test functions available:');
console.log('- testPackCreation()');
console.log('- testPacksAPI()');
console.log('- testProductsAPI()');
console.log('- runCompleteTest()');

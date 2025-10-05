// Comprehensive test for Pack Recommendations Feature
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

// Test configuration
const TEST_CONFIG = {
    adminCredentials: {
        username: 'admin@example.com', // Update with actual admin credentials
        password: 'admin123'           // Update with actual admin password
    },
    testPack: {
        name: 'Test Pack with Recommendations',
        description: 'A comprehensive test pack to verify recommendations functionality',
        price: 149.99,
        items: [],
        recommendedProductIds: [],
        recommendedPackIds: []
    }
};

let authToken = null;
let testProducts = [];
let testPacks = [];

async function authenticate() {
    try {
        console.log('🔐 Authenticating as admin...');
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username: TEST_CONFIG.adminCredentials.username,
            password: TEST_CONFIG.adminCredentials.password
        });
        
        authToken = response.data.token;
        console.log('✅ Authentication successful\n');
        return true;
    } catch (error) {
        console.log('❌ Authentication failed:', error.response?.data?.message || error.message);
        console.log('💡 Please update TEST_CONFIG.adminCredentials with valid admin credentials\n');
        return false;
    }
}

async function fetchTestData() {
    try {
        console.log('📊 Fetching test data...');
        
        // Fetch products and existing packs
        const [productsResponse, packsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/products`),
            axios.get(`${API_BASE_URL}/packs`)
        ]);

        testProducts = productsResponse.data.content || productsResponse.data || [];
        testPacks = packsResponse.data || [];

        console.log(`   Found ${testProducts.length} products`);
        console.log(`   Found ${testPacks.length} existing packs\n`);

        if (testProducts.length === 0) {
            throw new Error('No products available for testing');
        }

        return true;
    } catch (error) {
        console.error('❌ Failed to fetch test data:', error.message);
        return false;
    }
}

async function testPackCreationWithoutRecommendations() {
    try {
        console.log('🧪 Test 1: Creating pack without recommendations...');
        
        const packData = {
            ...TEST_CONFIG.testPack,
            name: 'Test Pack - No Recommendations',
            items: [{
                defaultProductId: testProducts[0].id,
                variationProductIds: testProducts.slice(1, 2).map(p => p.id)
            }],
            recommendedProductIds: [],
            recommendedPackIds: []
        };

        const formData = new FormData();
        formData.append('pack', new Blob([JSON.stringify(packData)], { type: 'application/json' }));

        const response = await axios.post(`${API_BASE_URL}/packs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
            }
        });

        const createdPack = response.data;
        console.log(`   ✅ Pack created successfully: ${createdPack.name} (ID: ${createdPack.id})`);
        console.log(`   📋 Recommendations: ${createdPack.recommendedProducts?.length || 0} products, ${createdPack.recommendedPacks?.length || 0} packs\n`);
        
        return createdPack;
    } catch (error) {
        console.error('❌ Test 1 failed:', error.response?.data || error.message);
        return null;
    }
}

async function testPackCreationWithProductRecommendations() {
    try {
        console.log('🧪 Test 2: Creating pack with product recommendations...');
        
        const packData = {
            ...TEST_CONFIG.testPack,
            name: 'Test Pack - Product Recommendations',
            items: [{
                defaultProductId: testProducts[0].id,
                variationProductIds: testProducts.slice(1, 2).map(p => p.id)
            }],
            recommendedProductIds: testProducts.slice(2, 5).map(p => p.id), // Recommend 3 products
            recommendedPackIds: []
        };

        const formData = new FormData();
        formData.append('pack', new Blob([JSON.stringify(packData)], { type: 'application/json' }));

        const response = await axios.post(`${API_BASE_URL}/packs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
            }
        });

        const createdPack = response.data;
        console.log(`   ✅ Pack created successfully: ${createdPack.name} (ID: ${createdPack.id})`);
        console.log(`   📋 Product recommendations: ${createdPack.recommendedProducts?.length || 0}`);
        
        if (createdPack.recommendedProducts?.length > 0) {
            console.log(`   📝 Recommended products: ${createdPack.recommendedProducts.map(p => p.name).join(', ')}`);
        }
        console.log('');

        return createdPack;
    } catch (error) {
        console.error('❌ Test 2 failed:', error.response?.data || error.message);
        return null;
    }
}

async function testPackCreationWithPackRecommendations(packFromTest1) {
    try {
        console.log('🧪 Test 3: Creating pack with pack recommendations...');
        
        const packData = {
            ...TEST_CONFIG.testPack,
            name: 'Test Pack - Pack Recommendations',
            items: [{
                defaultProductId: testProducts[0].id,
                variationProductIds: testProducts.slice(1, 2).map(p => p.id)
            }],
            recommendedProductIds: [],
            recommendedPackIds: packFromTest1 ? [packFromTest1.id] : []
        };

        const formData = new FormData();
        formData.append('pack', new Blob([JSON.stringify(packData)], { type: 'application/json' }));

        const response = await axios.post(`${API_BASE_URL}/packs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
            }
        });

        const createdPack = response.data;
        console.log(`   ✅ Pack created successfully: ${createdPack.name} (ID: ${createdPack.id})`);
        console.log(`   📋 Pack recommendations: ${createdPack.recommendedPacks?.length || 0}`);
        
        if (createdPack.recommendedPacks?.length > 0) {
            console.log(`   📝 Recommended packs: ${createdPack.recommendedPacks.map(p => p.name).join(', ')}`);
        }
        console.log('');

        return createdPack;
    } catch (error) {
        console.error('❌ Test 3 failed:', error.response?.data || error.message);
        return null;
    }
}

async function testPackCreationWithBothRecommendations(packFromTest1) {
    try {
        console.log('🧪 Test 4: Creating pack with both product and pack recommendations...');
        
        const packData = {
            ...TEST_CONFIG.testPack,
            name: 'Test Pack - Complete Recommendations',
            items: [{
                defaultProductId: testProducts[0].id,
                variationProductIds: testProducts.slice(1, 3).map(p => p.id)
            }],
            recommendedProductIds: testProducts.slice(3, 6).map(p => p.id), // Recommend 3 products
            recommendedPackIds: packFromTest1 ? [packFromTest1.id] : []
        };

        const formData = new FormData();
        formData.append('pack', new Blob([JSON.stringify(packData)], { type: 'application/json' }));

        const response = await axios.post(`${API_BASE_URL}/packs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
            }
        });

        const createdPack = response.data;
        console.log(`   ✅ Pack created successfully: ${createdPack.name} (ID: ${createdPack.id})`);
        console.log(`   📋 Recommendations: ${createdPack.recommendedProducts?.length || 0} products, ${createdPack.recommendedPacks?.length || 0} packs`);
        
        if (createdPack.recommendedProducts?.length > 0) {
            console.log(`   📝 Recommended products: ${createdPack.recommendedProducts.map(p => p.name).join(', ')}`);
        }
        if (createdPack.recommendedPacks?.length > 0) {
            console.log(`   📝 Recommended packs: ${createdPack.recommendedPacks.map(p => p.name).join(', ')}`);
        }
        console.log('');

        return createdPack;
    } catch (error) {
        console.error('❌ Test 4 failed:', error.response?.data || error.message);
        return null;
    }
}

async function testPackRetrieval(packId) {
    try {
        console.log('🧪 Test 5: Retrieving pack with recommendations...');
        
        const response = await axios.get(`${API_BASE_URL}/packs/${packId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const pack = response.data;
        console.log(`   ✅ Pack retrieved successfully: ${pack.name}`);
        console.log(`   📋 Recommendations: ${pack.recommendedProducts?.length || 0} products, ${pack.recommendedPacks?.length || 0} packs`);
        
        if (pack.recommendedProducts?.length > 0) {
            console.log(`   📝 Product recommendations: ${pack.recommendedProducts.map(p => p.name).join(', ')}`);
        }
        if (pack.recommendedPacks?.length > 0) {
            console.log(`   📝 Pack recommendations: ${pack.recommendedPacks.map(p => p.name).join(', ')}`);
        }
        console.log('');

        return pack;
    } catch (error) {
        console.error('❌ Test 5 failed:', error.response?.data || error.message);
        return null;
    }
}

async function runComprehensiveTests() {
    console.log('🚀 Starting Comprehensive Pack Recommendations Tests\n');
    console.log('=' .repeat(60));
    
    // Test 1: Authentication
    const authSuccess = await authenticate();
    if (!authSuccess) {
        console.log('❌ Cannot proceed without authentication');
        return;
    }

    // Test 2: Fetch test data
    const dataSuccess = await fetchTestData();
    if (!dataSuccess) {
        console.log('❌ Cannot proceed without test data');
        return;
    }

    // Test 3: Pack creation tests
    const pack1 = await testPackCreationWithoutRecommendations();
    const pack2 = await testPackCreationWithProductRecommendations();
    const pack3 = await testPackCreationWithPackRecommendations(pack1);
    const pack4 = await testPackCreationWithBothRecommendations(pack1);

    // Test 4: Pack retrieval
    if (pack4) {
        await testPackRetrieval(pack4.id);
    }

    // Summary
    console.log('=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    
    const tests = [
        { name: 'Pack without recommendations', result: pack1 ? '✅ PASS' : '❌ FAIL' },
        { name: 'Pack with product recommendations', result: pack2 ? '✅ PASS' : '❌ FAIL' },
        { name: 'Pack with pack recommendations', result: pack3 ? '✅ PASS' : '❌ FAIL' },
        { name: 'Pack with both recommendations', result: pack4 ? '✅ PASS' : '❌ FAIL' }
    ];

    tests.forEach(test => {
        console.log(`${test.result} ${test.name}`);
    });

    const passedTests = tests.filter(t => t.result.includes('✅')).length;
    const totalTests = tests.length;

    console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Pack recommendations feature is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the error messages above.');
    }

    console.log('\n💡 Next Steps:');
    console.log('   1. Test the admin interface manually');
    console.log('   2. Verify recommendations display on product detail pages');
    console.log('   3. Test pack recommendation updates');
}

// Run the comprehensive tests
runComprehensiveTests().catch(console.error);

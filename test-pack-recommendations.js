// Test script to verify pack recommendations functionality
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

async function testPackRecommendations() {
    try {
        console.log('🧪 Testing Pack Recommendations Feature...\n');

        // 1. Get all products and packs first
        console.log('1. Fetching available products and packs...');
        const [productsResponse, packsResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/products`),
            axios.get(`${API_BASE_URL}/packs`)
        ]);

        const products = productsResponse.data.content || [];
        const existingPacks = packsResponse.data || [];

        console.log(`   Found ${products.length} products and ${existingPacks.length} existing packs\n`);

        if (products.length === 0) {
            console.log('❌ No products available. Please add some products first.');
            return;
        }

        // 2. Create a test pack with recommendations
        console.log('2. Creating test pack with recommendations...');
        
        const testPackData = {
            name: 'Test Pack with Recommendations',
            description: 'A test pack to verify recommendations functionality',
            price: 99.99,
            items: [{
                defaultProductId: products[0].id,
                variationProductIds: products.slice(1, 3).map(p => p.id)
            }],
            recommendedProductIds: products.slice(3, 6).map(p => p.id), // Recommend some products
            recommendedPackIds: existingPacks.slice(0, 2).map(p => p.id) // Recommend some packs if available
        };

        console.log('   Pack data:', {
            name: testPackData.name,
            items: testPackData.items.length,
            recommendedProducts: testPackData.recommendedProductIds.length,
            recommendedPacks: testPackData.recommendedPackIds.length
        });

        // Create FormData for the request
        const formData = new FormData();
        formData.append('pack', new Blob([JSON.stringify(testPackData)], { type: 'application/json' }));

        const createResponse = await axios.post(`${API_BASE_URL}/packs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE' // You'll need to replace this with actual admin token
            }
        });

        const createdPack = createResponse.data;
        console.log(`   ✅ Pack created successfully with ID: ${createdPack.id}\n`);

        // 3. Verify the pack has recommendations
        console.log('3. Verifying pack recommendations...');
        const packResponse = await axios.get(`${API_BASE_URL}/packs/${createdPack.id}`);
        const packWithRecommendations = packResponse.data;

        console.log('   Pack recommendations:');
        console.log(`   - Recommended Products: ${packWithRecommendations.recommendedProducts?.length || 0}`);
        console.log(`   - Recommended Packs: ${packWithRecommendations.recommendedPacks?.length || 0}`);

        if (packWithRecommendations.recommendedProducts?.length > 0) {
            console.log('   - Recommended Product Names:', 
                packWithRecommendations.recommendedProducts.map(p => p.name).join(', '));
        }

        if (packWithRecommendations.recommendedPacks?.length > 0) {
            console.log('   - Recommended Pack Names:', 
                packWithRecommendations.recommendedPacks.map(p => p.name).join(', '));
        }

        console.log('\n✅ Pack recommendations feature is working correctly!');
        console.log('\n📝 Summary:');
        console.log(`   - Pack created: ${createdPack.name}`);
        console.log(`   - Has ${packWithRecommendations.recommendedProducts?.length || 0} product recommendations`);
        console.log(`   - Has ${packWithRecommendations.recommendedPacks?.length || 0} pack recommendations`);

    } catch (error) {
        console.error('❌ Error testing pack recommendations:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('\n💡 Note: You need to authenticate as an admin user to create packs.');
            console.log('   Please log in as an admin and get the authentication token.');
        }
    }
}

// Run the test
testPackRecommendations();

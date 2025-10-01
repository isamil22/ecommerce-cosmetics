// Script to add sample frequently bought together data
// This script will add some sample relationships between products

const axios = require('axios');

const API_BASE = 'http://localhost:8082/api';

const addSampleFrequentlyBoughtTogetherData = async () => {
    try {
        console.log('Adding sample frequently bought together data...');
        
        // First, get all products to see what we have
        const productsResponse = await axios.get(`${API_BASE}/products`);
        const products = productsResponse.data.content || productsResponse.data;
        
        console.log(`Found ${products.length} products`);
        
        if (products.length < 3) {
            console.log('Not enough products to create relationships. Need at least 3 products.');
            return;
        }
        
        // Create some sample relationships
        const relationships = [
            // Product 1 with products 2 and 3
            { productId: products[0].id, relatedIds: [products[1].id, products[2].id] },
            // Product 2 with products 1 and 3
            { productId: products[1].id, relatedIds: [products[0].id, products[2].id] },
            // Product 3 with products 1 and 2
            { productId: products[2].id, relatedIds: [products[0].id, products[1].id] }
        ];
        
        // Add more relationships if we have more products
        if (products.length >= 6) {
            relationships.push(
                { productId: products[3].id, relatedIds: [products[4].id, products[5].id] },
                { productId: products[4].id, relatedIds: [products[3].id, products[5].id] },
                { productId: products[5].id, relatedIds: [products[3].id, products[4].id] }
            );
        }
        
        // Update each product with its frequently bought together relationships
        for (const relationship of relationships) {
            try {
                console.log(`Updating product ${relationship.productId} with related products:`, relationship.relatedIds);
                await axios.put(`${API_BASE}/products/${relationship.productId}/frequently-bought-together`, relationship.relatedIds);
                console.log(`✅ Updated product ${relationship.productId}`);
            } catch (error) {
                console.error(`❌ Failed to update product ${relationship.productId}:`, error.message);
            }
        }
        
        console.log('✅ Sample frequently bought together data added successfully!');
        
        // Test the API to verify it works
        console.log('\nTesting the API...');
        for (const product of products.slice(0, 3)) {
            try {
                const fbtResponse = await axios.get(`${API_BASE}/products/${product.id}/frequently-bought-together`);
                console.log(`Product ${product.id} (${product.name}): ${fbtResponse.data.length} related products`);
            } catch (error) {
                console.error(`Failed to test product ${product.id}:`, error.message);
            }
        }
        
    } catch (error) {
        console.error('Error adding sample data:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

// Run the script
addSampleFrequentlyBoughtTogetherData();

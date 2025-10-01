// Test script to check frequently bought together API
import axios from 'axios';

const testFrequentlyBoughtAPI = async () => {
    try {
        console.log('Testing Frequently Bought Together API...');
        
        // Test with a specific product ID (you can change this)
        const productId = 1; // Change this to an existing product ID
        
        const response = await axios.get(`http://localhost:8080/api/products/${productId}/frequently-bought-together`);
        
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', response.data);
        console.log('Number of related products:', response.data.length);
        
        if (response.data.length === 0) {
            console.log('⚠️  No frequently bought together products found for this product.');
            console.log('This means the product has no related products configured in the database.');
        } else {
            console.log('✅ Frequently bought together products found!');
            response.data.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name} - $${product.price}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

// Run the test
testFrequentlyBoughtAPI();
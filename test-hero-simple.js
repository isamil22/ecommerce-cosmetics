// Simple hero update test without authentication
const axios = require('axios');

const API_BASE = 'http://localhost:8082/api';

async function testHeroUpdateSimple() {
    try {
        console.log('🚀 Starting Simple Hero Update Test...\n');
        
        // Step 1: Get current hero data
        console.log('1. Fetching current hero data...');
        const getResponse = await axios.get(`${API_BASE}/hero`);
        console.log('✅ Current hero data:', JSON.stringify(getResponse.data, null, 2));
        
        // Step 2: Update hero data (without authentication)
        console.log('\n2. Updating hero data...');
        const formData = new FormData();
        
        const heroData = {
            title: 'Welcome to Our Beauty Store',
            subtitle: 'Discover amazing cosmetics and beauty products at unbeatable prices',
            linkText: 'Shop Now',
            linkUrl: '/products'
        };
        
        formData.append('hero', JSON.stringify(heroData));
        
        const updateResponse = await axios.put(`${API_BASE}/hero`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('✅ Hero updated successfully!');
        console.log('Updated hero data:', JSON.stringify(updateResponse.data, null, 2));
        
        // Step 3: Verify the update
        console.log('\n3. Verifying the update...');
        const verifyResponse = await axios.get(`${API_BASE}/hero`);
        console.log('✅ Verification successful!');
        console.log('Final hero data:', JSON.stringify(verifyResponse.data, null, 2));
        
        console.log('\n🎉 Hero update test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status === 500) {
            console.log('\n💡 Server error. Check backend logs for details.');
        }
    }
}

// Run the test
testHeroUpdateSimple();

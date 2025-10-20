// Test script for hero update with authentication
const axios = require('axios');

const API_BASE = 'http://localhost:8082/api';

async function testHeroUpdate() {
    try {
        console.log('🚀 Starting Hero Update Test...\n');
        
        // Step 1: Login as admin
        console.log('1. Authenticating as admin...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: 'admin@example.com',
            password: 'adminpassword'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful!');
        
        // Step 2: Get current hero data
        console.log('\n2. Fetching current hero data...');
        const getResponse = await axios.get(`${API_BASE}/hero`);
        console.log('✅ Current hero data:', JSON.stringify(getResponse.data, null, 2));
        
        // Step 3: Update hero data
        console.log('\n3. Updating hero data...');
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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('✅ Hero updated successfully!');
        console.log('Updated hero data:', JSON.stringify(updateResponse.data, null, 2));
        
        // Step 4: Verify the update
        console.log('\n4. Verifying the update...');
        const verifyResponse = await axios.get(`${API_BASE}/hero`);
        console.log('✅ Verification successful!');
        console.log('Final hero data:', JSON.stringify(verifyResponse.data, null, 2));
        
        console.log('\n🎉 Hero update test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.log('\n💡 Authentication failed. Please check admin credentials.');
        } else if (error.response?.status === 403) {
            console.log('\n💡 Authorization failed. Admin user may not have HERO:EDIT permission.');
        }
    }
}

// Run the test
testHeroUpdate();

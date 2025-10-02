// Test script to check admin API endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

async function testAdminAPI() {
    console.log('Testing Admin API endpoints...');
    
    const endpoints = [
        { name: 'Products', url: '/products' },
        { name: 'Orders', url: '/orders' },
        { name: 'Users', url: '/users' },
        { name: 'Categories', url: '/categories' },
        { name: 'Packs', url: '/packs' },
        { name: 'Custom Packs', url: '/custom-packs' },
        { name: 'Pending Reviews', url: '/reviews/pending' },
        { name: 'Notification Settings', url: '/notification-settings' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\nTesting ${endpoint.name}...`);
            const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
                timeout: 5000,
                validateStatus: function (status) {
                    return status < 500; // Accept any status less than 500
                }
            });
            
            console.log(`✅ ${endpoint.name}: ${response.status} - ${response.statusText}`);
            if (response.data) {
                console.log(`   Data type: ${Array.isArray(response.data) ? 'Array' : typeof response.data}`);
                if (Array.isArray(response.data)) {
                    console.log(`   Items count: ${response.data.length}`);
                }
            }
        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error: ${error.response.data || error.response.statusText}`);
            }
        }
    }
}

// Run the test
testAdminAPI().catch(console.error);

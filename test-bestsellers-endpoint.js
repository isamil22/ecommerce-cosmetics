const axios = require('axios');

async function testBestsellersEndpoint() {
    try {
        console.log('Testing /api/products/bestsellers endpoint...');
        
        const response = await axios.get('http://localhost:8080/api/products/bestsellers', {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        console.log('Number of bestsellers:', response.data.length);
        
    } catch (error) {
        console.error('Error testing bestsellers endpoint:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Data:', error.response?.data);
        console.error('Full Error:', error.message);
    }
}

testBestsellersEndpoint();

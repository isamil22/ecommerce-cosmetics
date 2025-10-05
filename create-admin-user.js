// Script to create an admin user for testing
const axios = require('axios');

async function createAdminUser() {
    try {
        const registrationData = {
            fullName: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            recaptchaToken: 'test-token' // This might be bypassed in development
        };

        console.log('Creating admin user...');
        const response = await axios.post('http://localhost:8082/api/auth/register', registrationData);
        console.log('✅ Admin user created successfully:', response.data);
        
        // Now try to login
        const loginData = {
            email: 'admin@example.com',
            password: 'admin123'
        };

        console.log('Logging in as admin...');
        const loginResponse = await axios.post('http://localhost:8082/api/auth/login', loginData);
        console.log('✅ Login successful, token received');
        
        return loginResponse.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        return null;
    }
}

createAdminUser();

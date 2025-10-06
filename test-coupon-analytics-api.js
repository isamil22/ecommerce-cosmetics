// Test script to verify coupon analytics API
const axios = require('axios');

async function testCouponAnalytics() {
    try {
        // Login first
        console.log('🔐 Logging in as admin...');
        const loginResponse = await axios.post('http://localhost:8082/api/auth/login', {
            email: 'admin@example.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful!');
        
        // Test getting all coupons
        console.log('\n📊 Fetching all coupons...');
        const couponsResponse = await axios.get('http://localhost:8082/api/coupons', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Coupons fetched:', couponsResponse.data);
        
        // Test analytics for coupon ID 2
        console.log('\n📈 Testing analytics for coupon ID 2...');
        const analyticsResponse = await axios.get('http://localhost:8082/api/coupons/2/usage-statistics', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Analytics data:', JSON.stringify(analyticsResponse.data, null, 2));
        
        // Test general analytics
        console.log('\n📊 Testing general analytics...');
        const generalAnalyticsResponse = await axios.get('http://localhost:8082/api/coupons/usage-statistics', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ General analytics data:', JSON.stringify(generalAnalyticsResponse.data, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testCouponAnalytics();

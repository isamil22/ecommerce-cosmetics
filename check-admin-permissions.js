// Check admin user permissions
const axios = require('axios');

const API_BASE = 'http://localhost:8082/api';

async function checkAdminPermissions() {
    try {
        console.log('🔍 Checking admin permissions...\n');
        
        // Step 1: Login as admin
        console.log('1. Authenticating as admin...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: 'admin@example.com',
            password: 'adminpassword'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful!');
        
        // Step 2: Check authorities
        console.log('\n2. Checking user authorities...');
        const authResponse = await axios.get(`${API_BASE}/auth/debug/authorities`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Authorities:', JSON.stringify(authResponse.data, null, 2));
        
        // Step 3: Check if admin has HERO permissions
        const authorities = authResponse.data.authorities || [];
        const hasHeroEdit = authorities.some(auth => 
            auth.includes('HERO:EDIT') || 
            auth.includes('HERO:UPDATE') || 
            auth.includes('ROLE_ADMIN') || 
            auth.includes('ROLE_MANAGER')
        );
        
        console.log('\n3. Hero permissions check:');
        console.log(`Has HERO:EDIT permission: ${hasHeroEdit}`);
        
        if (!hasHeroEdit) {
            console.log('\n💡 Admin user needs HERO:EDIT permission. Let me check what permissions are available...');
            
            // Check available permissions
            const permissionsResponse = await axios.get(`${API_BASE}/permissions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('\nAvailable permissions:');
            permissionsResponse.data.forEach(permission => {
                if (permission.name.includes('HERO')) {
                    console.log(`- ${permission.name}: ${permission.description}`);
                }
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run the check
checkAdminPermissions();

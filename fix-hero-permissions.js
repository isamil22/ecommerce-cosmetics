// Fix hero permissions for admin user
const axios = require('axios');

const API_BASE = 'http://localhost:8082/api';

async function fixHeroPermissions() {
    try {
        console.log('🔧 Fixing hero permissions for admin user...\n');
        
        // Step 1: Login as admin
        console.log('1. Authenticating as admin...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: 'admin@example.com',
            password: 'adminpassword'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful!');
        
        // Step 2: Check if admin user has ROLE_ADMIN
        console.log('\n2. Checking admin user roles...');
        const userResponse = await axios.get(`${API_BASE}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const adminUser = userResponse.data.find(user => user.email === 'admin@example.com');
        if (!adminUser) {
            console.log('❌ Admin user not found!');
            return;
        }
        
        console.log('✅ Admin user found:', adminUser.fullName);
        console.log('Current roles:', adminUser.roles?.map(r => r.name) || 'None');
        
        // Step 3: Check if ROLE_ADMIN exists
        console.log('\n3. Checking available roles...');
        const rolesResponse = await axios.get(`${API_BASE}/roles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const adminRole = rolesResponse.data.find(role => role.name === 'ROLE_ADMIN');
        if (!adminRole) {
            console.log('❌ ROLE_ADMIN not found!');
            return;
        }
        
        console.log('✅ ROLE_ADMIN found:', adminRole.name);
        
        // Step 4: Check if admin user has ROLE_ADMIN
        const hasAdminRole = adminUser.roles?.some(role => role.name === 'ROLE_ADMIN');
        if (!hasAdminRole) {
            console.log('\n4. Assigning ROLE_ADMIN to admin user...');
            
            const assignResponse = await axios.post(`${API_BASE}/users/${adminUser.id}/roles`, {
                roleIds: [adminRole.id]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('✅ ROLE_ADMIN assigned to admin user!');
        } else {
            console.log('\n4. Admin user already has ROLE_ADMIN role.');
        }
        
        // Step 5: Test hero update
        console.log('\n5. Testing hero update...');
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
        
        console.log('\n🎉 Hero permissions fixed and tested successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('\n💡 Authentication failed. Please check admin credentials.');
        } else if (error.response?.status === 403) {
            console.log('\n💡 Authorization failed. Admin user may not have required permissions.');
        }
    }
}

// Run the fix
fixHeroPermissions();

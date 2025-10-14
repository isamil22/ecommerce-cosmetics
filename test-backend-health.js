// test-backend-health.js
// Quick health check to verify backend is responding

const http = require('http');

async function testBackendHealth() {
    console.log('🏥 Backend Health Check\n');
    console.log('Testing backend connection on port 8082...\n');
    
    // Test backend health
    const options = {
        hostname: 'localhost',
        port: 8082,
        path: '/api/products',
        method: 'GET',
        timeout: 5000
    };
    
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`✅ Backend is responding!`);
            console.log(`   Status Code: ${res.statusCode}`);
            console.log(`   Backend URL: http://localhost:8082`);
            console.log(`   Swagger UI: http://localhost:8082/swagger-ui/index.html`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`\n✅ Backend is healthy and ready!`);
                console.log(`\n🎯 Next Steps:`);
                console.log(`   1. Continue with Step 6: Create REST Controllers`);
                console.log(`   2. Or open Swagger UI to explore existing APIs`);
                console.log(`   3. Or verify in phpMyAdmin: http://localhost:8083`);
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ Backend is not responding`);
            console.log(`   Error: ${error.message}`);
            console.log(`\n💡 Try:`);
            console.log(`   docker-compose restart backend`);
            reject(error);
        });
        
        req.on('timeout', () => {
            console.log(`❌ Backend request timed out`);
            req.destroy();
            reject(new Error('Timeout'));
        });
        
        req.end();
    });
}

testBackendHealth()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));


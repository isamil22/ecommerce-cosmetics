// Comprehensive test script for admin dashboard
const puppeteer = require('puppeteer');

async function testAdminDashboard() {
    console.log('🚀 Starting comprehensive admin dashboard test...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    try {
        const page = await browser.newPage();
        
        // Enable console logging
        page.on('console', msg => {
            console.log('CONSOLE:', msg.text());
        });
        
        // Enable network request logging
        page.on('request', request => {
            console.log('REQUEST:', request.method(), request.url());
        });
        
        // Enable response logging
        page.on('response', response => {
            if (!response.ok()) {
                console.log('ERROR RESPONSE:', response.status(), response.url());
            }
        });
        
        console.log('📱 Navigating to admin dashboard...');
        await page.goto('http://localhost:3000/admin', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // Wait for the page to load
        await page.waitForTimeout(3000);
        
        console.log('🔍 Checking for admin dashboard elements...');
        
        // Check if admin dashboard loads without errors
        const adminTitle = await page.$('h1, h2, h3');
        if (adminTitle) {
            const titleText = await page.evaluate(el => el.textContent, adminTitle);
            console.log('✅ Admin dashboard loaded with title:', titleText);
        } else {
            console.log('❌ No admin title found');
        }
        
        // Check for error messages
        const errorElements = await page.$$('.error, .alert-danger, [class*="error"]');
        if (errorElements.length > 0) {
            console.log('❌ Found error elements on page');
            for (let i = 0; i < errorElements.length; i++) {
                const errorText = await page.evaluate(el => el.textContent, errorElements[i]);
                console.log('   Error:', errorText);
            }
        } else {
            console.log('✅ No error elements found');
        }
        
        // Check for loading states
        const loadingElements = await page.$$('[class*="loading"], [class*="spinner"]');
        if (loadingElements.length > 0) {
            console.log('⏳ Found loading elements - waiting for them to complete...');
            await page.waitForTimeout(5000);
        }
        
        // Check for data cards/stats
        const statCards = await page.$$('.card, .stat-card, [class*="card"]');
        console.log(`📊 Found ${statCards.length} stat cards`);
        
        // Check for navigation menu
        const navItems = await page.$$('nav a, .nav a, [role="navigation"] a');
        console.log(`🧭 Found ${navItems.length} navigation items`);
        
        // Take a screenshot
        console.log('📸 Taking screenshot...');
        await page.screenshot({ 
            path: 'admin-dashboard-test.png',
            fullPage: true 
        });
        
        console.log('✅ Admin dashboard test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ 
            path: 'admin-dashboard-error.png',
            fullPage: true 
        });
    } finally {
        await browser.close();
    }
}

// Run the test
testAdminDashboard().catch(console.error);

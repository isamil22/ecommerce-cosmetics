// Test script to check admin dashboard functionality
const puppeteer = require('puppeteer');

async function testAdminDashboard() {
    console.log('Starting admin dashboard test...');
    
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
        
        // Navigate to admin dashboard
        console.log('Navigating to admin dashboard...');
        await page.goto('http://localhost:3000/admin/dashboard', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // Wait for page to load
        await page.waitForTimeout(5000);
        
        // Check for error messages
        const errorElements = await page.$$('[class*="error"], [class*="Error"]');
        if (errorElements.length > 0) {
            console.log('Found error elements:', errorElements.length);
            for (let i = 0; i < errorElements.length; i++) {
                const text = await errorElements[i].evaluate(el => el.textContent);
                console.log('Error text:', text);
            }
        }
        
        // Check if dashboard loaded properly
        const dashboardTitle = await page.$('h1');
        if (dashboardTitle) {
            const titleText = await dashboardTitle.evaluate(el => el.textContent);
            console.log('Dashboard title:', titleText);
        }
        
        // Check for loading states
        const loadingElements = await page.$$('[class*="loading"], [class*="Loading"], [class*="spinner"]');
        if (loadingElements.length > 0) {
            console.log('Found loading elements:', loadingElements.length);
        }
        
        // Take screenshot
        await page.screenshot({ path: 'admin-dashboard-test.png', fullPage: true });
        console.log('Screenshot saved as admin-dashboard-test.png');
        
        // Check for JavaScript errors
        const jsErrors = await page.evaluate(() => {
            return window.errors || [];
        });
        
        if (jsErrors.length > 0) {
            console.log('JavaScript errors found:', jsErrors);
        }
        
        console.log('Test completed successfully');
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the test
testAdminDashboard().catch(console.error);

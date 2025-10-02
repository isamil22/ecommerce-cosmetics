#!/usr/bin/env node

/**
 * Frontend Visitor Counter Testing Script
 * Tests the visitor counter system through browser automation
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class VisitorCounterTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = [];
        this.baseUrl = 'http://localhost:8081';
        this.adminCredentials = {
            email: 'admin@example.com', // Update with actual admin credentials
            password: 'admin123' // Update with actual admin password
        };
    }

    async init() {
        console.log('🚀 Starting Frontend Visitor Counter Tests...');
        this.browser = await puppeteer.launch({ 
            headless: false, // Set to true for headless mode
            defaultViewport: { width: 1280, height: 720 }
        });
        this.page = await this.browser.newPage();
        
        // Set longer timeout
        this.page.setDefaultTimeout(10000);
        
        // Listen for console messages
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('🔴 Browser Error:', msg.text());
            }
        });
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    logTest(testName, status, message, screenshot = null) {
        const result = {
            test: testName,
            status: status,
            message: message,
            screenshot: screenshot,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        
        const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${statusIcon} ${testName}: ${message}`);
    }

    async takeScreenshot(name) {
        try {
            const screenshot = await this.page.screenshot({ 
                path: `screenshots/${name}-${Date.now()}.png`,
                fullPage: true 
            });
            return screenshot;
        } catch (error) {
            console.log('⚠️ Screenshot failed:', error.message);
            return null;
        }
    }

    async testFrontendAccess() {
        console.log('\n🌐 Testing Frontend Access...');
        
        try {
            await this.page.goto(this.baseUrl);
            await this.page.waitForSelector('body', { timeout: 10000 });
            
            const title = await this.page.title();
            this.logTest('Frontend Access', 'PASS', `Frontend loaded successfully. Title: ${title}`);
            
            await this.takeScreenshot('frontend-loaded');
            return true;
        } catch (error) {
            this.logTest('Frontend Access', 'FAIL', `Failed to load frontend: ${error.message}`);
            return false;
        }
    }

    async testAdminLogin() {
        console.log('\n🔐 Testing Admin Login...');
        
        try {
            // Navigate to admin login
            await this.page.goto(`${this.baseUrl}/auth`);
            await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
            
            // Fill login form
            await this.page.type('input[type="email"]', this.adminCredentials.email);
            await this.page.type('input[type="password"]', this.adminCredentials.password);
            
            // Submit form
            await this.page.click('button[type="submit"]');
            
            // Wait for redirect or success
            await this.page.waitForNavigation({ timeout: 10000 });
            
            // Check if we're on admin dashboard or redirected
            const currentUrl = this.page.url();
            if (currentUrl.includes('/admin') || currentUrl.includes('/dashboard')) {
                this.logTest('Admin Login', 'PASS', 'Successfully logged in as admin');
                await this.takeScreenshot('admin-logged-in');
                return true;
            } else {
                this.logTest('Admin Login', 'FAIL', `Login failed. Current URL: ${currentUrl}`);
                return false;
            }
        } catch (error) {
            this.logTest('Admin Login', 'FAIL', `Login error: ${error.message}`);
            await this.takeScreenshot('login-error');
            return false;
        }
    }

    async testVisitorCounterSettingsPage() {
        console.log('\n⚙️ Testing Visitor Counter Settings Page...');
        
        try {
            // Navigate to visitor counter settings
            await this.page.goto(`${this.baseUrl}/admin/vistorcountsetting`);
            await this.page.waitForSelector('h1', { timeout: 10000 });
            
            // Check page title
            const pageTitle = await this.page.$eval('h1', el => el.textContent);
            if (pageTitle.includes('Manage Visitor Counter')) {
                this.logTest('Settings Page Title', 'PASS', 'Page title is correct');
            } else {
                this.logTest('Settings Page Title', 'FAIL', `Incorrect title: ${pageTitle}`);
            }
            
            // Check for toggle switch
            const toggleSwitch = await this.page.$('input[type="checkbox"]');
            if (toggleSwitch) {
                this.logTest('Toggle Switch', 'PASS', 'Toggle switch is present');
            } else {
                this.logTest('Toggle Switch', 'FAIL', 'Toggle switch not found');
            }
            
            // Check for input fields
            const minInput = await this.page.$('input[name="min"]');
            const maxInput = await this.page.$('input[name="max"]');
            
            if (minInput && maxInput) {
                this.logTest('Input Fields', 'PASS', 'Min/Max input fields are present');
            } else {
                this.logTest('Input Fields', 'FAIL', 'Min/Max input fields not found');
            }
            
            // Check for save button
            const saveButton = await this.page.$('button[type="submit"]');
            if (saveButton) {
                this.logTest('Save Button', 'PASS', 'Save button is present');
            } else {
                this.logTest('Save Button', 'FAIL', 'Save button not found');
            }
            
            await this.takeScreenshot('settings-page');
            return true;
            
        } catch (error) {
            this.logTest('Settings Page Access', 'FAIL', `Failed to access settings page: ${error.message}`);
            await this.takeScreenshot('settings-page-error');
            return false;
        }
    }

    async testToggleFunctionality() {
        console.log('\n🔄 Testing Toggle Functionality...');
        
        try {
            // Get initial state
            const initialToggleState = await this.page.$eval('input[name="enabled"]', el => el.checked);
            
            // Click toggle
            await this.page.click('input[name="enabled"]');
            await this.page.waitForTimeout(1000); // Wait for animation
            
            const newToggleState = await this.page.$eval('input[name="enabled"]', el => el.checked);
            
            if (newToggleState !== initialToggleState) {
                this.logTest('Toggle Switch', 'PASS', 'Toggle switch changes state correctly');
            } else {
                this.logTest('Toggle Switch', 'FAIL', 'Toggle switch did not change state');
            }
            
            // Check if input fields appear/disappear
            const minInput = await this.page.$('input[name="min"]');
            const maxInput = await this.page.$('input[name="max"]');
            
            if (newToggleState && minInput && maxInput) {
                this.logTest('Input Fields Visibility', 'PASS', 'Input fields appear when enabled');
            } else if (!newToggleState && (!minInput || !maxInput)) {
                this.logTest('Input Fields Visibility', 'PASS', 'Input fields hide when disabled');
            } else {
                this.logTest('Input Fields Visibility', 'FAIL', 'Input fields visibility not working correctly');
            }
            
            await this.takeScreenshot('toggle-tested');
            
        } catch (error) {
            this.logTest('Toggle Functionality', 'FAIL', `Toggle test error: ${error.message}`);
        }
    }

    async testInputValidation() {
        console.log('\n✅ Testing Input Validation...');
        
        try {
            // Enable toggle first
            await this.page.click('input[name="enabled"]');
            await this.page.waitForTimeout(500);
            
            // Test minimum input
            await this.page.click('input[name="min"]');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.type('input[name="min"]', '-5');
            
            // Try to save
            await this.page.click('button[type="submit"]');
            await this.page.waitForTimeout(2000);
            
            // Check for error message or validation
            const errorMessage = await this.page.$('.error, .alert-danger, [role="alert"]');
            if (errorMessage) {
                this.logTest('Input Validation', 'PASS', 'Validation prevents negative values');
            } else {
                this.logTest('Input Validation', 'WARN', 'Validation may not be working for negative values');
            }
            
            // Reset to valid values
            await this.page.click('input[name="min"]');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.type('input[name="min"]', '10');
            
            await this.page.click('input[name="max"]');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.type('input[name="max"]', '50');
            
            await this.takeScreenshot('validation-tested');
            
        } catch (error) {
            this.logTest('Input Validation', 'FAIL', `Validation test error: ${error.message}`);
        }
    }

    async testSaveFunctionality() {
        console.log('\n💾 Testing Save Functionality...');
        
        try {
            // Set valid values
            await this.page.click('input[name="min"]');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.type('input[name="min"]', '15');
            
            await this.page.click('input[name="max"]');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.type('input[name="max"]', '45');
            
            // Click save
            await this.page.click('button[type="submit"]');
            
            // Wait for response
            await this.page.waitForTimeout(3000);
            
            // Check for success message
            const successMessage = await this.page.$('.toast-success, .alert-success, .success');
            if (successMessage) {
                const messageText = await successMessage.evaluate(el => el.textContent);
                this.logTest('Save Functionality', 'PASS', `Save successful: ${messageText}`);
            } else {
                this.logTest('Save Functionality', 'WARN', 'Save completed but no success message found');
            }
            
            await this.takeScreenshot('save-completed');
            
        } catch (error) {
            this.logTest('Save Functionality', 'FAIL', `Save test error: ${error.message}`);
        }
    }

    async testProductPageCounter() {
        console.log('\n👥 Testing Product Page Counter...');
        
        try {
            // Navigate to products page
            await this.page.goto(`${this.baseUrl}/products`);
            await this.page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
            
            // Click on first product
            const productLinks = await this.page.$$('a[href*="/products/"]');
            if (productLinks.length > 0) {
                await productLinks[0].click();
                await this.page.waitForNavigation();
                
                // Look for visitor counter
                const counterElement = await this.page.$('[class*="visitor"], [class*="viewing"], [class*="counter"]');
                if (counterElement) {
                    const counterText = await counterElement.evaluate(el => el.textContent);
                    this.logTest('Product Page Counter', 'PASS', `Counter found: ${counterText}`);
                } else {
                    this.logTest('Product Page Counter', 'FAIL', 'Visitor counter not found on product page');
                }
                
                await this.takeScreenshot('product-page-counter');
            } else {
                this.logTest('Product Page Counter', 'FAIL', 'No product links found');
            }
            
        } catch (error) {
            this.logTest('Product Page Counter', 'FAIL', `Product page test error: ${error.message}`);
        }
    }

    async testDashboardIntegration() {
        console.log('\n📊 Testing Dashboard Integration...');
        
        try {
            // Navigate to admin dashboard
            await this.page.goto(`${this.baseUrl}/admin/dashboard`);
            await this.page.waitForSelector('h1', { timeout: 10000 });
            
            // Look for visitor counter status card
            const statusCard = await this.page.$('[class*="visitor"], [class*="counter"]');
            if (statusCard) {
                this.logTest('Dashboard Integration', 'PASS', 'Visitor counter status card found on dashboard');
            } else {
                this.logTest('Dashboard Integration', 'FAIL', 'Visitor counter status card not found on dashboard');
            }
            
            await this.takeScreenshot('dashboard-integration');
            
        } catch (error) {
            this.logTest('Dashboard Integration', 'FAIL', `Dashboard test error: ${error.message}`);
        }
    }

    generateReport() {
        console.log('\n📊 FRONTEND TEST REPORT');
        console.log('=' .repeat(50));
        
        const passCount = this.testResults.filter(r => r.status === 'PASS').length;
        const failCount = this.testResults.filter(r => r.status === 'FAIL').length;
        const warnCount = this.testResults.filter(r => r.status === 'WARN').length;
        
        console.log(`✅ PASSED: ${passCount}`);
        console.log(`❌ FAILED: ${failCount}`);
        console.log(`⚠️  WARNINGS: ${warnCount}`);
        console.log(`📊 TOTAL TESTS: ${this.testResults.length}`);
        
        const successRate = ((passCount / this.testResults.length) * 100).toFixed(1);
        console.log(`🎯 SUCCESS RATE: ${successRate}%`);
        
        // Save detailed report
        const reportData = {
            summary: {
                total: this.testResults.length,
                passed: passCount,
                failed: failCount,
                warnings: warnCount,
                successRate: successRate
            },
            tests: this.testResults,
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('frontend-test-report.json', JSON.stringify(reportData, null, 2));
        console.log('\n📄 Detailed report saved to: frontend-test-report.json');
        
        // Show failed tests
        const failedTests = this.testResults.filter(r => r.status === 'FAIL');
        if (failedTests.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            failedTests.forEach(test => {
                console.log(`   - ${test.test}: ${test.message}`);
            });
        }
    }

    async runAllTests() {
        try {
            await this.init();
            
            // Create screenshots directory
            if (!fs.existsSync('screenshots')) {
                fs.mkdirSync('screenshots');
            }
            
            console.log('🧪 Running Frontend Visitor Counter Tests...\n');
            
            // Run all tests
            await this.testFrontendAccess();
            await this.testAdminLogin();
            await this.testVisitorCounterSettingsPage();
            await this.testToggleFunctionality();
            await this.testInputValidation();
            await this.testSaveFunctionality();
            await this.testProductPageCounter();
            await this.testDashboardIntegration();
            
            this.generateReport();
            
        } catch (error) {
            console.error('\n💥 Test suite crashed:', error.message);
            this.logTest('Test Suite', 'FAIL', `Test suite crashed: ${error.message}`);
        } finally {
            await this.cleanup();
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new VisitorCounterTester();
    tester.runAllTests().catch(console.error);
}

module.exports = { VisitorCounterTester };

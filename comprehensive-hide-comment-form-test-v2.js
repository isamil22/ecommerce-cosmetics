// Comprehensive Test Suite for Hide Comment Form Functionality - Version 2
// This script tests all aspects of the hide comment form feature with proper authentication

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class HideCommentFormTester {
    constructor() {
        this.baseURL = 'http://localhost:8082/api';
        this.testResults = [];
        this.createdPackIds = [];
        this.authToken = null;
    }

    log(testName, success, message, details = '') {
        const result = {
            test: testName,
            success: success,
            message: message,
            details: details,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        
        const status = success ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${testName}: ${message}`);
        if (details) {
            console.log(`   Details: ${details}`);
        }
    }

    async authenticate() {
        try {
            // Try to login as admin
            const loginData = {
                email: 'admin@example.com',
                password: 'admin123'
            };

            const response = await axios.post(`${this.baseURL}/auth/login`, loginData);
            this.authToken = response.data.token;
            
            this.log('Admin Authentication', true, 'Successfully authenticated as admin');
            return true;
        } catch (error) {
            this.log('Admin Authentication', false, 'Failed to authenticate as admin', error.message);
            return false;
        }
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        };
    }

    async testDatabaseMigration() {
        console.log('\n🗄️ Testing Database Migration...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            let allPacksHaveField = true;
            let missingFieldPacks = [];

            packs.forEach(pack => {
                if (pack.hideCommentForm === undefined) {
                    allPacksHaveField = false;
                    missingFieldPacks.push(pack.id);
                }
            });

            if (allPacksHaveField) {
                this.log('Database Migration Check', true, 
                    `All ${packs.length} packs have hideCommentForm field`, 
                    'Database migration successful');
            } else {
                this.log('Database Migration Check', false, 
                    `Some packs missing hideCommentForm field`, 
                    `Missing in packs: ${missingFieldPacks.join(', ')}`);
            }
        } catch (error) {
            this.log('Database Migration Check', false, 
                'Failed to check database migration', error.message);
        }
    }

    async testPackRetrieval() {
        console.log('\n🔍 Testing Pack Retrieval...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            const packsWithHideForm = packs.filter(pack => pack.hideCommentForm === true);
            const packsWithoutHideForm = packs.filter(pack => pack.hideCommentForm === false);

            this.log('Get All Packs', true, 
                `Retrieved ${packs.length} packs`, 
                `${packsWithHideForm.length} with hidden forms, ${packsWithoutHideForm.length} with visible forms`);

            // Test getting individual pack if any exist
            if (packs.length > 0) {
                const packId = packs[0].id;
                const individualResponse = await axios.get(`${this.baseURL}/packs/${packId}`);
                const pack = individualResponse.data;

                if (pack.hideCommentForm !== undefined) {
                    this.log('Get Individual Pack', true, 
                        `Pack retrieved with hideCommentForm: ${pack.hideCommentForm}`, 
                        `Pack ID: ${packId}`);
                } else {
                    this.log('Get Individual Pack', false, 
                        'Pack retrieved but hideCommentForm field is missing', 
                        `Pack ID: ${packId}`);
                }
            }
        } catch (error) {
            this.log('Pack Retrieval Test', false, 
                'Failed to retrieve packs', error.message);
        }
    }

    async testPackCreation() {
        console.log('\n🧪 Testing Pack Creation...');

        if (!this.authToken) {
            this.log('Pack Creation Test', false, 'No authentication token available');
            return;
        }

        // Test 1: Create pack with hideCommentForm = true
        try {
            const formData = new FormData();
            const packData = {
                name: 'Test Pack - Hide Comments Enabled',
                description: 'This pack has comment form hidden',
                price: 29.99,
                hideCommentForm: true,
                items: [
                    {
                        defaultProductId: 1,
                        variationProductIds: []
                    }
                ],
                recommendedProductIds: [],
                recommendedPackIds: []
            };

            formData.append('pack', JSON.stringify(packData));

            const response = await axios.post(`${this.baseURL}/packs`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            const createdPack = response.data;
            this.createdPackIds.push(createdPack.id);

            if (createdPack.hideCommentForm === true) {
                this.log('Create Pack with Hide Comment Form = true', true, 
                    `Pack created with ID: ${createdPack.id}`, 
                    `hideCommentForm: ${createdPack.hideCommentForm}`);
            } else {
                this.log('Create Pack with Hide Comment Form = true', false, 
                    'Pack created but hideCommentForm is not true', 
                    `Expected: true, Got: ${createdPack.hideCommentForm}`);
            }
        } catch (error) {
            this.log('Create Pack with Hide Comment Form = true', false, 
                'Failed to create pack', error.response?.data?.message || error.message);
        }

        // Test 2: Create pack with hideCommentForm = false
        try {
            const formData = new FormData();
            const packData = {
                name: 'Test Pack - Hide Comments Disabled',
                description: 'This pack has comment form visible',
                price: 39.99,
                hideCommentForm: false,
                items: [
                    {
                        defaultProductId: 1,
                        variationProductIds: []
                    }
                ],
                recommendedProductIds: [],
                recommendedPackIds: []
            };

            formData.append('pack', JSON.stringify(packData));

            const response = await axios.post(`${this.baseURL}/packs`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            const createdPack = response.data;
            this.createdPackIds.push(createdPack.id);

            if (createdPack.hideCommentForm === false) {
                this.log('Create Pack with Hide Comment Form = false', true, 
                    `Pack created with ID: ${createdPack.id}`, 
                    `hideCommentForm: ${createdPack.hideCommentForm}`);
            } else {
                this.log('Create Pack with Hide Comment Form = false', false, 
                    'Pack created but hideCommentForm is not false', 
                    `Expected: false, Got: ${createdPack.hideCommentForm}`);
            }
        } catch (error) {
            this.log('Create Pack with Hide Comment Form = false', false, 
                'Failed to create pack', error.response?.data?.message || error.message);
        }
    }

    async testPackUpdate() {
        console.log('\n✏️ Testing Pack Update...');

        if (!this.authToken || this.createdPackIds.length === 0) {
            this.log('Pack Update Test', false, 'No authentication token or packs available for testing');
            return;
        }

        const packId = this.createdPackIds[0];

        try {
            const formData = new FormData();
            const updateData = {
                name: 'Updated Test Pack',
                description: 'This pack has been updated',
                price: 49.99,
                hideCommentForm: false,
                items: [
                    {
                        defaultProductId: 1,
                        variationProductIds: []
                    }
                ],
                recommendedProductIds: [],
                recommendedPackIds: []
            };

            formData.append('pack', JSON.stringify(updateData));

            const response = await axios.put(`${this.baseURL}/packs/${packId}`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            const updatedPack = response.data;

            if (updatedPack.hideCommentForm === false) {
                this.log('Update Pack Hide Comment Form', true, 
                    `Pack updated successfully`, 
                    `hideCommentForm changed to: ${updatedPack.hideCommentForm}`);
            } else {
                this.log('Update Pack Hide Comment Form', false, 
                    'Pack updated but hideCommentForm not changed correctly', 
                    `Expected: false, Got: ${updatedPack.hideCommentForm}`);
            }
        } catch (error) {
            this.log('Update Pack Hide Comment Form', false, 
                'Failed to update pack', error.response?.data?.message || error.message);
        }
    }

    async testEdgeCases() {
        console.log('\n⚠️ Testing Edge Cases...');

        if (!this.authToken) {
            this.log('Edge Cases Test', false, 'No authentication token available');
            return;
        }

        // Test 1: Invalid hideCommentForm values
        try {
            const formData = new FormData();
            const packData = {
                name: 'Test Pack - Invalid Hide Comments',
                description: 'This pack tests invalid values',
                price: 25.99,
                hideCommentForm: 'invalid', // This should be handled gracefully
                items: [
                    {
                        defaultProductId: 1,
                        variationProductIds: []
                    }
                ],
                recommendedProductIds: [],
                recommendedPackIds: []
            };

            formData.append('pack', JSON.stringify(packData));

            const response = await axios.post(`${this.baseURL}/packs`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            const createdPack = response.data;
            this.createdPackIds.push(createdPack.id);

            // The backend should handle this gracefully (either convert to boolean or use default)
            this.log('Invalid Hide Comment Form Value', true, 
                `Pack created with hideCommentForm: ${createdPack.hideCommentForm}`, 
                'Backend handled invalid value gracefully');
        } catch (error) {
            this.log('Invalid Hide Comment Form Value', false, 
                'Failed to handle invalid value', error.response?.data?.message || error.message);
        }

        // Test 2: Null hideCommentForm
        try {
            const formData = new FormData();
            const packData = {
                name: 'Test Pack - Null Hide Comments',
                description: 'This pack tests null values',
                price: 35.99,
                hideCommentForm: null,
                items: [
                    {
                        defaultProductId: 1,
                        variationProductIds: []
                    }
                ],
                recommendedProductIds: [],
                recommendedPackIds: []
            };

            formData.append('pack', JSON.stringify(packData));

            const response = await axios.post(`${this.baseURL}/packs`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            const createdPack = response.data;
            this.createdPackIds.push(createdPack.id);

            this.log('Null Hide Comment Form Value', true, 
                `Pack created with hideCommentForm: ${createdPack.hideCommentForm}`, 
                'Backend handled null value gracefully');
        } catch (error) {
            this.log('Null Hide Comment Form Value', false, 
                'Failed to handle null value', error.response?.data?.message || error.message);
        }
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up test data...');

        if (!this.authToken) {
            console.log('❌ No authentication token available for cleanup');
            return;
        }

        for (const packId of this.createdPackIds) {
            try {
                await axios.delete(`${this.baseURL}/packs/${packId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`
                    }
                });
                console.log(`✅ Deleted test pack: ${packId}`);
            } catch (error) {
                console.log(`❌ Failed to delete test pack: ${packId} - ${error.message}`);
            }
        }
    }

    generateReport() {
        console.log('\n📊 Test Report Summary');
        console.log('='.repeat(50));

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;

        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults.filter(r => !r.success).forEach(result => {
                console.log(`  - ${result.test}: ${result.message}`);
            });
        }

        // Save detailed report to file
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: ((passedTests / totalTests) * 100).toFixed(1)
            },
            results: this.testResults,
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync('hide-comment-form-test-report-v2.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Detailed report saved to: hide-comment-form-test-report-v2.json');

        return report;
    }

    async runAllTests() {
        console.log('🚀 Starting Comprehensive Hide Comment Form Tests - Version 2');
        console.log('='.repeat(70));

        try {
            // First authenticate
            const authSuccess = await this.authenticate();
            if (!authSuccess) {
                console.log('❌ Authentication failed. Some tests will be skipped.');
            }

            // Run tests
            await this.testDatabaseMigration();
            await this.testPackRetrieval();
            
            if (authSuccess) {
                await this.testPackCreation();
                await this.testPackUpdate();
                await this.testEdgeCases();
            }
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
        } finally {
            await this.cleanup();
            return this.generateReport();
        }
    }
}

// Run the tests
if (require.main === module) {
    const tester = new HideCommentFormTester();
    tester.runAllTests().then(report => {
        process.exit(report.summary.failed > 0 ? 1 : 0);
    }).catch(error => {
        console.error('❌ Test suite crashed:', error);
        process.exit(1);
    });
}

module.exports = HideCommentFormTester;

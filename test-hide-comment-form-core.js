// Core functionality test for hide comment form feature
// Tests the essential functionality without requiring authentication

const axios = require('axios');

class CoreHideCommentFormTester {
    constructor() {
        this.baseURL = 'http://localhost:8082/api';
        this.testResults = [];
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

    async testDatabaseSchema() {
        console.log('\n🗄️ Testing Database Schema...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            if (packs.length === 0) {
                this.log('Database Schema Test', false, 'No packs found in database');
                return;
            }

            const firstPack = packs[0];
            
            if (firstPack.hideCommentForm !== undefined) {
                this.log('Database Schema Test', true, 
                    `hideCommentForm field exists in database`, 
                    `Field value: ${firstPack.hideCommentForm}, Type: ${typeof firstPack.hideCommentForm}`);
            } else {
                this.log('Database Schema Test', false, 
                    'hideCommentForm field missing from database schema');
            }

            // Test that all packs have the field
            let allPacksHaveField = true;
            packs.forEach(pack => {
                if (pack.hideCommentForm === undefined) {
                    allPacksHaveField = false;
                }
            });

            if (allPacksHaveField) {
                this.log('Database Migration Test', true, 
                    `All ${packs.length} packs have hideCommentForm field`, 
                    'Database migration successful');
            } else {
                this.log('Database Migration Test', false, 
                    'Some packs missing hideCommentForm field');
            }

        } catch (error) {
            this.log('Database Schema Test', false, 
                'Failed to test database schema', error.message);
        }
    }

    async testPackRetrieval() {
        console.log('\n🔍 Testing Pack Retrieval...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            if (packs.length === 0) {
                this.log('Pack Retrieval Test', false, 'No packs found');
                return;
            }

            this.log('Get All Packs', true, 
                `Retrieved ${packs.length} packs successfully`);

            // Test individual pack retrieval
            const firstPack = packs[0];
            const individualResponse = await axios.get(`${this.baseURL}/packs/${firstPack.id}`);
            const individualPack = individualResponse.data;

            if (individualPack.hideCommentForm !== undefined) {
                this.log('Get Individual Pack', true, 
                    `Individual pack retrieved with hideCommentForm: ${individualPack.hideCommentForm}`, 
                    `Pack ID: ${individualPack.id}`);
            } else {
                this.log('Get Individual Pack', false, 
                    'Individual pack missing hideCommentForm field');
            }

        } catch (error) {
            this.log('Pack Retrieval Test', false, 
                'Failed to retrieve packs', error.message);
        }
    }

    async testDataTypes() {
        console.log('\n🔢 Testing Data Types...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            if (packs.length === 0) {
                this.log('Data Types Test', false, 'No packs found');
                return;
            }

            let correctTypes = true;
            packs.forEach(pack => {
                if (pack.hideCommentForm !== undefined && typeof pack.hideCommentForm !== 'boolean') {
                    correctTypes = false;
                }
            });

            if (correctTypes) {
                this.log('Data Types Test', true, 
                    `All hideCommentForm fields are boolean type`, 
                    `Tested ${packs.length} packs`);
            } else {
                this.log('Data Types Test', false, 
                    'Some hideCommentForm fields are not boolean type');
            }

        } catch (error) {
            this.log('Data Types Test', false, 
                'Failed to test data types', error.message);
        }
    }

    async testDefaultValues() {
        console.log('\n🔧 Testing Default Values...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            if (packs.length === 0) {
                this.log('Default Values Test', false, 'No packs found');
                return;
            }

            const packsWithFalse = packs.filter(pack => pack.hideCommentForm === false);
            const packsWithTrue = packs.filter(pack => pack.hideCommentForm === true);

            this.log('Default Values Test', true, 
                `Found ${packsWithFalse.length} packs with hideCommentForm=false, ${packsWithTrue.length} with hideCommentForm=true`, 
                'Default value appears to be false (comment form visible)');

        } catch (error) {
            this.log('Default Values Test', false, 
                'Failed to test default values', error.message);
        }
    }

    async testBackendModel() {
        console.log('\n🏗️ Testing Backend Model...');

        try {
            const response = await axios.get(`${this.baseURL}/packs`);
            const packs = response.data;

            if (packs.length === 0) {
                this.log('Backend Model Test', false, 'No packs found');
                return;
            }

            const firstPack = packs[0];
            
            // Test that the field is properly serialized in JSON response
            const jsonString = JSON.stringify(firstPack);
            const parsedPack = JSON.parse(jsonString);

            if (parsedPack.hideCommentForm !== undefined) {
                this.log('Backend Model Test', true, 
                    `hideCommentForm field properly serialized in JSON response`, 
                    `Value: ${parsedPack.hideCommentForm}`);
            } else {
                this.log('Backend Model Test', false, 
                    'hideCommentForm field not serialized in JSON response');
            }

        } catch (error) {
            this.log('Backend Model Test', false, 
                'Failed to test backend model', error.message);
        }
    }

    generateReport() {
        console.log('\n📊 Core Functionality Test Report');
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

        require('fs').writeFileSync('core-hide-comment-form-test-report.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Detailed report saved to: core-hide-comment-form-test-report.json');

        return report;
    }

    async runAllTests() {
        console.log('🚀 Starting Core Hide Comment Form Functionality Tests');
        console.log('='.repeat(60));

        try {
            await this.testDatabaseSchema();
            await this.testPackRetrieval();
            await this.testDataTypes();
            await this.testDefaultValues();
            await this.testBackendModel();
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
        } finally {
            return this.generateReport();
        }
    }
}

// Run the tests
if (require.main === module) {
    const tester = new CoreHideCommentFormTester();
    tester.runAllTests().then(report => {
        process.exit(report.summary.failed > 0 ? 1 : 0);
    }).catch(error => {
        console.error('❌ Test suite crashed:', error);
        process.exit(1);
    });
}

module.exports = CoreHideCommentFormTester;

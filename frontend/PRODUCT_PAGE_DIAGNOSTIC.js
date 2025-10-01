/**
 * COMPREHENSIVE PRODUCT PAGE DIAGNOSTIC SCRIPT
 * ===========================================
 * 
 * This script will identify ALL issues causing the product page to fail
 * Run this in browser console to get detailed diagnostics
 */

console.log('🔍 PRODUCT PAGE COMPREHENSIVE DIAGNOSTIC');
console.log('========================================');

// 1. Check if we're in development or production mode
console.log('\n📊 ENVIRONMENT CHECK:');
console.log(`Current URL: ${window.location.href}`);
console.log(`User Agent: ${navigator.userAgent}`);
console.log(`Document ready state: ${document.readyState}`);

// Check if we're running production build
const isProduction = window.location.href.includes('dist') || 
                    document.querySelector('script[src*="index-C"]') !== null;
console.log(`Production Build: ${isProduction ? '❌ YES (Problem!)' : '✅ NO (Good!)'}`);

if (isProduction) {
    console.log('🚨 CRITICAL: You are running PRODUCTION build!');
    console.log('💡 SOLUTION: Start development server with: npm run dev');
    console.log('🔗 Then go to: http://localhost:5173/products/6');
}

// 2. Check React app loading
console.log('\n⚛️ REACT APP CHECK:');
const reactRoot = document.querySelector('#root');
console.log(`React Root Element: ${reactRoot ? '✅ Found' : '❌ Missing'}`);

// Check for React errors in console
const originalError = console.error;
let reactErrors = [];
console.error = function(...args) {
    const errorMsg = args.join(' ');
    if (errorMsg.includes('React error') || errorMsg.includes('Minified React error')) {
        reactErrors.push(errorMsg);
    }
    originalError.apply(console, args);
};

// 3. Check API connectivity
console.log('\n🔌 API CONNECTIVITY CHECK:');
async function checkApiConnectivity() {
    try {
        const response = await fetch('http://localhost:8080/api/hello');
        if (response.ok) {
            console.log('✅ Backend API: Connected');
            return true;
        } else {
            console.log(`❌ Backend API: Error ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Backend API: ${error.message}`);
        console.log('💡 SOLUTION: Start backend server with: ./mvnw spring-boot:run');
        return false;
    }
}

// 4. Check product data loading
console.log('\n📦 PRODUCT DATA CHECK:');
async function checkProductData() {
    try {
        const response = await fetch('http://localhost:8080/api/products/6');
        if (response.ok) {
            const product = await response.json();
            console.log('✅ Product API: Working');
            console.log(`Product Name: ${product.name || 'N/A'}`);
            console.log(`Product Images: ${product.images ? product.images.length : 0}`);
            console.log(`Product Variants: ${product.hasVariants ? 'Yes' : 'No'}`);
            console.log(`Product Quantity: ${product.quantity || 0}`);
            return true;
        } else {
            console.log(`❌ Product API: Error ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Product API: ${error.message}`);
        return false;
    }
}

// 5. Check component rendering issues
console.log('\n🧩 COMPONENT RENDERING CHECK:');

// Check for common React errors
const commonReactErrors = {
    '418': 'Element type is invalid: expected a string or a class/function',
    '423': 'Element ref was not specified correctly',
    'null reading': 'Trying to access property of null/undefined object'
};

console.log('Common React Error Meanings:');
Object.entries(commonReactErrors).forEach(([code, meaning]) => {
    console.log(`Error ${code}: ${meaning}`);
});

// 6. Check for missing dependencies
console.log('\n📚 DEPENDENCY CHECK:');
const requiredLibraries = [
    'React', 'ReactDOM', 'ReactRouter', 'Axios'
];

requiredLibraries.forEach(lib => {
    const isLoaded = window[lib] !== undefined;
    console.log(`${lib}: ${isLoaded ? '✅ Loaded' : '❌ Missing'}`);
});

// 7. Check for null/undefined data issues
console.log('\n🔍 NULL DATA CHECK:');
console.log('Looking for potential null reference issues...');

// Check if any global variables are null
const globalChecks = [
    'window.React', 'window.ReactDOM', 'document.body', 'document.head'
];

globalChecks.forEach(check => {
    try {
        const result = eval(check);
        console.log(`${check}: ${result ? '✅ OK' : '❌ NULL'}`);
    } catch (error) {
        console.log(`${check}: ❌ ERROR - ${error.message}`);
    }
});

// 8. Run all checks
async function runAllDiagnostics() {
    console.log('\n🚀 RUNNING COMPREHENSIVE DIAGNOSTICS...');
    
    const results = {
        environment: !isProduction,
        reactRoot: !!reactRoot,
        apiConnectivity: await checkApiConnectivity(),
        productData: await checkProductData(),
        reactErrors: reactErrors.length
    };
    
    console.log('\n📊 DIAGNOSTIC RESULTS:');
    console.log('========================');
    
    Object.entries(results).forEach(([check, result]) => {
        const status = result ? '✅ PASS' : '❌ FAIL';
        const checkName = check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        console.log(`${status} ${checkName}`);
    });
    
    // Generate recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (!results.environment) {
        console.log('🚨 CRITICAL: Switch to development mode');
        console.log('   1. Stop current server');
        console.log('   2. Run: npm run dev');
        console.log('   3. Go to: http://localhost:5173/products/6');
    }
    
    if (!results.apiConnectivity) {
        console.log('🚨 CRITICAL: Backend server not running');
        console.log('   1. Open new terminal');
        console.log('   2. Run: cd demo && ./mvnw spring-boot:run');
        console.log('   3. Wait for "Started DemoApplication" message');
    }
    
    if (!results.productData) {
        console.log('⚠️  Product data not loading');
        console.log('   1. Check if product ID 6 exists');
        console.log('   2. Check backend database connection');
        console.log('   3. Verify API endpoints are working');
    }
    
    if (results.reactErrors > 0) {
        console.log('⚠️  React errors detected');
        console.log('   1. Check browser console for detailed errors');
        console.log('   2. Verify all components are properly imported');
        console.log('   3. Check for null/undefined data in components');
    }
    
    // Final assessment
    const totalIssues = Object.values(results).filter(r => !r).length;
    
    console.log('\n🎯 FINAL ASSESSMENT:');
    if (totalIssues === 0) {
        console.log('🎉 All checks passed! Product page should work.');
    } else if (totalIssues <= 2) {
        console.log('⚠️  Minor issues found. Follow recommendations above.');
    } else {
        console.log('🚨 Multiple critical issues found. Fix environment first.');
    }
    
    return results;
}

// 9. Auto-run diagnostics
runAllDiagnostics();

// 10. Export functions for manual testing
window.productDiagnostic = {
    runAll: runAllDiagnostics,
    checkApi: checkApiConnectivity,
    checkProduct: checkProductData,
    results: null
};

console.log('\n🔧 Diagnostic functions loaded!');
console.log('Available functions:');
console.log('- productDiagnostic.runAll() - Run all diagnostics');
console.log('- productDiagnostic.checkApi() - Check API connectivity');
console.log('- productDiagnostic.checkProduct() - Check product data');
console.log('\n🚀 Diagnostics running automatically...');

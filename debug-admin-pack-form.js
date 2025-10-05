// Debug script to test AdminPackForm functionality
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging AdminPackForm Issues...\n');

// Check if the file exists and is readable
const formPath = path.join(__dirname, 'frontend', 'src', 'pages', 'admin', 'AdminPackForm.jsx');

try {
    const content = fs.readFileSync(formPath, 'utf8');
    console.log('✅ AdminPackForm.jsx file exists and is readable');
    
    // Check for common issues
    const issues = [];
    
    // Check for missing imports
    if (!content.includes('import { getAllPacks }')) {
        issues.push('❌ getAllPacks import might be missing');
    } else {
        console.log('✅ getAllPacks import found');
    }
    
    // Check for useState with allPacks
    if (!content.includes('const [allPacks, setAllPacks] = useState([])')) {
        issues.push('❌ allPacks state might be missing');
    } else {
        console.log('✅ allPacks state found');
    }
    
    // Check for fetchData function
    if (!content.includes('const fetchData = async ()')) {
        issues.push('❌ fetchData function might be missing');
    } else {
        console.log('✅ fetchData function found');
    }
    
    // Check for recommendations section
    if (!content.includes('Pack Recommendations')) {
        issues.push('❌ Recommendations section might be missing');
    } else {
        console.log('✅ Recommendations section found');
    }
    
    // Check for return statement
    if (!content.includes('return (')) {
        issues.push('❌ Return statement might be missing');
    } else {
        console.log('✅ Return statement found');
    }
    
    // Check for export default
    if (!content.includes('export default AdminPackForm')) {
        issues.push('❌ Export default might be missing');
    } else {
        console.log('✅ Export default found');
    }
    
    // Check for syntax errors (basic checks)
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openBraces !== closeBraces) {
        issues.push(`❌ Mismatched braces: ${openBraces} open, ${closeBraces} close`);
    } else {
        console.log('✅ Braces are balanced');
    }
    
    if (openParens !== closeParens) {
        issues.push(`❌ Mismatched parentheses: ${openParens} open, ${closeParens} close`);
    } else {
        console.log('✅ Parentheses are balanced');
    }
    
    // Check for common React issues
    if (!content.includes('useEffect')) {
        issues.push('❌ useEffect might be missing');
    } else {
        console.log('✅ useEffect found');
    }
    
    if (!content.includes('useState')) {
        issues.push('❌ useState might be missing');
    } else {
        console.log('✅ useState found');
    }
    
    console.log('\n📊 Summary:');
    if (issues.length === 0) {
        console.log('✅ No obvious issues found in AdminPackForm.jsx');
        console.log('\n💡 Possible causes for "not working":');
        console.log('   1. Backend server not running');
        console.log('   2. Authentication issues (not logged in as admin)');
        console.log('   3. JavaScript errors in browser console');
        console.log('   4. Network/CORS issues');
        console.log('   5. Missing dependencies');
    } else {
        console.log('❌ Issues found:');
        issues.forEach(issue => console.log(`   ${issue}`));
    }
    
} catch (error) {
    console.error('❌ Error reading AdminPackForm.jsx:', error.message);
}

// Check if backend is running
console.log('\n🔧 Checking backend connectivity...');
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/packs',
    method: 'GET',
    timeout: 5000
};

const req = http.request(options, (res) => {
    console.log(`✅ Backend is running (status: ${res.statusCode})`);
});

req.on('error', (err) => {
    console.log('❌ Backend is not running or not accessible');
    console.log('   Please start the backend server: cd demo && mvn spring-boot:run');
});

req.on('timeout', () => {
    console.log('❌ Backend request timed out');
    console.log('   Please check if backend is running on port 8080');
});

req.end();

console.log('\n🎯 Next Steps:');
console.log('   1. Check browser console for JavaScript errors');
console.log('   2. Verify you are logged in as admin');
console.log('   3. Ensure backend server is running');
console.log('   4. Check network requests in browser dev tools');

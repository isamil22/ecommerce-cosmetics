/**
 * FIND SUBMIT BUTTON DIAGNOSTIC SCRIPT
 * Run this in browser console to locate the submit button
 */

console.log('🔍 SUBMIT BUTTON DIAGNOSTIC');
console.log('===========================');

// Check if we're on the right page
const currentUrl = window.location.href;
console.log(`📍 Current URL: ${currentUrl}`);

if (!currentUrl.includes('/admin/products')) {
    console.log('❌ NOT ON ADMIN PRODUCTS PAGE');
    console.log('Please navigate to: http://localhost:5173/admin/products/create');
    return;
}

// Look for the submit button
const submitButton = document.querySelector('button[onclick*="handleSubmit"], button[type="submit"]');
const allButtons = document.querySelectorAll('button');

console.log(`🔍 Found ${allButtons.length} buttons on page:`);

allButtons.forEach((button, index) => {
    const text = button.textContent.trim();
    const hasSubmitHandler = button.onclick || button.getAttribute('onclick');
    const isVisible = button.offsetParent !== null;
    
    console.log(`${index + 1}. "${text}" - Visible: ${isVisible} - Has Handler: ${!!hasSubmitHandler}`);
    
    if (text.includes('Create') || text.includes('Update') || text.includes('Product')) {
        console.log(`   ⭐ POTENTIAL SUBMIT BUTTON: "${text}"`);
    }
});

// Specific search for the submit button
const potentialSubmitButtons = [
    ...document.querySelectorAll('button'),
    ...document.querySelectorAll('input[type="submit"]')
].filter(el => {
    const text = el.textContent || el.value || '';
    return text.includes('Create') || text.includes('Update') || text.includes('Product') || 
           text.includes('Save') || text.includes('Submit');
});

console.log('\n🎯 POTENTIAL SUBMIT BUTTONS:');
potentialSubmitButtons.forEach((button, index) => {
    const text = button.textContent || button.value || '';
    const isVisible = button.offsetParent !== null;
    const position = button.getBoundingClientRect();
    
    console.log(`${index + 1}. "${text}"`);
    console.log(`   Position: x:${Math.round(position.x)}, y:${Math.round(position.y)}`);
    console.log(`   Visible: ${isVisible}`);
    console.log(`   Disabled: ${button.disabled}`);
    
    if (isVisible) {
        console.log(`   ✅ CLICKABLE BUTTON FOUND!`);
        // Highlight the button
        button.style.border = '3px solid red';
        button.style.boxShadow = '0 0 10px red';
        
        setTimeout(() => {
            button.style.border = '';
            button.style.boxShadow = '';
        }, 3000);
    }
});

// Check form validation
const requiredFields = [
    'input[name="name"]',
    'input[name="price"]', 
    'select[name="categoryId"]'
];

console.log('\n✅ FORM VALIDATION CHECK:');
requiredFields.forEach(selector => {
    const field = document.querySelector(selector);
    if (field) {
        const value = field.value || '';
        const isEmpty = value.trim() === '';
        console.log(`${selector}: ${isEmpty ? '❌ EMPTY' : '✅ FILLED'} (${value})`);
    } else {
        console.log(`${selector}: ❌ NOT FOUND`);
    }
});

// Check if page is fully loaded
console.log('\n📄 PAGE STATUS:');
console.log(`Document ready state: ${document.readyState}`);
console.log(`React app loaded: ${!!document.querySelector('#root')}`);

// Final instructions
console.log('\n🎯 INSTRUCTIONS:');
console.log('1. Look for buttons with red border (highlighted above)');
console.log('2. The submit button should be in the TOP HEADER');
console.log('3. It should have pink-purple gradient background');
console.log('4. Text should say "Create Product" or "Update Product"');
console.log('5. If not visible, fill required fields (name, price, category)');

// Auto-scroll to top to show header
window.scrollTo(0, 0);
console.log('\n📜 Scrolled to top to show header area');

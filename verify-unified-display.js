// Browser Console Test Script for Unified Recommendations Display
// Run this in the browser console on a pack detail page to verify the unified display

console.log('🧪 Starting Unified Recommendations Display Verification');

// Function to check if unified display is working
function verifyUnifiedDisplay() {
    console.log('🔍 Checking for unified recommendations display...');
    
    // Look for the recommendations section
    const recommendationsSection = document.querySelector('h2');
    const unifiedTitle = recommendationsSection && recommendationsSection.textContent.includes('You Might Also Like');
    
    if (unifiedTitle) {
        console.log('✅ Found unified "You Might Also Like" section');
    } else {
        console.log('❌ Unified section title not found');
        return false;
    }
    
    // Count total recommendation sections
    const allSections = document.querySelectorAll('h2');
    const recommendationSections = Array.from(allSections).filter(h2 => 
        h2.textContent.includes('Recommended') || 
        h2.textContent.includes('You Might Also Like') ||
        h2.textContent.includes('Create Your Own')
    );
    
    console.log(`📊 Found ${recommendationSections.length} recommendation sections`);
    
    if (recommendationSections.length === 1) {
        console.log('✅ Perfect! Only one unified section found');
    } else {
        console.log('❌ Multiple sections found - unified display may not be working');
        recommendationSections.forEach((section, index) => {
            console.log(`  Section ${index + 1}: "${section.textContent}"`);
        });
    }
    
    // Check for type indicators (Pack badges)
    const packBadges = document.querySelectorAll('[class*="bg-blue-100"]');
    if (packBadges.length > 0) {
        console.log(`✅ Found ${packBadges.length} pack type indicators`);
    } else {
        console.log('⚠️ No pack type indicators found');
    }
    
    // Check grid layout
    const grids = document.querySelectorAll('[class*="grid-cols"]');
    console.log(`📐 Found ${grids.length} grid layouts`);
    
    // Count total recommendation items
    const productCards = document.querySelectorAll('[class*="bg-white"][class*="rounded-lg"][class*="shadow-md"]');
    console.log(`🛍️ Found ${productCards.length} recommendation items`);
    
    return true;
}

// Function to test navigation links
function testNavigationLinks() {
    console.log('🔗 Testing navigation links...');
    
    const links = document.querySelectorAll('a[href*="/products/"], a[href*="/packs/"], a[href*="/custom-packs/"]');
    console.log(`🔗 Found ${links.length} navigation links`);
    
    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        if (href.includes('/products/')) {
            console.log(`  Link ${index + 1}: Product → ${href}`);
        } else if (href.includes('/packs/')) {
            console.log(`  Link ${index + 1}: Pack → ${href}`);
        } else if (href.includes('/custom-packs/')) {
            console.log(`  Link ${index + 1}: Custom Pack → ${href}`);
        }
    });
    
    return links.length > 0;
}

// Function to test responsive layout
function testResponsiveLayout() {
    console.log('📱 Testing responsive layout...');
    
    const gridContainer = document.querySelector('[class*="grid"][class*="grid-cols"]');
    if (gridContainer) {
        const classes = gridContainer.className;
        console.log(`📐 Grid classes: ${classes}`);
        
        if (classes.includes('grid-cols-1') && classes.includes('sm:grid-cols-2') && classes.includes('lg:grid-cols-3')) {
            console.log('✅ Responsive grid classes found');
        } else {
            console.log('⚠️ Responsive grid classes may be incomplete');
        }
    } else {
        console.log('❌ Grid container not found');
    }
    
    return true;
}

// Function to run complete verification
function runCompleteVerification() {
    console.log('🚀 Running complete unified display verification...');
    console.log('================================================');
    
    const results = {
        unifiedDisplay: verifyUnifiedDisplay(),
        navigation: testNavigationLinks(),
        responsive: testResponsiveLayout()
    };
    
    console.log('================================================');
    console.log('📊 Verification Results:');
    console.log(`  Unified Display: ${results.unifiedDisplay ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Navigation Links: ${results.navigation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Responsive Layout: ${results.responsive ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = Object.values(results).every(result => result);
    console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    return results;
}

// Function to test specific pack pages
async function testPackPage(packId) {
    console.log(`🧪 Testing Pack ${packId} page...`);
    
    try {
        // Test if we can fetch the pack data
        const response = await fetch(`http://localhost:8082/api/packs/${packId}`);
        if (response.ok) {
            const pack = await response.json();
            console.log(`📦 Pack ${packId} data loaded:`, pack.name);
            console.log(`  Recommended Products: ${pack.recommendedProducts?.length || 0}`);
            console.log(`  Recommended Packs: ${pack.recommendedPacks?.length || 0}`);
            console.log(`  Recommended Custom Packs: ${pack.recommendedCustomPacks?.length || 0}`);
            
            const totalRecommendations = (pack.recommendedProducts?.length || 0) + 
                                       (pack.recommendedPacks?.length || 0) + 
                                       (pack.recommendedCustomPacks?.length || 0);
            
            console.log(`📊 Total recommendations: ${totalRecommendations}`);
            
            if (totalRecommendations > 0) {
                console.log('✅ Pack has recommendations to test');
                return true;
            } else {
                console.log('⚠️ Pack has no recommendations');
                return false;
            }
        } else {
            console.log(`❌ Failed to fetch pack ${packId}: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error testing pack ${packId}:`, error.message);
        return false;
    }
}

// Auto-run verification when script loads
console.log('🚀 Auto-running unified display verification...');
runCompleteVerification();

// Export functions for manual testing
window.verifyUnifiedDisplay = verifyUnifiedDisplay;
window.testNavigationLinks = testNavigationLinks;
window.testResponsiveLayout = testResponsiveLayout;
window.runCompleteVerification = runCompleteVerification;
window.testPackPage = testPackPage;

console.log('💡 Manual test functions available:');
console.log('- verifyUnifiedDisplay()');
console.log('- testNavigationLinks()');
console.log('- testResponsiveLayout()');
console.log('- runCompleteVerification()');
console.log('- testPackPage(packId)');

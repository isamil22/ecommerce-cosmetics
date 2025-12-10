#!/bin/bash

# Landing Page Builder - Quick Setup Test Script
# This script tests if everything is set up correctly

echo "🔍 Landing Page Builder - Setup Verification"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}: $2"
        ((FAILED++))
    fi
}

echo "📁 Checking Backend Files..."
echo "----------------------------"

# Check Entity files
[ -f "demo/src/main/java/com/example/demo/model/LandingPage.java" ]
test_result $? "LandingPage entity exists"

[ -f "demo/src/main/java/com/example/demo/model/LandingPageSection.java" ]
test_result $? "LandingPageSection entity exists"

[ -f "demo/src/main/java/com/example/demo/model/LandingPageSettings.java" ]
test_result $? "LandingPageSettings entity exists"

[ -f "demo/src/main/java/com/example/demo/model/LandingPageView.java" ]
test_result $? "LandingPageView entity exists"

# Check Repository files
[ -f "demo/src/main/java/com/example/demo/repositories/LandingPageRepository.java" ]
test_result $? "LandingPageRepository exists"

[ -f "demo/src/main/java/com/example/demo/repositories/LandingPageSectionRepository.java" ]
test_result $? "LandingPageSectionRepository exists"

[ -f "demo/src/main/java/com/example/demo/repositories/LandingPageSettingsRepository.java" ]
test_result $? "LandingPageSettingsRepository exists"

[ -f "demo/src/main/java/com/example/demo/repositories/LandingPageViewRepository.java" ]
test_result $? "LandingPageViewRepository exists"

# Check Service and Controller
[ -f "demo/src/main/java/com/example/demo/service/LandingPageService.java" ]
test_result $? "LandingPageService exists"

[ -f "demo/src/main/java/com/example/demo/controller/LandingPageController.java" ]
test_result $? "LandingPageController exists"

# Check Migrations
[ -f "demo/src/main/resources/db/migration/V11__create_landing_pages_tables.sql" ]
test_result $? "V11 migration exists"

[ -f "demo/src/main/resources/db/migration/V12__add_landing_page_permissions.sql" ]
test_result $? "V12 migration exists"

echo ""
echo "📱 Checking Frontend Files..."
echo "----------------------------"

# Check API Service
[ -f "frontend/src/api/landingPageService.js" ]
test_result $? "Landing Page API Service exists"

# Check Section Components
[ -f "frontend/src/components/landingPage/sections/HeroSection.jsx" ]
test_result $? "HeroSection component exists"

[ -f "frontend/src/components/landingPage/sections/TrustSignalsSection.jsx" ]
test_result $? "TrustSignalsSection component exists"

[ -f "frontend/src/components/landingPage/sections/ProductShowcaseSection.jsx" ]
test_result $? "ProductShowcaseSection component exists"

[ -f "frontend/src/components/landingPage/sections/KeyBenefitsSection.jsx" ]
test_result $? "KeyBenefitsSection component exists"

[ -f "frontend/src/components/landingPage/sections/TestimonialsSection.jsx" ]
test_result $? "TestimonialsSection component exists"

[ -f "frontend/src/components/landingPage/sections/FAQSection.jsx" ]
test_result $? "FAQSection component exists"

[ -f "frontend/src/components/landingPage/sections/UrgencyBannerSection.jsx" ]
test_result $? "UrgencyBannerSection component exists"

[ -f "frontend/src/components/landingPage/sections/FinalCTASection.jsx" ]
test_result $? "FinalCTASection component exists"

[ -f "frontend/src/components/landingPage/sections/SectionRegistry.js" ]
test_result $? "SectionRegistry exists"

# Check Pages
[ -f "frontend/src/pages/PublicLandingPage.jsx" ]
test_result $? "PublicLandingPage exists"

[ -f "frontend/src/pages/admin/AdminLandingPagesPage.jsx" ]
test_result $? "AdminLandingPagesPage exists"

[ -f "frontend/src/pages/admin/AdminLandingPageBuilder.jsx" ]
test_result $? "AdminLandingPageBuilder exists"

echo ""
echo "📄 Checking Documentation..."
echo "----------------------------"

[ -f "LANDING_PAGE_BUILDER_GUIDE.md" ]
test_result $? "Complete guide exists"

[ -f "LANDING_PAGE_QUICK_START.md" ]
test_result $? "Quick start guide exists"

[ -f "IMPLEMENTATION_SUMMARY.md" ]
test_result $? "Implementation summary exists"

[ -f "CODE_REVIEW_AND_TESTING.md" ]
test_result $? "Testing guide exists"

echo ""
echo "🔍 Checking Routes in App.jsx..."
echo "----------------------------"

if grep -q "AdminLandingPagesPage" frontend/src/App.jsx && \
   grep -q "AdminLandingPageBuilder" frontend/src/App.jsx && \
   grep -q "PublicLandingPage" frontend/src/App.jsx; then
    test_result 0 "All routes added to App.jsx"
else
    test_result 1 "Routes missing in App.jsx"
fi

if grep -q "/landing/:slug" frontend/src/App.jsx; then
    test_result 0 "Public landing page route configured"
else
    test_result 1 "Public landing page route missing"
fi

if grep -q "landing-pages" frontend/src/App.jsx; then
    test_result 0 "Admin landing pages routes configured"
else
    test_result 1 "Admin landing pages routes missing"
fi

echo ""
echo "=============================================="
echo "📊 Test Results Summary"
echo "=============================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! All files are in place!${NC}"
    echo ""
    echo "✅ Next Steps:"
    echo "1. Start backend: cd demo && ./mvnw spring-boot:run"
    echo "2. Start frontend: cd frontend && npm run dev"
    echo "3. Open: http://localhost:5173/admin/landing-pages"
    echo ""
    echo "📚 Read the guides:"
    echo "- LANDING_PAGE_QUICK_START.md"
    echo "- CODE_REVIEW_AND_TESTING.md"
    echo ""
else
    echo -e "${RED}❌ Some files are missing!${NC}"
    echo "Please check the failed tests above."
    exit 1
fi


#!/bin/bash

# Verification script for admin pack image upload fix
# Run this after restarting containers to verify fixes are applied

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Admin Pack Image Upload Fix - Verification Script          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Verification Steps:${NC}\n"

# Check 1: Docker containers running
echo "✓ Check 1: Docker containers status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if docker ps | grep -q "ecommerce-copy-backend"; then
    echo -e "${GREEN}✓ Backend container running${NC}"
else
    echo -e "${RED}✗ Backend container NOT running${NC}"
    echo "  Run: docker-compose up -d"
fi
echo ""

# Check 2: Flyway migration applied
echo "✓ Check 2: Database migration status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
MIGRATION_CHECK=$(docker-compose logs ecommerce-copy-backend 2>/dev/null | grep -c "V2__fix_pack_description")
if [ "$MIGRATION_CHECK" -gt 0 ]; then
    echo -e "${GREEN}✓ V2 migration found in logs${NC}"
else
    echo -e "${YELLOW}⚠ V2 migration not found in logs yet${NC}"
    echo "  The migration may still be running..."
    echo "  Check again in 30 seconds"
fi
echo ""

# Check 3: Database column type
echo "✓ Check 3: Database schema verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
COLUMN_TYPE=$(docker exec ecommerce-copy-backend mysql -uroot -ppassword -D sms -e "DESCRIBE packs;" 2>/dev/null | grep "description" | awk '{print $2}')
if [[ "$COLUMN_TYPE" == *"text"* ]]; then
    if [[ "$COLUMN_TYPE" == "longtext" ]]; then
        echo -e "${GREEN}✓ description column type: $COLUMN_TYPE${NC}"
    else
        echo -e "${YELLOW}⚠ description column type: $COLUMN_TYPE (expected: longtext)${NC}"
        echo "  Migration may not have completed"
    fi
else
    echo -e "${RED}✗ Could not verify column type${NC}"
    echo "  Try: docker-compose logs ecommerce-copy-backend | grep -i error"
fi
echo ""

# Check 4: Source code changes
echo "✓ Check 4: Source code changes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -q "LONGTEXT" "demo/src/main/java/com/example/demo/model/Pack.java"; then
    echo -e "${GREEN}✓ Pack.java updated with LONGTEXT${NC}"
else
    echo -e "${RED}✗ Pack.java NOT updated${NC}"
fi

if grep -q "startsWith(\"/\")" "demo/src/main/java/com/example/demo/service/ImageCompositionService.java"; then
    echo -e "${GREEN}✓ ImageCompositionService updated with URL conversion${NC}"
else
    echo -e "${RED}✗ ImageCompositionService NOT updated${NC}"
fi

if [ -f "demo/src/main/resources/db/migration/V2__fix_pack_description_column.sql" ]; then
    echo -e "${GREEN}✓ Migration file V2 exists${NC}"
else
    echo -e "${RED}✗ Migration file V2 NOT found${NC}"
fi
echo ""

# Check 5: Backend health
echo "✓ Check 5: Backend health check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HEALTH=$(curl -s http://localhost:8080/api/health 2>/dev/null || echo "ERROR")
if [[ "$HEALTH" == "ERROR" ]]; then
    echo -e "${YELLOW}⚠ Backend not responding yet${NC}"
    echo "  Wait 30 seconds and try again"
    echo "  Check: docker-compose logs ecommerce-copy-backend"
else
    echo -e "${GREEN}✓ Backend API responding${NC}"
fi
echo ""

# Check 6: Frontend accessible
echo "✓ Check 6: Admin panel access"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8085/admin/packs 2>/dev/null || echo "000")
if [ "$FRONTEND" = "200" ]; then
    echo -e "${GREEN}✓ Admin panel accessible (HTTP 200)${NC}"
elif [ "$FRONTEND" = "302" ] || [ "$FRONTEND" = "304" ]; then
    echo -e "${GREEN}✓ Admin panel responsive (HTTP $FRONTEND)${NC}"
else
    echo -e "${YELLOW}⚠ Admin panel returned HTTP $FRONTEND${NC}"
    echo "  May still be loading..."
fi
echo ""

# Summary
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   Verification Summary                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. If all checks passed → Ready to test!"
echo "2. If migration pending → Wait 30 seconds and re-run script"
echo "3. If checks failed → Review logs:"
echo ""
echo "   docker-compose logs ecommerce-copy-backend | tail -50"
echo ""
echo -e "${BLUE}Test the Fix:${NC}"
echo "1. Go to: http://localhost:8085/admin/packs"
echo "2. Click 'Edit' on any pack"
echo "3. Add image to 'Pack Description' section"
echo "4. Save and verify no 500 error"
echo ""
echo -e "${BLUE}Support:${NC}"
echo "Review: ADMIN_PACK_IMAGE_UPLOAD_FIX_REPORT.md (detailed)"
echo "Quick:  ADMIN_PACK_EDIT_IMAGE_FIX_SUMMARY.md (quick reference)"
echo ""


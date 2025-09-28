# Custom Pack Recommendations Testing Guide

## Backend Testing

### 1. Test Custom Pack Recommendations API

**Create Custom Pack Recommendation:**
```bash
curl -X PUT \
  'http://localhost:8082/api/packs/1/recommendations' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "productIds": [2, 3],
    "packIds": [1],
    "customPackIds": [1]
  }'
```

**Test Custom Pack Only Endpoint:**
```bash
curl -X PUT \
  'http://localhost:8082/api/packs/1/recommendations/custom-packs' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '[1]'
```

**Verify Pack Response Includes Custom Packs:**
```bash
curl -X GET \
  'http://localhost:8082/api/packs/1' \
  -H 'accept: */*'
```

Expected response should include:
```json
{
  "id": 1,
  "name": "Pack Name",
  "recommendedProducts": [...],
  "recommendedPacks": [...],
  "recommendedCustomPacks": [
    {
      "id": 1,
      "name": "Custom Pack Name",
      "description": "Description",
      "minItems": 2,
      "maxItems": 5,
      "pricingType": "FIXED",
      "fixedPrice": 99.99,
      "discountRate": null
    }
  ]
}
```

## Frontend Testing

### 1. Admin Interface Testing

1. Navigate to `/admin/packs`
2. Click "Recommendations" for any pack
3. Verify you see 3 sections:
   - Product Recommendations
   - Pack Recommendations  
   - Custom Pack Recommendations
4. Select some custom packs
5. Save changes
6. Verify success message

### 2. Customer Interface Testing

1. Navigate to `/packs/1` (or any pack with custom pack recommendations)
2. Scroll to bottom of page
3. Verify you see:
   - "Recommended Products" section
   - "You Might Also Like" section (regular packs)
   - "Create Your Own Pack" section (custom packs)
4. Custom pack cards should show:
   - Purple gradient design
   - "CP" icon
   - Pack name and item range
   - Pricing information
   - "Customizable Pack" badge

### 3. Database Verification

Check the new table was created:
```sql
SELECT * FROM pack_recommended_custom_packs;
```

## Expected Results

✅ **Backend:**
- All 4 endpoints working (combined, products-only, packs-only, custom-packs-only)
- Database table created and populated
- JSON response includes `recommendedCustomPacks` array

✅ **Frontend Admin:**
- 3-column layout with custom packs section
- Search functionality works across all types
- Save functionality includes custom pack IDs
- Summary shows selected custom packs

✅ **Frontend Customer:**
- Custom packs display with distinctive purple styling
- Links to `/custom-packs/:id` pages
- Responsive design on all screen sizes
- Clear visual distinction from regular packs

## Troubleshooting

**If custom packs don't appear:**
1. Check if custom packs exist: `GET /api/custom-packs`
2. Verify database table exists and has data
3. Check browser console for JavaScript errors
4. Verify JWT token has ADMIN role for admin functions

**If styling looks wrong:**
1. Check Tailwind CSS classes are loading
2. Verify gradient classes are supported
3. Check responsive breakpoints

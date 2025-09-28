# Pack Recommendations API

This document describes the new pack recommendation feature that allows administrators to manually curate product and pack recommendations for each pack.

## Overview

The recommendation system allows administrators to:
- Add specific products as recommendations for a pack
- Add other packs as recommendations for a pack
- Update both types of recommendations simultaneously
- Remove all recommendations by sending empty lists

## API Endpoints

### 1. Update All Recommendations
**PUT** `/api/packs/{id}/recommendations`

Updates both product and pack recommendations for a specific pack.

**Request Body:**
```json
{
  "productIds": [1, 2, 3],
  "packIds": [4, 5, 6]
}
```

**Response:** Returns the updated pack with all recommendations.

### 2. Update Product Recommendations Only
**PUT** `/api/packs/{id}/recommendations/products`

Updates only the product recommendations for a specific pack.

**Request Body:**
```json
[1, 2, 3]
```

**Response:** Returns the updated pack with new product recommendations.

### 3. Update Pack Recommendations Only
**PUT** `/api/packs/{id}/recommendations/packs`

Updates only the pack recommendations for a specific pack.

**Request Body:**
```json
[4, 5, 6]
```

**Response:** Returns the updated pack with new pack recommendations.

## Database Changes

The following database tables are created automatically:

### `pack_recommended_products`
- `pack_id` (FK to packs table)
- `product_id` (FK to products table)

### `pack_recommended_packs`
- `pack_id` (FK to packs table)
- `recommended_pack_id` (FK to packs table)

## Response Format

When fetching a pack, the response now includes recommendation data:

```json
{
  "id": 1,
  "name": "Summer Essentials Pack",
  "description": "Perfect for summer",
  "price": 99.99,
  "imageUrl": "https://...",
  "items": [...],
  "comments": [...],
  "recommendedProducts": [
    {
      "id": 10,
      "name": "Sunglasses",
      "price": 29.99,
      "imageUrl": "https://..."
    }
  ],
  "recommendedPacks": [
    {
      "id": 2,
      "name": "Beach Pack",
      "price": 79.99,
      "imageUrl": "https://..."
    }
  ]
}
```

## Security

All recommendation endpoints require `ADMIN` role:
- `@PreAuthorize("hasRole('ADMIN')")`

## Usage Examples

### Add Product Recommendations
```bash
curl -X PUT "http://localhost:8080/api/packs/1/recommendations/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d "[10, 11, 12]"
```

### Add Pack Recommendations
```bash
curl -X PUT "http://localhost:8080/api/packs/1/recommendations/packs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d "[2, 3, 4]"
```

### Update Both Types
```bash
curl -X PUT "http://localhost:8080/api/packs/1/recommendations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"productIds": [10, 11], "packIds": [2, 3]}'
```

### Clear All Recommendations
```bash
curl -X PUT "http://localhost:8080/api/packs/1/recommendations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"productIds": [], "packIds": []}'
```

## Frontend Integration

The frontend can now display recommendation sections like:
- "You Might Also Like" (for recommended products)
- "Complete the Look" (for recommended packs)
- "Related Packs" (for recommended packs)

These recommendations are manually curated by administrators for optimal cross-selling and upselling opportunities.


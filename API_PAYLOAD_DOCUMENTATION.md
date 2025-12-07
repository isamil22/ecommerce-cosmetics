# API Payload Documentation - Create Pack with Display Settings

## Request Format

### Endpoint
```
POST /api/packs
Content-Type: multipart/form-data
```

### Payload Structure

When a user creates a new pack through the AdminPackForm.jsx, the following payload is sent:

#### Example 1: Both Features Enabled (Default)
```json
{
  "name": "Summer Collection Bundle",
  "description": "<p>Summer beauty essentials...</p>",
  "price": 49.99,
  "items": [
    {
      "defaultProductId": "1",
      "variationProductIds": ["2", "3"]
    }
  ],
  "recommendedProductIds": ["5", "6"],
  "recommendedPackIds": ["2"],
  "hideCommentForm": false,
  "showPurchaseNotifications": true,
  "showCountdownTimer": true
}
```

#### Example 2: Both Features Disabled
```json
{
  "name": "Basic Bundle",
  "description": "<p>Essential items...</p>",
  "price": 29.99,
  "items": [
    {
      "defaultProductId": "1",
      "variationProductIds": ["2"]
    }
  ],
  "recommendedProductIds": [],
  "recommendedPackIds": [],
  "hideCommentForm": false,
  "showPurchaseNotifications": false,
  "showCountdownTimer": false
}
```

#### Example 3: Only Purchase Notifications Enabled
```json
{
  "name": "Premium Bundle",
  "description": "<p>Premium selection...</p>",
  "price": 79.99,
  "items": [
    {
      "defaultProductId": "1",
      "variationProductIds": ["2", "3", "4"]
    }
  ],
  "recommendedProductIds": ["5"],
  "recommendedPackIds": [],
  "hideCommentForm": false,
  "showPurchaseNotifications": true,
  "showCountdownTimer": false
}
```

#### Example 4: Only Countdown Timer Enabled
```json
{
  "name": "Flash Sale Bundle",
  "description": "<p>Limited time offer...</p>",
  "price": 39.99,
  "items": [
    {
      "defaultProductId": "1",
      "variationProductIds": ["2"]
    }
  ],
  "recommendedProductIds": ["5", "6", "7"],
  "recommendedPackIds": ["1", "3"],
  "hideCommentForm": false,
  "showPurchaseNotifications": false,
  "showCountdownTimer": true
}
```

## Backend Processing

### 1. Spring Boot Controller Receives Request
```java
@PostMapping
public ResponseEntity<?> createPack(
    @RequestParam("pack") PackRequestDTO packRequestDTO,
    @RequestParam(value = "image", required = false) MultipartFile image) {
    
    Pack createdPack = packService.createPack(packRequestDTO);
    // ... image handling ...
    return ResponseEntity.ok(new PackResponseDTO(createdPack));
}
```

### 2. PackService.createPack() Processing
```java
public Pack createPack(PackRequestDTO packRequestDTO) {
    Pack pack = new Pack();
    
    // Field mapping
    pack.setName(packRequestDTO.getName());
    pack.setDescription(packRequestDTO.getDescription());
    pack.setPrice(packRequestDTO.getPrice());
    
    // Display Settings - CRITICAL MAPPING
    pack.setShowPurchaseNotifications(packRequestDTO.isShowPurchaseNotifications());
    pack.setShowCountdownTimer(packRequestDTO.isShowCountdownTimer());
    
    // ... other fields ...
    
    return packRepository.save(pack);
}
```

### 3. Database Persistence
```sql
INSERT INTO packs (
    name, 
    description, 
    price, 
    show_purchase_notifications, 
    show_countdown_timer,
    created_date,
    updated_date
) VALUES (
    'Summer Collection Bundle',
    '<p>Summer beauty essentials...</p>',
    49.99,
    true,      -- showPurchaseNotifications
    true,      -- showCountdownTimer
    NOW(),
    NOW()
);
```

### 4. Database Table Schema
```sql
CREATE TABLE packs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    price DECIMAL(10, 2) NOT NULL,
    show_purchase_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    show_countdown_timer BOOLEAN DEFAULT TRUE NOT NULL,
    hide_comment_form BOOLEAN DEFAULT FALSE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_show_purchase_notifications (show_purchase_notifications),
    INDEX idx_show_countdown_timer (show_countdown_timer)
);
```

## API Response

### Successful Creation (Status: 201)
```json
{
  "id": 15,
  "name": "Summer Collection Bundle",
  "description": "<p>Summer beauty essentials...</p>",
  "price": 49.99,
  "items": [
    {
      "defaultProductId": "1",
      "variationProductIds": ["2", "3"]
    }
  ],
  "recommendedProductIds": ["5", "6"],
  "recommendedPackIds": ["2"],
  "hideCommentForm": false,
  "showPurchaseNotifications": true,
  "showCountdownTimer": true,
  "createdDate": "2024-01-15T10:30:00",
  "updatedDate": "2024-01-15T10:30:00"
}
```

### Error Response (Status: 400)
```json
{
  "message": "Validation failed: Price must be greater than 0",
  "status": "BAD_REQUEST",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Frontend Form Submission Code

### AdminPackForm.jsx - handleSubmit Function
```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
        toast.error('Please fix the validation errors before submitting');
        return;
    }

    const formData = new FormData();
    const description = editorRef.current ? editorRef.current.getContent() : packData.description;
    
    // Create JSON blob with all pack data including display settings
    formData.append('pack', new Blob([JSON.stringify({ 
        ...packData,  // INCLUDES showPurchaseNotifications & showCountdownTimer
        description,
        recommendedProductIds: packData.recommendedProductIds,
        recommendedPackIds: packData.recommendedPackIds
    })], { type: 'application/json' }));

    if (image) {
        formData.append('image', image);
    }

    setLoading(true);
    try {
        // POST to /api/packs endpoint
        await createPack(formData);
        localStorage.removeItem('packFormDraft'); // Clear draft on success
        toast.success('Pack created successfully!');
        navigate('/admin/packs');
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create pack. Please check the form fields.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(err);
    } finally {
        setLoading(false);
    }
};
```

## Network Request Example

### HTTP Request
```
POST /api/packs HTTP/1.1
Host: localhost:8080
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="pack"
Content-Type: application/json

{"name":"Summer Bundle","description":"<p>Summer essentials</p>","price":49.99,"items":[{"defaultProductId":"1","variationProductIds":["2","3"]}],"recommendedProductIds":["5","6"],"recommendedPackIds":["2"],"hideCommentForm":false,"showPurchaseNotifications":true,"showCountdownTimer":true}
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="pack-image.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## Customer Display Flow

### 1. API Returns Pack with Flags
```json
{
  "id": 15,
  "name": "Summer Collection Bundle",
  "showPurchaseNotifications": true,
  "showCountdownTimer": true,
  ...
}
```

### 2. PackDetailPage.jsx Conditional Rendering
```jsx
// Render Purchase Notifications only if enabled
{pack?.showPurchaseNotifications && (
  <PurchaseNotifications 
    packName={pack.name}
    packImage={pack.imageUrl}
  />
)}

// Render Countdown Timer only if enabled
{pack?.showCountdownTimer && (
  <EnhancedCountdown 
    deadline={calculateDeadline()}
    onTimeUp={handleFlashSaleEnd}
  />
)}
```

### 3. Customer Sees Only Enabled Features
- If both flags true → Sees both components
- If both flags false → Sees neither component
- If one flag true → Sees only that component
- If one flag false → Doesn't see that component

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  Admin Creates Pack                              │
│                                                                  │
│  AdminPackForm.jsx                                              │
│  ├─ Step 1: Basic Info (name, price, description)             │
│  ├─ Step 2: Pack Items (products to include)                  │
│  ├─ Step 3: Display Settings                                  │
│  │  ├─ 🛍️  Show Purchase Notifications (checkbox)            │
│  │  └─ ⏱️  Show Countdown Timer (checkbox)                    │
│  ├─ Step 4: Recommendations                                   │
│  └─ Step 5: Review & Submit                                   │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│            packData State Object                                 │
│  {                                                               │
│    name: "...",                                                  │
│    description: "...",                                           │
│    price: 0,                                                     │
│    items: [...],                                                │
│    recommendedProductIds: [...],                               │
│    recommendedPackIds: [...],                                  │
│    hideCommentForm: false,                                     │
│    showPurchaseNotifications: true,  ◄── Display Settings      │
│    showCountdownTimer: true          ◄── Display Settings      │
│  }                                                               │
└──────────────┬──────────────────────────────────────────────────┘
               │ handleSubmit()
               ▼
┌──────────────────────────────────────────────────────────────────┐
│         FormData (multipart/form-data)                           │
│  - "pack": JSON blob with all packData including flags          │
│  - "image": Image file (if provided)                            │
└──────────────┬──────────────────────────────────────────────────┘
               │ POST /api/packs
               ▼
┌──────────────────────────────────────────────────────────────────┐
│              Spring Boot Backend                                 │
│  PackController.createPack()                                    │
│  └─ PackService.createPack()                                    │
│     ├─ Maps PackRequestDTO to Pack entity                      │
│     ├─ Sets showPurchaseNotifications                          │
│     ├─ Sets showCountdownTimer                                 │
│     └─ packRepository.save(pack)                                │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│              MySQL Database                                      │
│  packs table                                                     │
│  ├─ id: 15                                                       │
│  ├─ name: "Summer Collection Bundle"                           │
│  ├─ price: 49.99                                               │
│  ├─ show_purchase_notifications: 1 (true)  ◄── Persisted       │
│  └─ show_countdown_timer: 1 (true)        ◄── Persisted       │
└──────────────┬──────────────────────────────────────────────────┘
               │ API returns PackResponseDTO
               ▼
┌──────────────────────────────────────────────────────────────────┐
│              Customer Views Pack                                 │
│  PackDetailPage.jsx                                             │
│  ├─ Fetches pack from API                                       │
│  ├─ Check: showPurchaseNotifications?                          │
│  │  └─ YES → Render PurchaseNotifications component           │
│  └─ Check: showCountdownTimer?                                 │
│     └─ YES → Render EnhancedCountdown component               │
└──────────────────────────────────────────────────────────────────┘
```

## Testing with cURL

### Test Case 1: Create Pack with Both Features Enabled
```bash
curl -X POST http://localhost:8080/api/packs \
  -F "pack=@pack.json" \
  -F "image=@image.jpg"

# Contents of pack.json:
{
  "name": "Summer Bundle",
  "description": "Summer essentials",
  "price": 49.99,
  "items": [{"defaultProductId": "1", "variationProductIds": ["2"]}],
  "recommendedProductIds": ["5"],
  "recommendedPackIds": [],
  "hideCommentForm": false,
  "showPurchaseNotifications": true,
  "showCountdownTimer": true
}
```

### Response
```json
{
  "id": 15,
  "name": "Summer Bundle",
  "price": 49.99,
  "showPurchaseNotifications": true,
  "showCountdownTimer": true,
  "createdDate": "2024-01-15T10:30:00"
}
```

## Summary

The Display Settings feature is fully integrated into the create pack workflow:

1. **Admin Interface**: AdminPackForm.jsx provides checkbox toggles in Display Settings step
2. **State Management**: packData state includes showPurchaseNotifications and showCountdownTimer
3. **API Submission**: Both flags are sent in the POST request to /api/packs
4. **Backend Processing**: PackService properly maps flags from DTO to entity
5. **Database Storage**: Flags persisted in MySQL packs table
6. **Customer Display**: PackDetailPage conditionally renders components based on flags

All components work together seamlessly to provide granular control over feature visibility per pack.

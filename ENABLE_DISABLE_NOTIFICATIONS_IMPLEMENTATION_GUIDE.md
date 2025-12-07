# 🎛️ Enable/Disable Purchase Notifications & Countdown Timer - Implementation Guide

## 📋 Project Analysis Summary

### Current Architecture

**Frontend:**
- `AdminPackEditPage.jsx` - Pack creation/editing form
- `PackDetailPage.jsx` - Customer-facing pack detail page
- `PurchaseNotifications.jsx` - Purchase notification component
- `EnhancedCountdown.jsx` - Countdown timer component

**Backend:**
- `Pack.java` - JPA Entity with existing fields:
  - id, name, description, price, imageUrl
  - items (PackItems list)
  - comments (Comments list)
  - recommendedProducts, recommendedPacks, recommendedCustomPacks
  - hideCommentForm (boolean) ← Similar pattern already implemented
  
- `PackRequestDTO.java` - DTO for API requests
- `PackResponseDTO.java` - DTO for API responses
- `PackService.java` - Business logic

**Database:**
- `packs` table - Core pack storage
- Schema migration system using Flyway

---

## 🎯 Implementation Strategy

### Step 1: Database Schema Changes

**Add two boolean columns to `packs` table:**

```sql
ALTER TABLE packs ADD COLUMN show_purchase_notifications BOOLEAN DEFAULT TRUE;
ALTER TABLE packs ADD COLUMN show_countdown_timer BOOLEAN DEFAULT TRUE;
```

**Migration File:** `V9__add_notification_toggle_columns.sql`

---

### Step 2: Backend Model Changes

**File:** `demo/src/main/java/com/example/demo/model/Pack.java`

Add two fields after `hideCommentForm`:

```java
@Column(name = "show_purchase_notifications", nullable = false)
private boolean showPurchaseNotifications = true;

@Column(name = "show_countdown_timer", nullable = false)
private boolean showCountdownTimer = true;
```

---

### Step 3: DTO Updates

**File:** `demo/src/main/java/com/example/demo/dto/PackRequestDTO.java`

Add to existing DTO:

```java
private boolean showPurchaseNotifications = true;
private boolean showCountdownTimer = true;
```

**File:** `demo/src/main/java/com/example/demo/dto/PackResponseDTO.java`

Add same fields for response mapping.

---

### Step 4: Frontend Admin Form

**File:** `frontend/src/pages/admin/AdminPackEditPage.jsx`

**Location:** After Step 2 (Pack Items), before Step 3 (Description)

Add new step: "Step 3: Display Settings"

```jsx
{/* Step 3: Display Settings */}
<div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
        <FiEye className="w-5 h-5 text-pink-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Display Settings</h3>
    </div>
    
    <div className="space-y-4">
        {/* Purchase Notifications Toggle */}
        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition">
            <input
                type="checkbox"
                checked={packData.showPurchaseNotifications}
                onChange={(e) => {
                    setPackData({...packData, showPurchaseNotifications: e.target.checked});
                    setIsDirty(true);
                }}
                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <span className="ml-3">
                <span className="block font-semibold text-gray-800">🛍️ Show Purchase Notifications</span>
                <span className="text-sm text-gray-600">Display notifications when customers buy this pack</span>
            </span>
        </label>

        {/* Countdown Timer Toggle */}
        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition">
            <input
                type="checkbox"
                checked={packData.showCountdownTimer}
                onChange={(e) => {
                    setPackData({...packData, showCountdownTimer: e.target.checked});
                    setIsDirty(true);
                }}
                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <span className="ml-3">
                <span className="block font-semibold text-gray-800">⏱️ Show Countdown Timer</span>
                <span className="text-sm text-gray-600">Display flash sale countdown timer for urgency</span>
            </span>
        </label>
    </div>
</div>
```

---

### Step 5: Frontend Pack Detail Page

**File:** `frontend/src/pages/PackDetailPage.jsx`

Update both component calls to use the pack flags:

**Purchase Notifications:**
```jsx
{pack?.showPurchaseNotifications && (
    <PurchaseNotifications 
        packName={pack?.name} 
        productImage={pack?.images && pack.images.length > 0 ? pack.images[0] : null}
    />
)}
```

**Countdown Timer:**
```jsx
{pack?.showCountdownTimer && (
    <EnhancedCountdown 
        packName={pack.name}
        fallbackEndTime={new Date().getTime() + (24 * 60 * 60 * 1000)}
        onExpire={() => {
            toast.info('🕐 انتهت فترة العرض الخاص / Special offer period ended');
        }}
    />
)}
```

---

## 📊 Implementation Checklist

### Phase 1: Database (1 migration file)
- [ ] Create `V9__add_notification_toggle_columns.sql`
- [ ] Add `show_purchase_notifications` column (default TRUE)
- [ ] Add `show_countdown_timer` column (default TRUE)

### Phase 2: Backend Model (2 files)
- [ ] Update `Pack.java` with two new boolean fields
- [ ] Update `PackRequestDTO.java` with two new fields
- [ ] Update `PackResponseDTO.java` with two new fields

### Phase 3: Frontend Admin (1 file)
- [ ] Update `AdminPackEditPage.jsx`
- [ ] Add new "Display Settings" step
- [ ] Add two toggle checkboxes
- [ ] Update packData state management
- [ ] Renumber remaining steps (Description → Step 4, etc.)

### Phase 4: Frontend Customer (1 file)
- [ ] Update `PackDetailPage.jsx`
- [ ] Wrap PurchaseNotifications with conditional
- [ ] Wrap EnhancedCountdown with conditional

---

## 🔄 Data Flow

```
Admin Creates/Edits Pack
    ↓
AdminPackEditPage Form (new Display Settings)
    ↓
POST/PUT /api/packs (includes flags)
    ↓
PackService saves to Database
    ↓
Customer views pack at PackDetailPage
    ↓
Pack API returns with showPurchaseNotifications & showCountdownTimer flags
    ↓
Frontend conditionally renders components based on flags
```

---

## 💾 Default Behavior

- **New Packs:** Both features enabled by default (TRUE)
- **Existing Packs:** Both features enabled by default (TRUE) via migration
- **Admin Control:** Can toggle on/off per pack
- **Backward Compatibility:** No breaking changes to existing API

---

## 🎨 UI/UX Considerations

1. **Admin Interface:**
   - New section after Pack Items in form
   - Visual toggles with emoji icons
   - Clear descriptions of each feature
   - Matches existing design patterns (hideCommentForm)

2. **Default State:**
   - Both enabled for new packs (marketing benefit)
   - Easy to disable if not desired
   - One-click toggle in admin panel

3. **Customer View:**
   - No UI changes - components appear/disappear based on backend flags
   - Seamless experience

---

## 🚀 Benefits

✅ **Admin Control:** Per-pack granular control  
✅ **Marketing:** Enable/disable urgency tactics by pack  
✅ **Flexibility:** Different strategies for different packs  
✅ **No Code Changes Required:** Just toggle in admin UI  
✅ **Backward Compatible:** Works with existing packs  
✅ **Minimal Impact:** Only 2 DB columns + 4 boolean flags in code  

---

## 📝 API Response Example

```json
{
  "id": 1,
  "name": "Pack beauty",
  "description": "...",
  "price": 133.00,
  "imageUrl": "...",
  "hideCommentForm": false,
  "showPurchaseNotifications": true,
  "showCountdownTimer": true,
  "items": [...],
  "comments": [...]
}
```

---

## 🔧 Alternative Approach (if needed)

If you want global settings instead of per-pack:
- Create `NotificationSettings` table
- Admin panel to control for all packs
- Frontend checks global setting + pack-level override
- More centralized but less flexible

**Current Proposed Approach:** Per-pack is better for this use case.

---

## 📚 Files to Modify

| File | Type | Changes |
|------|------|---------|
| V9__add_notification_toggle_columns.sql | DB Migration | New (add 2 columns) |
| Pack.java | Backend Model | Add 2 fields |
| PackRequestDTO.java | Backend DTO | Add 2 fields |
| PackResponseDTO.java | Backend DTO | Add 2 fields |
| AdminPackEditPage.jsx | Frontend Form | Add new step with toggles |
| PackDetailPage.jsx | Frontend View | Wrap components with conditionals |

**Total Changes:** 6 files  
**Complexity:** Low-Medium  
**Estimated Time:** 30-45 minutes

---

## ✨ Ready to Implement?

Would you like me to implement all these changes now?

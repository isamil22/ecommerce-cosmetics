# 🧪 Manual Testing Guide for Pack Pages

## Prerequisites

1. **Start Backend Server (Port 8080):**
   ```bash
   cd demo
   mvn spring-boot:run
   ```
   Wait for: `Started DemoApplication in X.XXX seconds`

2. **Start Frontend Server (Port 5173):**
   ```bash
   cd frontend
   npm run dev
   ```
   Wait for: `Local: http://localhost:5173/`

## 📋 Test Checklist

### ✅ Create Pack Page Tests

#### 1. Page Loading Test
- [ ] Navigate to: `http://localhost:5173/admin/packs/new`
- [ ] Page loads without errors
- [ ] Progress steps are visible
- [ ] Header shows "Create New Pack"

#### 2. Basic Information Section
- [ ] Pack Name input field works
- [ ] Price input field works (with $ symbol)
- [ ] Image upload area is visible
- [ ] Hide Comment Form toggle works
- [ ] Form validation works (try submitting empty form)

#### 3. Image Upload Test
- [ ] Click to upload works
- [ ] Drag & drop works
- [ ] Image preview shows after upload
- [ ] Change/Remove buttons work
- [ ] File validation works (try non-image file)

#### 4. Description Section
- [ ] TinyMCE editor loads
- [ ] Rich text formatting works
- [ ] Content saves properly

#### 5. Pack Items Section
- [ ] Enhanced product selectors show images
- [ ] Search functionality works in dropdowns
- [ ] Add Item button works
- [ ] Remove Item button works (when multiple items)
- [ ] Default product selection required
- [ ] Variation products selection works

#### 6. Recommendations Section
- [ ] Product recommendations section visible
- [ ] Pack recommendations section visible
- [ ] Checkboxes work for selection
- [ ] Selection counts update in real-time
- [ ] Selection summary shows selected items

#### 7. Form Submission
- [ ] Submit button works
- [ ] Loading state shows during submission
- [ ] Success message appears
- [ ] Redirects to packs list after success

### ✅ Edit Pack Page Tests

#### 1. Access Test
- [ ] Go to: `http://localhost:5173/admin/packs`
- [ ] Click "Edit" on any existing pack
- [ ] Edit page loads with pack ID in URL

#### 2. Data Loading Test
- [ ] Form pre-populates with existing pack data
- [ ] Pack name shows correctly
- [ ] Price shows correctly
- [ ] Description shows correctly
- [ ] Existing image displays
- [ ] Pack items show correctly
- [ ] Existing recommendations show correctly

#### 3. Update Functionality
- [ ] Can modify pack name
- [ ] Can modify price
- [ ] Can modify description
- [ ] Can add/remove pack items
- [ ] Can update recommendations
- [ ] Can change image
- [ ] Unsaved changes indicator shows

#### 4. Form Submission
- [ ] Update button works
- [ ] Loading state shows
- [ ] Success message appears
- [ ] Redirects to packs list after success

### ✅ Design & UI Tests

#### 1. Visual Consistency
- [ ] Both pages have same design
- [ ] Progress steps match
- [ ] Color scheme consistent (pink/purple gradient)
- [ ] Icons and styling match
- [ ] Card layouts match

#### 2. Responsive Design
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1024px+)
- [ ] Grid layouts adapt properly
- [ ] Form elements remain usable

#### 3. User Experience
- [ ] Smooth transitions and animations
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Success feedback is clear
- [ ] Navigation is intuitive

### ✅ Error Handling Tests

#### 1. Network Errors
- [ ] Test with backend server stopped
- [ ] Test with slow network connection
- [ ] Error messages are user-friendly

#### 2. Validation Errors
- [ ] Empty form submission
- [ ] Invalid price values
- [ ] Missing required fields
- [ ] File upload errors

#### 3. Edge Cases
- [ ] Very long pack names
- [ ] Very high prices
- [ ] Large image files
- [ ] Special characters in input

## 🔍 Code Quality Checks

### 1. Console Errors
- [ ] No JavaScript errors in browser console
- [ ] No React warnings
- [ ] No network errors (when servers running)

### 2. Performance
- [ ] Pages load quickly
- [ ] Image uploads don't freeze UI
- [ ] Large product lists don't cause lag

### 3. Accessibility
- [ ] Form labels are properly associated
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (if applicable)

## 🚨 Common Issues & Solutions

### Issue: Page doesn't load
**Solution:** Check if both servers are running on correct ports

### Issue: API calls fail
**Solution:** Verify backend is running on port 8080

### Issue: Images don't upload
**Solution:** Check file size limits and format validation

### Issue: Recommendations don't save
**Solution:** Verify API endpoint supports recommendations

### Issue: Form validation errors
**Solution:** Check required fields and data types

## 📊 Expected Results

After completing all tests, you should see:

1. **Create Pack Page:**
   - ✅ Modern, multi-step interface
   - ✅ Enhanced product selection with images
   - ✅ Recommendations system working
   - ✅ Image upload with drag & drop
   - ✅ Form validation and error handling

2. **Edit Pack Page:**
   - ✅ Identical design to create page
   - ✅ Pre-populated form data
   - ✅ All create page features available
   - ✅ Update functionality working
   - ✅ Image update capability

3. **Both Pages:**
   - ✅ Responsive design
   - ✅ Consistent styling
   - ✅ Smooth user experience
   - ✅ Proper error handling
   - ✅ Success feedback

## 🎯 Success Criteria

The test is considered successful if:
- [ ] Both pages load without errors
- [ ] All form elements work correctly
- [ ] API integration works properly
- [ ] Design consistency is maintained
- [ ] All features from create page are available in edit page
- [ ] Responsive design works on all screen sizes
- [ ] Error handling is robust
- [ ] User experience is smooth and intuitive

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Create Pack Page:
- Page Loading: ✅/❌
- Basic Info: ✅/❌
- Image Upload: ✅/❌
- Description: ✅/❌
- Pack Items: ✅/❌
- Recommendations: ✅/❌
- Form Submission: ✅/❌

Edit Pack Page:
- Page Loading: ✅/❌
- Data Loading: ✅/❌
- Form Pre-population: ✅/❌
- Update Functionality: ✅/❌
- Recommendations Edit: ✅/❌
- Image Update: ✅/❌
- Form Submission: ✅/❌

Design & UI:
- Visual Consistency: ✅/❌
- Responsive Design: ✅/❌
- User Experience: ✅/❌

Error Handling:
- Network Errors: ✅/❌
- Validation Errors: ✅/❌
- Edge Cases: ✅/❌

Overall Result: ✅ PASS / ❌ FAIL
Notes: _________________________________
```

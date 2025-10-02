# 🧪 **Visitor Counter System - Complete Testing Guide**

## 🎯 **Testing Strategy Overview**

Since the backend requires authentication, we'll perform comprehensive testing through the frontend interface and manual verification.

---

## 🔧 **Prerequisites**

### **1. Start All Services**
```bash
docker-compose up -d
```

### **2. Verify Services Are Running**
```bash
docker-compose ps
```
Expected output: All 4 services should be "Up"

### **3. Check Service Health**
- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:8082 (should show Spring Boot banner)
- **Database**: http://localhost:8083 (PhpMyAdmin)
- **Database Direct**: localhost:3307

---

## 🧪 **Test Suite 1: Backend API Testing**

### **Test 1.1: Basic Connectivity**
```bash
# Test if backend is responding
curl http://localhost:8082/api/hello
# Expected: 403 Forbidden (security enabled)
```

### **Test 1.2: Visitor Counter API**
```bash
# Test visitor counter endpoint
curl http://localhost:8082/api/visitor-counter-settings
# Expected: 403 Forbidden (authentication required)
```

### **Test 1.3: Authentication Test**
1. Login as admin through frontend
2. Check browser Network tab for API calls
3. Verify JWT token is being sent

---

## 🧪 **Test Suite 2: Frontend UI Testing**

### **Test 2.1: Admin Settings Page Access**
1. **Navigate to**: http://localhost:8081/admin
2. **Login** as admin user
3. **Go to**: Admin sidebar → "Visitor Counter"
4. **Expected**: Settings page loads with current configuration

### **Test 2.2: Settings Page UI Elements**
**Check for presence of:**
- ✅ Page title: "Manage Visitor Counter"
- ✅ Toggle switch for enable/disable
- ✅ Minimum visitors input field
- ✅ Maximum visitors input field
- ✅ Live preview section
- ✅ Save Changes button
- ✅ Help section with instructions

### **Test 2.3: Toggle Switch Functionality**
1. **Initial State**: Note current toggle position
2. **Click Toggle**: Switch between enabled/disabled
3. **Expected**: 
   - Toggle animates smoothly
   - Input fields appear/disappear
   - Live preview updates
   - "You have unsaved changes" indicator appears

### **Test 2.4: Input Field Validation**
**Test Minimum Field:**
1. Enter negative number: `-5`
2. Expected: Validation error or prevents input
3. Enter zero: `0`
4. Expected: Validation error
5. Enter decimal: `10.5`
6. Expected: Should accept or round to integer
7. Enter valid number: `15`
8. Expected: Accepts input

**Test Maximum Field:**
1. Enter number less than minimum: `5` (when min is 10)
2. Expected: Validation error or auto-adjustment
3. Enter valid number: `50`
4. Expected: Accepts input

### **Test 2.5: Live Preview Functionality**
1. **Enable counter**: Toggle ON
2. **Set range**: Min=10, Max=30
3. **Check preview**: Should show number between 10-30
4. **Change range**: Min=5, Max=15
5. **Check preview**: Should update to new range
6. **Expected**: Preview updates in real-time

### **Test 2.6: Save Functionality**
1. **Make changes**: Enable counter, set new range
2. **Click Save**: "Save Changes" button
3. **Expected**:
   - Button shows loading state
   - Success toast message appears
   - "You have unsaved changes" indicator disappears
   - Settings persist on page refresh

### **Test 2.7: Reset Functionality**
1. **Make changes**: Modify settings
2. **Click Reset**: "Reset" button (if visible)
3. **Expected**: Settings revert to original values

---

## 🧪 **Test Suite 3: Admin Dashboard Integration**

### **Test 3.1: Dashboard Status Card**
1. **Navigate to**: http://localhost:8081/admin/dashboard
2. **Look for**: "Visitor Counter" card in secondary metrics
3. **Check elements**:
   - ✅ Status indicator (green/red dot)
   - ✅ "Active" or "Disabled" text
   - ✅ Range display (when enabled)
   - ✅ "Configure Settings" link

### **Test 3.2: Status Card Accuracy**
1. **Enable counter** in settings page
2. **Return to dashboard**
3. **Expected**: Status card shows "Active" with green dot
4. **Disable counter** in settings page
5. **Return to dashboard**
6. **Expected**: Status card shows "Disabled" with red dot

### **Test 3.3: Quick Access Link**
1. **Click**: "Configure Settings" link in dashboard card
2. **Expected**: Navigates to visitor counter settings page

---

## 🧪 **Test Suite 4: Customer-Facing Counter**

### **Test 4.1: Product Page Display**
1. **Enable counter** in admin settings
2. **Navigate to**: http://localhost:8081/products
3. **Click on any product**
4. **Look for**: Visitor counter display
5. **Expected**: Shows "👥 X people viewing this product now"

### **Test 4.2: Counter Animation**
1. **Watch counter** for 10-15 seconds
2. **Expected**:
   - Number changes every 2-5 seconds
   - Smooth fade transition
   - Numbers stay within configured range
   - Animation is not jarring

### **Test 4.3: Range Validation**
1. **Set range**: Min=5, Max=15 in admin
2. **Save settings**
3. **Check product page**
4. **Expected**: All displayed numbers are between 5-15

### **Test 4.4: Disabled State**
1. **Disable counter** in admin settings
2. **Save settings**
3. **Check product page**
4. **Expected**: Counter disappears completely

### **Test 4.5: Pack Page Display**
1. **Enable counter** in admin settings
2. **Navigate to**: http://localhost:8081/packs
3. **Click on any pack**
4. **Expected**: Counter appears on pack detail page

---

## 🧪 **Test Suite 5: Database Integration**

### **Test 5.1: Settings Persistence**
1. **Set custom values**: Min=25, Max=75
2. **Save settings**
3. **Refresh page**
4. **Expected**: Values persist and are displayed correctly

### **Test 5.2: Database Direct Check**
1. **Open**: http://localhost:8083 (PhpMyAdmin)
2. **Login**: user/password
3. **Navigate to**: `sms` database → `visitor_count_setting` table
4. **Expected**: 
   - One record with id=1
   - Current settings values match frontend
   - Data types are correct (boolean, int, int)

---

## 🧪 **Test Suite 6: Edge Cases & Error Handling**

### **Test 6.1: Network Interruption**
1. **Disconnect internet**
2. **Try to save settings**
3. **Expected**: Error message appears
4. **Reconnect internet**
5. **Retry save**
6. **Expected**: Works normally

### **Test 6.2: Invalid Input Handling**
1. **Enter very large numbers**: 999999999
2. **Try to save**
3. **Expected**: Validation error or reasonable limit

### **Test 6.3: Concurrent Users**
1. **Open admin settings** in two browser tabs
2. **Modify settings** in both tabs
3. **Save in both tabs**
4. **Expected**: Last save wins, no conflicts

### **Test 6.4: Page Refresh During Save**
1. **Start saving** settings
2. **Refresh page** immediately
3. **Expected**: Save completes or shows error

---

## 🧪 **Test Suite 7: Performance Testing**

### **Test 7.1: Page Load Performance**
1. **Measure load time** of settings page
2. **Expected**: Loads within 2-3 seconds

### **Test 7.2: Counter Update Performance**
1. **Monitor CPU usage** while counter is running
2. **Expected**: Low CPU usage, smooth animations

### **Test 7.3: Multiple Product Pages**
1. **Open 5+ product pages** simultaneously
2. **Expected**: All counters work independently
3. **Expected**: No performance degradation

---

## 🧪 **Test Suite 8: Browser Compatibility**

### **Test 8.1: Chrome**
- Run all tests in Chrome
- Check console for errors

### **Test 8.2: Firefox**
- Run all tests in Firefox
- Check console for errors

### **Test 8.3: Safari/Edge**
- Run all tests in Safari/Edge
- Check console for errors

### **Test 8.4: Mobile Browser**
- Test on mobile device
- Check responsive design
- Verify touch interactions work

---

## 🧪 **Test Suite 9: Security Testing**

### **Test 9.1: Admin Authentication**
1. **Try to access** settings page without login
2. **Expected**: Redirected to login page

### **Test 9.2: Non-Admin User**
1. **Login as regular user**
2. **Try to access** admin settings
3. **Expected**: Access denied or redirected

### **Test 9.3: Direct API Access**
1. **Try to access** API without authentication
2. **Expected**: 403 Forbidden

---

## 📊 **Test Results Documentation**

### **Test Results Template**
```
Test Suite: [Name]
Date: [Date]
Tester: [Name]
Browser: [Browser Version]
Results:
- Test 1: ✅ PASS / ❌ FAIL - [Notes]
- Test 2: ✅ PASS / ❌ FAIL - [Notes]
- Test 3: ✅ PASS / ❌ FAIL - [Notes]

Issues Found:
1. [Issue description]
2. [Issue description]

Overall Status: ✅ PASS / ❌ FAIL
```

### **Critical Issues to Report**
- Settings not saving
- Counter not appearing on product pages
- Invalid numbers being accepted
- Performance problems
- Security vulnerabilities
- Data loss

---

## 🎯 **Success Criteria**

### **Must Pass (Critical)**
- ✅ Settings page loads and functions
- ✅ Toggle switch works correctly
- ✅ Input validation prevents invalid data
- ✅ Save functionality persists data
- ✅ Counter appears on product pages when enabled
- ✅ Counter disappears when disabled
- ✅ Numbers stay within configured range
- ✅ Admin authentication is required

### **Should Pass (Important)**
- ✅ Live preview updates in real-time
- ✅ Dashboard integration shows correct status
- ✅ Smooth animations and transitions
- ✅ Error handling for network issues
- ✅ Responsive design on mobile

### **Nice to Have (Optional)**
- ✅ Performance is optimal
- ✅ Works across all browsers
- ✅ Advanced error recovery

---

## 🚀 **Quick Test Checklist**

### **5-Minute Smoke Test**
- [ ] Services are running (docker-compose ps)
- [ ] Frontend loads (http://localhost:8081)
- [ ] Admin login works
- [ ] Settings page loads
- [ ] Toggle switch works
- [ ] Save button works
- [ ] Product page shows counter (when enabled)

### **15-Minute Full Test**
- [ ] All smoke test items
- [ ] Input validation works
- [ ] Live preview updates
- [ ] Dashboard integration works
- [ ] Counter animates properly
- [ ] Settings persist on refresh
- [ ] Disabled state works

### **30-Minute Comprehensive Test**
- [ ] All previous tests
- [ ] Edge case testing
- [ ] Error handling
- [ ] Performance testing
- [ ] Browser compatibility
- [ ] Security testing

---

## 🔧 **Troubleshooting Common Issues**

### **Issue: Settings Page Won't Load**
- Check if backend is running
- Check browser console for errors
- Verify admin authentication

### **Issue: Counter Not Appearing**
- Verify counter is enabled in settings
- Check if settings were saved
- Refresh product page
- Check browser console for errors

### **Issue: Numbers Outside Range**
- Check database values directly
- Verify frontend is fetching latest settings
- Clear browser cache

### **Issue: Save Button Not Working**
- Check network connectivity
- Verify admin permissions
- Check backend logs
- Try refreshing page

---

## 📞 **Support Information**

If issues are found:
1. **Document** the exact steps to reproduce
2. **Capture** screenshots or videos
3. **Check** browser console for errors
4. **Check** backend logs: `docker-compose logs backend`
5. **Report** with detailed information

---

**🎉 Happy Testing! This comprehensive guide ensures your visitor counter system works perfectly.**

# ✅ **Visitor Counter Manual Testing Checklist**

## 🎯 **Quick 5-Minute Test**

### **Step 1: Verify Services**
- [ ] Open terminal and run: `docker-compose ps`
- [ ] All 4 services should show "Up" status
- [ ] If not running: `docker-compose up -d`

### **Step 2: Test Frontend Access**
- [ ] Open browser and go to: http://localhost:8081
- [ ] Frontend loads without errors
- [ ] You can see the homepage

### **Step 3: Test Admin Login**
- [ ] Go to: http://localhost:8081/auth
- [ ] Login with admin credentials
- [ ] You should be redirected to admin dashboard

### **Step 4: Access Visitor Counter Settings**
- [ ] In admin sidebar, click "Visitor Counter"
- [ ] Settings page loads: "Manage Visitor Counter"
- [ ] You can see the toggle switch and input fields

### **Step 5: Test Basic Functionality**
- [ ] Toggle the switch ON/OFF
- [ ] Input fields appear/disappear with toggle
- [ ] Enter values: Min=10, Max=30
- [ ] Click "Save Changes"
- [ ] See success message

### **Step 6: Test Product Page**
- [ ] Go to: http://localhost:8081/products
- [ ] Click on any product
- [ ] Look for visitor counter display
- [ ] Counter should show numbers between 10-30

---

## 🧪 **Detailed 15-Minute Test**

### **Test 1: Settings Page UI**
- [ ] Page title shows "Manage Visitor Counter"
- [ ] Toggle switch is present and works
- [ ] Minimum visitors input field exists
- [ ] Maximum visitors input field exists
- [ ] Save Changes button is present
- [ ] Live preview section appears when enabled
- [ ] Help section is visible

### **Test 2: Toggle Functionality**
- [ ] Toggle starts in current state (ON/OFF)
- [ ] Clicking toggle changes state smoothly
- [ ] When ON: Input fields are visible
- [ ] When OFF: Input fields are hidden
- [ ] "You have unsaved changes" indicator appears when modified

### **Test 3: Input Validation**
- [ ] Try entering negative number in min field: `-5`
- [ ] Try entering negative number in max field: `-10`
- [ ] Try entering zero: `0`
- [ ] Try entering decimal: `10.5`
- [ ] Try entering text: `abc`
- [ ] Try entering very large number: `999999999`
- [ ] Validation should prevent or warn about invalid values

### **Test 4: Live Preview**
- [ ] Enable counter (toggle ON)
- [ ] Set min=5, max=15
- [ ] Preview should show number between 5-15
- [ ] Change to min=20, max=40
- [ ] Preview should update to new range
- [ ] Preview updates in real-time as you type

### **Test 5: Save Functionality**
- [ ] Make changes to settings
- [ ] Click "Save Changes" button
- [ ] Button shows loading state (spinning icon)
- [ ] Success message appears
- [ ] "You have unsaved changes" indicator disappears
- [ ] Settings persist when you refresh the page

### **Test 6: Dashboard Integration**
- [ ] Go to admin dashboard: http://localhost:8081/admin/dashboard
- [ ] Look for "Visitor Counter" card in secondary metrics
- [ ] Status shows "Active" or "Disabled" correctly
- [ ] Range is displayed when enabled
- [ ] "Configure Settings" link works

### **Test 7: Product Page Counter**
- [ ] Go to products page: http://localhost:8081/products
- [ ] Click on any product
- [ ] Look for visitor counter display
- [ ] Counter shows format: "👥 X people viewing this product now"
- [ ] Number changes every few seconds
- [ ] Numbers stay within your configured range
- [ ] Animation is smooth (fade in/out)

### **Test 8: Disabled State**
- [ ] Go back to visitor counter settings
- [ ] Disable counter (toggle OFF)
- [ ] Save changes
- [ ] Go back to product page
- [ ] Counter should disappear completely

---

## 🔍 **Advanced 30-Minute Test**

### **Test 9: Range Validation**
- [ ] Set min=1, max=5
- [ ] Save and check product page
- [ ] All numbers should be between 1-5
- [ ] Set min=50, max=100
- [ ] Save and check product page
- [ ] All numbers should be between 50-100

### **Test 10: Pack Page Testing**
- [ ] Enable counter in settings
- [ ] Go to packs page: http://localhost:8081/packs
- [ ] Click on any pack
- [ ] Counter should appear on pack detail page
- [ ] Counter should work the same as product pages

### **Test 11: Multiple Browser Tabs**
- [ ] Open admin settings in two browser tabs
- [ ] Modify settings in first tab
- [ ] Save in first tab
- [ ] Refresh second tab
- [ ] Second tab should show updated settings

### **Test 12: Error Handling**
- [ ] Disconnect internet
- [ ] Try to save settings
- [ ] Should show error message
- [ ] Reconnect internet
- [ ] Retry save
- [ ] Should work normally

### **Test 13: Performance Test**
- [ ] Open 5 product pages simultaneously
- [ ] All counters should work independently
- [ ] No performance degradation
- [ ] Animations remain smooth

### **Test 14: Browser Compatibility**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari/Edge
- [ ] All features should work the same

### **Test 15: Mobile Testing**
- [ ] Test on mobile device or mobile browser mode
- [ ] Settings page should be responsive
- [ ] Toggle switch should work with touch
- [ ] Input fields should be easy to use
- [ ] Counter should display properly

---

## 🚨 **Critical Issues to Watch For**

### **Must Work (Show Stoppers)**
- [ ] Settings page loads without errors
- [ ] Toggle switch changes state
- [ ] Save button works and shows success
- [ ] Counter appears on product pages when enabled
- [ ] Counter disappears when disabled
- [ ] Numbers stay within configured range

### **Should Work (Important)**
- [ ] Live preview updates correctly
- [ ] Dashboard shows correct status
- [ ] Input validation prevents invalid data
- [ ] Smooth animations and transitions
- [ ] Settings persist after page refresh

### **Nice to Have (Optional)**
- [ ] Performance is fast
- [ ] Works on all browsers
- [ ] Mobile responsive
- [ ] Advanced error messages

---

## 📊 **Test Results Template**

```
Date: _______________
Tester: _____________
Browser: ____________
Version: ____________

✅ PASSED TESTS:
- [ ] Settings page loads
- [ ] Toggle switch works
- [ ] Save functionality works
- [ ] Counter appears on product pages
- [ ] Counter disappears when disabled
- [ ] Numbers stay in range

❌ FAILED TESTS:
- [ ] [Describe any failures]

⚠️ WARNINGS:
- [ ] [Describe any warnings]

📝 NOTES:
[Any additional observations]

🎯 OVERALL STATUS: ✅ PASS / ❌ FAIL
```

---

## 🔧 **Troubleshooting Quick Fixes**

### **If Settings Page Won't Load:**
1. Check if backend is running: `docker-compose ps`
2. Check browser console for errors (F12)
3. Try refreshing the page
4. Check if you're logged in as admin

### **If Counter Doesn't Appear:**
1. Verify counter is enabled in settings
2. Check if settings were saved (refresh settings page)
3. Clear browser cache
4. Check browser console for errors

### **If Save Button Doesn't Work:**
1. Check network connection
2. Verify you're logged in as admin
3. Check browser console for errors
4. Try refreshing the page

### **If Numbers Are Outside Range:**
1. Check database directly via PhpMyAdmin
2. Verify frontend is fetching latest settings
3. Clear browser cache
4. Restart backend service

---

## 🎉 **Success Criteria**

**Your visitor counter system is working correctly if:**

✅ **Admin can configure settings through beautiful interface**
✅ **Settings save and persist correctly**
✅ **Counter appears on product pages when enabled**
✅ **Counter disappears when disabled**
✅ **Numbers stay within configured range**
✅ **Dashboard shows correct status**
✅ **All animations and transitions are smooth**
✅ **System handles errors gracefully**

**🎯 If all these criteria are met, your visitor counter system is working perfectly!**

# 🧪 Manual Testing Guide for Permission System

## Prerequisites
- Admin panel access
- At least one test user account
- Browser developer tools access

## Test 1: Create New Role with Custom Permissions

### Step 1.1: Create "Marketing Specialist" Role
1. **Navigate to Role Management**
   - Go to `/admin/roles`
   - Click "Create New Role"

2. **Fill Role Details**
   - **Name:** Marketing Specialist
   - **Description:** Manages marketing campaigns and content

3. **Select Permissions**
   - ✅ COUPON:CREATE
   - ✅ COUPON:EDIT
   - ✅ COUPON:VIEW
   - ✅ COUPON:ANALYTICS
   - ✅ ANNOUNCEMENT:EDIT
   - ✅ HERO:EDIT
   - ✅ PRODUCT:VIEW

4. **Save Role**
   - Click "Create Role"
   - Verify role appears in the list

### Step 1.2: Test API Endpoints
1. **Assign Role to Test User**
   - Go to User Management
   - Assign "Marketing Specialist" role to a test user

2. **Login as Test User**
   - Logout from admin
   - Login with test user credentials

3. **Test API Calls (Open Browser DevTools)**
   ```javascript
   // Test coupon creation (should work)
   fetch('/api/coupons', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('token'),
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       code: 'TEST20',
       discount: 20,
       type: 'PERCENTAGE'
     })
   }).then(r => console.log('Coupon Create:', r.status));

   // Test order access (should fail - 403)
   fetch('/api/orders', {
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   }).then(r => console.log('Orders Access:', r.status));
   ```

4. **Expected Results**
   - ✅ Coupon creation: 201 Created
   - ❌ Orders access: 403 Forbidden
   - ✅ Product view: 200 OK

## Test 2: Add Permissions to Existing Role Instantly

### Step 2.1: Modify "Manage Product" Role
1. **Edit Existing Role**
   - Go to `/admin/roles`
   - Find "Manage Product" role
   - Click Edit (pencil icon)

2. **Add New Permissions**
   - ✅ ORDER:VIEW
   - ✅ ORDER:EXPORT
   - ✅ USER:VIEW

3. **Save Changes**
   - Click "Update Role"
   - Verify permissions are added

### Step 2.2: Test Immediate Effect
1. **Login as "Manage Product" User**
   - Use a user with "Manage Product" role

2. **Test New Permissions**
   ```javascript
   // Test order access (should now work)
   fetch('/api/orders', {
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   }).then(r => console.log('Orders Access After Update:', r.status));

   // Test user access (should now work)
   fetch('/api/users', {
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('token')
     }
   }).then(r => console.log('Users Access After Update:', r.status));
   ```

3. **Expected Results**
   - ✅ Orders access: 200 OK (was 403 before)
   - ✅ Users access: 200 OK (was 403 before)
   - ✅ No server restart needed

## Test 3: Mix and Match Permissions Across Roles

### Step 3.1: Create Multiple Specialized Roles
1. **Create "Content Editor" Role**
   - PRODUCT:VIEW, PRODUCT:EDIT
   - CATEGORY:VIEW, CATEGORY:EDIT
   - HERO:EDIT
   - ANNOUNCEMENT:EDIT
   - REVIEW:VIEW, REVIEW:EDIT

2. **Create "Analytics Specialist" Role**
   - ORDER:VIEW, ORDER:EXPORT
   - COUPON:VIEW, COUPON:ANALYTICS
   - USER:VIEW
   - REVIEW:VIEW
   - PRODUCT:VIEW

### Step 3.2: Assign Multiple Roles to One User
1. **Go to User Management**
   - Find a test user
   - Click "Edit Roles"

2. **Assign Multiple Roles**
   - ✅ Content Editor
   - ✅ Analytics Specialist

3. **Save Changes**

### Step 3.3: Test Combined Permissions
1. **Login as User with Multiple Roles**
2. **Test Endpoints from Both Roles**
   ```javascript
   // Content Editor permissions
   fetch('/api/products', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
   }).then(r => console.log('Products:', r.status));

   // Analytics Specialist permissions  
   fetch('/api/orders', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
   }).then(r => console.log('Orders:', r.status));

   fetch('/api/coupons/usage-statistics', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
   }).then(r => console.log('Coupon Analytics:', r.status));
   ```

3. **Expected Results**
   - ✅ All endpoints should return 200 OK
   - ✅ User has combined permissions from both roles

## Test 4: Verify Backend Authorization

### Step 4.1: Monitor Backend Logs
1. **Open Terminal**
   ```bash
   docker-compose logs backend --tail=50 -f
   ```

2. **Make API Calls**
   - Try accessing unauthorized endpoints
   - Look for "Access Denied" messages in logs

3. **Expected Log Messages**
   - `AuthorizationDeniedException: Access Denied`
   - `403 Forbidden` responses
   - No 500 errors from authorization

### Step 4.2: Test Each Controller
1. **ProductController**
   - Test with/without PRODUCT:CREATE
   - Should get 403 without permission

2. **OrderController**
   - Test with/without ORDER:VIEW
   - Should get 403 without permission

3. **ReviewController**
   - Test with/without REVIEW:APPROVE
   - Should get 403 without permission

## Test 5: Verify Frontend Dashboard Adapts

### Step 5.1: Test Dashboard Sections
1. **Login with Different Roles**
   - Marketing Specialist
   - Manage Product
   - Content Editor

2. **Check Dashboard Sections**
   - Metric cards appear/disappear
   - Quick action buttons show/hide
   - Sidebar navigation adapts

### Step 5.2: Check for Errors
1. **Open Browser Console**
2. **Navigate Dashboard**
3. **Look for Errors**
   - No React context errors
   - No 500 errors in Network tab
   - No permission-related JavaScript errors

### Step 5.3: Test Dynamic UI
1. **Change User Permissions**
   - Add/remove permissions from user role
   - Refresh dashboard
   - Verify UI updates immediately

2. **Expected Behavior**
   - New sections appear instantly
   - Removed sections disappear
   - No page reload required

## Success Criteria

### ✅ Backend Tests Pass
- All controllers respect permission-based authorization
- 403 Forbidden for unauthorized access
- 200 OK for authorized access
- No 500 errors from authorization

### ✅ Frontend Tests Pass
- Dashboard adapts to user permissions
- No React context errors
- UI elements show/hide appropriately
- Smooth user experience

### ✅ System Tests Pass
- Create new roles with custom permissions
- Add permissions to existing roles instantly
- Mix and match permissions across different roles
- No server restart required for changes

## Troubleshooting

### Common Issues
1. **403 Forbidden on All Endpoints**
   - Check user has valid token
   - Verify user has assigned roles
   - Check role has permissions

2. **React Context Errors**
   - Refresh browser page
   - Clear browser cache
   - Check PermissionProvider is wrapping components

3. **500 Internal Server Error**
   - Check backend logs
   - Verify database connection
   - Restart backend if needed

### Debug Commands
```bash
# Check backend logs
docker-compose logs backend --tail=100

# Restart backend
docker-compose restart backend

# Check database
docker-compose exec backend psql -U postgres -d ecommerce
```

## Test Results Template

```
Test Date: ___________
Tester: ___________

Test 1: Create New Role
- [ ] Role created successfully
- [ ] Permissions assigned correctly
- [ ] API endpoints work as expected

Test 2: Add Permissions to Existing Role
- [ ] Permissions added successfully
- [ ] Changes take effect immediately
- [ ] No server restart required

Test 3: Mix and Match Permissions
- [ ] Multiple roles assigned to user
- [ ] Combined permissions work
- [ ] No conflicts between roles

Test 4: Backend Authorization
- [ ] Controllers respect permissions
- [ ] Proper error responses
- [ ] No system crashes

Test 5: Frontend Dashboard
- [ ] UI adapts to permissions
- [ ] No JavaScript errors
- [ ] Smooth user experience

Overall Result: [ ] PASS [ ] FAIL
Notes: ________________________________
```

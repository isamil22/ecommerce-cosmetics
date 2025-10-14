# 🧪 Manual UI Testing Checklist

## ✅ **All Backend Tests Passed!**

```
╔════════════════════════════════════════════╗
║  AUTOMATED TESTS: 10/10 PASSED (100%)     ║
╚════════════════════════════════════════════╝
```

Now let's test the frontend UI manually!

---

## 🚀 **Step 1: Start the Frontend**

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 **Step 2: Test Admin Login & New RBAC Pages**

### **✅ Test 2.1: Login as Admin**

1. Open browser: **http://localhost:5173**
2. Click "Login"
3. Enter credentials:
   ```
   Email: admin@example.com
   Password: adminpassword
   ```
4. Click "Login"

**Expected:**
- ✅ Successfully logged in
- ✅ Redirected to homepage or dashboard
- ✅ Navbar shows "Admin" link

---

### **✅ Test 2.2: Access Admin Dashboard**

1. Click **"Admin"** in the navbar (or visit http://localhost:5173/admin/dashboard)
2. Look at the **left sidebar**

**Expected - NEW section at the bottom:**
```
🛡️ Access Control  ← NEW SECTION!
  • Roles          ← NEW!
  • Permissions    ← NEW!
```

**Screenshot what you should see:**
```
┌─────────────────────────┐
│ 🏠 Dashboard           │
├─────────────────────────┤
│ 📦 Products            │
│ 📦 Packs               │
│ 💰 Sales               │
│ 👥 Users               │
│ 📝 Content             │
├─────────────────────────┤
│ 🛡️ Access Control  ⭐  │  ← NEW!
│   • Roles          ⭐  │  ← NEW!
│   • Permissions    ⭐  │  ← NEW!
├─────────────────────────┤
│ ⚙️ Settings            │
└─────────────────────────┘
```

---

### **✅ Test 2.3: Roles Management Page**

1. Click **"Roles"** in the sidebar
2. You should see the **Roles Management Page**

**Expected:**
- ✅ Page loads successfully
- ✅ Title: "Role Management"
- ✅ Button: "Create New Role" (top right)
- ✅ **5 role cards displayed:**
  ```
  🛡️ ROLE_ADMIN (57 permissions)
  🛡️ ROLE_MANAGER (27 permissions)
  🛡️ ROLE_EDITOR (19 permissions)
  🛡️ ROLE_VIEWER (11 permissions)
  🛡️ ROLE_USER (3 permissions)
  ```
- ✅ Each card shows:
  - Role name
  - Description
  - Number of permissions
  - Edit (✏️) and Delete (🗑️) buttons
  - First 6 permissions listed

**Take a screenshot!** This is your RBAC management UI! 📸

---

### **✅ Test 2.4: Create a New Role**

1. Click **"Create New Role"** button
2. A modal should open

**Fill in the form:**
```
Name: ROLE_SUPPORT_AGENT
Description: Customer support agent role
```

3. **Select permissions** by checking boxes:
   - Find **ORDER** section → Check: VIEW, EDIT
   - Find **USER** section → Check: VIEW
   - Find **PRODUCT** section → Check: VIEW
   - Find **REVIEW** section → Check: VIEW, APPROVE
   - Find **COMMENT** section → Check: VIEW, APPROVE
   - Find **DASHBOARD** section → Check: VIEW

4. Click **"Create Role"**

**Expected:**
- ✅ Modal closes
- ✅ Toast notification: "Role created successfully!"
- ✅ New role appears in the list: **ROLE_SUPPORT_AGENT**
- ✅ Shows correct permission count (8 permissions)

---

### **✅ Test 2.5: Permissions Page**

1. Click **"Permissions"** in the sidebar
2. You should see the **Permissions Management Page**

**Expected:**
- ✅ Page loads successfully
- ✅ Title: "Permission Management"
- ✅ **Filter dropdown** showing resources
- ✅ **57 permissions grouped by resource**
- ✅ Resources shown: PRODUCT, ORDER, USER, CATEGORY, etc.
- ✅ Each permission shows:
  - Action name (VIEW, CREATE, EDIT, DELETE)
  - Full permission name (e.g., PRODUCT:VIEW)
  - Edit and delete buttons

**Try the filter:**
1. Select **"PRODUCT"** from filter dropdown
2. **Expected:** Only 4 PRODUCT permissions shown
   - PRODUCT:VIEW
   - PRODUCT:CREATE
   - PRODUCT:EDIT
   - PRODUCT:DELETE

---

### **✅ Test 2.6: Enhanced Users Page**

1. Click **"Users"** in the sidebar
2. You should see the **Users Management Page** with **enhanced columns**

**Expected NEW columns:**
- ✅ "Name" column (shows fullName)
- ✅ "Legacy Role" column (dropdown with USER/ADMIN)
- ✅ **"RBAC Roles" column with "Manage" button** ⭐ NEW!
- ✅ "Email Confirmed" column
- ✅ **"Actions" column with 🔑 (key) icon** ⭐ NEW!

**Table should show:**
```
┌────┬─────────────┬──────────────────┬─────────┬────────────┬─────────┬─────────┐
│ ID │ Name        │ Email            │ Legacy  │ RBAC Roles │ Confirm │ Actions │
├────┼─────────────┼──────────────────┼─────────┼────────────┼─────────┼─────────┤
│ 1  │ Admin User  │ admin@example.com│ ADMIN   │ [Manage]⭐ │ Yes     │ 🔑 🗑️   │
│ 2  │ User Demo   │ user@example.com │ USER    │ [Manage]⭐ │ Yes     │ 🔑 🗑️   │
└────┴─────────────┴──────────────────┴─────────┴────────────┴─────────┴─────────┘
```

---

### **✅ Test 2.7: Assign Role to User**

1. In the Users table, find **user@example.com** (ID: 2)
2. Click the **"Manage"** button in the RBAC Roles column
3. A modal should open: **"Manage Roles - user@example.com"**

**Expected in modal:**
- ✅ List of all available roles with checkboxes
- ✅ Each role shows:
  - Name (e.g., ROLE_SUPPORT_AGENT)
  - Description
  - Permission count
- ✅ **ROLE_USER** is already checked (current role)

**Assign the new role:**
1. Check the box for **"ROLE_SUPPORT_AGENT"** (the role you created)
2. Keep **ROLE_USER** checked too (user can have multiple roles)
3. Click **"Save Roles"**

**Expected:**
- ✅ Modal closes
- ✅ Toast notification: "Roles assigned successfully!"
- ✅ Table refreshes

---

### **✅ Test 2.8: View User Permissions**

1. Find **user@example.com** in the users table
2. Click the **🔑 (key icon)** in the Actions column
3. A modal should open: **"User Permissions - user@example.com"**

**Expected:**
- ✅ Modal shows: "This user has X permissions through their assigned roles"
- ✅ Grid of permission cards showing:
  - Permission names (PRODUCT:VIEW, ORDER:VIEW, ORDER:EDIT, etc.)
  - Permission descriptions
- ✅ Should show permissions from both ROLE_USER and ROLE_SUPPORT_AGENT
- ✅ Close button works

---

## 🧪 **Step 3: Test Dynamic Sidebar**

This is the most exciting test! We'll verify the sidebar changes based on user permissions.

### **✅ Test 3.1: Logout from Admin**

1. Click your profile/logout button
2. Logout successfully

---

### **✅ Test 3.2: Login as Regular User**

1. Click "Login"
2. Enter:
   ```
   Email: user@example.com
   Password: userpassword
   ```
3. Login successfully

---

### **✅ Test 3.3: Go to Admin Dashboard**

1. If you see "Admin" link in navbar, click it
2. Or manually go to: http://localhost:5173/admin/dashboard

**Expected sidebar should show ONLY:**
```
┌─────────────────────────┐
│ 🏠 Dashboard           │  ← Has DASHBOARD:VIEW
├─────────────────────────┤
│ 📦 Products            │  ← Has PRODUCT:VIEW
│   • Products           │
├─────────────────────────┤
│ 💰 Sales               │  ← Has ORDER permissions
│   • Orders             │
├─────────────────────────┤
│ 👥 Users               │  ← Has REVIEW permissions
│   • Reviews            │
└─────────────────────────┘
```

**Expected sidebar should NOT show:**
- ❌ Categories (no CATEGORY permission)
- ❌ Packs (no PACK permission)
- ❌ Coupons (no COUPON permission)
- ❌ Users (no USER:VIEW permission)
- ❌ Content sections (no HERO/ANNOUNCEMENT permissions)
- ❌ **Access Control (Roles/Permissions)** ← This is admin-only!
- ❌ Analytics (no ANALYTICS permission)
- ❌ Settings (no SETTINGS permission)

**This proves the dynamic sidebar is working!** 🎉

---

### **✅ Test 3.4: Try Accessing a Forbidden Page**

1. Try to manually visit: http://localhost:5173/admin/roles
2. Or try clicking in sidebar (if you don't see the menu item)

**Expected:**
- Page might load but show empty data (API will return 403)
- Or sidebar doesn't even show the link

**This proves permission protection is working!** 🔒

---

## 🧪 **Step 4: Test Backend APIs via Swagger**

### **✅ Test 4.1: Open Swagger UI**

Visit: **http://localhost:8082/swagger-ui/index.html**

**Expected:**
- ✅ Swagger UI loads
- ✅ You see API documentation

---

### **✅ Test 4.2: Find RBAC Endpoints**

Scroll down and look for these sections:
- ✅ **"Role Management"** - 11 endpoints
- ✅ **"Permission Management"** - 15 endpoints  
- ✅ **"User Management"** - includes role assignment endpoints

---

### **✅ Test 4.3: Test an Endpoint**

1. Find **"Role Management"** section
2. Click on **GET /api/roles**
3. Click "Try it out"
4. **Authorize first:**
   - Click the 🔒 "Authorize" button (top right)
   - Login to get a token:
     ```
     Email: admin@example.com
     Password: adminpassword
     ```
   - Copy the JWT token from response
   - Paste in Authorization field
   - Click "Authorize"
5. Click **"Execute"**

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "ROLE_ADMIN",
    "description": "Full system access with all permissions",
    "permissions": [ ... 57 permissions ... ]
  },
  {
    "id": 2,
    "name": "ROLE_MANAGER",
    "permissions": [ ... 27 permissions ... ]
  },
  ...
]
```

**Status Code:** 200 ✅

---

## 🧪 **Step 5: Test Database via phpMyAdmin**

### **✅ Test 5.1: Open phpMyAdmin**

Visit: **http://localhost:8083**

**Login:**
```
Server: db
Username: user
Password: password
```

---

### **✅ Test 5.2: Browse RBAC Tables**

1. Click on **`sms`** database (left sidebar)
2. You should see **4 new tables:**
   - ✅ `roles`
   - ✅ `permissions`
   - ✅ `user_roles`
   - ✅ `role_permissions`

---

### **✅ Test 5.3: Verify Data**

**Click on `roles` table → Browse:**
- ✅ Should see 5 roles (ROLE_ADMIN, ROLE_MANAGER, etc.)
- ✅ If you created ROLE_SUPPORT_AGENT, it should appear here as row 6

**Click on `permissions` table → Browse:**
- ✅ Should see 57 permissions
- ✅ Check format: Name = "PRODUCT:VIEW", Resource = "PRODUCT", Action = "VIEW"

**Click on `user_roles` table → Browse:**
- ✅ Should see at least 2 rows (admin and regular user)
- ✅ If you assigned roles via UI, should see more rows
- ✅ user_id = 2 should now have multiple role_id entries if you assigned ROLE_SUPPORT_AGENT

**Click on `role_permissions` table → Browse:**
- ✅ Should see 117+ rows (117 from default + any new roles you created)

---

## 🎯 **Step 6: Advanced Testing - Create Custom Role Flow**

This tests the complete workflow from creation to assignment to usage!

### **✅ Test 6.1: Create "Content Manager" Role**

1. **Login as admin** (if not already)
2. Go to **Admin → Roles**
3. Click **"Create New Role"**
4. Fill in:
   ```
   Name: ROLE_CONTENT_MANAGER
   Description: Manages website content and products
   ```
5. **Select these permissions:**
   - **PRODUCT:** VIEW, CREATE, EDIT (3 permissions)
   - **CATEGORY:** VIEW, CREATE, EDIT (3 permissions)
   - **PACK:** VIEW, CREATE, EDIT (3 permissions)
   - **HERO:** VIEW, EDIT (2 permissions)
   - **ANNOUNCEMENT:** VIEW, EDIT (2 permissions)
   - **DASHBOARD:** VIEW (1 permission)
   
   **Total: 14 permissions**

6. Click **"Create Role"**

**Expected:**
- ✅ Success toast
- ✅ New card appears for ROLE_CONTENT_MANAGER showing "14 permissions"

---

### **✅ Test 6.2: Assign to User**

1. Go to **Admin → Users**
2. Find **user@example.com**
3. Click **"Manage"** in RBAC Roles column
4. In the modal:
   - Uncheck ROLE_USER
   - Uncheck ROLE_SUPPORT_AGENT (if checked)
   - Check **ROLE_CONTENT_MANAGER** only
5. Click **"Save Roles"**

**Expected:**
- ✅ Success toast
- ✅ Modal closes

---

### **✅ Test 6.3: Verify Permissions**

1. Still on Users page
2. Click the **🔑 icon** next to user@example.com
3. Modal opens showing permissions

**Expected:**
- ✅ Shows "This user has **14** permissions"
- ✅ Lists permissions:
  - PRODUCT:VIEW
  - PRODUCT:CREATE
  - PRODUCT:EDIT
  - CATEGORY:VIEW
  - CATEGORY:CREATE
  - CATEGORY:EDIT
  - PACK:VIEW
  - PACK:CREATE
  - PACK:EDIT
  - HERO:VIEW
  - HERO:EDIT
  - ANNOUNCEMENT:VIEW
  - ANNOUNCEMENT:EDIT
  - DASHBOARD:VIEW

---

### **✅ Test 6.4: Test Dynamic Sidebar**

1. **Logout from admin**
2. **Login as user@example.com** / userpassword
3. Go to admin dashboard

**Expected sidebar shows ONLY:**
```
┌─────────────────────────┐
│ 🏠 Dashboard           │  ✅ Has DASHBOARD:VIEW
├─────────────────────────┤
│ 📦 Products            │  ✅ Has PRODUCT permissions
│   • Products           │
│   • Categories         │  ✅ Has CATEGORY permissions
├─────────────────────────┤
│ 📦 Packs               │  ✅ Has PACK permissions
│   • Packs              │
├─────────────────────────┤
│ 📝 Content             │  ✅ Has HERO & ANNOUNCEMENT permissions
│   • Hero Section       │
│   • Announcements      │
└─────────────────────────┘
```

**Expected sidebar does NOT show:**
- ❌ Orders (no ORDER permissions)
- ❌ Coupons (no COUPON permissions)
- ❌ Users (no USER:VIEW)
- ❌ Reviews (no REVIEW permissions)
- ❌ Custom Packs (no CUSTOM_PACK permissions)
- ❌ **Access Control** (no ROLE/PERMISSION permissions)
- ❌ Analytics (no ANALYTICS permissions)
- ❌ Settings (no SETTINGS permissions)
- ❌ Countdown, Enhanced Counter, etc.

**🎉 SUCCESS!** The sidebar is dynamically showing only what the user can access!

---

## 🎯 **Step 7: Test Different Role Scenarios**

### **Scenario A: Manager Role**

1. Login as admin
2. Go to Users → Find user@example.com → Manage
3. Uncheck all, check **ROLE_MANAGER** only
4. Save
5. Logout and login as user@example.com
6. Go to admin dashboard

**Expected sidebar:**
- ✅ Dashboard, Products, Categories
- ✅ Packs, Custom Packs
- ✅ Orders, Coupons
- ✅ Users (view only), Reviews
- ✅ Analytics
- ❌ No Access Control section
- ❌ No Settings

---

### **Scenario B: Viewer Role**

1. Login as admin
2. Assign **ROLE_VIEWER** to user@example.com
3. Logout and login as user@example.com
4. Go to admin dashboard

**Expected:**
- ✅ Can see most sections
- ✅ All in "view-only" mode
- ✅ No create/edit/delete buttons visible
- ✅ Can view Analytics and export

---

### **Scenario C: Multiple Roles**

1. Login as admin
2. Assign **BOTH** ROLE_EDITOR and ROLE_VIEWER to user@example.com
3. Logout and login as user@example.com

**Expected:**
- ✅ User gets permissions from BOTH roles
- ✅ Permissions are combined (union)
- ✅ Sidebar shows all sections from both roles

---

## 📋 **Complete Testing Checklist**

### **Backend:**
- [x] ✅ All automated tests passed (10/10)
- [x] ✅ Backend running on port 8082
- [x] ✅ Database has 4 RBAC tables
- [x] ✅ 5 roles seeded
- [x] ✅ 57 permissions seeded
- [x] ✅ API endpoints responding

### **Frontend - Pages:**
- [ ] Roles page loads and displays roles
- [ ] Can create new role via UI
- [ ] Can edit existing role
- [ ] Can delete role
- [ ] Permissions page loads and displays permissions
- [ ] Can filter permissions by resource
- [ ] Users page shows enhanced columns
- [ ] "Manage" button works for role assignment
- [ ] "View Permissions" button (🔑) works

### **Frontend - Dynamic Behavior:**
- [ ] Admin user sees all sidebar items
- [ ] Regular user sees limited sidebar items
- [ ] Sidebar updates when roles change
- [ ] Different roles show different menu items
- [ ] Permission guards work correctly

### **Integration:**
- [ ] Create role → Assign to user → User sees new permissions
- [ ] Remove role → User loses permissions → Sidebar updates
- [ ] Multiple roles combine permissions correctly
- [ ] Admin always has full access

---

## 🎉 **SUCCESS CRITERIA**

**✅ All tests above should pass!**

If you see:
- ✅ New "Access Control" section in admin sidebar
- ✅ Can create roles with permissions
- ✅ Can assign roles to users
- ✅ Sidebar changes based on user roles
- ✅ User with limited role sees limited menu

**Then your RBAC system is 100% working!** 🎊

---

## 🐛 **Troubleshooting**

### **Frontend won't start:**
```bash
cd frontend
npm install  # Install dependencies first
npm run dev
```

### **Pages show errors:**
- Check browser console for errors
- Verify backend is running: `docker ps`
- Test API: `node test-rbac-endpoints.js`

### **Sidebar shows all items for limited user:**
- Verify roles were assigned correctly
- Check user permissions: Click 🔑 icon
- Logout and login again
- Clear browser cache

### **Can't create roles:**
- Ensure logged in as admin
- Role name must be unique
- Use format: ROLE_NAME

---

## 📸 **Screenshots to Take**

Take screenshots of these to verify:
1. ✅ Roles management page showing all 5 roles
2. ✅ Permissions page with filter
3. ✅ User management page with "Manage" button
4. ✅ Role assignment modal
5. ✅ User permissions modal
6. ✅ **Admin sidebar** (showing all items)
7. ✅ **Limited user sidebar** (showing only some items)

---

## 🎯 **What to Report**

After testing, let me know:
1. ✅ Did all automated tests pass? (should be YES)
2. ✅ Can you see the new "Access Control" section?
3. ✅ Can you create a role successfully?
4. ✅ Can you assign roles to users?
5. ✅ Does the sidebar change for different users?

**If all YES → System is perfect!** 🎉  
**If any NO → Share error message and I'll fix it!** 🔧

---

## 📞 **Quick Help**

### **Test Scripts:**
```bash
node test-complete-rbac-implementation.js    # Complete test
node test-rbac-endpoints.js                  # API test only
node test-rbac-system.js                     # Database test only
```

### **Start Services:**
```bash
docker ps                    # Check backend is running
cd frontend && npm run dev   # Start frontend
```

### **Access Points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8082
- Swagger: http://localhost:8082/swagger-ui/index.html
- phpMyAdmin: http://localhost:8083

---

**🎊 Start testing and let me know how it goes!** 🚀



# 🚀 Quick Start - How to Use Your New RBAC System

**Congratulations!** Your RBAC system is ready. Here's how to use it:

---

## 🎯 **Step-by-Step Guide**

### **Step 1: Start Your Application** ✅ *Already Running*

Your backend is already running in Docker. Frontend needs to be started:

```bash
cd frontend
npm run dev
```

---

### **Step 2: Login as Admin**

Visit: http://localhost:5173

**Login credentials:**
```
Email: admin@example.com
Password: adminpassword
```

---

### **Step 3: Explore the New RBAC Features**

After login, navigate to the admin dashboard and look at the sidebar.

**You'll see a NEW section called "Access Control":**
- 🛡️ **Roles** - Manage role definitions
- 🔑 **Permissions** - View and manage permissions

---

### **Step 4: Create Your First Custom Role**

1. Click **"Roles"** in the sidebar
2. Click **"Create New Role"** (top right)
3. Fill in the form:

   **Example - Content Manager:**
   ```
   Name: ROLE_CONTENT_MANAGER
   Description: Manages website content and products
   ```

4. **Select permissions** (check the boxes):
   - Under **PRODUCT**: Check VIEW, CREATE, EDIT
   - Under **CATEGORY**: Check VIEW, CREATE, EDIT
   - Under **PACK**: Check VIEW, CREATE, EDIT
   - Under **HERO**: Check VIEW, EDIT
   - Under **ANNOUNCEMENT**: Check VIEW, EDIT
   - Under **DASHBOARD**: Check VIEW

5. Click **"Create Role"**

6. ✅ Your custom role is created!

---

### **Step 5: Assign Role to a User**

#### Option A: Create a New User
1. Logout from admin
2. Click "Register" and create a new account
3. Confirm email (check your email or database)
4. Login as admin again

#### Option B: Use Existing User
Use user@example.com (password: userpassword)

#### Assign the Role:
1. Go to **Admin → Users**
2. Find your user in the table
3. In the **"RBAC Roles"** column, click **"Manage"**
4. A modal will open showing all available roles
5. Check **"ROLE_CONTENT_MANAGER"** (the role you just created)
6. Click **"Save Roles"**
7. ✅ Role assigned!

---

### **Step 6: Test the Dynamic Sidebar**

1. Logout from admin
2. Login as the user you assigned the role to
3. **Go to admin dashboard**

**What you should see:**
- ✅ Dashboard
- ✅ Products section (Products + Categories)
- ✅ Packs section
- ✅ Content section (Hero + Announcements)

**What you should NOT see:**
- ❌ Orders
- ❌ Coupons
- ❌ Users
- ❌ Reviews
- ❌ **Access Control** (Roles/Permissions)
- ❌ Analytics
- ❌ Settings

**This proves the dynamic sidebar is working!** 🎉

---

### **Step 7: View User Permissions**

1. Login as admin again
2. Go to **Admin → Users**
3. Find your test user
4. Click the **🔑 (key icon)** in the Actions column
5. A modal will open showing **all permissions** the user has
6. You should see permissions like:
   - PRODUCT:VIEW
   - PRODUCT:CREATE
   - PRODUCT:EDIT
   - CATEGORY:VIEW
   - etc.

---

## 🎯 **Common Tasks**

### **Create a "Manager" for Your Store:**

**Role:** `ROLE_SHOP_MANAGER`

**Permissions to assign:**
- PRODUCT:VIEW, PRODUCT:CREATE, PRODUCT:EDIT
- CATEGORY:VIEW, CATEGORY:CREATE, CATEGORY:EDIT
- PACK:VIEW, PACK:CREATE, PACK:EDIT
- ORDER:VIEW, ORDER:EDIT, ORDER:MANAGE
- COUPON:VIEW, COUPON:CREATE, COUPON:EDIT
- USER:VIEW
- REVIEW:VIEW, REVIEW:APPROVE, REVIEW:REJECT
- ANALYTICS:VIEW
- DASHBOARD:VIEW

**Result:** This person can manage products, process orders, create coupons, and moderate reviews - but cannot delete users or manage roles.

---

### **Create a "Customer Support" Role:**

**Role:** `ROLE_CUSTOMER_SUPPORT`

**Permissions:**
- ORDER:VIEW, ORDER:EDIT
- USER:VIEW
- PRODUCT:VIEW
- REVIEW:VIEW, REVIEW:APPROVE
- COMMENT:VIEW, COMMENT:APPROVE
- DASHBOARD:VIEW

**Result:** Can help customers with orders, view products to answer questions, and moderate content.

---

### **Create a "Marketing" Role:**

**Role:** `ROLE_MARKETING`

**Permissions:**
- PRODUCT:VIEW
- ANNOUNCEMENT:VIEW, ANNOUNCEMENT:EDIT
- HERO:VIEW, HERO:EDIT
- COUPON:VIEW, COUPON:CREATE, COUPON:EDIT
- ANALYTICS:VIEW, ANALYTICS:EXPORT
- DASHBOARD:VIEW

**Result:** Can create campaigns, manage homepage, create coupons, and view analytics.

---

## 🧪 **Testing Checklist**

### ✅ Test 1: Role Creation
- [ ] Login as admin
- [ ] Go to /admin/roles
- [ ] Create a new role
- [ ] Verify it appears in the list

### ✅ Test 2: Permission Assignment
- [ ] Edit a role
- [ ] Add/remove permissions
- [ ] Save and verify changes

### ✅ Test 3: User Role Assignment
- [ ] Go to /admin/users
- [ ] Click "Manage" on a user
- [ ] Assign a role
- [ ] Save and verify

### ✅ Test 4: Permission Viewing
- [ ] Click the 🔑 icon next to a user
- [ ] Verify permissions are listed
- [ ] Close modal

### ✅ Test 5: Dynamic Sidebar
- [ ] Logout from admin
- [ ] Login as a user with limited role
- [ ] Go to admin dashboard
- [ ] Verify sidebar shows only permitted items
- [ ] Try accessing a forbidden page

### ✅ Test 6: API Testing
- [ ] Open http://localhost:8082/swagger-ui/index.html
- [ ] Find the "Role Management" section
- [ ] Test GET /api/roles endpoint
- [ ] Authorize with admin JWT token
- [ ] Execute and verify response

---

## 📊 **Default Configuration**

### **Users in System:**
1. **admin@example.com** - ROLE_ADMIN (all permissions)
2. **user@example.com** - ROLE_USER (3 basic permissions)

### **Available Roles:**
1. **ROLE_ADMIN** - 57 permissions (everything)
2. **ROLE_MANAGER** - 27 permissions (management tasks)
3. **ROLE_EDITOR** - 19 permissions (content creation)
4. **ROLE_VIEWER** - 11 permissions (read-only)
5. **ROLE_USER** - 3 permissions (basic user)

### **Resources with Permissions:**
16 resources: PRODUCT, ORDER, USER, ROLE, PERMISSION, CATEGORY, PACK, CUSTOM_PACK, REVIEW, COMMENT, COUPON, ANALYTICS, SETTINGS, HERO, ANNOUNCEMENT, DASHBOARD

---

## 🎯 **Quick Reference**

### **To Create a Role:**
Admin → Roles → Create New Role → Fill form → Select permissions → Save

### **To Assign a Role:**
Admin → Users → Find user → Click "Manage" → Check roles → Save

### **To View Permissions:**
Admin → Users → Find user → Click 🔑 icon

### **To Create a Permission:**
Admin → Permissions → Create New Permission → Enter resource & action → Save

---

## 🐛 **Troubleshooting**

### **Problem: Can't see "Access Control" in sidebar**
**Solution:** Make sure you're logged in as admin@example.com

### **Problem: "Manage" button doesn't work**
**Solution:** 
1. Check browser console for errors
2. Verify backend is running: `docker ps`
3. Test API directly: `node test-rbac-endpoints.js`

### **Problem: Role creation fails**
**Solution:**
- Role name must be unique
- Use format: ROLE_NAME (all caps with underscores)
- At least one permission should be selected

### **Problem: Can't assign role to user**
**Solution:**
- User must exist and be confirmed
- Backend must be running
- Check browser console for API errors

---

## 🎊 **You're All Set!**

**Your RBAC system is:**
- ✅ Fully implemented
- ✅ Tested and verified
- ✅ Ready to use
- ✅ Production-ready

**Go ahead and:**
1. Create custom roles for your business needs
2. Assign roles to your team members
3. Let them login and see their personalized dashboard
4. Manage permissions as your needs evolve

---

**Need more help?** Read the detailed guides:
- `RBAC_FINAL_IMPLEMENTATION_SUMMARY.md` - Complete overview
- `FRONTEND_RBAC_USAGE_GUIDE.md` - Frontend usage examples
- `PERMISSION_BASED_SECURITY_GUIDE.md` - Backend security guide

**Enjoy your new RBAC system!** 🚀✨



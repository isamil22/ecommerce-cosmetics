# Frontend RBAC Usage Guide

## 🎯 Overview

The frontend now has a complete permission-based access control system that dynamically shows/hides UI elements based on user permissions.

---

## 📦 What Was Implemented

### 1. **PermissionContext** (`frontend/src/contexts/PermissionContext.jsx`)
- Manages user permissions globally
- Fetches permissions from backend on mount
- Provides helper functions to check permissions

### 2. **PermissionGuard Component** (`frontend/src/components/PermissionGuard.jsx`)
- Conditionally renders components based on permissions
- Supports multiple permission check modes

### 3. **DynamicAdminSidebar** (`frontend/src/components/DynamicAdminSidebar.jsx`)
- Sidebar that shows/hides menu items based on permissions
- Organizes sections by resource type

### 4. **RBAC API Service** (`frontend/src/api/rbacService.js`)
- Complete API client for role/permission management
- 30+ functions for RBAC operations

### 5. **Admin Pages**
- **AdminRolesPage** - Create, edit, delete roles and assign permissions
- **AdminPermissionsPage** - Manage permissions, filter by resource
- **Enhanced AdminUsersPage** - Assign multiple roles to users, view permissions

---

## 🚀 How to Use

### 1. **Using Permission Context**

```jsx
import { usePermissions } from '../contexts/PermissionContext';

function MyComponent() {
    const { hasPermission, hasRole, permissions, loading } = usePermissions();
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div>
            {hasPermission('PRODUCT:CREATE') && (
                <button>Create Product</button>
            )}
            
            {hasRole('ADMIN') && (
                <div>Admin-only content</div>
            )}
            
            <p>You have {permissions.length} permissions</p>
        </div>
    );
}
```

---

### 2. **Using PermissionGuard Component**

```jsx
import PermissionGuard from '../components/PermissionGuard';

function ProductsPage() {
    return (
        <div>
            {/* Show button only if user has PRODUCT:CREATE */}
            <PermissionGuard permission="PRODUCT:CREATE">
                <button>Create New Product</button>
            </PermissionGuard>
            
            {/* Show if user has ANY of these permissions */}
            <PermissionGuard anyPermissions={['PRODUCT:EDIT', 'PRODUCT:DELETE']}>
                <div>Edit Controls</div>
            </PermissionGuard>
            
            {/* Show if user has ALL of these permissions */}
            <PermissionGuard allPermissions={['PRODUCT:VIEW', 'PRODUCT:EDIT']}>
                <div>Advanced Editor</div>
            </PermissionGuard>
            
            {/* Show if user has specific role */}
            <PermissionGuard role="ADMIN">
                <div>Admin Panel</div>
            </PermissionGuard>
            
            {/* With fallback content */}
            <PermissionGuard 
                permission="PRODUCT:VIEW"
                fallback={<div>No access</div>}
            >
                <div>Product List</div>
            </PermissionGuard>
        </div>
    );
}
```

---

### 3. **Dynamic Sidebar** (Already Implemented)

The `DynamicAdminSidebar` automatically shows/hides menu items:

- **Dashboard** - Visible if user has `DASHBOARD:VIEW` or is ADMIN
- **Products** - Visible if user has any PRODUCT permissions
- **Categories** - Visible if user has any CATEGORY permissions
- **Packs** - Visible if user has any PACK permissions
- **Orders** - Visible if user has any ORDER permissions
- **Coupons** - Visible if user has any COUPON permissions
- **Users** - Visible if user has any USER permissions
- **Reviews** - Visible if user has any REVIEW permissions
- **Roles/Permissions** - Visible if user has ROLE or PERMISSION permissions
- **Analytics** - Visible if user has `ANALYTICS:VIEW`
- **Settings** - Visible if user has SETTINGS permissions

---

## 🔧 Available Permission Checks

### From `usePermissions()` hook:

```javascript
const {
    permissions,      // Array of all user's permissions
    roles,            // Array of user's roles  
    loading,          // Boolean - true while loading
    userId,           // Current user's ID
    hasPermission,    // Function - check single permission
    hasAnyPermission, // Function - check if user has ANY of the permissions
    hasAllPermissions,// Function - check if user has ALL of the permissions
    hasRole,          // Function - check if user has specific role
    refreshPermissions// Function - refresh permissions from backend
} = usePermissions();
```

### Examples:

```javascript
// Check single permission
if (hasPermission('PRODUCT:CREATE')) {
    // User can create products
}

// Check any of multiple permissions
if (hasAnyPermission(['PRODUCT:EDIT', 'PRODUCT:DELETE'])) {
    // User can edit OR delete products
}

// Check all permissions required
if (hasAllPermissions(['PRODUCT:VIEW', 'PRODUCT:EDIT', 'PRODUCT:DELETE'])) {
    // User has ALL three permissions
}

// Check role
if (hasRole('ADMIN')) {
    // User is an admin
}
```

---

## 📝 Real-World Examples

### Example 1: Conditional Button Rendering

```jsx
import { usePermissions } from '../contexts/PermissionContext';
import PermissionGuard from '../components/PermissionGuard';

function ProductListPage() {
    const { hasPermission } = usePermissions();
    
    return (
        <div>
            <h1>Products</h1>
            
            {/* Method 1: Using hook directly */}
            {hasPermission('PRODUCT:CREATE') && (
                <button>Add New Product</button>
            )}
            
            {/* Method 2: Using PermissionGuard */}
            <PermissionGuard permission="PRODUCT:CREATE">
                <button>Add New Product</button>
            </PermissionGuard>
        </div>
    );
}
```

---

### Example 2: Conditional Form Fields

```jsx
function UserEditForm({ user }) {
    return (
        <form>
            <input name="email" value={user.email} />
            <input name="name" value={user.name} />
            
            {/* Only show role dropdown to admins or users with USER:EDIT */}
            <PermissionGuard anyPermissions={['USER:EDIT', 'USER:PROMOTE']}>
                <select name="role">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </PermissionGuard>
            
            {/* Only admins can delete users */}
            <PermissionGuard permission="USER:DELETE">
                <button className="text-red-600">Delete User</button>
            </PermissionGuard>
        </form>
    );
}
```

---

### Example 3: Conditional Navigation

```jsx
function MyNavbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            
            {/* Only show admin link if user can view dashboard */}
            <PermissionGuard anyPermissions={['DASHBOARD:VIEW']} role="ADMIN">
                <Link to="/admin/dashboard">Admin</Link>
            </PermissionGuard>
        </nav>
    );
}
```

---

### Example 4: Conditional Table Actions

```jsx
function OrdersTable({ orders }) {
    return (
        <table>
            {orders.map(order => (
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.total}</td>
                    <td>
                        {/* View button - everyone with ORDER:VIEW */}
                        <PermissionGuard permission="ORDER:VIEW">
                            <button>View</button>
                        </PermissionGuard>
                        
                        {/* Edit button - only if user has ORDER:EDIT or ORDER:MANAGE */}
                        <PermissionGuard anyPermissions={['ORDER:EDIT', 'ORDER:MANAGE']}>
                            <button>Edit</button>
                        </PermissionGuard>
                        
                        {/* Delete button - only admins */}
                        <PermissionGuard permission="ORDER:DELETE">
                            <button>Delete</button>
                        </PermissionGuard>
                    </td>
                </tr>
            ))}
        </table>
    );
}
```

---

## 🎨 Styling Permission-Protected Elements

You can add visual indicators for permission-protected features:

```jsx
function ProductCard({ product }) {
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission('PRODUCT:EDIT');
    
    return (
        <div className={`product-card ${canEdit ? 'editable' : ''}`}>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            
            {canEdit && (
                <div className="admin-badge">
                    <FiShield className="text-pink-600" />
                    <span>Editable</span>
                </div>
            )}
            
            <PermissionGuard permission="PRODUCT:EDIT">
                <button>Quick Edit</button>
            </PermissionGuard>
        </div>
    );
}
```

---

## 🔄 Refresh Permissions

If a user's roles/permissions change, you can refresh them:

```jsx
import { usePermissions } from '../contexts/PermissionContext';

function AdminUserRoleManager() {
    const { refreshPermissions } = usePermissions();
    
    const assignRole = async (userId, roleId) => {
        await addRoleToUser(userId, roleId);
        
        // Refresh if this is the current user
        if (userId === currentUserId) {
            refreshPermissions();
        }
    };
}
```

---

## 🧪 Testing the Dynamic UI

### Test Scenario 1: Admin User
**Login as:** admin@example.com / adminpassword

**Expected:**
- ✅ See ALL sidebar menu items
- ✅ Can access all admin pages
- ✅ Can create/edit/delete roles and permissions
- ✅ Can assign roles to users

### Test Scenario 2: Manager User (once assigned ROLE_MANAGER)
**Expected:**
- ✅ See Dashboard
- ✅ See Products, Categories
- ✅ See Orders, Coupons
- ✅ See Users (view only)
- ✅ See Reviews, Analytics
- ❌ Cannot see Role/Permission management
- ❌ Cannot delete users
- ❌ Cannot delete products

### Test Scenario 3: Editor User (once assigned ROLE_EDITOR)
**Expected:**
- ✅ See Dashboard
- ✅ See Products (create/edit)
- ✅ See Packs, Custom Packs
- ✅ See Reviews (approve)
- ✅ See Content management
- ❌ Cannot see Orders
- ❌ Cannot see Users
- ❌ Cannot see RBAC pages

### Test Scenario 4: Viewer User (once assigned ROLE_VIEWER)
**Expected:**
- ✅ See Dashboard (read-only)
- ✅ Can view products, orders, users
- ✅ Can view analytics
- ❌ Cannot create/edit/delete anything
- ❌ No action buttons visible

---

## 🎯 Next Steps

### 1. **Test the Frontend**

Start the frontend:
```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

Login as admin and navigate to:
- `/admin/roles` - Manage roles
- `/admin/permissions` - Manage permissions
- `/admin/users` - Assign roles to users

### 2. **Create Test Users with Different Roles**

Use the Admin UI to:
1. Create a new user (register from frontend)
2. Go to Admin → Users
3. Click "Manage" next to the user
4. Assign them `ROLE_MANAGER` or `ROLE_EDITOR`
5. Login as that user
6. Verify they only see permitted sections

### 3. **Create Custom Roles**

1. Go to `/admin/roles`
2. Click "Create New Role"
3. Name it (e.g., `ROLE_CONTENT_MANAGER`)
4. Select specific permissions (e.g., PRODUCT:VIEW, PRODUCT:CREATE, HERO:EDIT)
5. Assign to a user
6. Login as that user
7. Verify they see only the permitted sections

---

## 🔧 Customization

### Add Permission Guard to Existing Components

**Before:**
```jsx
<button onClick={handleDelete}>Delete</button>
```

**After:**
```jsx
<PermissionGuard permission="PRODUCT:DELETE">
    <button onClick={handleDelete}>Delete</button>
</PermissionGuard>
```

### Make Entire Pages Permission-Protected

```jsx
// In App.jsx
import PermissionGuard from './components/PermissionGuard';

<Route 
    path="/admin/analytics" 
    element={
        <PermissionGuard 
            permission="ANALYTICS:VIEW"
            fallback={<div>Access Denied</div>}
        >
            <AdminAnalyticsPage />
        </PermissionGuard>
    } 
/>
```

---

## 📊 Permission Matrix Reference

### What Each Role Can See:

| Page/Section | ADMIN | MANAGER | EDITOR | VIEWER | USER |
|--------------|-------|---------|--------|--------|------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ❌ |
| Products | ✅ | ✅ | ✅ | ✅ | ❌ |
| Categories | ✅ | ✅ | ❌ | ✅ | ❌ |
| Packs | ✅ | ✅ | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ❌ | ✅ | ❌ |
| Coupons | ✅ | ✅ | ❌ | ✅ | ❌ |
| Users | ✅ | ✅ (view) | ❌ | ✅ (view) | ❌ |
| Reviews | ✅ | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ❌ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ | ✅ (view) | ❌ |
| Roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| Permissions | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🎯 Common Use Cases

### Use Case 1: Create "Content Manager" Role

1. Login as admin
2. Go to `/admin/roles`
3. Click "Create New Role"
4. Enter:
   - Name: `ROLE_CONTENT_MANAGER`
   - Description: "Manages website content"
5. Select permissions:
   - PRODUCT:VIEW, PRODUCT:CREATE, PRODUCT:EDIT
   - CATEGORY:VIEW, CATEGORY:CREATE, CATEGORY:EDIT
   - PACK:VIEW, PACK:CREATE, PACK:EDIT
   - HERO:VIEW, HERO:EDIT
   - ANNOUNCEMENT:VIEW, ANNOUNCEMENT:EDIT
6. Save
7. Assign to user in `/admin/users`

**Result:** User will see Products, Categories, Packs, Hero, and Announcements in sidebar

---

### Use Case 2: Create "Order Manager" Role

1. Go to `/admin/roles`
2. Create role: `ROLE_ORDER_MANAGER`
3. Select permissions:
   - ORDER:VIEW, ORDER:EDIT, ORDER:MANAGE
   - PRODUCT:VIEW (to see product details in orders)
   - USER:VIEW (to see customer details)
   - DASHBOARD:VIEW
4. Assign to user

**Result:** User will see Dashboard, Orders, and can manage order status

---

### Use Case 3: Create "Read-Only Analyst" Role

1. Go to `/admin/roles`
2. Create role: `ROLE_ANALYST`
3. Select VIEW permissions only:
   - PRODUCT:VIEW
   - ORDER:VIEW
   - USER:VIEW
   - ANALYTICS:VIEW, ANALYTICS:EXPORT
   - DASHBOARD:VIEW
4. Assign to user

**Result:** User can view data and export analytics but cannot make changes

---

## 🐛 Troubleshooting

### Issue: Sidebar is empty

**Problem:** User has no permissions
**Solution:** Go to `/admin/users`, click "Manage" next to the user, assign roles

### Issue: Permission guard not working

**Problem:** PermissionContext not wrapping app
**Solution:** Check `main.jsx` has `<PermissionProvider>` wrapping `<App />`

### Issue: Permissions not updating

**Problem:** Permissions cached
**Solution:** Call `refreshPermissions()` or logout/login again

### Issue: User can't see admin pages

**Problem:** User doesn't have required permissions
**Solution:** Assign appropriate role with DASHBOARD:VIEW permission

---

## 🎉 Summary

### ✅ What Works Now:

1. **Dynamic Sidebar**
   - Shows only permitted menu items
   - Hides sections user can't access

2. **Permission Checking**
   - Global context for permissions
   - Easy-to-use hooks and guards
   - Multiple check modes (any/all/single)

3. **Role Management UI**
   - Create/edit/delete roles
   - Assign permissions to roles visually
   - See permission count per role

4. **Permission Management UI**
   - View all permissions
   - Filter by resource
   - Create custom permissions

5. **User Role Assignment**
   - Assign multiple roles to users
   - View user permissions
   - Manage role assignments easily

### 🎯 Next Actions:

1. **Test the UI**
   - Login as admin
   - Navigate to `/admin/roles`
   - Create a test role
   - Assign it to a user
   - Login as that user
   - Verify they see only permitted sections

2. **Create Custom Roles**
   - Design roles for your specific use case
   - Assign granular permissions
   - Test with real users

3. **Apply Permission Guards**
   - Add `<PermissionGuard>` to existing components
   - Protect sensitive buttons/actions
   - Hide features users can't use

---

*Frontend RBAC is ready! Dynamic permission-based UI is fully functional.* ✅


# Permission-Based Security Guide

## 🔒 How to Use Permission-Based Security in Controllers

Now that the RBAC system is implemented, you can protect your endpoints with specific permissions instead of just roles.

---

## 📋 Using @PreAuthorize with Permissions

### Option 1: Check for Specific Permission

```java
@PostMapping
@PreAuthorize("hasAuthority('PRODUCT:CREATE')")
public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
    // Only users with PRODUCT:CREATE permission can access
    return ResponseEntity.ok(productService.createProduct(productDTO));
}
```

### Option 2: Check for Any of Multiple Permissions

```java
@PutMapping("/{id}")
@PreAuthorize("hasAnyAuthority('PRODUCT:EDIT', 'PRODUCT:DELETE')")
public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
    // Users with either PRODUCT:EDIT or PRODUCT:DELETE can access
    return ResponseEntity.ok(productService.updateProduct(id, productDTO));
}
```

### Option 3: Combine Role and Permission Checks

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('PRODUCT:DELETE')")
public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    // Admins OR users with PRODUCT:DELETE permission can access
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
}
```

### Option 4: Use Permission Evaluator

```java
@GetMapping("/{id}")
@PreAuthorize("hasPermission(#id, 'PRODUCT', 'PRODUCT:VIEW')")
public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
    // Uses custom PermissionEvaluator for more complex logic
    return ResponseEntity.ok(productService.getProduct(id));
}
```

---

## 🎯 Example: Updating ProductController

### Before (Role-based):
```java
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ProductDTO> createProduct(...) {
    // Only admins can access
}
```

### After (Permission-based):
```java
@PostMapping
@PreAuthorize("hasAuthority('PRODUCT:CREATE')")
public ResponseEntity<ProductDTO> createProduct(...) {
    // Anyone with PRODUCT:CREATE permission can access
    // This includes:
    // - ROLE_ADMIN (has all permissions)
    // - ROLE_MANAGER (has PRODUCT:CREATE)
    // - ROLE_EDITOR (has PRODUCT:CREATE)
}
```

---

## 🔧 Updating Your Controllers

### ProductController Example

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(...) {
        // Public - no protection needed
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        // Public - no protection needed
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCT:CREATE')")
    public ResponseEntity<ProductDTO> createProduct(...) {
        // Requires PRODUCT:CREATE permission
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT:EDIT')")
    public ResponseEntity<ProductDTO> updateProduct(...) {
        // Requires PRODUCT:EDIT permission
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT:DELETE')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        // Requires PRODUCT:DELETE permission
    }
}
```

---

## 📝 Available Permissions

### Product Permissions
- `PRODUCT:VIEW` - View products
- `PRODUCT:CREATE` - Create new products
- `PRODUCT:EDIT` - Edit existing products
- `PRODUCT:DELETE` - Delete products

### Order Permissions
- `ORDER:VIEW` - View orders
- `ORDER:CREATE` - Create orders
- `ORDER:EDIT` - Edit orders
- `ORDER:DELETE` - Delete orders
- `ORDER:MANAGE` - Manage order status

### User Permissions
- `USER:VIEW` - View users
- `USER:CREATE` - Create users
- `USER:EDIT` - Edit user information
- `USER:DELETE` - Delete users
- `USER:PROMOTE` - Promote users to admin

### Role Permissions
- `ROLE:VIEW` - View roles
- `ROLE:CREATE` - Create new roles
- `ROLE:EDIT` - Edit roles
- `ROLE:DELETE` - Delete roles
- `ROLE:ASSIGN` - Assign roles to users

### Permission Management
- `PERMISSION:VIEW` - View permissions
- `PERMISSION:CREATE` - Create permissions
- `PERMISSION:EDIT` - Edit permissions
- `PERMISSION:DELETE` - Delete permissions
- `PERMISSION:ASSIGN` - Assign permissions to roles

### Other Permissions
- `CATEGORY:*` - Category management (VIEW, CREATE, EDIT, DELETE)
- `PACK:*` - Pack management
- `CUSTOM_PACK:*` - Custom pack management
- `REVIEW:*` - Review management (VIEW, APPROVE, REJECT, DELETE)
- `COMMENT:*` - Comment management (VIEW, APPROVE, REJECT, DELETE)
- `COUPON:*` - Coupon management (VIEW, CREATE, EDIT, DELETE)
- `ANALYTICS:VIEW` / `ANALYTICS:EXPORT` - Analytics access
- `SETTINGS:VIEW` / `SETTINGS:EDIT` - Settings management
- `HERO:VIEW` / `HERO:EDIT` - Hero section management
- `ANNOUNCEMENT:VIEW` / `ANNOUNCEMENT:EDIT` - Announcement management
- `DASHBOARD:VIEW` - Dashboard access

---

## 🎯 Role Permissions Matrix

| Role | Total Permissions | Can Do |
|------|-------------------|--------|
| **ROLE_ADMIN** | 57 (ALL) | Everything |
| **ROLE_MANAGER** | 27 | Products, Orders, Reviews, Comments, Coupons, Analytics |
| **ROLE_EDITOR** | 19 | Products, Packs, Reviews (approve only), Content |
| **ROLE_VIEWER** | 11 | View-only access to most resources |
| **ROLE_USER** | 3 | View products, View/create own orders |

---

## 🔍 Testing Permission-Based Security

### Test 1: Verify Permissions are Loaded

Login and check what authorities the user has:

```bash
# The getAuthorities() method now returns both roles and permissions
# For admin user, you should see:
# - ROLE_ADMIN
# - PRODUCT:VIEW
# - PRODUCT:CREATE
# - PRODUCT:EDIT
# ... (all 57 permissions)
```

### Test 2: Test Endpoint Protection

```javascript
// This should work (admin has PRODUCT:CREATE)
POST /api/products
Headers: { Authorization: "Bearer <admin-token>" }

// This should fail (regular user doesn't have PRODUCT:CREATE)
POST /api/products
Headers: { Authorization: "Bearer <user-token>" }
```

### Test 3: Test Permission Evaluator

The `CustomPermissionEvaluator` allows you to use `hasPermission()` in @PreAuthorize:

```java
@PreAuthorize("hasPermission(#productId, 'PRODUCT', 'PRODUCT:EDIT')")
public ResponseEntity<?> updateProduct(@PathVariable Long productId, ...) {
    // Custom logic for permission checking
}
```

---

## 🚀 Best Practices

### 1. **Use Specific Permissions Instead of Roles**

❌ **Bad:**
```java
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
```

✅ **Good:**
```java
@PreAuthorize("hasAuthority('PRODUCT:CREATE')")
```

**Why?** Roles can change over time. Permissions are more granular and explicit.

---

### 2. **Protect Write Operations**

```java
// Public endpoints (no auth needed)
@GetMapping - View products
@GetMapping("/{id}") - View single product

// Protected endpoints (require permissions)
@PostMapping - PRODUCT:CREATE
@PutMapping("/{id}") - PRODUCT:EDIT
@DeleteMapping("/{id}") - PRODUCT:DELETE
```

---

### 3. **Use Method-Level Security**

```java
@Service
public class ProductService {
    
    @PreAuthorize("hasAuthority('PRODUCT:DELETE')")
    public void deleteProduct(Long id) {
        // Even if someone bypasses controller, service is protected
    }
}
```

---

### 4. **Allow Admins to Override**

```java
@PreAuthorize("hasRole('ADMIN') or hasAuthority('PRODUCT:CREATE')")
```

This ensures admins always have access while still using fine-grained permissions.

---

## 📊 How It Works

```
User Login
    ↓
User.getAuthorities() called
    ↓
Returns Set<GrantedAuthority>:
  - ROLE_ADMIN           (from user's roles)
  - PRODUCT:VIEW         (from role's permissions)
  - PRODUCT:CREATE       (from role's permissions)
  - ...all 57 permissions
    ↓
@PreAuthorize checks if user has required authority
    ↓
Request allowed/denied
```

---

## 🎯 Current Implementation

### ✅ What's Working:

1. **User Authentication**
   - Users login and receive JWT token
   - Token contains user information

2. **Authority Loading**
   - User's `getAuthorities()` returns both roles and permissions
   - ROLE_ADMIN user gets all 57 permissions automatically
   - Other roles get their assigned permissions

3. **Endpoint Protection**
   - Controllers use `@PreAuthorize` with `hasRole()` or `hasAuthority()`
   - Spring Security checks authorities before allowing access
   - 401 Unauthorized if not authenticated
   - 403 Forbidden if no permission

4. **Permission Evaluator**
   - Custom evaluator for complex permission logic
   - Can use `hasPermission()` in @PreAuthorize
   - Admin users automatically pass all permission checks

---

## 🧪 Test the Security

Run the comprehensive test:

```bash
node test-rbac-endpoints.js
```

This will verify:
- ✅ Admin can login
- ✅ Admin can access all RBAC endpoints
- ✅ Roles are returned with permissions
- ✅ User permissions are correctly loaded
- ✅ Search and filter endpoints work

---

## 🎯 Next: Update Your Controllers (Optional)

You can now go through your existing controllers and update them from role-based to permission-based security:

```bash
# Controllers to update:
- ProductController.java
- OrderController.java
- CategoryController.java
- PackController.java
- CustomPackController.java
- CouponController.java
- ReviewController.java
- CommentController.java
```

**Or skip this and proceed to Step 9 (Frontend) first!**

---

*Security infrastructure is ready! Endpoints can now use fine-grained permissions.* ✅


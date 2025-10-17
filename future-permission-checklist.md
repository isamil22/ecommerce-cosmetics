# 🔮 Future Permission Addition Checklist

## 📋 Before Adding Any New Permission

### ✅ Step 1: Check Existing Permissions
- [ ] Review the [Complete Permission Mapping Guide](./complete-permission-mapping-guide.html)
- [ ] Verify no similar permission already exists
- [ ] Check if existing permissions can be reused

### ✅ Step 2: Follow Naming Convention
- [ ] Use format: `RESOURCE:ACTION` (uppercase, colon-separated)
- [ ] Resource name should be singular noun (e.g., `PRODUCT`, `USER`, `REVIEW`)
- [ ] Action should be standard verb (e.g., `CREATE`, `EDIT`, `VIEW`, `DELETE`)

### ✅ Step 3: Standard Actions to Use
**Primary Actions:**
- [ ] `VIEW` - Read/view data
- [ ] `CREATE` - Create new items
- [ ] `EDIT` - Edit existing items
- [ ] `UPDATE` - Update existing items
- [ ] `DELETE` - Delete items
- [ ] `MANAGE` - Full management (all actions)

**Specialized Actions (use sparingly):**
- [ ] `APPROVE` - Approve pending items (e.g., REVIEW:APPROVE)
- [ ] `EXPORT` - Export data (e.g., ORDER:EXPORT)
- [ ] `RESTORE` - Restore deleted items (e.g., ORDER:RESTORE)
- [ ] `ANALYTICS` - View analytics (e.g., COUPON:ANALYTICS)

## 🏗️ When Creating a New Controller

### ✅ Step 1: Controller Setup
- [ ] Add `@PreAuthorize` annotations to ALL endpoints
- [ ] Include both permission-based AND legacy role authorization
- [ ] Follow the pattern: `hasAuthority('RESOURCE:ACTION') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')`

### ✅ Step 2: Permission Mapping
For each endpoint, determine:
- [ ] **GET endpoints** → `RESOURCE:VIEW` or `RESOURCE:EDIT`
- [ ] **POST endpoints** → `RESOURCE:CREATE` or `RESOURCE:EDIT`
- [ ] **PUT endpoints** → `RESOURCE:EDIT` or `RESOURCE:UPDATE`
- [ ] **DELETE endpoints** → `RESOURCE:DELETE` or `RESOURCE:EDIT`

### ✅ Step 3: Example Controller Pattern
```java
@RestController
@RequestMapping("/api/new-resource")
public class NewResourceController {
    
    @GetMapping
    @PreAuthorize("hasAuthority('NEW_RESOURCE:VIEW') or hasAuthority('NEW_RESOURCE:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<List<NewResourceDTO>> getAll() {
        // Implementation
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('NEW_RESOURCE:CREATE') or hasAuthority('NEW_RESOURCE:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<NewResourceDTO> create(@RequestBody NewResourceDTO dto) {
        // Implementation
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('NEW_RESOURCE:EDIT') or hasAuthority('NEW_RESOURCE:UPDATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<NewResourceDTO> update(@PathVariable Long id, @RequestBody NewResourceDTO dto) {
        // Implementation
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('NEW_RESOURCE:DELETE') or hasAuthority('NEW_RESOURCE:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Implementation
    }
}
```

## 🎯 When Adding Permissions to Existing Controllers

### ✅ Step 1: Identify Missing Permissions
- [ ] Review controller for missing `@PreAuthorize` annotations
- [ ] Check if endpoints use old role-based authorization only
- [ ] Identify which permissions are needed

### ✅ Step 2: Update Authorization
- [ ] Replace old role-only authorization with permission-based + legacy roles
- [ ] Use consistent permission names across similar endpoints
- [ ] Test that legacy roles still work

### ✅ Step 3: Example Update Pattern
**Before:**
```java
@PostMapping
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
public ResponseEntity<DTO> create(@RequestBody DTO dto) {
    // Implementation
}
```

**After:**
```java
@PostMapping
@PreAuthorize("hasAuthority('RESOURCE:CREATE') or hasAuthority('RESOURCE:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
public ResponseEntity<DTO> create(@RequestBody DTO dto) {
    // Implementation
}
```

## 🧪 Testing New Permissions

### ✅ Step 1: Create Test Role
- [ ] Create a new role with only the new permissions
- [ ] Assign the role to a test user
- [ ] Verify the user can only access authorized endpoints

### ✅ Step 2: Test Authorization
- [ ] Test each endpoint with the new role
- [ ] Verify 403 errors for unauthorized access
- [ ] Verify 200 success for authorized access
- [ ] Test that legacy roles still work

### ✅ Step 3: Frontend Integration
- [ ] Update frontend to use new permissions in `PermissionGuard` components
- [ ] Test UI elements show/hide based on permissions
- [ ] Verify no React context errors

## 📝 Documentation Updates

### ✅ Step 1: Update Permission Guide
- [ ] Add new permissions to [Complete Permission Mapping Guide](./complete-permission-mapping-guide.html)
- [ ] Update this checklist if new patterns emerge
- [ ] Document any new action types

### ✅ Step 2: Update API Documentation
- [ ] Update Swagger/OpenAPI documentation
- [ ] Add permission requirements to endpoint descriptions
- [ ] Document authorization requirements

## 🚨 Common Mistakes to Avoid

### ❌ Wrong Permission Names
- ❌ `"review"` → ✅ `"REVIEW:CREATE"`
- ❌ `"product_edit"` → ✅ `"PRODUCT:EDIT"`
- ❌ `"userManagement"` → ✅ `"USER:MANAGE"`

### ❌ Missing Legacy Role Support
- ❌ `@PreAuthorize("hasAuthority('RESOURCE:ACTION')")`
- ✅ `@PreAuthorize("hasAuthority('RESOURCE:ACTION') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")`

### ❌ Inconsistent Naming
- ❌ Mixing `PRODUCT:EDIT` and `PRODUCT:UPDATE` for same functionality
- ✅ Choose one and use consistently

### ❌ Missing Authorization
- ❌ Forgetting `@PreAuthorize` on new endpoints
- ❌ Using only legacy roles without permissions

## 🎯 Quick Decision Tree

**Q: Do I need a new permission?**
- **A: Check existing permissions first** → Use existing if possible
- **A: If new resource** → Use `RESOURCE:ACTION` format
- **A: If new action** → Use standard actions (VIEW, CREATE, EDIT, DELETE, MANAGE)

**Q: What action should I use?**
- **Read data** → `VIEW`
- **Create new items** → `CREATE`
- **Modify existing items** → `EDIT` or `UPDATE`
- **Remove items** → `DELETE`
- **Full control** → `MANAGE`

**Q: How do I test permissions?**
- **Create test role** → Assign only new permissions
- **Test endpoints** → Verify 403 for unauthorized, 200 for authorized
- **Test UI** → Verify elements show/hide correctly

---

## 📞 Remember

- **Always use RESOURCE:ACTION format**
- **Include legacy role support**
- **Test thoroughly with restricted roles**
- **Update documentation**
- **Follow existing patterns**

This checklist ensures you'll never encounter the "review" vs "REVIEW:CREATE" issue again! 🎉

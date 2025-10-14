# RBAC System - Manual Testing Guide

This guide will help you manually verify the RBAC implementation is working correctly.

---

## 🔍 Test 1: Verify Database Structure

### Using phpMyAdmin (Easiest)

1. Open **http://localhost:8083** in your browser
2. Login with:
   - Server: `db`
   - Username: `user`
   - Password: `password`
3. Click on `sms` database on the left sidebar

### What to Check:

**Tables (should see 4 new tables):**
- ✅ `roles` - Contains role definitions
- ✅ `permissions` - Contains permission definitions
- ✅ `user_roles` - Links users to roles
- ✅ `role_permissions` - Links roles to permissions

**Verify Roles Table:**
1. Click on `roles` table → Browse
2. You should see 5 roles:
   - ROLE_ADMIN
   - ROLE_MANAGER
   - ROLE_EDITOR
   - ROLE_VIEWER
   - ROLE_USER

**Verify Permissions Table:**
1. Click on `permissions` table → Browse
2. You should see 57 permissions
3. Check a few examples:
   - Name: `PRODUCT:VIEW`, Resource: `PRODUCT`, Action: `VIEW`
   - Name: `ORDER:CREATE`, Resource: `ORDER`, Action: `CREATE`
   - Name: `USER:DELETE`, Resource: `USER`, Action: `DELETE`

**Verify User Roles:**
1. Click on `user_roles` table → Browse
2. You should see your existing users with assigned roles
3. Admin users should be linked to ROLE_ADMIN
4. Regular users should be linked to ROLE_USER

---

## 🔍 Test 2: Check Application Startup

### Verify Backend is Running

```bash
docker ps
```

**Expected:** You should see `ecommerce-basic-backend-1` with status "Up"

### Check Backend Logs

```bash
docker logs ecommerce-basic-backend-1 --tail 100
```

**Look for:**
- ✅ "Started EcomercebasicApplication" - App started successfully
- ✅ "Flyway" - Migration applied
- ✅ No errors or exceptions
- ✅ "Tomcat started on port 8080"

---

## 🔍 Test 3: Run Automated Tests

We've created automated test scripts:

### Test Database Migration
```bash
node test-rbac-migration.js
```

**Expected Output:**
```
✅ All 4 RBAC tables exist
✅ Found 5 roles
✅ Found 57 permissions
✅ ROLE_ADMIN has all permissions
✅ Users migrated to new system
🎉 ALL TESTS PASSED!
```

### Test Complete RBAC System
```bash
node test-rbac-system.js
```

**Expected Output:**
```
✅ Database schema verified
✅ Roles data verified
✅ Permissions data verified
✅ Role-permission assignments verified
✅ User-role assignments verified
✅ Foreign key constraints verified
✅ Permission queries working
✅ User permission lookup working
✅ Data integrity verified
✅ Timestamps working
🎉 ALL TESTS PASSED!
```

---

## 🔍 Test 4: Check Flyway Migration History

### Using Node Script
```bash
node check-flyway-status.js
```

**Expected Output:**
```
[✅] v0: << Flyway Baseline >>
[✅] v1: init schema
[✅] v2: add rbac system  ← This should be present!
```

### Using phpMyAdmin
1. Open phpMyAdmin (http://localhost:8083)
2. Go to `sms` database
3. Click on `flyway_schema_history` table → Browse
4. Verify you see entry for `V2__add_rbac_system.sql`

---

## 🔍 Test 5: Verify Specific Functionality

### Test Role-Permission Relationship

**Query 1: Get all permissions for ROLE_MANAGER**
```sql
SELECT p.name, p.resource, p.action
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE r.name = 'ROLE_MANAGER'
ORDER BY p.resource, p.action;
```

**Expected:** Should return 27 permissions

---

### Test User Permissions Lookup

**Query 2: Get all permissions for admin user**
```sql
SELECT DISTINCT p.name, p.resource, p.action
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@example.com'
ORDER BY p.resource, p.action;
```

**Expected:** Should return all 57 permissions (since admin has ROLE_ADMIN)

---

### Test User Has Multiple Roles (for future)

**Query 3: Get all roles for a specific user**
```sql
SELECT u.email, r.name as role_name, r.description
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@example.com';
```

**Expected:** Should show at least ROLE_ADMIN

---

## 🔍 Test 6: Entity Relationships

### Check Backend Console

When the backend starts, Hibernate should recognize all entities. No errors about:
- Missing tables
- Foreign key violations
- Mapping issues

### Verify Entity Loading

The User entity should now:
- Have a `roles` field (Set of Role objects)
- The `getAuthorities()` method returns both roles AND permissions
- Support backward compatibility with old `role` enum

---

## 🎯 What Should Work Now

### ✅ Working Features:
1. Database schema is complete
2. All tables have proper relationships
3. Default roles and permissions are seeded
4. Existing users are migrated to new system
5. Backend entities are properly mapped
6. Repositories can query RBAC data
7. Services can manage roles and permissions
8. Application starts without errors

### ❌ Not Yet Working:
1. No REST API endpoints yet (Step 6)
2. No permission-based security on endpoints (Step 7)
3. No admin UI for management (Step 9)
4. No dynamic dashboard (Step 10)

---

## 🚨 Troubleshooting

### If Backend Won't Start

**Check logs:**
```bash
docker logs ecommerce-basic-backend-1
```

**Common issues:**
- Migration failed: Check for SQL syntax errors in V2__add_rbac_system.sql
- Entity mapping errors: Verify Role, Permission entities are correct
- Foreign key violations: Check data migration in V2 script

### If Tests Fail

**Database connection error:**
- Verify MySQL is running on port 3307
- Check docker-compose.yml configuration
- Ensure database credentials are correct

**Missing tables:**
- Backend may not have restarted after migration
- Run: `docker-compose restart backend`
- Check Flyway logs

**Wrong permission counts:**
- V2 migration may have run multiple times
- Check for duplicate data in permissions table
- May need to reset database

---

## 🎯 Ready for Next Steps?

After verifying all tests pass, you can proceed with:

**Option 1: Continue Building (Recommended)**
→ Go to Step 6: Create REST Controllers for role/permission management

**Option 2: Build Frontend First**
→ Jump to Step 9: Create admin UI pages (requires Step 6 APIs)

**Option 3: Test Thoroughly**
→ Write additional integration tests before proceeding

---

## 📞 Need Help?

If any tests fail or you see errors:
1. Check the backend logs first
2. Verify database connection
3. Review the error messages
4. Check if all files were created correctly

---

*All tests should pass before proceeding to Step 6!* ✅


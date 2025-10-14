# Registration Issue Fix Summary

## 🔍 Problem Identified

**Error:** `POST http://localhost:8081/api/auth/register 400/500 (Bad Request/Internal Server Error)`

**Root Cause:** Port mismatch between frontend and backend
- Frontend was trying to connect to port 8081/8082
- Backend was running on port 8080
- Vite proxy configuration was pointing to wrong port

---

## ✅ Fixes Applied

### 1. **Fixed Vite Proxy Configuration**
**File:** `frontend/vite.config.js`
- Changed proxy target from `http://localhost:8082` to `http://localhost:8080`
- Added HMR (Hot Module Replacement) settings
- Improved watch settings for faster file change detection

**Before:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8082', // WRONG PORT
    changeOrigin: true,
  },
}
```

**After:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080', // CORRECT PORT
    changeOrigin: true,
    secure: false,
  },
}
```

### 2. **Updated API Service Files**
**Files:** 
- `frontend/src/api/apiService.js`
- `frontend/src/api/rbacService.js`

**Changed from:**
```javascript
const apiService = axios.create({
    baseURL: 'http://localhost:8080/api', // Hardcoded URL
});
```

**Changed to:**
```javascript
const apiService = axios.create({
    baseURL: '/api', // Relative URL - uses Vite proxy
});
```

**Benefits:**
- ✅ Works in both development and production
- ✅ No hardcoded ports
- ✅ Easier to maintain
- ✅ Respects Vite proxy configuration

### 3. **Improved Development Experience**
Created helper files:
- ✅ `DEVELOPMENT_GUIDE.md` - Comprehensive troubleshooting guide
- ✅ `clear-cache.ps1` - Script to clear frontend cache
- ✅ `quick-start.ps1` - Script to check server status

---

## 🚀 How to Test the Fix

### Step 1: Clear Cache and Restart
```powershell
# Clear frontend cache
.\clear-cache.ps1

# OR manually:
cd frontend
Remove-Item -Recurse -Force node_modules\.vite
Remove-Item -Recurse -Force dist
```

### Step 2: Start Backend
```bash
cd demo
mvn spring-boot:run
```
**Expected:** Backend starts on port 8080

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```
**Expected:** Frontend starts on port 5173

### Step 4: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh → "Empty Cache and Hard Reload"

### Step 5: Test Registration
1. Go to `http://localhost:5173/auth`
2. Fill registration form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Complete reCAPTCHA
3. Click "Register"
4. Check Network tab in DevTools

**Expected Results:**
- ✅ Request goes to: `/api/auth/register` (proxied to `http://localhost:8080/api/auth/register`)
- ✅ Status: 200 OK
- ✅ Success message appears
- ✅ Redirects to email confirmation page

---

## 🐛 If Still Not Working

### Check 1: Verify Backend is Running
```bash
# Test backend directly
curl http://localhost:8080/api/hello

# OR in browser:
http://localhost:8080/api/hello
```

### Check 2: Verify Correct Ports in Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to register
4. Look at the request URL
5. It should show: `/api/auth/register` (not `http://localhost:8081/...`)

### Check 3: Check Backend Logs
Look for errors in the backend console:
- Database connection errors
- Email service errors
- Validation errors
- reCAPTCHA errors

### Check 4: Common Backend Errors

**Error: "reCAPTCHA validation failed"**
- Check `application.properties` has correct reCAPTCHA secret
- Verify reCAPTCHA token is being sent from frontend

**Error: "Email already taken"**
- Try a different email address
- User might already exist in database

**Error: Database connection failed**
- Check MySQL is running
- Verify credentials in `application.properties`

---

## 📝 Files Modified

1. ✅ `frontend/vite.config.js` - Fixed proxy port
2. ✅ `frontend/src/api/apiService.js` - Changed to relative URL
3. ✅ `frontend/src/api/rbacService.js` - Changed to relative URL
4. ✅ `DEVELOPMENT_GUIDE.md` - Created
5. ✅ `clear-cache.ps1` - Created
6. ✅ `quick-start.ps1` - Created

---

## 🎯 Key Takeaways

### Why This Happened
1. **Vite Proxy Misconfiguration**: The proxy was pointing to wrong port
2. **Multiple API URLs**: Having different URLs in different files caused confusion
3. **Browser/Build Cache**: Old configuration was cached

### Prevention for Future
1. **Use Relative URLs**: Always use `/api` instead of full URLs
2. **Configure Vite Proxy**: Let Vite handle routing in development
3. **Restart After Config Changes**: Always restart dev server after changing configs
4. **Clear Cache When Stuck**: Use the `clear-cache.ps1` script

### Best Practices
1. ✅ Use Vite proxy for development
2. ✅ Use relative URLs in API services
3. ✅ Centralize configuration
4. ✅ Restart dev server after config changes
5. ✅ Keep DevTools open to monitor requests
6. ✅ Clear cache when experiencing issues

---

## 🔄 Rollback Instructions

If you need to revert these changes:

```bash
git checkout frontend/vite.config.js
git checkout frontend/src/api/apiService.js
git checkout frontend/src/api/rbacService.js
```

---

## ✨ Additional Improvements Made

1. **Better Error Handling**: Proxy now logs errors more clearly
2. **Hot Module Replacement**: Changes reflect faster
3. **File Watching**: Detects changes more reliably
4. **Documentation**: Comprehensive guides for troubleshooting
5. **Helper Scripts**: Quick cache clearing and status checking

---

## 📞 Next Steps

1. **Test Registration Flow**: Create a new account
2. **Test Login Flow**: Login with created account
3. **Check Email Confirmation**: Verify confirmation code email
4. **Test Other Features**: Make sure nothing broke

If you encounter any issues, refer to `DEVELOPMENT_GUIDE.md` for detailed troubleshooting steps!


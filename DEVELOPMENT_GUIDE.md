# Development Guide - Avoiding Cache Issues

## 🚀 Quick Start

### Backend (Spring Boot)
```bash
cd demo
mvn spring-boot:run
```
- Runs on: `http://localhost:8080`

### Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
- Runs on: `http://localhost:5173`
- API requests are proxied to `http://localhost:8080/api`

---

## 🔧 How to Avoid Cache Issues

### 1. **When You Change API Configuration Files**

If you modify:
- `frontend/src/api/apiService.js`
- `frontend/src/api/rbacService.js`
- `frontend/vite.config.js`

**Do this:**
```bash
# Stop the frontend server (Ctrl+C)
# Restart it:
npm run dev
```

### 2. **Clear Browser Cache (When Needed)**

**Option A - Hard Reload (Recommended)**
1. Open Developer Tools (`F12`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Option B - Manual Cache Clear**
1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"

### 3. **Clear Vite Build Cache (If Issues Persist)**

```bash
cd frontend
rm -rf node_modules/.vite
rm -rf dist
npm run dev
```

**Windows PowerShell:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules\.vite
Remove-Item -Recurse -Force dist
npm run dev
```

---

## 📝 Configuration Files Explained

### `frontend/vite.config.js`
- **Proxy Settings**: Routes `/api` requests to `http://localhost:8080`
- **Why?** This avoids CORS issues during development
- **Result**: Frontend sees `/api`, but Vite forwards to backend

### `frontend/src/api/apiService.js`
- Uses relative URL: `baseURL: '/api'`
- **Why?** Works with Vite proxy in development AND production
- **No hardcoded ports!** More flexible and maintainable

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Request failed with status code 400/500"
**Solution:**
1. Check backend is running on port 8080
2. Restart frontend server
3. Clear browser cache
4. Check backend console for error logs

### Issue 2: "Network Error" or "ERR_CONNECTION_REFUSED"
**Solution:**
1. Verify backend is running: `http://localhost:8080/api/hello`
2. Check `vite.config.js` proxy target is `http://localhost:8080`
3. Restart both frontend and backend

### Issue 3: Changes Not Reflecting
**Solution:**
1. Restart frontend dev server
2. Hard reload browser (`Ctrl+Shift+R`)
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Issue 4: "Port Already in Use"
**Backend (8080):**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

## ✅ Best Practices

### 1. **Always Use Vite Proxy for Development**
- ✅ Use relative URLs: `/api`
- ❌ Avoid hardcoded URLs: `http://localhost:8080/api`

### 2. **Restart After Config Changes**
Always restart the dev server after changing:
- `vite.config.js`
- `package.json`
- Any API service files

### 3. **Keep Browser DevTools Open**
- Monitor Network tab for request URLs
- Check Console for errors
- Verify correct ports are being used

### 4. **Clear Cache Regularly During Development**
- Use "Disable cache" in DevTools Network tab
- Do hard reloads after major changes

---

## 🎯 Quick Reference

| What Changed | Action Needed |
|--------------|---------------|
| React component | Auto-refresh (HMR) |
| API service file | Restart frontend server |
| Vite config | Restart frontend server |
| Backend code | Restart backend server |
| Browser acting weird | Hard reload + clear cache |

---

## 📊 Port Reference

| Service | Port | URL |
|---------|------|-----|
| Backend | 8080 | `http://localhost:8080` |
| Frontend | 5173 | `http://localhost:5173` |
| MySQL | 3306 | `localhost:3306` |

---

## 💡 Pro Tips

1. **Use Browser DevTools "Disable cache"**
   - Open Network tab → Check "Disable cache"
   - Cache disabled while DevTools is open

2. **Watch Backend Logs**
   - Check for `Started DemoApplication` on port 8080
   - Look for error stack traces

3. **Test Backend Directly**
   - Use Postman or browser: `http://localhost:8080/api/hello`
   - Verify backend is responding before testing frontend

4. **Use Git to Track Changes**
   - Commit working code before making changes
   - Easy to revert if something breaks

---

## 🔍 Debugging Checklist

When something doesn't work:

- [ ] Backend server running on port 8080?
- [ ] Frontend server running on port 5173?
- [ ] `vite.config.js` proxy pointing to port 8080?
- [ ] API services using relative URLs (`/api`)?
- [ ] Browser cache cleared?
- [ ] Frontend dev server restarted?
- [ ] DevTools Network tab showing correct request URL?
- [ ] Backend console showing any errors?

---

## 📞 Need Help?

If issues persist:
1. Check backend logs for detailed error messages
2. Check browser console for frontend errors
3. Verify all ports are correct
4. Try restarting both servers

**Common Error Codes:**
- `400 Bad Request`: Invalid data format or validation error
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Endpoint doesn't exist
- `500 Internal Server Error`: Backend crashed - check logs!


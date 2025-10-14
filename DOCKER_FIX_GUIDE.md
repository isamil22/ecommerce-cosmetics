# Docker Setup - Registration Fix Guide

## 🐳 Your Current Docker Architecture

```
Browser
    ↓
http://localhost:8081 (Frontend Container - Nginx)
    ↓ (Nginx proxy: /api → http://backend:8080)
    ↓
http://backend:8080 (Backend Container - Spring Boot)
    ↓
MySQL Database (db:3306)
```

## 📊 Port Mapping

| Service | Docker Port | Container Port | URL |
|---------|-------------|----------------|-----|
| Frontend | 8081 | 80 | http://localhost:8081 |
| Backend | 8082 | 8080 | http://localhost:8082 |
| Database | 3307 | 3306 | localhost:3307 |
| phpMyAdmin | 8083 | 80 | http://localhost:8083 |

## ✅ Fix for Docker Setup

### Step 1: Rebuild Docker Containers

The changes we made to `apiService.js`, `rbacService.js`, and `vite.config.js` need to be rebuilt into the Docker image.

```powershell
# Stop all containers
docker-compose down

# Rebuild frontend container (this includes our fixes)
docker-compose build frontend

# Start everything
docker-compose up -d
```

### Step 2: Clear Browser Cache

1. Press F12 (DevTools)
2. Right-click refresh → "Empty Cache and Hard Reload"

### Step 3: Test Registration

1. Go to: `http://localhost:8081/auth`
2. Fill registration form
3. Check Network tab - should see `/api/auth/register`
4. Should work now! ✅

## 🔄 Quick Commands

### Rebuild Everything (Fresh Start)
```powershell
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Rebuild Only Frontend
```powershell
docker-compose down
docker-compose build frontend
docker-compose up -d
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Frontend only
docker-compose logs -f frontend

# Backend only
docker-compose logs -f backend
```

### Check Running Containers
```powershell
docker-compose ps
```

## 🐛 Troubleshooting Docker

### Issue: Registration still fails

**Check backend logs:**
```powershell
docker-compose logs backend | Select-String -Pattern "error" -Context 5
```

**Check frontend logs:**
```powershell
docker-compose logs frontend
```

### Issue: Port already in use

**Find and kill process:**
```powershell
# Check what's using port 8081
netstat -ano | findstr :8081

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Database connection failed

**Check database:**
```powershell
docker-compose logs db
```

**Restart database:**
```powershell
docker-compose restart db
```

## 📝 Configuration Files in Docker

### Files that affect Docker build:
- ✅ `frontend/Dockerfile` - Builds React app
- ✅ `frontend/nginx.conf` - Nginx proxy config (already correct!)
- ✅ `frontend/src/api/apiService.js` - **WE FIXED THIS**
- ✅ `frontend/src/api/rbacService.js` - **WE FIXED THIS**
- ✅ `frontend/vite.config.js` - **WE FIXED THIS** (used during build)
- ✅ `docker-compose.yml` - Container orchestration

### Why Rebuild?

When you run `docker-compose up`, Docker uses the **cached image**. Our fixes are in the source code, so we need to:

1. `docker-compose down` - Stop containers
2. `docker-compose build frontend` - Build new image with our fixes
3. `docker-compose up -d` - Start with new image

## ⚡ One Command to Fix Everything

```powershell
docker-compose down && docker-compose build frontend && docker-compose up -d && Start-Sleep 5 && docker-compose logs frontend
```

This will:
1. Stop containers
2. Rebuild frontend with our fixes
3. Start everything
4. Show frontend logs

## 🎯 Expected Results After Rebuild

1. Frontend accessible at: `http://localhost:8081`
2. Registration should work
3. Network requests go to `/api/auth/register`
4. Nginx proxies to backend container

## 💡 Pro Tips for Docker Development

1. **Always rebuild after changing source code**
2. **Use `docker-compose logs -f`** to watch logs in real-time
3. **Clear browser cache** after rebuilding
4. **Check container health:** `docker-compose ps`


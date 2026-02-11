# Deployment Instructions

## Changes Pushed to GitHub ✅
Commit: `32d1f0d` - "Fix: Docker volume permission issue with thumbnail generation"

## Manual Steps to Deploy on Server

### 1. SSH into your server
```bash
ssh root@72.62.182.187
# Password: Smail@ByLuna@mundi@3ev
```

### 2. Navigate to project directory
```bash
cd /root/ecommerce-cosmetics
```

### 3. Pull the latest changes
```bash
git pull origin main
```

### 4. Rebuild and restart containers
Since we modified Java backend code (`ImageController.java`, `HeroService.java`), we MUST rebuild the backend.
We also modified Frontend code, so we should rebuild frontend too.

```bash
docker-compose down
docker-compose up -d --build
```

### 5. Verify the deployment
Check backend logs to ensure it started correctly:
```bash
docker-compose logs backend | tail -20
```

### 6. Verify Fixes
1. Open Admin Panel > Hero Section
2. Upload new image
3. Verify it updates immediately without refresh

---

## 🆘 Troubleshooting

### Error: `KeyError: 'ContainerConfig'` or `ImageNotFound`
If you see an error like `KeyError: 'ContainerConfig'` or `No such image: sha256:...`, it means Docker's state is corrupted (it's looking for an old image that doesn't exist).

**Solution:**
You must manually remove the broken containers and let Docker recreate them.

Run these 3 commands in order:

```bash
# 1. Stop everything and remove orphans
docker-compose down --remove-orphans

# 2. Force remove the specific broken containers (just to be safe)
docker rm -f ecommerce-copy-backend ecommerce-copy-frontend

# 3. Rebuild and start again
docker-compose up -d --build
```

---

## What Was Fixed (In this update)
1. ✅ **Smart Caching**: Hero images now cache for 5 mins (was 1 year)
2. ✅ **Auto Cleanup**: Old hero images are deleted automatically
3. ✅ **Instant Updates**: Admin panel updates immediately after upload
4. ✅ **Mobile Fix**: Removed stale localStorage cache for hero images using unique timestamps

## Files Modified
- `demo/src/main/java/com/example/demo/controller/ImageController.java`
- `demo/src/main/java/com/example/demo/service/HeroService.java`
- `frontend/src/pages/admin/AdminHeroPage.jsx`
- `frontend/src/components/landingPage/sections/HeroSection.jsx`
- `frontend/src/pages/HomePage.jsx` (New Mobile Fix)
- `frontend/src/utils/imageUtils.js` (New Mobile Fix)

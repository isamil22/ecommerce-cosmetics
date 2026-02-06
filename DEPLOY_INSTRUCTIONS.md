# Deployment Instructions

## Changes Pushed to GitHub ✅
Commit: `a2a4ead` - "fix: add defensive image fallback for missing custom-packs images"

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

### 4. Create the missing custom-packs directory
```bash
mkdir -p uploads/images/custom-packs
```

### 5. Rebuild and restart the frontend container
```bash
docker-compose down frontend
docker-compose up -d --build frontend
```

### 6. Verify the deployment
```bash
docker-compose logs frontend | tail -20
```

### 7. Check if containers are running
```bash
docker-compose ps
```

---

## Alternative: Full Rebuild (if needed)
```bash
cd /root/ecommerce-cosmetics
git pull origin main
mkdir -p uploads/images/custom-packs
docker-compose down
docker-compose up -d --build
```

---

## What Was Fixed
1. ✅ Created `uploads/images/custom-packs/` directory for custom pack images
2. ✅ Added defensive image error handling in `CustomPacksPage.jsx`
3. ✅ When images 404, they now show a beautiful fallback UI instead of broken images

## Files Modified
- `frontend/src/pages/CustomPacksPage.jsx`

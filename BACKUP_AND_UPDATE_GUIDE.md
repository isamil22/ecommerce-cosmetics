# 📦 Project Backup & Update Guide

## ✅ Your Backup Has Been Created!

A backup copy of your project has been created in:
```
C:\Users\Hi\Downloads\ecommerce-basic-backup-[timestamp]
```

---

## 🔄 How to Create Additional Backups

### Method 1: Quick Copy (Recommended)
```powershell
cd C:\Users\Hi\Downloads
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "ecommerce-basic-backup-$timestamp"
Copy-Item -Path "ecommerce-basic" -Destination $backupName -Recurse -Exclude @("node_modules", "target", "dist", "build", ".vite", "*.log")
```

### Method 2: Using Git (Best for Version Control)
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic
git status
git add .
git commit -m "Backup before updates"
git branch backup-$(Get-Date -Format "yyyy-MM-dd")
```

### Method 3: Create ZIP Archive
```powershell
cd C:\Users\Hi\Downloads
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
Compress-Archive -Path "ecommerce-basic" -DestinationPath "ecommerce-basic-backup-$timestamp.zip" -Exclude @("node_modules", "target", "dist", "build")
```

---

## 🚀 Starting to Work on Updates

### Option 1: Work Directly (Current Project)
You can start making changes directly in:
```
C:\Users\Hi\Downloads\ecommerce-basic
```

### Option 2: Create a Working Copy
```powershell
cd C:\Users\Hi\Downloads
Copy-Item -Path "ecommerce-basic" -Destination "ecommerce-basic-working" -Recurse -Exclude @("node_modules", "target", "dist", "build")
cd ecommerce-basic-working
```

---

## 📋 Project Setup After Backup

### 1. Install Dependencies

**Backend (Spring Boot):**
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic\demo
# Maven will download dependencies automatically when you build
```

**Frontend (React):**
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic\frontend
npm install
```

### 2. Start Development Environment

**Option A: Using Docker (Easiest)**
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic
docker-compose up -d
```

Access:
- Frontend: http://localhost:8081
- Backend API: http://localhost:8082
- Database Admin: http://localhost:8083

**Option B: Local Development**

**Backend:**
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic\demo
mvn spring-boot:run
```
Runs on: http://localhost:8080

**Frontend:**
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic\frontend
npm run dev
```
Runs on: http://localhost:5173

---

## 🔧 Making Updates

### Recommended Workflow

1. **Create a Git Branch for Your Updates**
   ```powershell
   cd C:\Users\Hi\Downloads\ecommerce-basic
   git checkout -b feature/your-update-name
   ```

2. **Make Your Changes**
   - Edit files as needed
   - Test your changes

3. **Commit Your Changes**
   ```powershell
   git add .
   git commit -m "Description of your changes"
   ```

4. **If Something Goes Wrong**
   ```powershell
   git log  # See your commits
   git reset --hard HEAD~1  # Undo last commit (CAREFUL!)
   # Or restore from backup folder
   ```

---

## 📁 What's Excluded from Backups

To save space, these folders are typically excluded:
- `node_modules/` - Can be reinstalled with `npm install`
- `target/` - Maven build output, regenerated on build
- `dist/` - Frontend build output, regenerated on build
- `build/` - Build artifacts
- `.vite/` - Vite cache, regenerated automatically
- `*.log` - Log files

**Important:** Your source code, configuration files, and Git history are always included!

---

## 🛡️ Safety Tips

1. **Always create a backup before major changes**
2. **Use Git commits frequently** - commit after each working feature
3. **Test in a separate branch** - don't work directly on main/master
4. **Keep your backup folder safe** - don't delete it until you're sure everything works

---

## 🔄 Restoring from Backup

If you need to restore your project:

```powershell
cd C:\Users\Hi\Downloads
# Stop any running services first
# Then restore:
Remove-Item -Path "ecommerce-basic" -Recurse -Force
Copy-Item -Path "ecommerce-basic-backup-[timestamp]" -Destination "ecommerce-basic" -Recurse
```

Or using Git:
```powershell
cd C:\Users\Hi\Downloads\ecommerce-basic
git reset --hard HEAD  # Reset to last commit
# Or checkout a specific backup branch
git checkout backup-2025-12-06
```

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Create backup | See Method 1 above |
| Start Docker | `docker-compose up -d` |
| Stop Docker | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Install frontend deps | `cd frontend && npm install` |
| Run frontend dev | `cd frontend && npm run dev` |
| Run backend | `cd demo && mvn spring-boot:run` |
| Check Git status | `git status` |
| Create new branch | `git checkout -b feature/name` |

---

## ✅ You're Ready!

Your project is backed up and ready for updates. The backup folder contains:
- ✅ All source code
- ✅ Configuration files
- ✅ Database migration scripts
- ✅ Documentation
- ✅ Git history (if using full backup)

**Start making your updates with confidence!** 🎉


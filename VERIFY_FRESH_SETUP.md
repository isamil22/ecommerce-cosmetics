# ✅ Verification Checklist - Fresh & Separate Setup

## 🔍 Double-Check Confirmation

This document verifies that your copy project is **completely isolated** from your original project.

### ✅ Container Isolation

| Component | Original Project | Copy Project | Status |
|-----------|-----------------|--------------|--------|
| **Project Name** | `ecommerce-basic` (default) | `ecommerce-copy` | ✅ SEPARATE |
| **DB Container** | `ecommerce-basic-db-1` (default) | `ecommerce-copy-db` | ✅ SEPARATE |
| **Backend Container** | `ecommerce-basic-backend-1` (default) | `ecommerce-copy-backend` | ✅ SEPARATE |
| **Frontend Container** | `ecommerce-basic-frontend-1` (default) | `ecommerce-copy-frontend` | ✅ SEPARATE |
| **phpMyAdmin Container** | `ecommerce-basic-phpmyadmin-1` (default) | `ecommerce-copy-phpmyadmin` | ✅ SEPARATE |

### ✅ Port Isolation

| Service | Original Project | Copy Project | Status |
|---------|-----------------|--------------|--------|
| **Frontend** | `8081` | `8085` | ✅ SEPARATE |
| **Backend** | `8082` | `8084` | ✅ SEPARATE |
| **Database** | `3307` | `3308` | ✅ SEPARATE |
| **phpMyAdmin** | `8083` | `8086` | ✅ SEPARATE |

### ✅ Data Isolation

| Component | Original Project | Copy Project | Status |
|-----------|-----------------|--------------|--------|
| **Database Volume** | `ecommerce-basic_db_data` | `ecommerce-copy_db_data_copy` | ✅ SEPARATE |
| **Network** | `ecommerce-basic_my-network` | `ecommerce-copy_my-network-copy` | ✅ SEPARATE |
| **Database Data** | Stored in original volume | Stored in copy volume | ✅ SEPARATE |

### ✅ Network Isolation

- **Original Network**: `ecommerce-basic_my-network` (or `my-network` if no project name)
- **Copy Network**: `ecommerce-copy_my-network-copy`
- ✅ **Completely separate** - containers cannot communicate between projects

## 🧪 Verification Commands

Run these commands to verify separation:

### 1. Check Container Names
```powershell
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```
**Expected**: You should see containers with `ecommerce-copy-` prefix, separate from original.

### 2. Check Volumes
```powershell
docker volume ls
```
**Expected**: You should see `ecommerce-copy_db_data_copy` separate from original `db_data`.

### 3. Check Networks
```powershell
docker network ls
```
**Expected**: You should see `ecommerce-copy_my-network-copy` separate from original network.

### 4. Check Port Usage
```powershell
netstat -ano | findstr "8081 8082 8083 3307 8084 8085 8086 3308"
```
**Expected**: Ports 8084, 8085, 8086, 3308 should be used by copy project.

## 🚀 Starting Fresh (Guaranteed Clean Start)

To ensure you start with a **completely fresh database** (no old data):

```powershell
# 1. Stop any running containers
docker-compose down

# 2. Remove the copy volume (if it exists from previous tests)
docker volume rm ecommerce-copy_db_data_copy

# 3. Verify original volume still exists (don't remove this!)
docker volume ls | findstr "ecommerce-basic"

# 4. Build and start fresh
docker-compose up -d --build

# 5. Verify containers are running
docker-compose ps
```

## ⚠️ Important Notes

1. **Database starts EMPTY** - You'll need to:
   - Run migrations (Flyway will handle this automatically)
   - Add test data if needed
   - Configure initial settings

2. **No connection to original** - The copy project:
   - Uses different container names
   - Uses different ports
   - Uses different volume (completely separate data)
   - Uses different network (cannot communicate with original)

3. **Safe to test** - You can:
   - Run both projects simultaneously
   - Test features without worry
   - Delete copy containers/volumes without affecting original

## 🔒 Security Check

The backend connects to database using:
- **Internal Docker network**: `jdbc:mysql://db:3306/sms`
- This `db` refers to the `db` service in **this** docker-compose.yml only
- ✅ **Cannot** connect to original project's database

## ✅ Final Verification

After starting containers, verify:

1. **Frontend accessible**: http://localhost:8085
2. **Backend accessible**: http://localhost:8084
3. **phpMyAdmin accessible**: http://localhost:8086
4. **Database empty**: Check phpMyAdmin - should be fresh/empty
5. **Original still works**: Original project on ports 8081, 8082, 8083, 3307

## 🎯 Summary

✅ **Project Name**: `ecommerce-copy` (unique)  
✅ **Container Names**: All prefixed with `ecommerce-copy-`  
✅ **Ports**: All different (8084, 8085, 8086, 3308)  
✅ **Volume**: `ecommerce-copy_db_data_copy` (separate)  
✅ **Network**: `ecommerce-copy_my-network-copy` (separate)  
✅ **Database**: Fresh and empty on first start  
✅ **Isolation**: 100% separate from original project  

**You're safe to test! 🚀**


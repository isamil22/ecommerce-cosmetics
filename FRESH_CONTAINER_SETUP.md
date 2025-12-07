# Fresh Container Setup Guide

This project copy has been configured to use **completely separate containers, volumes, and networks** from your original project. This ensures you can test features without affecting your original app.

## What Changed

### Container Names
- All containers now have unique names with `ecommerce-copy-` prefix:
  - `ecommerce-copy-db` (Database)
  - `ecommerce-copy-backend` (Backend)
  - `ecommerce-copy-frontend` (Frontend)
  - `ecommerce-copy-phpmyadmin` (phpMyAdmin)

### Port Mappings (Changed to avoid conflicts)
- **Frontend**: `http://localhost:8085` (was 8081)
- **Backend**: `http://localhost:8084` (was 8082)
- **Database**: `localhost:3308` (was 3307)
- **phpMyAdmin**: `http://localhost:8086` (was 8083)

### Volumes & Networks
- **Volume**: `db_data_copy` (separate from original `db_data`)
- **Network**: `my-network-copy` (separate from original `my-network`)
- **Project Name**: `ecommerce-copy`

## How to Start

### First Time Setup (Fresh Start)

```powershell
# Navigate to project directory
cd "C:\Users\Hi\Downloads\Project Cosmetics Ayoub\ecommerce-basic - Copy"

# Stop any existing containers (if any)
docker-compose down

# Remove old volumes (if you want completely fresh data)
docker volume rm ecommerce-copy_db_data_copy

# Build and start all containers
docker-compose up -d --build
```

### Regular Start

```powershell
# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Access Your Application

- **Frontend**: http://localhost:8085
- **Backend API**: http://localhost:8084
- **phpMyAdmin**: http://localhost:8086
- **Database**: localhost:3308

## Verify Separation

To confirm containers are separate from your original:

```powershell
# List all containers
docker ps -a

# You should see containers with "ecommerce-copy-" prefix
# Your original containers should have different names

# List volumes
docker volume ls

# You should see "ecommerce-copy_db_data_copy" separate from original
```

## Fresh Database

The database will start completely empty. You may need to:
1. Run your database migrations/scripts
2. Add test data
3. Configure initial settings

## Important Notes

- ✅ This setup is **completely isolated** from your original project
- ✅ You can run both projects simultaneously (different ports)
- ✅ All data is stored separately
- ✅ Stopping/removing these containers won't affect your original app

## Troubleshooting

### Port Already in Use
If you get port conflicts, you can change ports in `docker-compose.yml`:
```yaml
ports:
  - 'NEW_PORT:CONTAINER_PORT'
```

### Want to Start Fresh Again
```powershell
# Stop and remove everything (including volumes)
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build
```

### Check Container Status
```powershell
docker-compose ps
```


# PowerShell script to start fresh containers for copy project
# This ensures you start with a clean database, separate from original project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Fresh Copy Project Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any existing containers
Write-Host "[1/5] Stopping existing containers..." -ForegroundColor Yellow
docker-compose down
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Containers stopped" -ForegroundColor Green
} else {
    Write-Host "⚠ No containers were running" -ForegroundColor Yellow
}

# Step 2: Remove copy volume (if exists) to ensure fresh start
Write-Host ""
Write-Host "[2/5] Removing old copy volume (if exists)..." -ForegroundColor Yellow
$volumeName = "ecommerce-copy_db_data_copy"
$volumeExists = docker volume ls -q | Select-String -Pattern $volumeName
if ($volumeExists) {
    docker volume rm $volumeName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Old volume removed - fresh database guaranteed" -ForegroundColor Green
    } else {
        Write-Host "⚠ Could not remove volume (may be in use)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ No old volume found - will create fresh one" -ForegroundColor Green
}

# Step 3: Verify original project volumes are safe
Write-Host ""
Write-Host "[3/5] Verifying original project is safe..." -ForegroundColor Yellow
$originalVolumes = docker volume ls -q | Select-String -Pattern "ecommerce-basic"
if ($originalVolumes) {
    Write-Host "✓ Original project volumes are safe:" -ForegroundColor Green
    $originalVolumes | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
} else {
    Write-Host "✓ No original project volumes found (or using different naming)" -ForegroundColor Green
}

# Step 4: Build containers
Write-Host ""
Write-Host "[4/5] Building containers..." -ForegroundColor Yellow
docker-compose build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Containers built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 5: Start containers
Write-Host ""
Write-Host "[5/5] Starting containers..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Containers started successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to start containers!" -ForegroundColor Red
    exit 1
}

# Final verification
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your copy project is running on:" -ForegroundColor White
Write-Host "  Frontend:    http://localhost:8085" -ForegroundColor Cyan
Write-Host "  Backend:     http://localhost:8084" -ForegroundColor Cyan
Write-Host "  phpMyAdmin:  http://localhost:8086" -ForegroundColor Cyan
Write-Host "  Database:    localhost:3308" -ForegroundColor Cyan
Write-Host ""
Write-Host "Container Status:" -ForegroundColor White
docker-compose ps
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop containers:" -ForegroundColor Yellow
Write-Host "  docker-compose down" -ForegroundColor Gray
Write-Host ""


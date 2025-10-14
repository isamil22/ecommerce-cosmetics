# PowerShell Script to Rebuild Docker Containers
# Use this after making code changes

Write-Host "🐳 Docker Rebuild Script" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop containers
Write-Host "📋 Step 1: Stopping containers..." -ForegroundColor Yellow
docker-compose down
Write-Host "  ✓ Containers stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Rebuild frontend
Write-Host "📋 Step 2: Rebuilding frontend container..." -ForegroundColor Yellow
Write-Host "  (This includes all our API fixes)" -ForegroundColor White
docker-compose build frontend
Write-Host "  ✓ Frontend rebuilt" -ForegroundColor Green
Write-Host ""

# Step 3: Start everything
Write-Host "📋 Step 3: Starting all containers..." -ForegroundColor Yellow
docker-compose up -d
Write-Host "  ✓ Containers started" -ForegroundColor Green
Write-Host ""

# Step 4: Wait for containers to be ready
Write-Host "📋 Step 4: Waiting for containers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "  ✓ Containers should be ready" -ForegroundColor Green
Write-Host ""

# Step 5: Show status
Write-Host "📋 Step 5: Container status:" -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# Final instructions
Write-Host "✅ Docker rebuild complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Clear browser cache (F12 → Right-click refresh → Empty Cache and Hard Reload)" -ForegroundColor White
Write-Host "  2. Go to: http://localhost:8081/auth" -ForegroundColor White
Write-Host "  3. Try to register a new account" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:     docker-compose logs -f" -ForegroundColor White
Write-Host "  View backend:  docker-compose logs -f backend" -ForegroundColor White
Write-Host "  View frontend: docker-compose logs -f frontend" -ForegroundColor White
Write-Host ""


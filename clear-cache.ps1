# PowerShell Script to Clear Frontend Cache
# Run this if you're experiencing cache issues

Write-Host "🧹 Clearing Frontend Cache..." -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location frontend

# Remove Vite cache
if (Test-Path "node_modules\.vite") {
    Write-Host "  ✓ Removing Vite cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules\.vite
}

# Remove dist folder
if (Test-Path "dist") {
    Write-Host "  ✓ Removing dist folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force dist
}

Write-Host "✅ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your frontend server: npm run dev" -ForegroundColor White
Write-Host "  2. Hard reload your browser (Ctrl+Shift+R)" -ForegroundColor White
Write-Host ""

# Go back to root
Set-Location ..


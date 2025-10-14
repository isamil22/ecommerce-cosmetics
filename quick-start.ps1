# PowerShell Script for Quick Development Setup
# This script helps you start both backend and frontend servers

Write-Host "🚀 E-Commerce Development Quick Start" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check if backend is running
Write-Host "📋 Checking backend (port 8080)..." -ForegroundColor Yellow
if (Test-Port 8080) {
    Write-Host "  ✓ Backend is already running on port 8080" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Backend is NOT running on port 8080" -ForegroundColor Red
    Write-Host "  → Start backend: cd demo && mvn spring-boot:run" -ForegroundColor White
}

Write-Host ""

# Check if frontend is running
Write-Host "📋 Checking frontend (port 5173)..." -ForegroundColor Yellow
if (Test-Port 5173) {
    Write-Host "  ✓ Frontend is already running on port 5173" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Frontend is NOT running on port 5173" -ForegroundColor Red
    Write-Host "  → Start frontend: cd frontend && npm run dev" -ForegroundColor White
}

Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  API Test: http://localhost:8080/api/hello" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Read DEVELOPMENT_GUIDE.md for troubleshooting help!" -ForegroundColor Cyan


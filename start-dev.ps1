#!/usr/bin/env pwsh
# MySharpJobs Full Stack Development Server Launcher
# This script starts the Laravel backend, Reverb WebSocket server, and React frontend

Write-Host ""
Write-Host "🚀 MySharpJobs Full Stack Development Server" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Display service URLs
Write-Host "Services will start on:" -ForegroundColor Yellow
Write-Host "  📱 Frontend (React):      http://localhost:5173" -ForegroundColor Green
Write-Host "  🔧 Backend (Laravel):     http://localhost:8000" -ForegroundColor Blue
Write-Host "  📡 WebSocket (Reverb):    ws://localhost:6001" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Gray
Write-Host ""

# Change to backend directory
Set-Location -Path "backend"

# Check if concurrently is installed
$concurrentlyInstalled = $null -ne (Get-Command npx -ErrorAction SilentlyContinue)

if (-not $concurrentlyInstalled) {
    Write-Host "❌ npx command not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Run composer dev command which uses concurrently
Write-Host "Starting all services..." -ForegroundColor Cyan
Write-Host ""

try {
    # Use composer dev command
    composer dev
}
catch {
    Write-Host ""
    Write-Host "❌ Error starting services: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Trying alternative method with php artisan serve:all..." -ForegroundColor Yellow
    php artisan serve:all
}
finally {
    Set-Location -Path ".."
}

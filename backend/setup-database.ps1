# MySharpJob - Database Setup Script for XAMPP
# Run this AFTER starting MySQL in XAMPP Control Panel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MySharpJob Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the backend directory
if (-not (Test-Path "artisan")) {
    Write-Host "ERROR: Please run this script from the backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Testing MySQL connection..." -ForegroundColor Yellow
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

if (-not (Test-Path $mysqlPath)) {
    Write-Host "WARNING: MySQL not found at $mysqlPath" -ForegroundColor Yellow
    Write-Host "Trying to use system mysql..." -ForegroundColor Yellow
    $mysqlPath = "mysql"
}

# Test connection
try {
    Write-Host "Connecting to MySQL..." -ForegroundColor Gray
    & $mysqlPath -u root -e "SELECT 'Connection successful!' AS Status;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL connection successful!" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "✗ Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "  1. XAMPP Control Panel is open" -ForegroundColor White
    Write-Host "  2. MySQL service is STARTED (green status)" -ForegroundColor White
    Write-Host "  3. Port 3306 is not blocked" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating database 'mysharpjob'..." -ForegroundColor Yellow
& $mysqlPath -u root -e "CREATE DATABASE IF NOT EXISTS mysharpjob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database 'mysharpjob' is ready!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Clearing Laravel cache..." -ForegroundColor Yellow
php artisan config:clear | Out-Null
php artisan cache:clear | Out-Null
Write-Host "✓ Cache cleared!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Running database migrations..." -ForegroundColor Yellow
php artisan migrate:fresh --seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database migrations completed!" -ForegroundColor Green
} else {
    Write-Host "✗ Migration failed" -ForegroundColor Red
    Write-Host "You can run 'php artisan migrate' manually to see detailed errors" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Database Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now ready to post jobs!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend running at: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "Database: mysharpjob (MySQL via XAMPP)" -ForegroundColor White
Write-Host ""

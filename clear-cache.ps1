Write-Host "🧹 Clearing all caches and restarting..." -ForegroundColor Cyan

# Stop any running processes
Write-Host "`n📛 Stopping any running dev servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*MysharpJob*" } | Stop-Process -Force
Write-Host "✅ Stopped Node processes" -ForegroundColor Green

# Clear npm cache
Write-Host "`n🗑️  Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ npm cache cleared" -ForegroundColor Green

# Remove node_modules and reinstall (optional - uncomment if needed)
# Write-Host "`n📦 Removing node_modules..." -ForegroundColor Yellow
# Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
# Write-Host "✅ node_modules removed" -ForegroundColor Green

# Write-Host "`n📥 Installing dependencies..." -ForegroundColor Yellow
# npm install
# Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Clear Vite cache
Write-Host "`n🗑️  Clearing Vite cache..." -ForegroundColor Yellow
Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Vite cache cleared" -ForegroundColor Green

# Clear dist folder
Write-Host "`n🗑️  Clearing dist folder..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ dist folder cleared" -ForegroundColor Green

Write-Host "`n✨ All caches cleared!" -ForegroundColor Green
Write-Host "`n📌 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: npm run dev" -ForegroundColor White
Write-Host "   2. Open browser in incognito/private mode" -ForegroundColor White
Write-Host "   3. Navigate to: http://localhost:3000/login" -ForegroundColor White
Write-Host "   4. Open DevTools Console (F12)" -ForegroundColor White
Write-Host "   5. Try logging in and check console output" -ForegroundColor White
Write-Host "`n🔍 Check DEBUG_LOGIN_TESTING_GUIDE.md for detailed instructions" -ForegroundColor Yellow

# 🚀 Quick Start - MySharpJobs Development

## ⚡ Start Everything (Pick One)

```powershell
# Method 1: PowerShell (Recommended)
.\start-dev.ps1

# Method 2: From Backend Directory
cd backend
composer dev

# Method 3: Custom Artisan Command
cd backend
php artisan serve:all

# Method 4: Windows CMD
start-dev.bat
```

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 (or auto-selected) |
| Backend | http://localhost:8000 |
| WebSocket | ws://localhost:6001 |

**Note**: Frontend port may vary if 3000/3001 is in use. Check terminal output for actual URL.

## 🔐 Test Accounts

| User | Email | Password |
|------|-------|----------|
| Admin | admin@mysharpjobs.ng | Admin@123 |
| Artisan | artisan@mysharpjobs.ng | Artisan@123 |
| Client | client@mysharpjobs.ng | Client@123 |

View all users: `php artisan users:show`

## 🛑 Stop Servers

Press **Ctrl+C** in terminal (stops all services)

## 🧪 Quick Test

1. Start: `.\start-dev.ps1`
2. Visit: http://localhost:3000
3. Login: Use credentials above
4. Test: Real-time messaging, job posting

## 🐛 Common Fixes

```powershell
# Port in use
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Database error
cd backend
php artisan migrate:fresh --seed

# Cache issues
cd backend
php artisan optimize:clear

# Frontend issues
npm install
```

## 📚 Documentation

- **DEVELOPMENT_SERVER_GUIDE.md** - Full guide
- **FULL_STACK_SERVER_SETUP_COMPLETE.md** - Setup details
- **QUICK_LOGIN_REFERENCE.md** - All test accounts
- **DATABASE_SEEDER_DOCUMENTATION.md** - Database info

---

**That's it! Start coding! 🎉**
